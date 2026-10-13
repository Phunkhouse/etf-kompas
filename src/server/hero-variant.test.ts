import { describe, expect, it } from 'vitest'
import { calculatorData, type CalculatorData } from './calculator-data'
import type { ChosenRates } from './cnb'
import { bundledData } from './data/bundled'
import { chooseHeroVariant, heroSavingKc } from './hero-variant'
import { priceBrokers } from './broker-pricing'
import {
  DEFAULT_MONTHLY,
  DEFAULT_YEARS,
  GROSS_RETURN,
} from '@/lib/calculator-defaults'

const RATES: ChosenRates = {
  EUR: { rate: 24.365, date: '2026-10-09', source: 'cnb' },
  USD: { rate: 21.745, date: '2026-10-08', source: 'cnb' },
}

// Real data, cut down to the brokers a test is about.
function data(ids?: string[], rates: ChosenRates = RATES): CalculatorData {
  const all = calculatorData(bundledData, rates, 'cspx')!
  return ids
    ? { ...all, pricing: all.pricing.filter((b) => ids.includes(b.id)) }
    : all
}

describe('the default setting', () => {
  it('is 3 000 Kč a month for 10 years at 6 % a year', () => {
    expect(DEFAULT_MONTHLY).toBe(3000)
    expect(DEFAULT_YEARS).toBe(10)
    expect(GROSS_RETURN).toBe(6)
  })
})

describe('heroSavingKc: the amount the b headline names', () => {
  it('is the highest cost minus the lowest at the default setting (Fio and Trading 212 today)', () => {
    // 30 762 Kč at Fio and 2 476 Kč at Trading 212, checked with a month-by-month
    // loop in broker-pricing.test.ts
    expect(heroSavingKc(data())).toBe(30762 - 2476)
  })

  it('is exactly the spread of the pure pricing at the default setting', () => {
    const d = data()
    const prices = priceBrokers(d.pricing, d.fundId, d.ter, d.rates, {
      monthly: DEFAULT_MONTHLY,
      years: DEFAULT_YEARS,
      grossReturn: GROSS_RETURN,
    })
    expect(heroSavingKc(d)).toBe(prices.spreadKc)
  })

  it('follows the brokers that have a price: two brokers, their difference', () => {
    expect(heroSavingKc(data(['trading212', 'xtb']))).toBe(4176 - 2476)
  })

  it('is null with one priced broker: there is nothing to save', () => {
    expect(heroSavingKc(data(['degiro']))).toBeNull()
    expect(heroSavingKc(data(['trading212']))).toBeNull()
  })

  it('is null with no priced broker', () => {
    expect(heroSavingKc(data([]))).toBeNull()
  })

  it('is null when two priced brokers cost the same (a saving of 0 Kč is not shown)', () => {
    const one = data(['trading212'])
    const twin = structuredClone(one.pricing[0])
    twin.id = 'twin'
    expect(heroSavingKc({ ...one, pricing: [...one.pricing, twin] })).toBeNull()
  })

  it('ignores a broker that has no price without its exchange rate', () => {
    // with no rates, Fio and DEGIRO have no price; Trading 212 and XTB do
    expect(heroSavingKc(data(undefined, {}))).toBe(4176 - 2476)
  })

  it('is null when the calculator has no data at all', () => {
    expect(heroSavingKc(null)).toBeNull()
  })

  it('is a whole number of Kč, never a fraction', () => {
    expect(Number.isInteger(heroSavingKc(data()))).toBe(true)
  })
})

describe('chooseHeroVariant: variant b only when there is something honest to say', () => {
  it('gives b, with the amount, when b is asked for and there is a saving', () => {
    expect(chooseHeroVariant('b', 28286)).toEqual({
      variant: 'b',
      savingKc: 28286,
    })
  })

  it('gives a when b is asked for but there is no saving (the hide rule)', () => {
    expect(chooseHeroVariant('b', null)).toEqual({
      variant: 'a',
      savingKc: null,
    })
  })

  it('gives a for a saving of 0 or less', () => {
    expect(chooseHeroVariant('b', 0).variant).toBe('a')
    expect(chooseHeroVariant('b', -5).variant).toBe('a')
  })

  it('gives a when a is asked for, and does not carry an amount it will not use', () => {
    expect(chooseHeroVariant('a', 28286)).toEqual({
      variant: 'a',
      savingKc: null,
    })
    expect(chooseHeroVariant('a', null)).toEqual({
      variant: 'a',
      savingKc: null,
    })
  })

  it('gives a for anything that is not a known variant', () => {
    expect(chooseHeroVariant('c' as never, 28286).variant).toBe('a')
    expect(chooseHeroVariant(undefined as never, 28286).variant).toBe('a')
  })
})
