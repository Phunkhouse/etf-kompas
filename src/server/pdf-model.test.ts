import { describe, expect, it } from 'vitest'
import { GROSS_RETURN } from '@/lib/calculator-defaults'
import { checkCopy } from '@/lib/copy-check'
import { priceBrokers } from './broker-pricing'
import { calculatorData } from './calculator-data'
import type { ChosenRates } from './cnb'
import { comparison } from './comparison'
import { bundledData } from './data/bundled'
import { pdfModel, type PdfModel } from './pdf-model'

// Phase 4, PR 3: the content of the personalised PDF (docs/PHASE-4-PLAN.md, the six
// pages approved by David on 2026-10-14). The model holds every number and every
// text of the six pages; the layout only draws it. Written first.
const RATES: ChosenRates = {
  EUR: { rate: 24.365, date: '2026-10-09', source: 'cnb' },
  USD: { rate: 21.745, date: '2026-10-08', source: 'cnb' },
}
const SETUP = { monthly: 3000, years: 10 }
const CONTROLLER = '[SPRÁVCE] – [IČO], [adresa]'
const FUNDS = ['cspx', 'vuaa', 'vusa', 'cndx', 'eqqq']

function raw() {
  return structuredClone(bundledData) as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}
function build(data: unknown = bundledData, setup = SETUP): PdfModel {
  const model = pdfModel(data, RATES, setup, CONTROLLER)
  if (!model) throw new Error('no model')
  return model
}
// "12 668 Kč" -> 12668 (non-breaking spaces too)
const kc = (text: string) => Number(text.replace(/[^\d]/g, ''))
function page<K extends PdfModel['pages'][number]['kind']>(
  model: PdfModel,
  kind: K,
) {
  const found = model.pages.find((p) => p.kind === kind)
  if (!found) throw new Error(`no ${kind} page`)
  return found as Extract<PdfModel['pages'][number], { kind: K }>
}

describe('pdfModel: the six pages', () => {
  it('has six pages in the approved order, numbered 1 to 6', () => {
    const model = build()
    expect(model.pages.map((p) => p.kind)).toEqual([
      'comparison',
      'costs',
      'breakdown',
      'taxes',
      'where',
      'method',
    ])
    expect(model.pages.map((p) => p.number)).toEqual([1, 2, 3, 4, 5, 6])
    expect(model.pageCount).toBe(6)
  })

  it('is null when the data does not parse', () => {
    expect(pdfModel({ etfs: 'x' }, RATES, SETUP, CONTROLLER)).toBeNull()
  })

  it("carries the visitor's setup in the header, not the default one", () => {
    const model = build(bundledData, { monthly: 10000, years: 20 })
    expect(model.setup).toEqual({
      monthly: 10000,
      years: 20,
      grossReturn: GROSS_RETURN,
    })
    expect(model.header.replace(/\s/g, ' ')).toBe(
      'Vaše srovnání · 10 000 Kč měsíčně · 20 let · 6 % ročně',
    )
  })

  it('has the footer of the drawing: not advice, verified month, controller', () => {
    const { footer } = build()
    expect(footer.text.replace(/\s/g, ' ')).toMatch(
      /^Obecná informace, ne investiční ani daňové poradenství\. Čísla ověřena k \d{1,2}\. \d{4}, odhad bez českých daní a inflace\. Správce: /,
    )
    expect(footer.text).toContain(CONTROLLER)
  })

  it('never contains the placeholder TODO_VERIFY, and never ranks or says cheapest', () => {
    const text = JSON.stringify(build())
    expect(text).not.toContain('TODO_VERIFY')
    expect(text).not.toMatch(/nejlevnější/i)
  })

  it('passes the same text rules as the page copy (glossary, banned words)', () => {
    const tickers = ['CSPX', 'VUAA', 'VUSA', 'CNDX', 'EQQQ', 'VOO', 'QQQ']
    // The prose we write: titles, leads, notes and legends. Not the venue names and the
    // titles of third-party documents (for example "BVME.ETF"), which are data.
    const prose = build().pages.map((p) =>
      Object.fromEntries(
        Object.entries(p).filter(([key]) =>
          [
            'label',
            'title',
            'lead',
            'legend',
            'note',
            'paragraphs',
            'sourcesHeading',
            'testNotice',
          ].includes(key),
        ),
      ),
    )
    expect(checkCopy({ pdf: prose }, { tickers })).toEqual([])
  })

  it('contains no e-mail address', () => {
    expect(JSON.stringify(build())).not.toMatch(/[\w.+-]+@[\w-]+\.\w+/)
  })
})

