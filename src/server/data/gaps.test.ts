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
    indexName: todo,
    isin: todo,
    domicile: todo,
    replication: todo,
    distribution: fields.distribution
      ? sourced(fields.distribution as string)
      : todo,
    ter: fields.ter ? sourced(fields.ter as number) : todo,
    fundSizeEur: todo,
    dividendYieldPct: todo,
    withholdingRate: todo,
    return5yPct: todo,
    return10yPct: todo,
  }
}

function broker(id: string, availability: Broker['availability'] = {}): Broker {
  return {
    id,
    name: id,
    fxFeePct: todo,
    custodyFeePct: todo,
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
    x.fxFeePct = sourced(0.25)
    const need: Need = {
      kind: 'broker',
      screen: 'S',
      what: 'fees',
      brokerIds: ['x', 'y'],
      fields: ['fxFeePct'],
    }
    const [gap] = computeGaps({ etfs: [], brokers: [x, broker('y')] }, [need])
    expect(gap).toMatchObject({ total: 2, verified: 1 })
    expect(gap.missing).toEqual(['y.fxFeePct'])
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
