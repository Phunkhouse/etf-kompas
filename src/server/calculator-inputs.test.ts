import { describe, expect, it } from 'vitest'
import { calculatorInputs } from './calculator-inputs'
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

type FundValues = {
  ter?: number | 'TODO_VERIFY'
  dividendYieldPct?: number | 'TODO_VERIFY'
  withholdingRate?: number | 'TODO_VERIFY'
}

function field(value: number | 'TODO_VERIFY') {
  return value === 'TODO_VERIFY' ? todo : sourced(value)
}

function etf(id: string, indexGroup: string, values: FundValues = {}): Etf {
  return {
    id,
    ticker: id.toUpperCase(),
    region: 'us-listed',
    indexGroup,
    name: todo,
    indexName: todo,
    isin: todo,
    domicile: todo,
    replication: todo,
    distribution: todo,
    ter: field(values.ter ?? 0.03),
    fundSizeEur: todo,
    dividendYieldPct: field(values.dividendYieldPct ?? 1.11),
    withholdingRate: field(values.withholdingRate ?? 15),
    return5yPct: todo,
    return10yPct: todo,
  }
}

function broker(id: string, fxFeePct: number | 'TODO_VERIFY'): Broker {
  return {
    id,
    name: id,
    fxFeePct: field(fxFeePct),
    custodyFeePct: todo,
    czSupport: todo,
    availability: {},
  }
}

const ids = { featured: 'voo', alternative: 'cspx', broker: 'degiro' }

function data(
  overrides: {
    voo?: FundValues
    cspx?: FundValues
    fx?: number | 'TODO_VERIFY'
  } = {},
) {
  return {
    etfs: [
      etf('voo', 'sp500', { ter: 0.03, ...overrides.voo }),
      etf('cspx', 'sp500', { ter: 0.07, ...overrides.cspx }),
      etf('qqq', 'nasdaq100', { ter: 0.18 }),
    ],
    brokers: [broker('degiro', overrides.fx ?? 0.25), broker('xtb', 0.5)],
  }
}

// --- the mapping ----------------------------------------------------------

describe('calculatorInputs', () => {
  it('passes the data through as plain percent numbers, not fractions', () => {
    expect(calculatorInputs(data(), ids)).toEqual({
      featured: {
        id: 'voo',
        indexGroup: 'sp500',
        ter: 0.03,
        dividendYieldPct: 1.11,
        withholdingRate: 15,
      },
      alternative: {
        id: 'cspx',
        indexGroup: 'sp500',
        ter: 0.07,
        dividendYieldPct: 1.11,
        withholdingRate: 15,
      },
      fxFeePct: 0.25,
    })
  })

  it('uses the funds and the broker it is asked for', () => {
    const result = calculatorInputs(data(), {
      featured: 'qqq',
      alternative: 'cspx',
      broker: 'xtb',
    })
    expect(result?.featured.id).toBe('qqq')
    expect(result?.featured.ter).toBe(0.18)
    expect(result?.fxFeePct).toBe(0.5)
  })

  it('leaves the conversion fee out when the broker fee is still TODO_VERIFY', () => {
    const result = calculatorInputs(data({ fx: 'TODO_VERIFY' }), ids)
    expect(result).not.toBeNull()
    expect(result?.fxFeePct).toBeUndefined()
  })

  it('returns null when a number the calculator needs is TODO_VERIFY', () => {
    for (const missing of [
      'ter',
      'dividendYieldPct',
      'withholdingRate',
    ] as const) {
      expect(
        calculatorInputs(data({ voo: { [missing]: 'TODO_VERIFY' } }), ids),
      ).toBeNull()
      expect(
        calculatorInputs(data({ cspx: { [missing]: 'TODO_VERIFY' } }), ids),
      ).toBeNull()
    }
  })

  it('does not use a number that has no source or no evidence', () => {
    const noEvidence = data()
    noEvidence.etfs[0] = {
      ...noEvidence.etfs[0],
      ter: { ...sourced(0.03), evidence: null },
    }
    expect(calculatorInputs(noEvidence, ids)).toBeNull()

    const noSource = data()
    noSource.etfs[1] = {
      ...noSource.etfs[1],
      withholdingRate: { ...sourced(15), sourceUrl: '' },
    }
    expect(calculatorInputs(noSource, ids)).toBeNull()
  })

  it('does not count a conversion fee that has no evidence', () => {
    const noEvidenceFx = data()
    noEvidenceFx.brokers[0] = {
      ...noEvidenceFx.brokers[0],
      fxFeePct: { ...sourced(0.25), evidence: '' },
    }
    expect(calculatorInputs(noEvidenceFx, ids)?.fxFeePct).toBeUndefined()
  })

  it('throws for a fund or broker that is not in the data', () => {
    expect(() =>
      calculatorInputs(data(), { ...ids, featured: 'nope' }),
    ).toThrow(/nope/)
    expect(() =>
      calculatorInputs(data(), { ...ids, alternative: 'nope' }),
    ).toThrow(/nope/)
    expect(() => calculatorInputs(data(), { ...ids, broker: 'nope' })).toThrow(
      /nope/,
    )
  })
})

// --- the real data --------------------------------------------------------

describe('the real data files', () => {
  it('give VOO against CSPX with DEGIRO, in plain percent (never fractions)', async () => {
    const { loadData } = await import('./data/load')
    const { dataSchema } = await import('./data/schema')
    const parsed = dataSchema.parse(await loadData())
    const result = calculatorInputs(parsed, ids)
    expect(result).not.toBeNull()
    const { featured, alternative, fxFeePct } = result!
    for (const fund of [featured, alternative]) {
      // a fund fee of 0.0003 would be a fraction; real fees are 0.01 to 2
      expect(fund.ter).toBeGreaterThanOrEqual(0.01)
      expect(fund.ter).toBeLessThanOrEqual(2)
      expect(fund.dividendYieldPct).toBeGreaterThan(0.1)
      expect(fund.dividendYieldPct).toBeLessThan(10)
      expect(fund.withholdingRate).toBeGreaterThanOrEqual(1)
      expect(fund.withholdingRate).toBeLessThanOrEqual(100)
    }
    expect(featured.indexGroup).toBe(alternative.indexGroup)
    expect(fxFeePct).toBeGreaterThan(0.01)
    expect(fxFeePct).toBeLessThan(5)
  })
})
