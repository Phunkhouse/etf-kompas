import { describe, it } from 'vitest'

// The daily Czech National Bank rate (docs/METHODOLOGY-V2.md, "Exchange rates,
// fetched daily"). The cases are listed first and wait for David's approval
// (CLAUDE.md, risky logic: these numbers turn euro fees into Kč). They are
// `it.todo` so that CI stays green until the implementation follows.

describe('parseCnbDaily', () => {
  it.todo(
    'reads EUR and USD from the daily file: decimal comma, date in the first line',
  )
  it.todo(
    'divides by the quoted amount, so a rate quoted per 100 units becomes per 1',
  )
  it.todo('ignores other currencies and the column-title line')
  it.todo('handles Windows line endings and a trailing empty line')
  it.todo('returns null for an empty text or a text that is not the daily file')
  it.todo(
    'returns null when the date in the first line is missing or impossible (31.02.2026)',
  )
  it.todo(
    'leaves out a currency whose rate is not a positive number and keeps the other',
  )
})

describe('ratesAreFresh', () => {
  it.todo('a rate is fresh up to and including 45 days, and stale from day 46')
  it.todo('a date in the future is not fresh')
})

describe('chooseRates', () => {
  it.todo(
    'uses the fetched rate when it is fresh, for each currency on its own',
  )
  it.todo(
    'falls back to the verified record in the data when the fetch gave nothing',
  )
  it.todo(
    'does not use a stale fetched rate, and does not use a stale or unverified record',
  )
  it.todo(
    'returns no rate when neither is usable, so euro and dollar fees stay unpriced',
  )
  it.todo(
    'says where each rate came from and its own date, to show "kurz ČNB z ..."',
  )
})

describe('fetchCnbRates', () => {
  it.todo(
    'asks the bank for its daily file with one plain request and parses the answer',
  )
  it.todo('returns null on an HTTP error')
  it.todo('returns null on a network error or a timeout, and never throws')
  it.todo('returns null when the answer cannot be read')
})
