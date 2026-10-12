// The Czech National Bank's daily exchange rates (docs/METHODOLOGY-V2.md,
// "Exchange rates, fetched daily"). Pure parsing and choosing, plus one plain
// request with the fetch function passed in. No imports from next or react.
import { TODO_VERIFY } from './data/schema'
import { hasSource } from './data/verified'

type Currency = 'EUR' | 'USD'

// The latest daily fixing. The bank publishes it on working days; at weekends
// and on holidays the last one stays valid.
export const CNB_DAILY_URL =
  'https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt'

// A rate older than this is never used: the limit of broker fees (note 0024).
export const MAX_RATE_AGE_DAYS = 45

const REQUEST_TIMEOUT_MS = 5000
const DAY_MS = 24 * 60 * 60 * 1000

export type CnbDaily = {
  // ISO date of the fixing
  date: string
  // Kč per one unit of the currency; only the currencies that could be read
  rates: Partial<Record<Currency, number>>
}

export type RateSource = {
  rate: number
  // the date of the rate itself
  date: string
  // cnb = fetched today's file, data = the verified record in data/rates.json
  source: 'cnb' | 'data'
}

export type ChosenRates = Partial<Record<Currency, RateSource>>

type SeedRecord = {
  value: number | typeof TODO_VERIFY
  sourceUrl: string | null
  evidence: string | null
  asOf: string | null
}

function parseIsoDate(text: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null
  const time = Date.parse(`${text}T00:00:00Z`)
  if (Number.isNaN(time)) return null
  return new Date(time).toISOString().slice(0, 10) === text ? time : null
}

// "09.10.2026 #195" -> "2026-10-09"; null for anything else or an impossible day.
function parseCnbDate(headerLine: string): string | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})(?:\s|$)/.exec(headerLine.trim())
  if (!match) return null
  const iso = `${match[3]}-${match[2]}-${match[1]}`
  return parseIsoDate(iso) === null ? null : iso
}

function parsePositive(text: string): number | null {
  const trimmed = text.trim()
  if (!/^\d+(,\d+)?$/.test(trimmed)) return null
  const value = Number(trimmed.replace(',', '.'))
  return Number.isFinite(value) && value > 0 ? value : null
}

// The file is one line with the date, one line of column titles, then one line
// per currency: `EMU|euro|1|EUR|24,365` (country|currency|amount|code|rate).
export function parseCnbDaily(text: string): CnbDaily | null {
  const lines = text.split(/\r?\n/)
  const date = parseCnbDate(lines[0] ?? '')
  if (date === null) return null

  const rates: Partial<Record<Currency, number>> = {}
  for (const line of lines.slice(2)) {
    const cells = line.split('|')
    if (cells.length < 5) continue
    const code = cells[3].trim()
    if (code !== 'EUR' && code !== 'USD') continue
    const amount = parsePositive(cells[2])
    const rate = parsePositive(cells[4])
    if (amount === null || rate === null) continue
    rates[code] = rate / amount
  }
  return Object.keys(rates).length > 0 ? { date, rates } : null
}

// Fresh up to and including MAX_RATE_AGE_DAYS; a date in the future is not fresh.
export function ratesAreFresh(
  date: string,
  today: string,
  maxDays = MAX_RATE_AGE_DAYS,
): boolean {
  const then = parseIsoDate(date)
  const now = parseIsoDate(today)
  if (then === null || now === null) return false
  const age = Math.round((now - then) / DAY_MS)
  return age >= 0 && age <= maxDays
}

// For each currency on its own: the fetched rate if it is fresh, else the verified
// record from the data if it is fresh, else nothing.
export function chooseRates(
  fetched: CnbDaily | null,
  seed: Partial<Record<Currency, SeedRecord>> | undefined,
  today: string,
): ChosenRates {
  const chosen: ChosenRates = {}
  for (const currency of ['EUR', 'USD'] as const) {
    const live = fetched?.rates[currency]
    if (fetched && live !== undefined && ratesAreFresh(fetched.date, today)) {
      chosen[currency] = { rate: live, date: fetched.date, source: 'cnb' }
      continue
    }
    const record = seed?.[currency]
    if (
      record &&
      typeof record.value === 'number' &&
      record.value > 0 &&
      hasSource(record) &&
      record.asOf !== null &&
      ratesAreFresh(record.asOf, today)
    ) {
      chosen[currency] = {
        rate: record.value,
        date: record.asOf,
        source: 'data',
      }
    }
  }
  return chosen
}

// One plain request: no headers, no cookies, a timeout. Never throws; null when
// the bank does not answer or the answer cannot be read.
export async function fetchCnbRates(
  fetchImpl: typeof fetch,
): Promise<CnbDaily | null> {
  try {
    const response = await fetchImpl(CNB_DAILY_URL, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!response.ok) return null
    return parseCnbDaily(await response.text())
  } catch {
    return null
  }
}
