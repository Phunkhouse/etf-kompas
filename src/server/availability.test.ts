import { describe, expect, it } from 'vitest'
import { buyability, heroRows } from './availability'
import type { Broker, Etf } from './data/schema'

// --- fixtures -------------------------------------------------------------

function sourced<T>(value: T) {
  return {
    value,
    sourceUrl: 'https://example.com/search',
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

type Availability = Broker['availability'][string]

function broker(
  id: string,
  availability: Record<string, Availability>,
): Broker {
  return {
    id,
    name: id,
    fxFeePct: todo,
    custodyFeePct: todo,
    czSupport: todo,
    availability,
  }
}

function etf(id: string, ter: number | 'TODO_VERIFY'): Etf {
  return {
    id,
    ticker: id.toUpperCase(),
    region: 'us-listed',
    indexGroup: 'sp500',
    name: todo,
    indexName: todo,
    isin: todo,
    domicile: todo,
    replication: todo,
    distribution: todo,
    ter: ter === 'TODO_VERIFY' ? todo : sourced(ter),
    fundSizeEur: todo,
    dividendYieldPct: todo,
    withholdingRate: todo,
    return5yPct: todo,
    return10yPct: todo,
  }
}

const yes = sourced(true)
const no = sourced(false)

// --- the rule -------------------------------------------------------------

describe('buyability: yes', () => {
  it('is yes when one firm sells the fund and the others verifiably do not', () => {
    const brokers = [
      broker('a', { x: yes }),
      broker('b', { x: no }),
      broker('c', { x: no }),
    ]
    expect(buyability('x', brokers)).toEqual({
      state: 'yes',
      yesCount: 1,
      verifiedNoCount: 2,
      total: 3,
    })
  })

  it('is yes when one firm sells it and the others are still unverified', () => {
    const brokers = [broker('a', { x: yes }), broker('b', { x: todo })]
    expect(buyability('x', brokers).state).toBe('yes')
  })

  it('is yes when every firm sells it', () => {
    const brokers = [broker('a', { x: yes }), broker('b', { x: yes })]
    const result = buyability('x', brokers)
    expect(result.state).toBe('yes')
    expect(result.yesCount).toBe(2)
  })
})

describe('buyability: no', () => {
  it('is no only when every firm is verified as not selling it', () => {
    const brokers = [broker('a', { x: no }), broker('b', { x: no })]
    expect(buyability('x', brokers)).toEqual({
      state: 'no',
      yesCount: 0,
      verifiedNoCount: 2,
      total: 2,
    })
  })
})

describe('buyability: unverified', () => {
  it('is unverified when some firms say no and the others are unverified (the VOO case)', () => {
    const brokers = [
      broker('a', { x: no }),
      broker('b', { x: no }),
      broker('c', { x: no }),
      broker('d', { x: todo }),
      broker('e', { x: todo }),
    ]
    expect(buyability('x', brokers)).toEqual({
      state: 'unverified',
      yesCount: 0,
      verifiedNoCount: 3,
      total: 5,
    })
  })

  it('is unverified when nothing is verified', () => {
    const brokers = [broker('a', { x: todo }), broker('b', { x: todo })]
    const result = buyability('x', brokers)
    expect(result.state).toBe('unverified')
    expect(result.verifiedNoCount).toBe(0)
  })

  it('counts a firm without a record for the fund as unverified', () => {
    const brokers = [broker('a', { x: no }), broker('b', {})]
    expect(buyability('x', brokers)).toMatchObject({
      state: 'unverified',
      verifiedNoCount: 1,
      total: 2,
    })
  })

  it('does not count a true or false value that has no evidence', () => {
    const noEvidence = { ...no, evidence: null }
    const noEvidenceYes = { ...yes, evidence: '' }
    const brokers = [
      broker('a', { x: noEvidence }),
      broker('b', { x: noEvidenceYes }),
    ]
    expect(buyability('x', brokers)).toMatchObject({
      state: 'unverified',
      yesCount: 0,
      verifiedNoCount: 0,
    })
  })

  it('does not count a value whose source is still TODO_VERIFY', () => {
    const placeholderSource = { ...no, sourceUrl: 'TODO_VERIFY' }
    const brokers = [broker('a', { x: placeholderSource })]
    expect(buyability('x', brokers).state).toBe('unverified')
  })

  it('is never no when there are no firms at all', () => {
    expect(buyability('x', [])).toEqual({
      state: 'unverified',
      yesCount: 0,
      verifiedNoCount: 0,
      total: 0,
    })
  })

  it('looks only at the fund it is asked about', () => {
    const brokers = [broker('a', { x: yes, y: no })]
    expect(buyability('y', brokers).state).toBe('no')
    expect(buyability('x', brokers).state).toBe('yes')
  })
})

// --- the hero rows --------------------------------------------------------

describe('heroRows', () => {
  const data = {
    etfs: [etf('voo', 0.03), etf('qqq', 0.18), etf('cspx', 0.07)],
    brokers: [
      broker('a', { voo: no, qqq: no, cspx: yes }),
      broker('b', { voo: no, qqq: no, cspx: yes }),
      broker('c', { voo: todo, qqq: todo, cspx: todo }),
    ],
  }

  it('keeps the order of the funds it is asked for', () => {
    const rows = heroRows(data, ['voo', 'qqq', 'cspx'])
    expect(rows.map((row) => row.fundId)).toEqual(['voo', 'qqq', 'cspx'])
    expect(heroRows(data, ['cspx', 'voo']).map((row) => row.fundId)).toEqual([
      'cspx',
      'voo',
    ])
  })

  it('takes the fee from the data, as a plain percent number', () => {
    const rows = heroRows(data, ['voo', 'qqq', 'cspx'])
    expect(rows.map((row) => row.ter)).toEqual([0.03, 0.18, 0.07])
  })

  it('gives a null fee while the fee is still TODO_VERIFY', () => {
    const rows = heroRows({ ...data, etfs: [etf('voo', 'TODO_VERIFY')] }, [
      'voo',
    ])
    expect(rows[0].ter).toBeNull()
  })

  it('highlights the buyable row, not the cheapest one', () => {
    const rows = heroRows(data, ['voo', 'qqq', 'cspx'])
    expect(rows.map((row) => row.highlight)).toEqual([false, false, true])
    // VOO has the lowest fee and is not highlighted (note 0029)
    expect(rows[0].ter).toBeLessThan(rows[2].ter as number)
  })

  it('highlights nothing when no fund is buyable', () => {
    const rows = heroRows(
      {
        etfs: data.etfs,
        brokers: [broker('a', { voo: no, qqq: no, cspx: no })],
      },
      ['voo', 'qqq', 'cspx'],
    )
    expect(rows.every((row) => !row.highlight)).toBe(true)
  })

  it('highlights every buyable row', () => {
    const rows = heroRows(
      {
        etfs: data.etfs,
        brokers: [broker('a', { voo: yes, qqq: no, cspx: yes })],
      },
      ['voo', 'qqq', 'cspx'],
    )
    expect(rows.map((row) => row.highlight)).toEqual([true, false, true])
  })

  it('carries the buyability of each fund', () => {
    const rows = heroRows(data, ['voo', 'cspx'])
    expect(rows[0].buyability).toMatchObject({
      state: 'unverified',
      verifiedNoCount: 2,
      total: 3,
    })
    expect(rows[1].buyability.state).toBe('yes')
  })

  it('throws for a fund that is not in the data', () => {
    expect(() => heroRows(data, ['nope'])).toThrow(/nope/)
  })
})

// --- the real data --------------------------------------------------------

describe('the real data files', () => {
  it('never says "no" while a firm is unverified, and CSPX is buyable', async () => {
    const { loadData } = await import('./data/load')
    const { dataSchema } = await import('./data/schema')
    const data = dataSchema.parse(await loadData())
    for (const fund of data.etfs) {
      const result = buyability(fund.id, data.brokers)
      if (result.state === 'no') {
        expect(result.verifiedNoCount).toBe(data.brokers.length)
      }
    }
    expect(buyability('cspx', data.brokers).state).toBe('yes')
    expect(buyability('voo', data.brokers).state).not.toBe('no')
  })
})
