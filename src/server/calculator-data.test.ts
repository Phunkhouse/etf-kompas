import { describe, expect, it } from 'vitest'
import { priceBrokers } from './broker-pricing'
import { calculatorData } from './calculator-data'
import type { ChosenRates } from './cnb'
import type { CostInput } from './cost'
import { bundledData } from './data/bundled'
import { dataSchema } from './data/schema'

const RATES: ChosenRates = {
  EUR: { rate: 24.365, date: '2026-10-09', source: 'cnb' },
  USD: { rate: 21.745, date: '2026-10-08', source: 'cnb' },
}
const INPUT: CostInput = { monthly: 3000, years: 10, grossReturn: 6 }

// A copy of the real data that a test may change.
function raw() {
  return structuredClone(bundledData) as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
}

describe('calculatorData', () => {
  it('names the fund and gives its verified annual fee', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    expect(data).toMatchObject({ fundId: 'cspx', ticker: 'CSPX', ter: 0.07 })
  })

  it('is null for an unknown fund', () => {
    expect(calculatorData(bundledData, RATES, 'nope')).toBeNull()
  })

  it('is null when the annual fee is not verified (TODO_VERIFY)', () => {
    const input = raw()
    const vusa = input.etfs.find((e: { id: string }) => e.id === 'vusa')
    vusa.ter = {
      value: 'TODO_VERIFY',
      sourceUrl: null,
      asOf: null,
      verifiedBy: null,
      verifiedOn: null,
      evidence: null,
    }
    expect(calculatorData(input, RATES, 'vusa')).toBeNull()
  })

  it('is null when the annual fee has no source or evidence', () => {
    const input = raw()
    const cspx = input.etfs.find((e: { id: string }) => e.id === 'cspx')
    cspx.ter.evidence = null
    expect(calculatorData(input, RATES, 'cspx')).toBeNull()
  })

  it('lists every broker by id and name, priced or not', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')!
    expect(data.brokers.map((b) => b.id)).toEqual(
      dataSchema.parse(bundledData).brokers.map((b) => b.id),
    )
    expect(data.brokers.every((b) => b.name.length > 0)).toBe(true)
  })

  it('passes pricing data only for brokers that have fees (DEGIRO, Fio, Interactive Brokers, Trading 212 and XTB today)', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')!
    expect(data.pricing.map((b) => b.id)).toEqual([
      'degiro',
      'fio',
      'ibkr',
      'trading212',
      'xtb',
    ])
  })

  it('prices Interactive Brokers at its euro listing, where the EUR 3.00 minimum applies to every order', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')!
    const prices = priceBrokers(
      data.pricing,
      'cspx',
      data.ter,
      data.rates,
      INPUT,
    )
    const ibkr = prices.pricedBrokers.find((p) => p.brokerId === 'ibkr')!
    expect(ibkr).toBeDefined()
    // the euro line (3,00 EUR) is cheaper than the dollar line (4,00 USD)
    expect(ibkr.listing).toEqual({ currency: 'EUR', venue: 'IBIS2' })
    // 0,05 % of an order of about 123 EUR is far below the minimum, so every one of the
    // 120 orders costs 3 EUR. Fio charges a flat 3,95 EUR on the same euro rate, so the
    // two broker parts (which include the return lost on the fees) must be in the
    // ratio 3 to 3,95.
    const fio = prices.pricedBrokers.find((p) => p.brokerId === 'fio')!
    const expected = (fio.result.parts.broker * 3) / 3.95
    expect(Math.abs(ibkr.result.parts.broker - expected)).toBeLessThan(
      expected * 0.01,
    )
    // and more than the plain sum of the fees, 120 x 3 EUR
    expect(ibkr.result.parts.broker).toBeGreaterThan(
      Math.round(120 * 3 * 24.365),
    )
    // the conversion is the 0,03 % of the automatic currency conversion
    expect(ibkr.result.parts.fx).toBeGreaterThan(0)
    expect(ibkr.result.parts.fx).toBeLessThan(500)
  })

  it('has no custody fee at Interactive Brokers (a statement on its FAQ page)', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')!
    const ibkr = data.pricing.find((b) => b.id === 'ibkr')!
    expect(ibkr.fees!.custody).toMatchObject({
      value: { annualFixed: 0, annualPercent: 0 },
    })
  })

  it('passes only the chosen fund: no other fund in availability or listings', () => {
    const [degiro] = calculatorData(bundledData, RATES, 'cspx')!.pricing
    expect(Object.keys(degiro.availability)).toEqual(['cspx'])
    expect(Object.keys(degiro.fees!.listings)).toEqual(['cspx'])
  })

  it('leaves out unverified records, so no TODO_VERIFY reaches the browser', () => {
    const input = raw()
    const degiro = input.brokers.find((b: { id: string }) => b.id === 'degiro')
    degiro.fees.custody = {
      value: 'TODO_VERIFY',
      sourceUrl: null,
      asOf: null,
      verifiedBy: null,
      verifiedOn: null,
      evidence: null,
    }
    degiro.fees.fx.EUR.evidence = null
    const data = calculatorData(input, RATES, 'cspx')!
    expect(JSON.stringify(data)).not.toContain('TODO_VERIFY')
    expect(data.pricing[0].fees!.custody).toBeUndefined()
    expect(data.pricing[0].fees!.fx.EUR).toBeUndefined()
  })

  it('prices exactly like the full data would (nothing a price needs is lost)', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')!
    const rates = { EUR: 24.365, USD: 21.745 }
    const full = priceBrokers(
      dataSchema.parse(bundledData).brokers,
      'cspx',
      0.07,
      rates,
      INPUT,
    )
    const slim = priceBrokers(data.pricing, 'cspx', data.ter, data.rates, INPUT)
    expect(slim.pricedBrokers).toEqual(full.pricedBrokers)
    expect(slim.headline).toEqual(full.headline)
    expect(full.pricedBrokers.length).toBeGreaterThan(0)
  })

  it('is plain JSON: it survives a round trip to the browser unchanged', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')!
    expect(JSON.parse(JSON.stringify(data))).toEqual(data)
  })

  describe('exchange rates', () => {
    it('gives the rate per currency and the oldest date used', () => {
      const data = calculatorData(bundledData, RATES, 'cspx')!
      expect(data.rates).toEqual({ EUR: 24.365, USD: 21.745 })
      expect(data.ratesAsOf).toBe('2026-10-08')
    })

    it('leaves out a currency that has no rate, and still returns data', () => {
      const data = calculatorData(bundledData, { EUR: RATES.EUR }, 'cspx')!
      expect(data.rates).toEqual({ EUR: 24.365 })
      expect(data.ratesAsOf).toBe('2026-10-09')
    })

    it('has no rates and no date when none is available', () => {
      const data = calculatorData(bundledData, {}, 'cspx')!
      expect(data.rates).toEqual({})
      expect(data.ratesAsOf).toBeNull()
    })

    it('does not price a broker that needs a rate that is missing', () => {
      const data = calculatorData(bundledData, {}, 'cspx')!
      const prices = priceBrokers(
        data.pricing,
        'cspx',
        data.ter,
        data.rates,
        INPUT,
      )
      // DEGIRO needs the euro rate for its fees and has no price without it;
      // Trading 212 and XTB charge nothing in a currency that needs a rate, so
      // they do (XTB is the dearer of the two: 0,5 % to convert against 0,15 %)
      expect(prices.pricedBrokers.map((p) => p.brokerId)).toEqual([
        'trading212',
        'xtb',
      ])
      expect(prices.headline?.brokerId).toBe('xtb')
      expect(prices.spreadKc).toBe(4176 - 2476)
    })
  })

  it('does not throw on garbage input; it returns null', () => {
    expect(calculatorData(null, RATES, 'cspx')).toBeNull()
    expect(calculatorData({ etfs: 5 }, RATES, 'cspx')).toBeNull()
  })
})
