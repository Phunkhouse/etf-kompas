import { describe, expect, it } from 'vitest'
import { priceBrokers } from './broker-pricing'
import { calculatorData } from './calculator-data'
import { comparison } from './comparison'
import type { ChosenRates } from './cnb'
import { bundledData } from './data/bundled'
import { GROSS_RETURN } from '@/lib/calculator-defaults'

// Phase 4, PR 2: test case P-1 of docs/PHASE-4-PLAN.md. The comparison page and
// the PDF show the same numbers as the calculator, because they call the same
// pricing code. Written first.
const RATES: ChosenRates = {
  EUR: { rate: 24.365, date: '2026-10-09', source: 'cnb' },
  USD: { rate: 21.745, date: '2026-10-08', source: 'cnb' },
}
const FUNDS = ['cspx', 'vuaa', 'vusa', 'cndx', 'eqqq']

function raw() {
  return structuredClone(bundledData) as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

describe('comparison', () => {
  const setup = { monthly: 3000, years: 10 }

  it('echoes the setup and the assumed return', () => {
    expect(comparison(bundledData, RATES, setup)?.setup).toEqual({
      ...setup,
      grossReturn: GROSS_RETURN,
    })
  })

  it('lists the five twins in this order, with fee and type only when verified', () => {
    const result = comparison(bundledData, RATES, setup)!
    expect(result.funds.map((f) => f.fundId)).toEqual(FUNDS)
    expect(result.funds[0]).toMatchObject({
      ticker: 'CSPX',
      indexLabel: 'S&P 500',
      ter: 0.07,
      type: 'accumulating',
    })
    expect(result.funds[2]).toMatchObject({
      ticker: 'VUSA',
      type: 'distributing',
    })
    expect(result.funds[3]).toMatchObject({
      ticker: 'CNDX',
      indexLabel: 'Nasdaq 100',
      ter: 0.3,
    })
  })

  it('shows an unverified fee or type as null, never as a number', () => {
    const data = raw()
    const cspx = data.etfs.find((e: { id: string }) => e.id === 'cspx')
    cspx.ter = {
      ...cspx.ter,
      value: 'TODO_VERIFY',
      sourceUrl: null,
      evidence: null,
    }
    cspx.distribution = { ...cspx.distribution, evidence: null }
    const result = comparison(data, RATES, setup)!
    expect(result.funds[0]).toMatchObject({ ter: null, type: null })
  })

  it('lists the brokers alphabetically by name, not by cost', () => {
    const result = comparison(bundledData, RATES, setup)!
    for (const fundId of FUNDS) {
      const names = result.byFund[fundId].brokers.map((b) => b.name)
      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'cs')))
    }
  })

  it.each(FUNDS)(
    '%s: every broker price equals the calculator pricing for the same inputs',
    (fundId) => {
      const result = comparison(bundledData, RATES, setup)!
      const data = calculatorData(bundledData, RATES, fundId)!
      const prices = priceBrokers(data.pricing, fundId, data.ter, data.rates, {
        ...setup,
        grossReturn: GROSS_RETURN,
      })
      for (const cell of result.byFund[fundId].brokers) {
        const expected = prices.brokers.find(
          (b) => b.brokerId === cell.brokerId,
        )!
        if (expected.priced === null) {
          expect(cell.priced).toBeNull()
        } else {
          expect(cell.priced).toEqual({
            feesKc:
              expected.priced.result.parts.fx +
              expected.priced.result.parts.broker,
            totalKc: expected.priced.result.totalKc,
          })
        }
      }
      expect(result.byFund[fundId].spreadKc).toBe(prices.spreadKc)
      expect(result.byFund[fundId].headlineKc).toBe(
        prices.headline?.result.totalKc ?? null,
      )
      expect(result.byFund[fundId].lowestKc).toBe(
        prices.pricedBrokers.length === 0
          ? null
          : Math.min(...prices.pricedBrokers.map((p) => p.result.totalKc)),
      )
    },
  )

  it('the headline of the headline fund is the number the calculator shows', () => {
    const result = comparison(bundledData, RATES, setup)!
    const data = calculatorData(bundledData, RATES, 'cspx')!
    const prices = priceBrokers(data.pricing, 'cspx', data.ter, data.rates, {
      ...setup,
      grossReturn: GROSS_RETURN,
    })
    expect(result.headlineFundId).toBe('cspx')
    expect(result.byFund.cspx.headlineKc).toBe(prices.headline!.result.totalKc)
  })

  it('a broker without a verified price has priced null (a dash and [ověřit]), never 0', () => {
    const data = raw()
    delete data.brokers.find((b: { id: string }) => b.id === 'ibkr').fees
    const cells = comparison(data, RATES, setup)!.byFund.cspx.brokers
    expect(cells.find((c) => c.brokerId === 'ibkr')!.priced).toBeNull()
    for (const cell of cells) {
      if (cell.priced) expect(cell.priced.totalKc).toBeGreaterThan(0)
    }
  })

  it('tells "not sold" (false) from "not verified" (null) in available', () => {
    const data = raw()
    const degiro = data.brokers.find((b: { id: string }) => b.id === 'degiro')
    degiro.availability.cspx = { ...degiro.availability.cspx, value: false }
    const fio = data.brokers.find((b: { id: string }) => b.id === 'fio')
    fio.availability.cspx = {
      ...fio.availability.cspx,
      evidence: null,
      sourceUrl: null,
    }
    const cells = comparison(data, RATES, setup)!.byFund.cspx.brokers
    expect(cells.find((c) => c.brokerId === 'degiro')).toMatchObject({
      available: false,
      priced: null,
    })
    expect(cells.find((c) => c.brokerId === 'fio')).toMatchObject({
      available: null,
      priced: null,
    })
  })

  it('a different setup gives different, consistent numbers', () => {
    const a = comparison(bundledData, RATES, { monthly: 3000, years: 10 })!
    const b = comparison(bundledData, RATES, { monthly: 10000, years: 20 })!
    expect(b.byFund.cspx.headlineKc!).toBeGreaterThan(a.byFund.cspx.headlineKc!)
  })

  it('has the oldest as-of date of the data', () => {
    expect(comparison(bundledData, RATES, setup)!.asOf).toMatch(
      /^\d{4}-\d{2}-\d{2}$/,
    )
  })

  it('is null when the data does not parse', () => {
    expect(comparison({ etfs: 'nonsense' }, RATES, setup)).toBeNull()
  })
})
