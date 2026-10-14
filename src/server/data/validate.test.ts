import { describe, expect, it } from 'vitest'
import { validateData } from './validate'

const TODAY = '2026-10-10'

const SOURCE_URL = 'https://example.com/factsheet.pdf'

// A fully verified record, as_of 10 days before TODAY.
function record(value: unknown, overrides: Record<string, unknown> = {}) {
  return {
    value,
    sourceUrl: SOURCE_URL,
    asOf: '2026-09-30',
    verifiedBy: 'David',
    verifiedOn: '2026-10-01',
    evidence:
      'https://web.archive.org/web/2026/https://example.com/factsheet.pdf',
    ...overrides,
  }
}

const sources = [
  { url: SOURCE_URL, title: 'Example factsheet', publisher: 'Example' },
]

function etf(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-etf',
    ticker: 'TEST',
    region: 'ucits',
    indexGroup: 'sp500',
    name: record('Test ETF'),
    indexName: record('Test Index'),
    isin: record('IE0000000000'),
    domicile: record('Ireland'),
    replication: record('physical'),
    distribution: record('accumulating'),
    ter: record(0.07),
    fundSizeEur: record(1_000_000_000),
    dividendYieldPct: record(1.3),
    withholdingRate: record(15),
    return5yPct: record(10.5),
    return10yPct: record(12.1),
    ...overrides,
  }
}

function broker(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-broker',
    name: 'Test Broker',
    fxFeePct: record(0.5),
    custodyFeePct: record(0),
    czSupport: record(true),
    availability: { 'test-etf': record(true) },
    ...overrides,
  }
}

function data(parts: { etfs?: unknown[]; brokers?: unknown[] } = {}) {
  return {
    etfs: parts.etfs ?? [etf()],
    brokers: parts.brokers ?? [broker()],
    sources,
  }
}

function run(
  input: ReturnType<typeof data>,
  mode: 'strict' | 'draft' = 'strict',
) {
  return validateData(input, { today: TODAY, mode })
}

