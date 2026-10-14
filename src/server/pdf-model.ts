// The content of the personalised PDF (SPEC §3.2, §22; six pages approved by David on
// 2026-10-14): every number and every text, ready to draw. The numbers come from the
// calculator's own pricing, so the PDF cannot disagree with the page or the
// calculator. A value without a source is `[ověřit]` or a dash, never 0.
// Pure: no imports from next or react.
import { calculatorCopy, pdfCopy, resultsCopy, shellCopy } from '@/content/copy'
import { formatKc, formatMonthYear, formatPercent } from '@/lib/format'
import { GROSS_RETURN } from '@/lib/calculator-defaults'
import { calculatorData } from './calculator-data'
import { priceBrokers } from './broker-pricing'
import type { ChosenRates } from './cnb'
import { comparison } from './comparison'
import { dataSchema, TODO_VERIFY, type Broker } from './data/schema'
import { hasSource } from './data/verified'

const text = pdfCopy
const FOOTER_TEST_NOTICE = shellCopy.footer.testNotice
const resultsCopy_assumption = calculatorCopy.assumption

export type PdfPage =
  | {
      kind: 'comparison'
      number: number
      label: string
      title: string
      lead: string
      brokers: { brokerId: string; name: string }[]
      rows: {
        fundId: string
        ticker: string
        indexLabel: string
        type: 'Acc' | 'Dist' | null
        fee: string | null
        cells: { brokerId: string; text: string }[]
      }[]
      legend: string
      value: {
        years: number
        valueText: string
        feesText: string
        note: string
      } | null
    }
  | {
      kind: 'costs'
      number: number
      label: string
      title: string
      lead: string
      brokers: { brokerId: string; name: string }[]
      rows: {
        fundId: string
        ticker: string
        indexLabel: string
        cells: { brokerId: string; totalKc: number | null; text: string }[]
      }[]
      spread: { spreadText: string; lowestText: string; text: string } | null
      note: string
    }
  | {
      kind: 'breakdown'
      number: number
      label: string
      title: string
      lead: string
      ticker: string
      rows: {
        brokerId: string
        name: string
        parts: {
          fundKc: number
          fxKc: number
          brokerKc: number
          totalKc: number
        } | null
        fundText: string
        fxText: string
        brokerText: string
        totalText: string
      }[]
    }
  | {
      kind: 'taxes'
      number: number
      label: string
      title: string
      lead: string
      rows: { label: string; hint: string; text: string | null }[]
      note: string
    }
  | {
      kind: 'where'
      number: number
      label: string
      title: string
      lead: string
      rows: {
        brokerId: string
        name: string
        purchase: string
        fx: string
        custody: string
        czech: string
        sourceUrl: string | null
        asOf: string | null
      }[]
    }
  | {
      kind: 'method'
      number: number
      label: string
      title: string
      paragraphs: string[]
      sourcesHeading: string
      sources: { url: string; title: string; publisher: string }[]
      controller: string
      testNotice: string
    }

export type PdfModel = {
  setup: { monthly: number; years: number; grossReturn: number }
  header: string
  footer: { text: string; verifiedMonth: string | null }
  pageCount: number
  pages: PdfPage[]
}

type Sourced = {
  value: unknown
  sourceUrl: string | null
  asOf: string | null
  evidence: string | null
}

function verified(record: Sourced | undefined): boolean {
  return (
    record !== undefined && record.value !== TODO_VERIFY && hasSource(record)
  )
}

// "0,07 %" style numbers in the Czech decimal comma, without trailing zeros.
function plain(value: number): string {
  return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 3 })
    .format(value)
    .replace(/\s/g, ' ')
}

const SYMBOL: Record<string, string> = { CZK: 'Kč', EUR: '€', USD: '$' }

function money(amount: number, currency: string): string {
  return `${plain(amount)} ${SYMBOL[currency] ?? currency}`
}

type PurchaseRule = {
  venues: string[] | null
  currency: string
  fixed: number
  percent: number
  min?: number
  max?: number
}

function ruleAmount(rule: PurchaseRule): string {
  const parts: string[] = []
  if (rule.fixed > 0) parts.push(money(rule.fixed, rule.currency))
  if (rule.percent > 0) {
    parts.push(`${plain(rule.percent)} % ${text.where.ofPurchase}`)
  }
  if (parts.length === 0) return money(0, rule.currency)
  let amount = parts.join(' + ')
  if (rule.min !== undefined) {
    amount += `, ${text.where.atLeast} ${money(rule.min, rule.currency)}`
  }
  if (rule.max !== undefined) {
    amount += `, ${text.where.atMost} ${money(rule.max, rule.currency)}`
  }
  return amount
}

