import { describe, expect, it } from 'vitest'
import { brokerFeesSchema, ratesSchema } from './schema'
import { validateData } from './validate'

function sourced<T>(value: T, asOf = '2026-10-11') {
  return {
    value,
    sourceUrl: 'https://example.com/doc',
    asOf,
    verifiedBy: 'David',
    verifiedOn: '2026-10-11',
    evidence: 'sha256:abc',
  }
}

const rule = {
  venues: ['London'],
  currency: 'EUR',
  fixed: 2,
  percent: 0,
}

const validFees = {
  fx: { USD: sourced(0.25), EUR: sourced(0) },
  purchase: [sourced(rule)],
  custody: sourced({ currency: 'EUR', annualFixed: 2.5, annualPercent: 0 }),
  listings: { cspx: [sourced({ currency: 'USD', venue: 'London' })] },
}

describe('the data model for broker fees', () => {
  it('accepts a purchase rule, a custody fee, a listing and an exchange rate as sourced records', () => {
    expect(brokerFeesSchema.safeParse(validFees).success).toBe(true)
    expect(
      ratesSchema.safeParse({ EUR: sourced(24.365), USD: sourced(21.745) })
        .success,
    ).toBe(true)
  })

  it('accepts records that are still TODO_VERIFY', () => {
    const todo = {
      value: 'TODO_VERIFY',
      sourceUrl: null,
      asOf: null,
      verifiedBy: null,
      verifiedOn: null,
      evidence: null,
    }
    expect(
      brokerFeesSchema.safeParse({
        ...validFees,
        purchase: [todo],
        custody: todo,
      }).success,
    ).toBe(true)
  })

  it('rejects negative fees, an unknown currency and a rule with min above max', () => {
    const withRule = (over: object) => ({
      ...validFees,
      purchase: [sourced({ ...rule, ...over })],
    })
    expect(brokerFeesSchema.safeParse(withRule({ fixed: -1 })).success).toBe(
      false,
    )
    expect(
      brokerFeesSchema.safeParse(withRule({ currency: 'GBP' })).success,
    ).toBe(false)
    expect(
      brokerFeesSchema.safeParse(withRule({ min: 5, max: 2 })).success,
    ).toBe(false)
    expect(
      brokerFeesSchema.safeParse(withRule({ min: 2, max: 5 })).success,
    ).toBe(true)
    expect(
      brokerFeesSchema.safeParse({ ...validFees, fx: { USD: sourced(-0.25) } })
        .success,
    ).toBe(false)
  })

  it('rejects a percent that looks like a fraction', () => {
    expect(
      brokerFeesSchema.safeParse({ ...validFees, fx: { USD: sourced(0.0025) } })
        .success,
    ).toBe(false)
    expect(
      brokerFeesSchema.safeParse({
        ...validFees,
        custody: sourced({
          currency: 'EUR',
          annualFixed: 0,
          annualPercent: 0.001,
        }),
      }).success,
    ).toBe(false)
  })

  it('rejects a rate of 0 or less', () => {
    expect(
      ratesSchema.safeParse({ EUR: sourced(0), USD: sourced(21.7) }).success,
    ).toBe(false)
  })
})

describe('freshness of broker fees and exchange rates', () => {
  const sources = [
    { url: 'https://example.com/doc', title: 't', publisher: 'p' },
  ]
  function data(asOf: string) {
    return {
      etfs: [],
      brokers: [
        {
          id: 'b',
          name: 'b',
          fxFeePct: sourced(0.25, asOf),
          custodyFeePct: sourced(0.1, asOf),
          czSupport: sourced(true, asOf),
          availability: {},
          fees: { ...validFees, fx: { USD: sourced(0.25, asOf) } },
        },
      ],
      rates: { EUR: sourced(24.365, asOf), USD: sourced(21.745, asOf) },
      sources,
    }
  }
  const today = '2026-10-12'

  it('an exchange rate older than the broker-fee limit of 45 days is stale', () => {
    const stale = validateData(data('2026-08-20'), { today, mode: 'strict' })
    expect(
      stale.issues.filter(
        (i) => i.code === 'STALE' && i.path.startsWith('rates'),
      ),
    ).not.toHaveLength(0)
    const fresh = validateData(data('2026-09-20'), { today, mode: 'strict' })
    expect(
      fresh.issues.filter(
        (i) => i.path.startsWith('rates') && i.code === 'STALE',
      ),
    ).toHaveLength(0)
  })

  it('a broker fee under `fees` is stale after 45 days, not 120', () => {
    const stale = validateData(data('2026-08-20'), { today, mode: 'strict' })
    expect(
      stale.issues.filter(
        (i) => i.code === 'STALE' && i.path.includes('.fees.'),
      ),
    ).not.toHaveLength(0)
    const fresh = validateData(data('2026-09-20'), { today, mode: 'strict' })
    expect(
      fresh.issues.filter(
        (i) => i.code === 'STALE' && i.path.includes('.fees.'),
      ),
    ).toHaveLength(0)
  })
})
