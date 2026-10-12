import { describe, expect, it } from 'vitest'
import {
  assertPlainPercent,
  calcCost,
  conversionFeePct,
  findPurchaseRule,
  purchaseFeeKc,
  splitRounded,
  toKc,
  type CostFees,
  type PurchaseRule,
  type Rates,
} from './cost'

// Version 2 of the calculator (docs/METHODOLOGY-V2.md). The cases were listed
// first and approved by David on 2026-10-12. The groups at the end (brokers
// with a price, the data model, golden cases G3 to G5) are still `it.todo`:
// they follow in the next PR, after David's spreadsheet numbers.

const NO_FEES: CostFees = {
  ter: 0,
  fxFeePct: 0,
  purchaseFeeKc: 0,
  custodyAnnualFixedKc: 0,
  custodyAnnualPercent: 0,
}
const RATES: Rates = { EUR: 25, USD: 23 }

function fees(overrides: Partial<CostFees>): CostFees {
  return { ...NO_FEES, ...overrides }
}

// The month-by-month loop of METHODOLOGY-V2 section 4 (a spreadsheet column).
function loopValue(deposit: number, annualRate: number, years: number) {
  const m = (1 + annualRate) ** (1 / 12) - 1
  let balance = 0
  for (let month = 0; month < 12 * years; month++) {
    balance = balance * (1 + m) + deposit
  }
  return balance
}

describe('annuity maths (unchanged from version 1)', () => {
  it('the closed form equals a month-by-month loop for several rates and horizons', () => {
    for (const g of [3, 6, 12]) {
      for (const years of [5, 10, 20]) {
        const ter = 0.7
        const expected =
          loopValue(3000, g / 100, years) -
          loopValue(3000, (g - ter) / 100, years)
        const { totalKc } = calcCost(
          { monthly: 3000, years, grossReturn: g },
          fees({ ter }),
        )
        expect(Math.abs(totalKc - expected)).toBeLessThanOrEqual(0.5 + 1e-6)
      }
    }
  })

  it('at a return of 0 the annuity factor is 12 x years', () => {
    // conversion fee of 1 %: cost = deposit x 1 % x 12 x years
    const { totalKc } = calcCost(
      { monthly: 2000, years: 10, grossReturn: 0 },
      fees({ fxFeePct: 1 }),
    )
    expect(totalKc).toBe(2400)
  })

  it('a monthly amount of 0 gives a cost of 0', () => {
    const result = calcCost(
      { monthly: 0, years: 10 },
      fees({ ter: 0.2, fxFeePct: 0.25, purchaseFeeKc: 20 }),
    )
    expect(result.totalKc).toBe(0)
    expect(result.valueKc).toBe(0)
  })
})