describe('validateData', () => {
  it('accepts a fully verified, fresh dataset', () => {
    const result = run(data())
    expect(result.issues).toEqual([])
    expect(result.ok).toBe(true)
  })

  describe('missing source', () => {
    it.each(['sourceUrl', 'asOf', 'verifiedBy', 'verifiedOn', 'evidence'])(
      'fails in both modes when %s is missing',
      (field) => {
        const input = data({
          etfs: [etf({ ter: record(0.07, { [field]: null }) })],
        })
        for (const mode of ['strict', 'draft'] as const) {
          const result = run(input, mode)
          expect(result.ok).toBe(false)
          expect(result.issues).toContainEqual(
            expect.objectContaining({
              code: 'MISSING_SOURCE',
              severity: 'error',
              path: `etfs[0].ter.${field}`,
            }),
          )
        }
      },
    )

    it('treats an empty string like a missing value', () => {
      const result = run(
        data({ etfs: [etf({ ter: record(0.07, { sourceUrl: '  ' }) })] }),
      )
      expect(result.issues).toContainEqual(
        expect.objectContaining({ code: 'MISSING_SOURCE' }),
      )
    })
  })

  describe('TODO_VERIFY', () => {
    const placeholder = {
      value: 'TODO_VERIFY',
      sourceUrl: null,
      asOf: null,
      verifiedBy: null,
      verifiedOn: null,
      evidence: null,
    }
    const input = () => data({ etfs: [etf({ ter: placeholder })] })

    it('fails in strict mode', () => {
      const result = run(input(), 'strict')
      expect(result.ok).toBe(false)
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: 'TODO_VERIFY',
          severity: 'error',
          path: 'etfs[0].ter',
        }),
      )
    })

    it('only warns in draft mode', () => {
      const result = run(input(), 'draft')
      expect(result.ok).toBe(true)
      expect(result.issues).toContainEqual(
        expect.objectContaining({ code: 'TODO_VERIFY', severity: 'warning' }),
      )
    })

    it('reports a placeholder once, without extra missing-source noise', () => {
      const result = run(input(), 'draft')
      expect(result.issues.map((i) => i.code)).toEqual(['TODO_VERIFY'])
    })

    it('flags TODO_VERIFY in a metadata field too', () => {
      const result = run(
        data({
          etfs: [etf({ ter: record(0.07, { verifiedBy: 'TODO_VERIFY' }) })],
        }),
      )
      expect(result.ok).toBe(false)
      expect(result.issues).toContainEqual(
        expect.objectContaining({ code: 'TODO_VERIFY' }),
      )
    })
  })

  describe('stale asOf', () => {
    const etfAged = (asOf: string) =>
      data({ etfs: [etf({ ter: record(0.07, { asOf }) })] })

    it('fails when older than 120 days (2026-06-11 is 121 days before)', () => {
      for (const mode of ['strict', 'draft'] as const) {
        const result = run(etfAged('2026-06-11'), mode)
        expect(result.ok).toBe(false)
        expect(result.issues).toContainEqual(
          expect.objectContaining({
            code: 'STALE',
            severity: 'error',
            path: 'etfs[0].ter.asOf',
          }),
        )
      }
    })

    it('accepts exactly 120 days (2026-06-12)', () => {
      expect(run(etfAged('2026-06-12')).ok).toBe(true)
    })

    it('uses a 45-day limit for broker fees', () => {
      const brokerAged = (asOf: string) =>
        data({ brokers: [broker({ fxFeePct: record(0.5, { asOf }) })] })
      // 2026-08-25 is 46 days before, 2026-08-26 is exactly 45
      expect(run(brokerAged('2026-08-25')).issues).toContainEqual(
        expect.objectContaining({
          code: 'STALE',
          path: 'brokers[0].fxFeePct.asOf',
        }),
      )
      expect(run(brokerAged('2026-08-26')).ok).toBe(true)
    })

    it('rejects an asOf date in the future', () => {
      const result = run(etfAged('2026-10-11'))
      expect(result.issues).toContainEqual(
        expect.objectContaining({ code: 'FUTURE_DATE' }),
      )
    })
  })

  describe('broker availability', () => {
    it('validates per-ETF availability records like any other record', () => {
      const result = run(
        data({
          brokers: [
            broker({
              availability: { 'test-etf': record(true, { evidence: null }) },
            }),
          ],
        }),
      )
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: 'MISSING_SOURCE',
          path: 'brokers[0].availability.test-etf.evidence',
        }),
      )
    })

    it('uses the 120-day limit for availability (only fees are 45 days)', () => {
      const result = run(
        data({
          brokers: [
            broker({
              availability: {
                'test-etf': record(true, { asOf: '2026-08-01' }),
              },
            }),
          ],
        }),
      )
      expect(result.ok).toBe(true)
    })
  })

  describe('sources registry', () => {
    it('fails when a record cites a URL that is not in sources', () => {
      const result = run(
        data({
          etfs: [
            etf({
              ter: record(0.07, { sourceUrl: 'https://other.example/x' }),
            }),
          ],
        }),
      )
      expect(result.ok).toBe(false)
      expect(result.issues).toContainEqual(
        expect.objectContaining({ code: 'UNKNOWN_SOURCE' }),
      )
    })
  })

  describe('malformed input', () => {
    it.each([
      ['non-https sourceUrl', { sourceUrl: 'http://example.com/a' }],
      ['asOf not an ISO date', { asOf: '10.10.2026' }],
      ['verifiedOn not an ISO date', { verifiedOn: 'yesterday' }],
    ])('reports %s as MALFORMED', (_label, overrides) => {
      const result = run(
        data({ etfs: [etf({ ter: record(0.07, overrides) })] }),
      )
      expect(result.ok).toBe(false)
      expect(result.issues).toContainEqual(
        expect.objectContaining({ code: 'MALFORMED' }),
      )
    })

    it('reports a wrong value type (ter as text) as MALFORMED', () => {
      const result = run(data({ etfs: [etf({ ter: record('0.07 %') })] }))
      expect(result.issues).toContainEqual(
        expect.objectContaining({
          code: 'MALFORMED',
          path: 'etfs[0].ter.value',
        }),
      )
    })

    it('reports a missing required field as MALFORMED', () => {
      const withoutTer = { ...etf(), ter: undefined }
      const result = run(data({ etfs: [withoutTer] }))
      expect(result.issues).toContainEqual(
        expect.objectContaining({ code: 'MALFORMED', path: 'etfs[0].ter' }),
      )
    })

    it('does not throw on garbage input', () => {
      expect(() =>
        validateData(null, { today: TODAY, mode: 'strict' }),
      ).not.toThrow()
      expect(validateData(null, { today: TODAY, mode: 'strict' }).ok).toBe(
        false,
      )
    })
  })
})

describe('seed data files', () => {
  // The real data files carry real dates, so they are checked on a fixed day:
  // the day the latest values were verified.
  const SEED_TODAY = '2026-10-14'

  it('passes draft mode but not strict mode (some values are still TODO_VERIFY)', async () => {
    const { loadData } = await import('./load')
    const input = await loadData()
    expect(validateData(input, { today: SEED_TODAY, mode: 'draft' }).ok).toBe(
      true,
    )
    expect(validateData(input, { today: SEED_TODAY, mode: 'strict' }).ok).toBe(
      false,
    )
  })

  // The fund set of note 0036: the five European twins, plus VOO and QQQ, which
  // the page names only to say where they cannot be bought.
  it('contains the five twins and the two American originals', async () => {
    const { loadData } = await import('./load')
    const { etfs } = (await loadData()) as { etfs: { ticker: string }[] }
    expect(etfs.map((e) => e.ticker).sort()).toEqual(
      ['CNDX', 'CSPX', 'EQQQ', 'QQQ', 'VOO', 'VUAA', 'VUSA'].sort(),
    )
  })
})
