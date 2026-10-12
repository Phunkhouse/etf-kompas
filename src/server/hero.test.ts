import { describe, expect, it } from 'vitest'
import { heroNote, heroTwins } from './hero'
import type { Broker, Etf } from './data/schema'

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

const yes = sourced(true)
const no = sourced(false)
// a "yes" that has no evidence behind it
const unsourcedYes = { ...yes, evidence: null }

function etf(
  id: string,
  over: { ter?: unknown; distribution?: unknown } = {},
): Etf {
  return {
    id,
    ticker: id.toUpperCase(),
    ter: over.ter ?? sourced(0.07),
    distribution: over.distribution ?? sourced('accumulating'),
  } as unknown as Etf
}

function broker(
  id: string,
  name: string,
  availability: Record<string, unknown>,
): Broker {
  return { id, name, availability } as unknown as Broker
}

// --- the twins ------------------------------------------------------------

describe('heroTwins', () => {
  const data = {
    etfs: [
      etf('cspx', {
        ter: sourced(0.07),
        distribution: sourced('accumulating'),
      }),
      etf('vuaa', { ter: sourced(0.07) }),
      etf('cndx', { ter: sourced(0.3) }),
      etf('eqqq', { ter: sourced(0.3), distribution: sourced('distributing') }),
    ],
    brokers: [],
  }

  it('keeps the order it is asked for and carries the ticker of the data', () => {
    const twins = heroTwins(data, ['cspx', 'vuaa', 'cndx', 'eqqq'])
    expect(twins.map((t) => t.fundId)).toEqual(['cspx', 'vuaa', 'cndx', 'eqqq'])
    expect(twins.map((t) => t.ticker)).toEqual(['CSPX', 'VUAA', 'CNDX', 'EQQQ'])
    expect(heroTwins(data, ['eqqq', 'cspx']).map((t) => t.fundId)).toEqual([
      'eqqq',
      'cspx',
    ])
  })

  it('takes the fee as a plain percent number', () => {
    const twins = heroTwins(data, ['cspx', 'cndx'])
    expect(twins.map((t) => t.ter)).toEqual([0.07, 0.3])
  })

  it('takes the type from the data: accumulating or distributing', () => {
    const twins = heroTwins(data, ['cspx', 'eqqq'])
    expect(twins.map((t) => t.type)).toEqual(['accumulating', 'distributing'])
  })

  it('gives null for a fee or type that is still TODO_VERIFY', () => {
    const [twin] = heroTwins(
      { etfs: [etf('cspx', { ter: todo, distribution: todo })], brokers: [] },
      ['cspx'],
    )
    expect(twin.ter).toBeNull()
    expect(twin.type).toBeNull()
  })

  it('gives null for a fee or type without evidence', () => {
    const [twin] = heroTwins(
      {
        etfs: [
          etf('cspx', {
            ter: { ...sourced(0.07), evidence: null },
            distribution: { ...sourced('accumulating'), sourceUrl: null },
          }),
        ],
        brokers: [],
      },
      ['cspx'],
    )
    expect(twin.ter).toBeNull()
    expect(twin.type).toBeNull()
  })

  it('gives null for a type that is neither accumulating nor distributing', () => {
    const [twin] = heroTwins(
      { etfs: [etf('cspx', { distribution: sourced('weekly') })], brokers: [] },
      ['cspx'],
    )
    expect(twin.type).toBeNull()
  })

  it('throws for a fund that is not in the data', () => {
    expect(() => heroTwins(data, ['nope'])).toThrow(/nope/)
  })
})

// --- the muted line under the table -----------------------------------------