describe('the three parts', () => {
  const grid = [
    {
      monthly: 500,
      years: 5,
      g: 0,
      f: fees({ ter: 1, fxFeePct: 1, purchaseFeeKc: 20 }),
    },
    {
      monthly: 3000,
      years: 10,
      g: 6,
      f: fees({
        ter: 0.07,
        fxFeePct: 0.25,
        purchaseFeeKc: 75,
        custodyAnnualFixedKc: 62.5,
        custodyAnnualPercent: 0.1,
      }),
    },
    {
      monthly: 20000,
      years: 20,
      g: 12,
      f: fees({
        ter: 0.3,
        fxFeePct: 0.5,
        purchaseFeeKc: 250,
        custodyAnnualPercent: 0.25,
      }),
    },
    {
      monthly: 1234,
      years: 10,
      g: 4.5,
      f: fees({ ter: 0.33, fxFeePct: 0.11, purchaseFeeKc: 13.37 }),
    },
  ]

  it('the displayed parts add up to the displayed total, always', () => {
    for (const { monthly, years, g, f } of grid) {
      const { totalKc, parts } = calcCost({ monthly, years, grossReturn: g }, f)
      expect(parts.fund + parts.fx + parts.broker).toBe(totalKc)
    }
  })

  it('the parts come in the order fund fee, conversion, broker fees', () => {
    const { parts } = calcCost({ monthly: 3000, years: 10 }, NO_FEES)
    expect(Object.keys(parts)).toEqual(['fund', 'fx', 'broker'])
    const only = (o: Partial<CostFees>) =>
      calcCost({ monthly: 3000, years: 10 }, fees(o)).parts
    expect(only({ ter: 0.5 })).toMatchObject({ fx: 0, broker: 0 })
    expect(only({ fxFeePct: 0.5 })).toMatchObject({ fund: 0, broker: 0 })
    expect(only({ purchaseFeeKc: 50 })).toMatchObject({ fund: 0, fx: 0 })
  })

  it('the largest part absorbs the rounding remainder; a tie goes to the first', () => {
    // 10.4 + 10.4 + 10.4 = 31.2 -> 31; rounded parts 10 + 10 + 10 = 30
    expect(splitRounded(31.2, { fund: 10.4, fx: 10.4, broker: 10.4 })).toEqual({
      totalKc: 31,
      parts: { fund: 11, fx: 10, broker: 10 },
    })
    // the broker part is the largest and takes the remainder
    expect(splitRounded(8.2, { fund: 1.4, fx: 1.4, broker: 5.4 })).toEqual({
      totalKc: 8,
      parts: { fund: 1, fx: 1, broker: 6 },
    })
  })

  it('with no conversion fee and no broker fees only the fund fee is left', () => {
    const { parts, totalKc } = calcCost(
      { monthly: 3000, years: 10 },
      fees({ ter: 0.07 }),
    )
    expect(parts).toEqual({ fund: totalKc, fx: 0, broker: 0 })
    expect(totalKc).toBeGreaterThan(0)
  })

  it('every part is zero or more when every fee is zero or more', () => {
    for (const { monthly, years, g, f } of grid) {
      const { parts } = calcCost({ monthly, years, grossReturn: g }, f)
      for (const part of Object.values(parts))
        expect(part).toBeGreaterThanOrEqual(0)
    }
  })

  it('the illustrative value plus the cost equals the value without any costs', () => {
    for (const { monthly, years, g, f } of grid) {
      const { totalKc, valueKc, valueWithoutCostsKc } = calcCost(
        { monthly, years, grossReturn: g },
        f,
      )
      expect(valueKc + totalKc).toBe(valueWithoutCostsKc)
    }
  })
})

describe('broker purchase fee', () => {
  const rule = (o: Partial<PurchaseRule>): PurchaseRule => ({
    venues: null,
    currency: 'CZK',
    fixed: 0,
    percent: 0,
    ...o,
  })

  it('a fixed fee in Kč is charged once a month', () => {
    const fee = purchaseFeeKc(rule({ fixed: 20 }), 3000, RATES)
    expect(fee).toBe(20)
    // at a return of 0 over 10 years: 20 Kč x 120 orders
    const { parts } = calcCost(
      { monthly: 3000, years: 10, grossReturn: 0 },
      fees({ purchaseFeeKc: fee }),
    )
    expect(parts.broker).toBe(2400)
  })

  it('a fixed fee in euro or dollar is converted at the given rate', () => {
    expect(
      purchaseFeeKc(rule({ currency: 'EUR', fixed: 2 }), 3000, RATES),
    ).toBe(50)
    expect(
      purchaseFeeKc(rule({ currency: 'USD', fixed: 1 }), 3000, RATES),
    ).toBe(23)
  })

  it('a percent fee is taken from the deposit', () => {
    expect(purchaseFeeKc(rule({ percent: 0.5 }), 1000, RATES)).toBeCloseTo(
      5,
      10,
    )
  })

  it('the minimum applies when the percent fee is smaller', () => {
    expect(purchaseFeeKc(rule({ percent: 0.5, min: 20 }), 1000, RATES)).toBe(20)
    expect(
      purchaseFeeKc(
        rule({ currency: 'EUR', percent: 0.1, min: 1 }),
        1000,
        RATES,
      ),
    ).toBe(25)
  })

  it('the maximum applies when the fee is larger', () => {
    expect(purchaseFeeKc(rule({ percent: 1, max: 50 }), 20000, RATES)).toBe(50)
    expect(
      purchaseFeeKc(
        rule({ currency: 'USD', percent: 1, max: 5 }),
        20000,
        RATES,
      ),
    ).toBe(115)
  })

  it('with neither a minimum nor a maximum the fee is just fixed plus percent', () => {
    expect(
      purchaseFeeKc(rule({ fixed: 20, percent: 0.1 }), 3000, RATES),
    ).toBeCloseTo(23, 10)
  })

  it('the first rule whose venues contain the listing venue is used; a rule with no venues matches any', () => {
    const tradegate = rule({ venues: ['Tradegate'], fixed: 0 })
    const other = rule({ venues: null, fixed: 2, currency: 'EUR' })
    const lse = rule({ venues: ['London'], fixed: 9 })
    expect(findPurchaseRule([tradegate, other], 'Tradegate')).toBe(tradegate)
    expect(findPurchaseRule([tradegate, other], 'London')).toBe(other)
    expect(findPurchaseRule([other, lse], 'London')).toBe(other)
    expect(findPurchaseRule([tradegate], 'London')).toBeNull()
  })

  it('a fee larger than the deposit invests nothing and does not throw', () => {
    const result = calcCost(
      { monthly: 500, years: 5, grossReturn: 6 },
      fees({ purchaseFeeKc: 900 }),
    )
    expect(result.valueKc).toBe(0)
    expect(result.totalKc).toBe(result.valueWithoutCostsKc)
  })
})

