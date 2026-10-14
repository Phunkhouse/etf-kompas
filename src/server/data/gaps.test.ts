import { describe, expect, it } from 'vitest'
import { computeGaps, summarize } from './gaps'
import { needs, type Need } from './needs'
import type { Broker, Etf } from './schema'

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

function etf(
  id: string,
  fields: Partial<Record<'name' | 'ter' | 'distribution', unknown>> = {},
): Etf {
  return {
    id,
    ticker: id.toUpperCase(),
    region: 'ucits',
    indexGroup: 'sp500',
    name: fields.name ? sourced(fields.name as string) : todo,
    isin: todo,
    distribution: fields.distribution
      ? sourced(fields.distribution as string)
      : todo,
    ter: fields.ter ? sourced(fields.ter as number) : todo,
  }
}

function broker(id: string, availability: Broker['availability'] = {}): Broker {
  return {
    id,
    name: id,
    czSupport: todo,
    availability,
  }
}

const fundNeed: Need = {
  kind: 'fund',
  screen: 'S',
  what: 'fund fields',
  fundIds: ['a', 'b'],
  fields: ['name', 'ter'],
}

describe('computeGaps', () => {
  it('counts verified fund values and names the missing ones', () => {
    const data = {
      etfs: [etf('a', { name: 'A', ter: 0.07 }), etf('b', { name: 'B' })],
      brokers: [],
    }
    const [gap] = computeGaps(data, [fundNeed])
    expect(gap).toMatchObject({ total: 4, verified: 3, inModel: true })
    expect(gap.missing).toEqual(['b.ter'])
  })

  it('does not count a value without evidence or without a source', () => {
    const noEvidence = etf('a', { name: 'A', ter: 0.07 })
    noEvidence.ter = { ...noEvidence.ter, evidence: null }
    noEvidence.name = { ...noEvidence.name, sourceUrl: '' }
    const [gap] = computeGaps({ etfs: [noEvidence], brokers: [] }, [
      { ...fundNeed, fundIds: ['a'] },
    ])
    expect(gap.verified).toBe(0)
    expect(gap.missing).toEqual(['a.name', 'a.ter'])
  })

  it('counts a fund that is not in the data as missing, without failing', () => {
    const [gap] = computeGaps({ etfs: [], brokers: [] }, [fundNeed])
    expect(gap.verified).toBe(0)
    expect(gap.missing).toHaveLength(4)
  })

  it('checks availability: only a verified true or false counts', () => {
    const data = {
      etfs: [],
      brokers: [
        broker('x', { f: sourced(true), g: todo }),
        broker('y', { f: sourced(false) }),
      ],
    }
    const need: Need = {
      kind: 'availability',
      screen: 'S',
      what: 'availability',
      fundIds: ['f', 'g'],
      brokerIds: ['x', 'y'],
    }
    const [gap] = computeGaps(data, [need])
    expect(gap).toMatchObject({ total: 4, verified: 2 })
    expect(gap.missing).toEqual(['x/g', 'y/g'])
  })

  it('checks broker fields', () => {
    const x = broker('x')
    x.czSupport = sourced(true)
    const need: Need = {
      kind: 'broker',
      screen: 'S',
      what: 'fees',
      brokerIds: ['x', 'y'],
      fields: ['czSupport'],
    }
    const [gap] = computeGaps({ etfs: [], brokers: [x, broker('y')] }, [need])
    expect(gap).toMatchObject({ total: 2, verified: 1 })
    expect(gap.missing).toEqual(['y.czSupport'])
  })

  it('reports a planned need as missing and not in the model', () => {
    const need: Need = {
      kind: 'planned',
      screen: 'S',
      what: 'w',
      field: 'f',
      count: 5,
    }
    const [gap] = computeGaps({ etfs: [], brokers: [] }, [need])
    expect(gap).toMatchObject({ total: 5, verified: 0, inModel: false })
    expect(gap.missing).toEqual(['f'])
  })
})

// A broker with the fee model of the calculator (METHODOLOGY-V2 §3).
function priced(
  id: string,
  options: {
    availability?: Broker['availability']
    listings?: Record<string, unknown[]>
    fx?: Record<string, unknown>
    purchase?: unknown[]
    custody?: unknown
  },
): Broker {
  const base = broker(id, options.availability ?? { f: sourced(true) })
  return {
    ...base,
    fees: {
      fx: options.fx ?? {},
      purchase: options.purchase ?? [],
      custody: options.custody,
      listings: options.listings ?? {},
    },
  } as unknown as Broker
}

const rule = sourced({
  venues: null,
  currency: 'EUR',
  fixed: 1,
  percent: 0,
})
const eurListing = sourced({ currency: 'EUR', venue: 'XETRA' })
const usdListing = sourced({ currency: 'USD', venue: 'LSE' })
const fundF = etf('f', { name: 'F', ter: 0.07 })