// The commission of one purchase in words: rules with the same amount are joined and
// their venues named; a rule for any other venue reads "jinde".
function purchaseText(broker: Broker): string {
  const rules = (broker.fees?.purchase ?? []).filter(verified)
  if (rules.length === 0) return text.unverified
  const values = rules.map((record) => record.value as PurchaseRule)
  const hasVenueRules = values.some((rule) => rule.venues !== null)
  const groups = new Map<string, { venues: string[]; any: boolean }>()
  for (const rule of values) {
    const amount = ruleAmount(rule)
    const group = groups.get(amount) ?? { venues: [], any: false }
    if (rule.venues === null) group.any = true
    else group.venues.push(...rule.venues)
    groups.set(amount, group)
  }
  // An amount with a minimum holds a comma itself, so such lines are told apart by a semicolon.
  const joiner = [...groups.keys()].some((amount) => amount.includes(', '))
    ? '; '
    : ', '
  return [...groups]
    .map(([amount, group]) => {
      if (group.any)
        return hasVenueRules ? `${text.where.other} ${amount}` : amount
      return `${amount} (${group.venues.join(', ')})`
    })
    .join(joiner)
}

function fxText(broker: Broker): string {
  const found: { currency: 'EUR' | 'USD'; percent: number }[] = []
  for (const currency of ['EUR', 'USD'] as const) {
    const record = broker.fees?.fx[currency]
    if (record && verified(record) && typeof record.value === 'number') {
      found.push({ currency, percent: record.value })
    }
  }
  if (found.length === 0) return text.unverified
  if (found.length === 2 && found[0].percent === found[1].percent) {
    return `${plain(found[0].percent)} % ${text.where.toBoth}`
  }
  return found
    .map(
      ({ currency, percent }) =>
        `${plain(percent)} % ${currency === 'EUR' ? text.where.toEuros : text.where.toDollars}`,
    )
    .join(', ')
}

function custodyText(broker: Broker): string {
  const record = broker.fees?.custody
  if (!record || !verified(record)) return text.unverified
  const { currency, annualFixed, annualPercent } = record.value as {
    currency: string
    annualFixed: number
    annualPercent: number
  }
  const parts: string[] = []
  if (annualFixed > 0) {
    parts.push(`${money(annualFixed, currency)} ${text.where.yearly}`)
  }
  if (annualPercent > 0) {
    parts.push(`${plain(annualPercent)} % ${text.where.yearly}`)
  }
  return parts.length === 0 ? money(0, currency) : parts.join(' + ')
}

// The record that backs a broker's fees on page 5: the first verified purchase
// rule, else the custody or conversion record.
function sourceOf(broker: Broker): { url: string; asOf: string | null } | null {
  const records: Sourced[] = [
    ...(broker.fees?.purchase ?? []),
    ...(broker.fees?.custody ? [broker.fees.custody] : []),
    ...Object.values(broker.fees?.fx ?? {}),
  ]
  const found = records.find((record) => verified(record) && record.sourceUrl)
  return found ? { url: found.sourceUrl!, asOf: found.asOf } : null
}

function walkSources(node: unknown, found: Set<string>) {
  if (Array.isArray(node)) {
    node.forEach((item) => walkSources(item, found))
    return
  }
  if (typeof node !== 'object' || node === null) return
  const record = node as Record<string, unknown>
  if (
    'value' in record &&
    typeof record.sourceUrl === 'string' &&
    verified(record as Sourced)
  ) {
    found.add(record.sourceUrl)
    return
  }
  Object.values(record).forEach((value) => walkSources(value, found))
}

