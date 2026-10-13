import { describe, expect, it } from 'vitest'
import { priceBroker, priceBrokers } from './broker-pricing'
import { calcCost, fundFeeKc, type CostInput, type Rates } from './cost'
import type { Broker } from './data/schema'

// --- fixtures -------------------------------------------------------------

function sourced<T>(value: T) {
  return {
    value,
    sourceUrl: 'https://example.com/doc',
    asOf: '2026-10-11',
    verifiedBy: 'David',
    verifiedOn: '2026-10-11',
    evidence: 'sha256:abc',
  }
}

const todo = {
  value: 'TODO_VERIFY' as const,
  sourceUrl: null,
  asOf: null,
  verifiedBy: null,
  verifiedOn: null,
  evidence: null,
}

const RATES: Rates = { EUR: 25, USD: 23 }
const INPUT: CostInput = { monthly: 3000, years: 10, grossReturn: 6 }
const TER = 0.07

type Over = {
  id?: string
  sells?: boolean | 'todo'
  fixedEur?: number
  listings?: { currency: 'CZK' | 'EUR' | 'USD'; venue: string }[]
  fx?: { USD?: number; EUR?: number }
  skip?: 'purchase' | 'custody' | 'listings' | 'fx'
}

// A broker with everything verified, unless an override takes something away.
function broker(over: Over = {}): Broker {
  const listings = over.listings ?? [{ currency: 'EUR', venue: 'Amsterdam' }]
  const fx = over.fx ?? { USD: 0.25, EUR: 0 }
  return {
    id: over.id ?? 'b',
    name: over.id ?? 'b',
    fxFeePct: todo,
    custodyFeePct: todo,
    czSupport: todo,
    availability: {
      cspx: over.sells === 'todo' ? todo : sourced(over.sells ?? true),
    },
    fees: {
      fx:
        over.skip === 'fx'
          ? {}
          : {
              ...(fx.USD !== undefined ? { USD: sourced(fx.USD) } : {}),
              ...(fx.EUR !== undefined ? { EUR: sourced(fx.EUR) } : {}),
            },
      purchase:
        over.skip === 'purchase'
          ? []
          : [
              sourced({
                venues: null,
                currency: 'EUR' as const,
                fixed: over.fixedEur ?? 3,
                percent: 0,
              }),
            ],
      custody:
        over.skip === 'custody'
          ? undefined
          : sourced({
              currency: 'EUR' as const,
              annualFixed: 2.5,
              annualPercent: 0,
            }),
      listings: {
        cspx: over.skip === 'listings' ? [] : listings.map((l) => sourced(l)),
      },
    },
  }
}

// --- which brokers have a price -------------------------------------------