describe('broker custody fee', () => {
  it('an annual fixed fee is spread evenly over twelve months', () => {
    // 60 Kč a year = 5 Kč a month; at a return of 0 over 10 years: 5 x 120
    const { parts } = calcCost(
      { monthly: 3000, years: 10, grossReturn: 0 },
      fees({ custodyAnnualFixedKc: 60 }),
    )
    expect(parts.broker).toBe(600)
  })

  it('an annual percent fee lowers the return like the fund fee', () => {
    const asCustody = calcCost(
      { monthly: 3000, years: 10 },
      fees({ custodyAnnualPercent: 0.5 }),
    )
    const asFund = calcCost({ monthly: 3000, years: 10 }, fees({ ter: 0.5 }))
    expect(asCustody.totalKc).toBe(asFund.totalKc)
    expect(asCustody.parts.broker).toBe(asCustody.totalKc)
  })

  it('with no custody fee only the purchase fee is left', () => {
    const { parts, totalKc } = calcCost(
      { monthly: 3000, years: 10 },
      fees({ purchaseFeeKc: 20 }),
    )
    expect(parts.broker).toBe(totalKc)
  })
})

describe('conversion', () => {
  const fx = { USD: 0.25, EUR: 0 }

  it('a CZK listing pays no conversion fee', () => {
    expect(conversionFeePct('CZK', fx)).toBe(0)
    expect(conversionFeePct('CZK', {})).toBe(0)
  })

  it('a USD listing uses the USD fee and a EUR listing the EUR fee of the same broker', () => {
    expect(conversionFeePct('USD', fx)).toBe(0.25)
    expect(conversionFeePct('EUR', { USD: 0.25, EUR: 0.1 })).toBe(0.1)
  })

  it('a euro fee of 0 (as at DEGIRO) gives no conversion cost', () => {
    expect(conversionFeePct('EUR', fx)).toBe(0)
    const { parts } = calcCost(
      { monthly: 3000, years: 10 },
      fees({ ter: 0.07, fxFeePct: conversionFeePct('EUR', fx) as number }),
    )
    expect(parts.fx).toBe(0)
  })

  it('a currency without a verified fee has no conversion fee yet (null, not 0)', () => {
    expect(conversionFeePct('USD', { EUR: 0 })).toBeNull()
  })

  it('converts amounts at the rate', () => {
    expect(toKc(2, 'EUR', RATES)).toBe(50)
    expect(toKc(10, 'CZK', RATES)).toBe(10)
  })
})