export function pdfModel(
  raw: unknown,
  rates: ChosenRates,
  setup: { monthly: number; years: number },
  controller: string,
): PdfModel | null {
  const parsed = dataSchema.safeParse(raw)
  if (!parsed.success) return null
  const shown = comparison(raw, rates, setup)
  if (!shown) return null
  const { years } = setup
  const rate = formatPercent(GROSS_RETURN, 0)
  const brokers = shown.byFund[shown.headlineFundId].brokers.map((cell) => ({
    brokerId: cell.brokerId,
    name: cell.name,
  }))
  const headFund = shown.funds.find((f) => f.fundId === shown.headlineFundId)
  const head = shown.byFund[shown.headlineFundId]
  const month = shown.asOf ? formatMonthYear(shown.asOf) : null

  // Page 1: availability and the illustrative value of the calculator's headline.
  const data = calculatorData(raw, rates, shown.headlineFundId)
  const prices = data
    ? priceBrokers(data.pricing, shown.headlineFundId, data.ter, data.rates, {
        ...shown.setup,
      })
    : null
  const headline = prices?.headline?.result ?? null

  const page1: PdfPage = {
    kind: 'comparison',
    number: 1,
    label: text.comparison.label,
    title: text.comparison.title,
    lead: text.comparison.lead,
    brokers,
    rows: shown.funds.map((fund) => ({
      fundId: fund.fundId,
      ticker: fund.ticker,
      indexLabel: fund.indexLabel,
      type:
        fund.type === 'accumulating'
          ? 'Acc'
          : fund.type === 'distributing'
            ? 'Dist'
            : null,
      fee: fund.ter === null ? null : formatPercent(fund.ter),
      cells: shown.byFund[fund.fundId].brokers.map((cell) => ({
        brokerId: cell.brokerId,
        text:
          cell.available === true
            ? text.yes
            : cell.available === false
              ? text.no
              : text.unverified,
      })),
    })),
    legend: text.comparison.legend,
    value: headline
      ? {
          years,
          valueText: formatKc(headline.valueKc),
          feesText: formatKc(headline.totalKc),
          note: text.comparison.valueNote(rate),
        }
      : null,
  }

  // Page 2: the total over the period, every fund at every broker.
  const page2: PdfPage = {
    kind: 'costs',
    number: 2,
    label: text.costs.label,
    title: text.costs.title,
    lead: text.costs.lead(years),
    brokers,
    rows: shown.funds.map((fund) => ({
      fundId: fund.fundId,
      ticker: fund.ticker,
      indexLabel: fund.indexLabel,
      cells: shown.byFund[fund.fundId].brokers.map((cell) => ({
        brokerId: cell.brokerId,
        totalKc: cell.priced?.totalKc ?? null,
        text: cell.priced ? formatKc(cell.priced.totalKc) : text.none,
      })),
    })),
    spread:
      head.spreadKc !== null && head.lowestKc !== null
        ? {
            spreadText: formatKc(head.spreadKc),
            lowestText: formatKc(head.lowestKc),
            text: resultsCopy.brokers.summary(
              formatKc(head.spreadKc),
              formatKc(head.lowestKc),
              years,
            ),
          }
        : null,
    note: text.costs.note,
  }

  // Page 3: what the headline fund's price is made of, per broker.
  const page3: PdfPage = {
    kind: 'breakdown',
    number: 3,
    label: text.breakdown.label,
    title: text.breakdown.title,
    lead: text.breakdown.lead(years),
    ticker: headFund?.ticker ?? '',
    rows: brokers.map((broker) => {
      const priced = prices?.brokers.find(
        (entry) => entry.brokerId === broker.brokerId,
      )?.priced
      const result = priced?.result ?? null
      return {
        brokerId: broker.brokerId,
        name: broker.name,
        parts: result
          ? {
              fundKc: result.parts.fund,
              fxKc: result.parts.fx,
              brokerKc: result.parts.broker,
              totalKc: result.totalKc,
            }
          : null,
        fundText: result ? formatKc(result.parts.fund) : text.none,
        fxText: result ? formatKc(result.parts.fx) : text.none,
        brokerText: result ? formatKc(result.parts.broker) : text.none,
        totalText: result ? formatKc(result.totalKc) : text.none,
      }
    }),
  }

  // Page 4: taxes. No verified text yet: every row says where it will come from.
  const page4: PdfPage = {
    kind: 'taxes',
    number: 4,
    label: text.taxes.label,
    title: text.taxes.title,
    lead: text.taxes.lead,
    rows: text.taxes.rows.map((row) => ({ ...row, text: null })),
    note: text.taxes.note,
  }

  // Page 5: where to buy, from the broker records.
  const sortedBrokers = [...parsed.data.brokers].sort((a, b) =>
    a.name.localeCompare(b.name, 'cs'),
  )
  const page5: PdfPage = {
    kind: 'where',
    number: 5,
    label: text.where.label,
    title: text.where.title,
    lead: text.where.lead,
    rows: sortedBrokers.map((broker) => {
      const source = sourceOf(broker)
      return {
        brokerId: broker.id,
        name: broker.name,
        purchase: purchaseText(broker),
        fx: fxText(broker),
        custody: custodyText(broker),
        czech: verified(broker.czSupport)
          ? broker.czSupport.value === true
            ? text.yes
            : text.no
          : text.unverified,
        sourceUrl: source?.url ?? null,
        asOf: source?.asOf ?? null,
      }
    }),
  }

  // Page 6: the method and the sources of the values that are verified.
  const urls = new Set<string>()
  walkSources({ etfs: parsed.data.etfs, brokers: parsed.data.brokers }, urls)
  const sources = parsed.data.sources
    .filter((source) => urls.has(source.url))
    .sort(
      (a, b) =>
        a.publisher.localeCompare(b.publisher, 'cs') ||
        a.title.localeCompare(b.title, 'cs'),
    )
  const page6: PdfPage = {
    kind: 'method',
    number: 6,
    label: text.method.label,
    title: text.method.title,
    paragraphs: [
      text.method.counted,
      resultsCopy_assumption(rate),
      text.method.proof,
    ],
    sourcesHeading: text.method.sourcesHeading,
    sources,
    controller,
    testNotice: FOOTER_TEST_NOTICE,
  }

  const pages = [page1, page2, page3, page4, page5, page6]
  return {
    setup: shown.setup,
    header: `${text.header} · ${formatKc(setup.monthly)} měsíčně · ${years} let · ${rate} ročně`,
    footer: {
      text: [
        text.footer.advice,
        `${month ? text.footer.verified(month) : text.footer.verified(text.unverified)}, ${text.footer.estimate}.`,
        text.footer.controller(controller),
      ].join(' '),
      verifiedMonth: month,
    },
    pageCount: pages.length,
    pages,
  }
}