describe('heroNote: where the first twin is sold', () => {
  const etfs = [etf('cspx'), etf('voo'), etf('qqq')]

  it('lists the brokers verified as selling it, in the order of the data', () => {
    const note = heroNote(
      {
        etfs,
        brokers: [
          broker('a', 'DEGIRO', { cspx: yes }),
          broker('b', 'Fio', { cspx: no }),
          broker('c', 'Trading 212', { cspx: yes }),
          broker('d', 'IBKR', { cspx: todo }),
        ],
      },
      'cspx',
      ['voo', 'qqq'],
    )
    expect(note.sellers).toEqual(['DEGIRO', 'Trading 212'])
    expect(note.fundId).toBe('cspx')
    expect(note.ticker).toBe('CSPX')
  })

  it('does not list a broker whose "yes" has no evidence', () => {
    const note = heroNote(
      { etfs, brokers: [broker('a', 'DEGIRO', { cspx: unsourcedYes })] },
      'cspx',
      [],
    )
    expect(note.sellers).toEqual([])
  })

  it('says others are unverified while any broker is neither verified yes nor no', () => {
    const base = {
      etfs,
      brokers: [broker('a', 'DEGIRO', { cspx: yes })],
    }
    expect(heroNote(base, 'cspx', []).othersUnverified).toBe(false)
    const withTodo = {
      etfs,
      brokers: [...base.brokers, broker('b', 'IBKR', { cspx: todo })],
    }
    expect(heroNote(withTodo, 'cspx', []).othersUnverified).toBe(true)
    const withMissing = {
      etfs,
      brokers: [...base.brokers, broker('b', 'IBKR', {})],
    }
    expect(heroNote(withMissing, 'cspx', []).othersUnverified).toBe(true)
  })

  it('does not count a verified "no" as unverified', () => {
    const note = heroNote(
      {
        etfs,
        brokers: [
          broker('a', 'DEGIRO', { cspx: yes }),
          broker('b', 'Fio', { cspx: no }),
        ],
      },
      'cspx',
      [],
    )
    expect(note.othersUnverified).toBe(false)
  })

  it('throws for a first fund that is not in the data', () => {
    expect(() => heroNote({ etfs, brokers: [] }, 'nope', [])).toThrow(/nope/)
  })
})

describe('heroNote: the American originals are "mostly not sold"', () => {
  const etfs = [etf('cspx'), etf('voo'), etf('qqq')]
  const originals = ['voo', 'qqq']

  function five(a: Record<string, unknown>[]) {
    return a.map((availability, i) =>
      broker(`b${i}`, `Broker ${i}`, availability),
    )
  }

  it('carries the tickers of the originals', () => {
    const note = heroNote({ etfs, brokers: [] }, 'cspx', originals)
    expect(note.originals.tickers).toEqual(['VOO', 'QQQ'])
  })

  it('is true when both are verified as not sold by 3 of 5 brokers (a majority)', () => {
    const brokers = five([
      { voo: no, qqq: no },
      { voo: no, qqq: no },
      { voo: no, qqq: no },
      { voo: todo, qqq: todo },
      {},
    ])
    expect(
      heroNote({ etfs, brokers }, 'cspx', originals).originals.mostlyNo,
    ).toBe(true)
  })

  it('is false at 2 of 5, which is not a majority', () => {
    const brokers = five([
      { voo: no, qqq: no },
      { voo: no, qqq: no },
      { voo: todo, qqq: todo },
      { voo: todo, qqq: todo },
      {},
    ])
    expect(
      heroNote({ etfs, brokers }, 'cspx', originals).originals.mostlyNo,
    ).toBe(false)
  })

  it('is false when only one of the two originals has a majority', () => {
    const brokers = five([
      { voo: no, qqq: no },
      { voo: no, qqq: no },
      { voo: no, qqq: todo },
      {},
      {},
    ])
    expect(
      heroNote({ etfs, brokers }, 'cspx', originals).originals.mostlyNo,
    ).toBe(false)
  })

  it('does not count "yes", unverified or unsourced values as "no"', () => {
    const brokers = five([
      { voo: no, qqq: no },
      { voo: no, qqq: no },
      { voo: yes, qqq: yes },
      { voo: todo, qqq: todo },
      { voo: { ...no, evidence: null }, qqq: { ...no, evidence: null } },
    ])
    expect(
      heroNote({ etfs, brokers }, 'cspx', originals).originals.mostlyNo,
    ).toBe(false)
  })

  it('is false with no brokers at all', () => {
    expect(
      heroNote({ etfs, brokers: [] }, 'cspx', originals).originals.mostlyNo,
    ).toBe(false)
  })
})