describe('pdfModel: page 1, the comparison', () => {
  it('lists the five funds with fee and type only when verified, and the five brokers', () => {
    const p = page(build(), 'comparison')
    expect(p.rows.map((r) => r.fundId)).toEqual(FUNDS)
    expect(p.rows[0]).toMatchObject({ ticker: 'CSPX', type: 'Acc' })
    expect(p.rows[0].fee?.replace(/\s/g, ' ')).toBe('0,07 %')
    expect(p.rows[2]).toMatchObject({ ticker: 'VUSA', type: 'Dist' })
    expect(p.brokers).toHaveLength(5)
  })

  it('shows Ano, Ne and [ověřit] for the availability as the page does', () => {
    const data = raw()
    const degiro = data.brokers.find((b: { id: string }) => b.id === 'degiro')
    degiro.availability.cspx = { ...degiro.availability.cspx, value: false }
    const fio = data.brokers.find((b: { id: string }) => b.id === 'fio')
    fio.availability.cspx = {
      ...fio.availability.cspx,
      evidence: null,
      sourceUrl: null,
    }
    const p = page(build(data), 'comparison')
    const cspx = p.rows[0].cells
    expect(cspx.find((c) => c.brokerId === 'degiro')?.text).toBe('Ne')
    expect(cspx.find((c) => c.brokerId === 'fio')?.text).toBe('[ověřit]')
    expect(cspx.find((c) => c.brokerId === 'xtb')?.text).toBe('Ano')
  })

  it('shows an unverified fee or type as [ověřit]', () => {
    const data = raw()
    const cspx = data.etfs.find((e: { id: string }) => e.id === 'cspx')
    cspx.ter = {
      ...cspx.ter,
      value: 'TODO_VERIFY',
      sourceUrl: null,
      evidence: null,
    }
    cspx.distribution = { ...cspx.distribution, evidence: null }
    const row = page(build(data), 'comparison').rows[0]
    expect(row.fee).toBeNull()
    expect(row.type).toBeNull()
  })

  it("gives the illustrative value and fees of the page's headline: the calculator's own numbers", () => {
    const model = build()
    const data = calculatorData(bundledData, RATES, 'cspx')!
    const prices = priceBrokers(data.pricing, 'cspx', data.ter, data.rates, {
      ...SETUP,
      grossReturn: GROSS_RETURN,
    })
    const headline = prices.headline!.result
    const { value } = page(model, 'comparison')
    expect(kc(value!.valueText)).toBe(headline.valueKc)
    expect(kc(value!.feesText)).toBe(headline.totalKc)
    expect(value!.years).toBe(10)
  })
})

describe('pdfModel: page 2, what it costs', () => {
  it('has the total of every fund at every broker, equal to the page and the calculator', () => {
    const model = build()
    const page2 = page(model, 'costs')
    const shown = comparison(bundledData, RATES, SETUP)!
    expect(page2.rows.map((r) => r.fundId)).toEqual(FUNDS)
    for (const row of page2.rows) {
      for (const cell of row.cells) {
        const expected = shown.byFund[row.fundId].brokers.find(
          (b) => b.brokerId === cell.brokerId,
        )!
        if (expected.priced === null) {
          expect(cell.totalKc).toBeNull()
          expect(cell.text).toBe('–')
        } else {
          expect(cell.totalKc).toBe(expected.priced.totalKc)
          expect(kc(cell.text)).toBe(expected.priced.totalKc)
        }
      }
    }
  })

  it('names the spread and the lowest cost of the headline fund, as the page does', () => {
    const page2 = page(build(), 'costs')
    const shown = comparison(bundledData, RATES, SETUP)!.byFund.cspx
    expect(page2.spread).not.toBeNull()
    expect(kc(page2.spread!.spreadText)).toBe(shown.spreadKc)
    expect(kc(page2.spread!.lowestText)).toBe(shown.lowestKc)
    expect(page2.note).toBe('Odhad. Bez českých daní a inflace.')
  })

  it('leaves the spread out without two priced brokers', () => {
    const data = raw()
    for (const broker of data.brokers.slice(1)) delete broker.fees
    expect(page(build(data), 'costs').spread).toBeNull()
  })

  it('lists the brokers alphabetically, not by cost', () => {
    const names = page(build(), 'costs').brokers.map((b) => b.name)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'cs')))
  })

  it('shows a different setup as different numbers', () => {
    const a = page(build(), 'costs').rows[0].cells[0].totalKc!
    const b = page(build(bundledData, { monthly: 10000, years: 20 }), 'costs')
      .rows[0].cells[0].totalKc!
    expect(b).toBeGreaterThan(a)
  })
})