describe('which brokers have a price', () => {
  it('a broker is priced only when availability, listing and every needed fee are verified', () => {
    expect(priceBroker(broker(), 'cspx', TER, RATES, INPUT)).not.toBeNull()
    for (const sells of ['todo', false] as const) {
      expect(
        priceBroker(broker({ sells }), 'cspx', TER, RATES, INPUT),
      ).toBeNull()
    }
    for (const skip of ['listings', 'purchase', 'custody'] as const) {
      expect(
        priceBroker(broker({ skip }), 'cspx', TER, RATES, INPUT),
      ).toBeNull()
    }
    // a dollar listing needs a verified dollar conversion fee
    const dollar = { listings: [{ currency: 'USD' as const, venue: 'London' }] }
    expect(
      priceBroker(broker({ ...dollar, skip: 'fx' }), 'cspx', TER, RATES, INPUT),
    ).toBeNull()
    expect(
      priceBroker(
        broker({ ...dollar, fx: { EUR: 0 } }),
        'cspx',
        TER,
        RATES,
        INPUT,
      ),
    ).toBeNull()
    // a fee in euro needs the euro rate
    expect(priceBroker(broker(), 'cspx', TER, { USD: 23 }, INPUT)).toBeNull()
  })

  it('a value without a source or evidence does not count as verified', () => {
    const noEvidence = broker()
    noEvidence.fees!.purchase = [
      { ...noEvidence.fees!.purchase![0], evidence: null },
    ]
    expect(priceBroker(noEvidence, 'cspx', TER, RATES, INPUT)).toBeNull()

    const noSource = broker()
    noSource.availability.cspx = { ...sourced(true), sourceUrl: '' }
    expect(priceBroker(noSource, 'cspx', TER, RATES, INPUT)).toBeNull()
  })

  it('a fund the broker does not sell has no price', () => {
    expect(
      priceBroker(broker({ sells: false }), 'cspx', TER, RATES, INPUT),
    ).toBeNull()
    expect(priceBroker(broker(), 'vuaa', TER, RATES, INPUT)).toBeNull()
  })

  it('prices a broker with the cost of its fees', () => {
    const priced = priceBroker(broker(), 'cspx', TER, RATES, INPUT)!
    // 3 EUR per order, 2.5 EUR a year, no conversion in euro
    const expected = calcCost(INPUT, {
      ter: TER,
      fxFeePct: 0,
      purchaseFeeKc: 75,
      custodyAnnualFixedKc: 62.5,
      custodyAnnualPercent: 0,
    })
    expect(priced.result).toEqual(expected)
    expect(priced.brokerId).toBe('b')
    expect(priced.listing).toEqual({ currency: 'EUR', venue: 'Amsterdam' })
  })

  it('a broker that sells a fund in several listings is priced at its cheapest listing', () => {
    const both = broker({
      listings: [
        { currency: 'USD', venue: 'London' },
        { currency: 'EUR', venue: 'Amsterdam' },
      ],
    })
    const priced = priceBroker(both, 'cspx', TER, RATES, INPUT)!
    expect(priced.listing.currency).toBe('EUR')
    const dollarOnly = priceBroker(
      broker({ listings: [{ currency: 'USD', venue: 'London' }] }),
      'cspx',
      TER,
      RATES,
      INPUT,
    )!
    expect(priced.result.totalKc).toBeLessThan(dollarOnly.result.totalKc)
    // order of the listings does not matter
    const reversed = broker({
      listings: [
        { currency: 'EUR', venue: 'Amsterdam' },
        { currency: 'USD', venue: 'London' },
      ],
    })
    expect(
      priceBroker(reversed, 'cspx', TER, RATES, INPUT)!.listing.currency,
    ).toBe('EUR')
  })

  it('falls back to a listing that can be priced when the cheaper one cannot', () => {
    const mixed = broker({
      fx: { EUR: 0 }, // no dollar fee verified
      listings: [
        { currency: 'USD', venue: 'London' },
        { currency: 'EUR', venue: 'Amsterdam' },
      ],
    })
    expect(
      priceBroker(mixed, 'cspx', TER, RATES, INPUT)!.listing.currency,
    ).toBe('EUR')
  })
})

describe('the brokers together', () => {
  const cheap = broker({ id: 'cheap', fixedEur: 1 })
  const mid = broker({ id: 'mid', fixedEur: 3 })
  const dear = broker({ id: 'dear', fixedEur: 9 })
  const unpriced = broker({ id: 'unpriced', skip: 'purchase' })

  it('the spread is the highest cost minus the lowest among priced brokers', () => {
    const prices = priceBrokers(
      [mid, dear, cheap, unpriced],
      'cspx',
      TER,
      RATES,
      INPUT,
    )
    const costs = prices.pricedBrokers.map((p) => p.result.totalKc)
    expect(prices.spreadKc).toBe(Math.max(...costs) - Math.min(...costs))
    expect(prices.spreadKc).toBeGreaterThan(0)
  })

  it('the spread is null with fewer than two priced brokers', () => {
    expect(
      priceBrokers([mid, unpriced], 'cspx', TER, RATES, INPUT).spreadKc,
    ).toBeNull()
    expect(
      priceBrokers([unpriced], 'cspx', TER, RATES, INPUT).spreadKc,
    ).toBeNull()
  })

  it('the spread is null when it rounds to 0 Kč', () => {
    const twin = broker({ id: 'twin', fixedEur: 3 })
    const prices = priceBrokers([mid, twin], 'cspx', TER, RATES, INPUT)
    expect(prices.pricedBrokers).toHaveLength(2)
    expect(prices.spreadKc).toBeNull()
  })

  it('the order of the brokers in the result does not depend on price', () => {
    const prices = priceBrokers(
      [dear, unpriced, cheap, mid],
      'cspx',
      TER,
      RATES,
      INPUT,
    )
    expect(prices.brokers.map((b) => b.brokerId)).toEqual([
      'dear',
      'unpriced',
      'cheap',
      'mid',
    ])
    expect(prices.pricedBrokers.map((b) => b.brokerId)).toEqual([
      'dear',
      'cheap',
      'mid',
    ])
    expect(prices.brokers[1].priced).toBeNull()
  })

  it('the headline cost is the highest cost among the priced brokers', () => {
    const prices = priceBrokers([cheap, dear, mid], 'cspx', TER, RATES, INPUT)
    expect(prices.headline?.brokerId).toBe('dear')
    expect(prices.headline?.result.totalKc).toBe(
      Math.max(...prices.pricedBrokers.map((p) => p.result.totalKc)),
    )
  })

  it('with one priced broker the headline is its cost and there is no spread', () => {
    const prices = priceBrokers([unpriced, mid], 'cspx', TER, RATES, INPUT)
    expect(prices.headline?.brokerId).toBe('mid')
    expect(prices.spreadKc).toBeNull()
  })

  it('with no priced broker the result has only the fund-fee part and no total', () => {
    const prices = priceBrokers([unpriced], 'cspx', TER, RATES, INPUT)
    expect(prices.headline).toBeNull()
    expect(prices.spreadKc).toBeNull()
    expect(fundFeeKc(INPUT, TER)).toBe(
      calcCost(INPUT, {
        ter: TER,
        fxFeePct: 0,
        purchaseFeeKc: 0,
        custodyAnnualFixedKc: 0,
        custodyAnnualPercent: 0,
      }).parts.fund,
    )
    expect(fundFeeKc(INPUT, TER)).toBeGreaterThan(0)
  })
})