describe('clamping and units', () => {
  const sample = fees({ ter: 0.2, fxFeePct: 0.25, purchaseFeeKc: 30 })

  it('a monthly amount above 20 000 is treated as 20 000', () => {
    expect(calcCost({ monthly: 99999, years: 10 }, sample)).toEqual(
      calcCost({ monthly: 20000, years: 10 }, sample),
    )
  })

  it('years snap to 5, 10 or 20, a tie to the smaller', () => {
    const at = (years: number) => calcCost({ monthly: 3000, years }, sample)
    expect(at(7)).toEqual(at(5))
    expect(at(7.5)).toEqual(at(5))
    expect(at(8)).toEqual(at(10))
    expect(at(15)).toEqual(at(10))
    expect(at(40)).toEqual(at(20))
  })

  it('the gross return is clamped to 0 to 12', () => {
    const at = (grossReturn: number) =>
      calcCost({ monthly: 3000, years: 10, grossReturn }, sample)
    expect(at(15)).toEqual(at(12))
    expect(at(-3)).toEqual(at(0))
  })

  it('fees are plain percent numbers: 0.07 means 0,07 %, and 0.0007 is rejected as a fraction', () => {
    expect(() => assertPlainPercent('ter', 0.07)).not.toThrow()
    expect(() => assertPlainPercent('fx', 0)).not.toThrow()
    expect(() => assertPlainPercent('ter', 0.0007)).toThrow(/fraction/)
    expect(() => assertPlainPercent('ter', -1)).toThrow()
    // 0.07 is 0,07 %: cost is close to a hand calculation with t = 0.0007
    const g = 0.06
    const hand = loopValue(3000, g, 10) - loopValue(3000, g - 0.0007, 10)
    const { totalKc } = calcCost(
      { monthly: 3000, years: 10, grossReturn: 6 },
      fees({ ter: 0.07 }),
    )
    expect(Math.abs(totalKc - hand)).toBeLessThanOrEqual(0.5 + 1e-6)
  })

  it('calcCost rejects a fee that looks like a fraction', () => {
    expect(() =>
      calcCost({ monthly: 3000, years: 10 }, fees({ ter: 0.0007 })),
    ).toThrow(/fraction/)
  })

  it('the total and the parts are whole Kč', () => {
    const { totalKc, parts, valueKc } = calcCost(
      { monthly: 1234, years: 10, grossReturn: 5.5 },
      fees({ ter: 0.33, fxFeePct: 0.11, purchaseFeeKc: 13.37 }),
    )
    for (const n of [totalKc, valueKc, ...Object.values(parts)]) {
      expect(Number.isInteger(n)).toBe(true)
    }
  })
})

describe('golden cases (docs/METHODOLOGY-V2.md section 7, computed by David)', () => {
  it('G1: r = 0, conversion only: 2 400 Kč', () => {
    const { totalKc, parts } = calcCost(
      { monthly: 2000, years: 10, grossReturn: 0 },
      fees({ fxFeePct: 1 }),
    )
    expect(totalKc).toBe(2400)
    expect(parts).toEqual({ fund: 0, fx: 2400, broker: 0 })
  })

  it('G2: fund fee only: 1 672 Kč', () => {
    const { totalKc, parts } = calcCost(
      { monthly: 1000, years: 5, grossReturn: 6 },
      fees({ ter: 1 }),
    )
    expect(totalKc).toBe(1672)
    expect(parts).toEqual({ fund: 1672, fx: 0, broker: 0 })
  })

  it.todo("G3: all three parts (waiting for David's spreadsheet)")
  it.todo("G4: the minimum of a percent fee (waiting for David's spreadsheet)")
  it.todo(
    "G5: fixed fees in dollars, converted (waiting for David's spreadsheet)",
  )
})

describe('which brokers have a price', () => {
  it.todo(
    'a broker is priced only when availability, listing and every needed fee are verified',
  )
  it.todo('a value without a source or evidence does not count as verified')
  it.todo('a fund the broker does not sell has no price')
  it.todo(
    'the spread is the highest cost minus the lowest among priced brokers',
  )
  it.todo('the spread is null with fewer than two priced brokers')
  it.todo('the spread is null when it rounds to 0 Kč')
  it.todo('the order of the brokers in the result does not depend on price')
  it.todo('the headline cost is the highest cost among the priced brokers')
  it.todo(
    'with one priced broker the headline is its cost and there is no spread',
  )
  it.todo(
    'with no priced broker the result has only the fund-fee part and no total',
  )
  it.todo(
    'a broker that sells a fund in several listings is priced at its cheapest listing',
  )
})

describe('the data model for broker fees', () => {
  it.todo(
    'accepts a purchase rule, a custody fee, a listing and an exchange rate as sourced records',
  )
  it.todo(
    'rejects negative fees, an unknown currency and a rule with min above max',
  )
  it.todo(
    'an exchange rate older than the broker-fee limit of 45 days is stale',
  )
  it.todo(
    'the real data files give a price only for brokers whose values are all verified',
  )
})
