// The numbers of the comparison page and the PDF (SPEC §3.2, §22): five funds, five
// brokers, the visitor's setup. Every price comes from the same pricing code as the
// calculator, so the page cannot disagree with it. Unverified values are null,
// never 0. Pure: no imports from next or react.
import { GROSS_RETURN } from '@/lib/calculator-defaults'
import { verifiedValue } from './availability'
import { priceBrokers } from './broker-pricing'
import { calculatorData } from './calculator-data'
import type { ChosenRates } from './cnb'
import { fundFeeKc } from './cost'
import { oldestAsOf } from './data/freshness'
import { dataSchema } from './data/schema'
import { TODO_VERIFY } from './data/todo'
import { hasSource } from './data/verified'
import { taxStatements, type TaxStatements } from './tax-statements'

// The twins in the order of the comparison page (note 0036); the first one is the
// fund the calculator and its headline use.
const FUNDS = ['cspx', 'vuaa', 'vusa', 'cndx', 'eqqq']

const INDEX_LABELS: Record<string, string> = {
  sp500: 'S&P 500',
  nasdaq100: 'Nasdaq 100',
}

export type ComparisonFund = {
  fundId: string
  ticker: string
  name: string | null
  indexLabel: string
  // plain percent (0.07 means 0,07 %); null unless verified
  ter: number | null
  type: 'accumulating' | 'distributing' | null
}

export type ComparisonCell = {
  brokerId: string
  name: string
  // true or false only when verified; null when it is not
  available: boolean | null
  // fees = conversion plus broker fees over the period; total = with the fund fee
  priced: { feesKc: number; totalKc: number } | null
}

export type ComparisonForFund = {
  brokers: ComparisonCell[]
  fundFeeKc: number | null
  headlineKc: number | null
  lowestKc: number | null
  spreadKc: number | null
}

export type Comparison = {
  setup: { monthly: number; years: number; grossReturn: number }
  asOf: string | null
  headlineFundId: string
  funds: ComparisonFund[]
  byFund: Record<string, ComparisonForFund>
  taxes: TaxStatements
}

type Sourced = {
  value: unknown
  sourceUrl: string | null
  evidence: string | null
}

function verified(record: Sourced | undefined): unknown {
  if (!record) return null
  return record.value !== TODO_VERIFY && hasSource(record) ? record.value : null
}

export function comparison(
  raw: unknown,
  rates: ChosenRates,
  setup: { monthly: number; years: number },
): Comparison | null {
  const parsed = dataSchema.safeParse(raw)
  if (!parsed.success) return null
  const { etfs, brokers } = parsed.data
  const input = { ...setup, grossReturn: GROSS_RETURN }
  const sorted = [...brokers].sort((a, b) => a.name.localeCompare(b.name, 'cs'))

  const funds: ComparisonFund[] = []
  const byFund: Record<string, ComparisonForFund> = {}

  for (const fundId of FUNDS) {
    const etf = etfs.find((candidate) => candidate.id === fundId)
    if (!etf) continue
    const ter = verified(etf.ter)
    const type = verified(etf.distribution)
    const name = verified(etf.name)
    funds.push({
      fundId,
      ticker: etf.ticker,
      name: typeof name === 'string' ? name : null,
      indexLabel: INDEX_LABELS[etf.indexGroup] ?? etf.indexGroup,
      ter: typeof ter === 'number' ? ter : null,
      type: type === 'accumulating' || type === 'distributing' ? type : null,
    })

    const data = calculatorData(raw, rates, fundId)
    const prices = data
      ? priceBrokers(data.pricing, fundId, data.ter, data.rates, input)
      : null
    const cells = sorted.map((broker): ComparisonCell => {
      const priced =
        prices?.brokers.find((entry) => entry.brokerId === broker.id)?.priced ??
        null
      return {
        brokerId: broker.id,
        name: broker.name,
        available: verifiedValue(broker.availability[fundId]),
        priced: priced
          ? {
              feesKc: priced.result.parts.fx + priced.result.parts.broker,
              totalKc: priced.result.totalKc,
            }
          : null,
      }
    })
    byFund[fundId] = {
      brokers: cells,
      fundFeeKc: data ? fundFeeKc(input, data.ter) : null,
      headlineKc: prices?.headline?.result.totalKc ?? null,
      lowestKc:
        prices && prices.pricedBrokers.length > 0
          ? Math.min(...prices.pricedBrokers.map((p) => p.result.totalKc))
          : null,
      spreadKc: prices?.spreadKc ?? null,
    }
  }

  return {
    setup: input,
    asOf: oldestAsOf(raw),
    headlineFundId: FUNDS[0],
    taxes: taxStatements(raw),
    funds,
    byFund,
  }
}