describe('computeGaps: the calculator fees', () => {
  const need = (part: 'purchase' | 'custody' | 'fx'): Need => ({
    kind: 'fees',
    screen: 'S',
    what: 'w',
    brokerIds: ['x', 'y'],
    part,
  })

  it('wants one verified purchase rule per broker', () => {
    const data = {
      etfs: [],
      brokers: [priced('x', { purchase: [rule] }), priced('y', {})],
    }
    const [gap] = computeGaps(data, [need('purchase')])
    expect(gap).toMatchObject({ total: 2, verified: 1, inModel: true })
    expect(gap.missing).toEqual(['y.purchase'])
  })

  it('wants a verified custody fee per broker', () => {
    const data = {
      etfs: [],
      brokers: [
        priced('x', { custody: sourced({ currency: 'CZK' }) }),
        priced('y', {}),
      ],
    }
    expect(computeGaps(data, [need('custody')])[0].missing).toEqual([
      'y.custody',
    ])
  })

  it('wants a conversion fee for each currency its listings use, not for CZK', () => {
    const data = {
      etfs: [],
      brokers: [
        priced('x', {
          listings: { f: [eurListing, usdListing] },
          fx: { EUR: sourced(0.1) },
        }),
        priced('y', {
          listings: { f: [sourced({ currency: 'CZK', venue: 'PSE' })] },
        }),
      ],
    }
    const [gap] = computeGaps(data, [need('fx')])
    expect(gap).toMatchObject({ total: 2, verified: 1 })
    expect(gap.missing).toEqual(['x.fx.USD'])
  })

  it('does not count a listing without a source as a currency in use', () => {
    const unverified = { ...usdListing, evidence: null }
    const data = {
      etfs: [],
      brokers: [priced('x', { listings: { f: [unverified] } })],
    }
    expect(computeGaps(data, [need('fx')])[0].total).toBe(0)
  })
})

describe('computeGaps: listings and prices', () => {
  const pairs = (
    kind: 'listings' | 'priced',
    brokerIds = ['x', 'y', 'z'],
  ): Need => ({
    kind,
    screen: 'S',
    what: 'w',
    fundIds: ['f'],
    brokerIds,
  })

  it('counts only the pairs verified as sold, and wants a listing for each', () => {
    const data = {
      etfs: [fundF],
      brokers: [
        priced('x', { listings: { f: [eurListing] } }),
        priced('y', {}),
        priced('z', { availability: { f: sourced(false) } }),
      ],
    }
    const [gap] = computeGaps(data, [pairs('listings')])
    expect(gap).toMatchObject({ total: 2, verified: 1 })
    expect(gap.missing).toEqual(['y/f'])
  })

  it('does not need a listing where the availability is not verified', () => {
    const data = {
      etfs: [fundF],
      brokers: [priced('x', { availability: { f: todo } })],
    }
    expect(computeGaps(data, [pairs('listings')])[0].total).toBe(0)
  })

  it('calls a pair priced only when the calculator can price it', () => {
    const complete = priced('x', {
      listings: { f: [eurListing] },
      fx: { EUR: sourced(0.1) },
      purchase: [rule],
      custody: sourced({ currency: 'CZK', annualFixed: 0, annualPercent: 0 }),
    })
    const noRule = priced('y', {
      listings: { f: [eurListing] },
      fx: { EUR: sourced(0.1) },
      custody: sourced({ currency: 'CZK', annualFixed: 0, annualPercent: 0 }),
    })
    const noListing = priced('z', { purchase: [rule] })
    const [gap] = computeGaps(
      { etfs: [fundF], brokers: [complete, noRule, noListing] },
      [pairs('priced')],
    )
    expect(gap).toMatchObject({ total: 3, verified: 1 })
    expect(gap.missing).toEqual(['y/f', 'z/f'])
  })

  it('cannot price a fund whose annual fee is not verified', () => {
    const complete = priced('x', {
      listings: { f: [eurListing] },
      fx: { EUR: sourced(0.1) },
      purchase: [rule],
      custody: sourced({ currency: 'CZK', annualFixed: 0, annualPercent: 0 }),
    })
    const [gap] = computeGaps({ etfs: [etf('f')], brokers: [complete] }, [
      pairs('priced', ['x']),
    ])
    expect(gap.missing).toEqual(['x/f'])
  })
})

describe('summarize', () => {
  it('counts each missing value once, and the planned ones separately', () => {
    const data = { etfs: [etf('a'), etf('b')], brokers: [] }
    const twice: Need[] = [
      fundNeed,
      { ...fundNeed, screen: 'T' },
      { kind: 'planned', screen: 'S', what: 'w', field: 'f', count: 5 },
    ]
    const result = summarize(computeGaps(data, twice))
    expect(result.total).toBe(13)
    expect(result.verified).toBe(0)
    expect(result.uniqueMissing).toBe(4)
    expect(result.notInModel).toBe(5)
  })
})

describe('the needs list', () => {
  it('only names funds and brokers that exist in the data files', async () => {
    const { loadData } = await import('./load')
    const { dataSchema } = await import('./schema')
    const data = dataSchema.parse(await loadData())
    const funds = new Set(data.etfs.map((fund) => fund.id))
    const brokers = new Set(data.brokers.map((b) => b.id))
    for (const need of needs) {
      if ('fundIds' in need) {
        for (const id of need.fundIds) expect(funds.has(id), id).toBe(true)
      }
      if ('brokerIds' in need) {
        for (const id of need.brokerIds) expect(brokers.has(id), id).toBe(true)
      }
    }
  })

  it('has an availability record for every needed fund at every broker', async () => {
    const { loadData } = await import('./load')
    const { dataSchema } = await import('./schema')
    const data = dataSchema.parse(await loadData())
    for (const need of needs) {
      if (need.kind !== 'availability') continue
      for (const brokerId of need.brokerIds) {
        const broker = data.brokers.find((b) => b.id === brokerId)!
        for (const fundId of need.fundIds) {
          expect(
            broker.availability[fundId],
            `${brokerId}/${fundId}`,
          ).toBeDefined()
        }
      }
    }
  })
})
