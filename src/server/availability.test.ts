import { describe, expect, it } from 'vitest'
import { verifiedValue } from './availability'

function record(value: unknown, over: Record<string, unknown> = {}) {
  return {
    value,
    sourceUrl: 'https://example.com/search',
    asOf: '2026-10-11',
    verifiedBy: 'David',
    verifiedOn: '2026-10-11',
    evidence: 'sha256:abc',
    ...over,
  }
}

type Rec = Parameters<typeof verifiedValue>[0]

describe('verifiedValue', () => {
  it('gives true or false for a record with a source and evidence', () => {
    expect(verifiedValue(record(true) as Rec)).toBe(true)
    expect(verifiedValue(record(false) as Rec)).toBe(false)
  })

  it('gives null for TODO_VERIFY', () => {
    expect(
      verifiedValue(
        record('TODO_VERIFY', { sourceUrl: null, evidence: null }) as Rec,
      ),
    ).toBeNull()
  })

  it('gives null when the source or the evidence is missing', () => {
    expect(verifiedValue(record(true, { evidence: null }) as Rec)).toBeNull()
    expect(verifiedValue(record(false, { sourceUrl: null }) as Rec)).toBeNull()
  })

  it('gives null for no record at all', () => {
    expect(verifiedValue(undefined)).toBeNull()
  })

  it('gives null for a value that is not a boolean', () => {
    expect(verifiedValue(record('yes') as Rec)).toBeNull()
  })
})