describe('the real data files', () => {
  it('give a price only to brokers whose values are all verified', async () => {
    const { loadData } = await import('./data/load')
    const { dataSchema } = await import('./data/schema')
    const data = dataSchema.parse(await loadData())
    const rates: Partial<Rates> = {}
    for (const currency of ['EUR', 'USD'] as const) {
      const record = data.rates?.[currency]
      if (record && typeof record.value === 'number' && record.evidence) {
        rates[currency] = record.value
      }
    }
    const prices = priceBrokers(data.brokers, 'cspx', TER, rates, INPUT)
    expect(prices.brokers).toHaveLength(data.brokers.length)
    for (const { brokerId, priced } of prices.brokers) {
      const broker = data.brokers.find((b) => b.id === brokerId)!
      if (priced) {
        // priced means: sold, a verified listing, a verified custody fee
        expect(broker.availability.cspx.value).toBe(true)
        expect(broker.fees?.custody?.value).not.toBe('TODO_VERIFY')
      }
    }
    // spread and headline follow the priced brokers, whatever their number is
    expect(prices.headline === null).toBe(prices.pricedBrokers.length === 0)
  })

  it('prices DEGIRO for CSPX at its euro listing (checked with a month-by-month loop)', async () => {
    const { loadData } = await import('./data/load')
    const { dataSchema } = await import('./data/schema')
    const data = dataSchema.parse(await loadData())
    // Czech National Bank fixing of 9 October 2026
    const rates: Rates = { EUR: 24.365, USD: 21.745 }
    const cspx = data.etfs.find((fund) => fund.id === 'cspx')!
    const ter = cspx.ter.value as number
    const prices = priceBrokers(data.brokers, 'cspx', ter, rates, INPUT)
    const degiro = prices.pricedBrokers.find((p) => p.brokerId === 'degiro')!
    // EUR 3 per order (2 plus 1 handling), EUR 2.50 a year, no conversion in euro
    expect(degiro.listing).toEqual({
      currency: 'EUR',
      venue: 'Euronext Amsterdam',
    })
    expect(degiro.result.totalKc).toBe(14403)
    expect(degiro.result.parts).toEqual({ fund: 1748, fx: 0, broker: 12655 })
    // the dollar listing would cost 15 617 Kč (1 214 Kč more, the conversion)
    expect(prices.headline?.brokerId).toBe('degiro')
    // Trading 212 is priced too: dollar listing in London, no commission, no
    // custody, 0.15 % to convert. Checked with an independent month-by-month loop:
    // the fund fee part is 1 748 Kč, the conversion about 729 Kč, in all 2 476 Kč.
    const t212 = prices.pricedBrokers.find((p) => p.brokerId === 'trading212')!
    expect(t212.listing).toEqual({ currency: 'USD', venue: 'LSE' })
    expect(t212.result.totalKc).toBe(2476)
    expect(t212.result.parts.broker).toBe(0)
    expect(t212.result.parts.fund + t212.result.parts.fx).toBe(2476)
    // the spread between the dearest and the cheapest priced broker
    expect(prices.spreadKc).toBe(14403 - 2476)
  })
})