describe('pdfModel: page 3, what the price is made of', () => {
  it("splits the headline fund's cost per broker into the three parts of the calculator", () => {
    const page3 = page(build(), 'breakdown')
    const data = calculatorData(bundledData, RATES, 'cspx')!
    const prices = priceBrokers(data.pricing, 'cspx', data.ter, data.rates, {
      ...SETUP,
      grossReturn: GROSS_RETURN,
    })
    expect(page3.ticker).toBe('CSPX')
    for (const row of page3.rows) {
      const expected = prices.brokers.find((b) => b.brokerId === row.brokerId)!
      if (expected.priced === null) {
        expect(row.parts).toBeNull()
        continue
      }
      const { parts, totalKc } = expected.priced.result
      expect(row.parts).toEqual({
        fundKc: parts.fund,
        fxKc: parts.fx,
        brokerKc: parts.broker,
        totalKc,
      })
      expect(parts.fund + parts.fx + parts.broker).toBe(totalKc)
      expect(kc(row.totalText)).toBe(totalKc)
    }
  })

  it('shows a dash for a broker without a price', () => {
    const data = raw()
    delete data.brokers.find((b: { id: string }) => b.id === 'ibkr').fees
    const row = page(build(data), 'breakdown').rows.find(
      (r) => r.brokerId === 'ibkr',
    )!
    expect(row.parts).toBeNull()
    expect(row.totalText).toBe('–')
  })
})

describe('pdfModel: page 4, the taxes', () => {
  it('has the four rows of the drawing, each [ověřit zdroj] until there is verified text', () => {
    const page4 = page(build(), 'taxes')
    expect(page4.rows.map((r) => r.label)).toEqual([
      'Fond, který výnosy reinvestuje',
      'Fond, který výnosy vyplácí',
      'Časový test',
      'Daň z dividend v zahraničí',
    ])
    for (const row of page4.rows) expect(row.text).toBeNull()
    expect(page4.note).toBe(
      'Nejde o daňové poradenství. Před rozhodnutím se poraďte s poradcem.',
    )
  })
})

describe('pdfModel: page 5, where to buy', () => {
  it('has one row per broker, alphabetical, with the fees from the data', () => {
    const page5 = page(build(), 'where')
    expect(page5.rows.map((r) => r.name)).toEqual([
      'DEGIRO',
      'Fio e-Broker',
      'Interactive Brokers',
      'Trading 212',
      'XTB',
    ])
    const t212 = page5.rows.find((r) => r.brokerId === 'trading212')!
    expect(t212.purchase.replace(/\s/g, ' ')).toBe('0 Kč')
    expect(t212.fx.replace(/\s/g, ' ')).toContain('0,15 %')
    const degiro = page5.rows.find((r) => r.brokerId === 'degiro')!
    expect(degiro.purchase.replace(/\s/g, ' ')).toBe(
      '1 € (Tradegate), jinde 3 €',
    )
  })

  it('writes a commission with a percentage and a minimum in words', () => {
    const ibkr = page(build(), 'where').rows.find((r) => r.brokerId === 'ibkr')!
    expect(ibkr.purchase.replace(/\s/g, ' ')).toContain('0,05 %')
    expect(ibkr.purchase.replace(/\s/g, ' ')).toContain('3 €')
  })

  it('says whether the interface is in Czech, from the data', () => {
    const rows = page(build(), 'where').rows
    expect(rows.find((r) => r.brokerId === 'ibkr')?.czech).toBe('Ne')
    expect(rows.find((r) => r.brokerId === 'xtb')?.czech).toBe('Ano')
  })

  it('shows a value without a source as [ověřit]', () => {
    const data = raw()
    const xtb = data.brokers.find((b: { id: string }) => b.id === 'xtb')
    xtb.czSupport = { ...xtb.czSupport, evidence: null }
    xtb.fees.purchase = []
    const row = page(build(data), 'where').rows.find(
      (r) => r.brokerId === 'xtb',
    )!
    expect(row.czech).toBe('[ověřit]')
    expect(row.purchase).toBe('[ověřit]')
  })

  it('gives each broker a source from the data with its date', () => {
    const rows = page(build(), 'where').rows
    const urls = new Set(bundledData.sources.map((s) => s.url))
    for (const row of rows) {
      expect(urls.has(row.sourceUrl ?? ''), row.brokerId).toBe(true)
      expect(row.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})

describe('pdfModel: page 6, the method and the sources', () => {
  it('states the method, what is not counted, and that the return is an illustration', () => {
    const page6 = page(build(), 'method')
    const text = page6.paragraphs.join(' ').replace(/\s/g, ' ')
    expect(text).toContain('roční poplatek fondu')
    expect(text).toContain('převod korun')
    expect(text).toContain('poplatky brokera')
    expect(text).toMatch(/inflac/)
    expect(text).toMatch(/6 % ročně/)
    expect(text).toMatch(/příklad, ne slib/)
  })

  it('lists only sources of the data files, none invented', () => {
    const page6 = page(build(), 'method')
    const known = new Map(bundledData.sources.map((s) => [s.url, s]))
    expect(page6.sources.length).toBeGreaterThan(0)
    for (const source of page6.sources) {
      expect(known.has(source.url), source.url).toBe(true)
      expect(source.title).toBe(known.get(source.url)!.title)
    }
  })

  it('says it is a test project and names the controller', () => {
    const page6 = page(build(), 'method')
    expect(page6.controller).toBe(CONTROLLER)
    expect(page6.testNotice).toMatch(/Zkušební projekt/)
  })
})
