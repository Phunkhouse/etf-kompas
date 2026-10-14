// The Czech tax sentences of the comparison page and the PDF, built from the sourced
// records in data/tax.json (SPEC §18, docs/TAX-SOURCES.md). A sentence appears only
// when its record is verified; otherwise it is `[ověřit zdroj]`. Pure: no imports
// from next or react.
import { taxCopy } from '@/content/copy'
import { formatKc } from '@/lib/format'
import { taxSchema, TODO_VERIFY, type Tax } from './data/schema'
import { isSet } from './data/verified'

export type TaxSource = { label: string; url: string; asOf: string }
// `source` is null for the placeholder: nobody has verified that part yet.
export type TaxSentence = { text: string; source: TaxSource | null }
export type TaxStatements = { sale: TaxSentence[]; dividends: TaxSentence[] }

type Key = keyof Tax
type Record_ = Tax[Key]

const placeholder: TaxSentence = { text: taxCopy.unverified, source: null }

function verifiedValue(record: Record_): unknown {
  const ok =
    record.value !== TODO_VERIFY &&
    isSet(record.sourceUrl) &&
    isSet(record.asOf) &&
    isSet(record.evidence) &&
    isSet(record.verifiedBy) &&
    isSet(record.verifiedOn)
  return ok ? record.value : null
}

function sourceOf(record: Record_, key: Key): TaxSource {
  return {
    label: taxCopy.citations[key],
    url: record.sourceUrl as string,
    asOf: record.asOf as string,
  }
}

export function taxStatements(raw: unknown): TaxStatements {
  const tax = taxSchema.safeParse(
    typeof raw === 'object' && raw !== null && 'tax' in raw ? raw.tax : null,
  )
  if (!tax.success) return { sale: [placeholder], dividends: [placeholder] }
  const records = tax.data

  // The sentence of a verified record, or null. A yes/no fact speaks only when true.
  function sentence(
    key: Key,
    build: (value: never) => string,
  ): TaxSentence | null {
    const value = verifiedValue(records[key])
    if (value === null || value === false) return null
    return { text: build(value as never), source: sourceOf(records[key], key) }
  }

  // The verified sentences, then one placeholder when anything is missing.
  function statement(
    parts: (TaxSentence | null)[],
    unsourcedRest = false,
  ): TaxSentence[] {
    const shown = parts.filter((part) => part !== null)
    return shown.length === parts.length && !unsourcedRest
      ? shown
      : [...shown, placeholder]
  }

  return {
    sale: statement([
      sentence('timeTestYears', (years: number) =>
        taxCopy.sale.timeTest(years),
      ),
      sentence('annualLimitKc', (limit: number) =>
        taxCopy.sale.annualLimit(formatKc(limit)),
      ),
      sentence('exemptionsExclusive', () => taxCopy.sale.exclusive),
      sentence('businessAssetsExcluded', () => taxCopy.sale.business),
      sentence('foreignIssuerSecurities', () => taxCopy.sale.foreign),
    ]),
    // How a dividend is taxed and what is credited from abroad has no source yet.
    dividends: statement(
      [sentence('dividendsCapitalIncome', () => taxCopy.dividends)],
      true,
    ),
  }
}
