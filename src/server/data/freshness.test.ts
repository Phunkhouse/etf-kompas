import { describe, expect, it } from 'vitest'
import { oldestAsOf } from './freshness'

function record(value: unknown, asOf: string | null) {
  return {
    value,
    sourceUrl: 'https://example.com',
    asOf,
    verifiedBy: 'David',
    verifiedOn: '2026-10-11',
    evidence: 'x',
  }
}

describe('oldestAsOf', () => {
  it('returns null when there is no data', () => {
    expect(oldestAsOf(null)).toBeNull()
    expect(oldestAsOf({ etfs: [], brokers: [], sources: [] })).toBeNull()
  })

  it('returns the oldest asOf among filled records', () => {
    const data = {
      etfs: [
        {
          id: 'a',
          ter: record(0.03, '2026-06-30'),
          isin: record('X', '2026-10-11'),
        },
        { id: 'b', ter: record(0.07, '2026-09-30') },
      ],
    }
    expect(oldestAsOf(data)).toBe('2026-06-30')
  })

  it('ignores TODO_VERIFY records and records without a date', () => {
    const data = {
      etfs: [
        { ter: record('TODO_VERIFY', '2020-01-01'), isin: record('X', null) },
        { ter: record(0.07, '2026-09-30') },
      ],
    }
    expect(oldestAsOf(data)).toBe('2026-09-30')
  })

  it('finds records nested in objects and lists (broker availability)', () => {
    const data = {
      brokers: [{ availability: { voo: record(false, '2026-08-01') } }],
    }
    expect(oldestAsOf(data)).toBe('2026-08-01')
  })

  it('ignores a malformed date', () => {
    expect(oldestAsOf({ a: record(1, '30. 6. 2026') })).toBeNull()
  })

  it('works on the real data files', async () => {
    const { loadData } = await import('./load')
    expect(oldestAsOf(await loadData())).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('gives the same answer for the bundled data', async () => {
    const { loadData } = await import('./load')
    const { bundledData } = await import('./bundled')
    expect(oldestAsOf(bundledData)).toBe(oldestAsOf(await loadData()))
  })
})
