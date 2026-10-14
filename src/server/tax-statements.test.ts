import { describe, expect, it } from 'vitest'
import { taxCopy } from '@/content/copy'
import { formatKc } from '@/lib/format'
import { taxStatements } from './tax-statements'

const LAW = 'https://www.zakonyprolidi.cz/cs/1992-586'

function record(value: unknown, overrides: Record<string, unknown> = {}) {
  return {
    value,
    sourceUrl: LAW,
    asOf: '2026-10-14',
    verifiedBy: 'David',
    verifiedOn: '2026-10-15',
    evidence: 'sha256:abc',
    ...overrides,
  }
}

const todo = {
  value: 'TODO_VERIFY',
  sourceUrl: null,
  asOf: null,
  verifiedBy: null,
  verifiedOn: null,
  evidence: null,
}

function tax(overrides: Record<string, unknown> = {}) {
  return {
    timeTestYears: record(3),
    annualLimitKc: record(100000),
    exemptionsExclusive: record(true),
    businessAssetsExcluded: record(true),
    foreignIssuerSecurities: record(true),
    dividendsCapitalIncome: record(true),
    ...overrides,
  }
}

function data(taxPart: unknown) {
  return {
    etfs: [],
    brokers: [],
    sources: [{ url: LAW, title: 'Zákon', publisher: 'Sbírka zákonů' }],
    ...(taxPart === undefined ? {} : { tax: taxPart }),
  }
}

const placeholder = { text: taxCopy.unverified, source: null }

describe('taxStatements', () => {
  it('builds the sale statement from verified records, each sentence with its source', () => {
    const { sale } = taxStatements(data(tax()))
    const text = sale.map((sentence) => sentence.text).join(' ')
    expect(text).toContain('3')
    expect(text).toContain(formatKc(100000))
    expect(sale.length).toBeGreaterThan(1)
    for (const sentence of sale) {
      expect(sentence.source).toMatchObject({ url: LAW, asOf: '2026-10-14' })
      expect(sentence.source?.label).toMatch(/586\/1992/)
    }
  })

  it('says a dividend is capital income, and leaves the rest to the reviewer', () => {
    const { dividends } = taxStatements(data(tax()))
    expect(dividends[0].source?.url).toBe(LAW)
    expect(dividends[0].text).toMatch(/kapitálov/)
    expect(dividends.at(-1)).toEqual(placeholder)
  })

  it('replaces only the sentence whose record is unverified', () => {
    const { sale } = taxStatements(
      data(
        tax({ annualLimitKc: record(100000, { verifiedBy: 'TODO_VERIFY' }) }),
      ),
    )
    expect(sale).toContainEqual(placeholder)
    expect(sale.map((s) => s.text).join(' ')).not.toContain(formatKc(100000))
    expect(sale.some((s) => s.source !== null)).toBe(true)
  })

  it.each([
    ['a TODO_VERIFY record', todo],
    ['a record without evidence', record(3, { evidence: null })],
    ['a record nobody verified', record(3, { verifiedOn: null })],
  ])('treats %s as unverified', (_name, timeTestYears) => {
    const { sale } = taxStatements(data(tax({ timeTestYears })))
    expect(sale.map((s) => s.text).join(' ')).not.toMatch(/\b3 let/)
    expect(sale).toContainEqual(placeholder)
  })

  it('shows a yes/no fact only when it is true', () => {
    const { sale } = taxStatements(
      data(tax({ exemptionsExclusive: record(false) })),
    )
    expect(sale).toContainEqual(placeholder)
  })

  it('gives one placeholder per statement when there are no tax records', () => {
    expect(taxStatements(data(undefined))).toEqual({
      sale: [placeholder],
      dividends: [placeholder],
    })
  })

  it('does not throw on malformed data, and shows placeholders', () => {
    const wrong = data(tax({ timeTestYears: record('three') }))
    expect(taxStatements(wrong).sale).toEqual([placeholder])
    expect(taxStatements('nonsense').sale).toEqual([placeholder])
  })
})
