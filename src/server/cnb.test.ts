import { describe, expect, it, vi } from 'vitest'
import {
  CNB_DAILY_URL,
  chooseRates,
  fetchCnbRates,
  parseCnbDaily,
  ratesAreFresh,
} from './cnb'

// The daily Czech National Bank rate (docs/METHODOLOGY-V2.md, "Exchange rates,
// fetched daily"). The cases were listed first and approved by David on
// 2026-10-12.

const FILE = [
  '09.10.2026 #195',
  'země|měna|množství|kód|kurz',
  'Austrálie|dolar|1|AUD|14,000',
  'Japonsko|jen|100|JPY|14,420',
  'EMU|euro|1|EUR|24,365',
  'USA|dolar|1|USD|21,745',
  '',
].join('\n')

describe('parseCnbDaily', () => {
  it('reads EUR and USD from the daily file: decimal comma, date in the first line', () => {
    expect(parseCnbDaily(FILE)).toEqual({
      date: '2026-10-09',
      rates: { EUR: 24.365, USD: 21.745 },
    })
  })

  it('divides by the quoted amount, so a rate quoted per 100 units becomes per 1', () => {
    const per100 = [
      '09.10.2026 #195',
      'h',
      'EMU|euro|100|EUR|2436,5',
      'USA|dolar|1|USD|21,745',
    ].join('\n')
    expect(parseCnbDaily(per100)?.rates.EUR).toBeCloseTo(24.365, 10)
  })

  it('ignores other currencies and the column-title line', () => {
    const parsed = parseCnbDaily(FILE)!
    expect(Object.keys(parsed.rates).sort()).toEqual(['EUR', 'USD'])
  })

  it('handles Windows line endings and a trailing empty line', () => {
    const crlf = FILE.replace(/\n/g, '\r\n') + '\r\n'
    expect(parseCnbDaily(crlf)).toEqual(parseCnbDaily(FILE))
  })

  it('returns null for an empty text or a text that is not the daily file', () => {
    expect(parseCnbDaily('')).toBeNull()
    expect(parseCnbDaily('<html>Service unavailable</html>')).toBeNull()
    expect(
      parseCnbDaily('09.10.2026 #195\nheader\nAustrálie|dolar|1|AUD|14,000'),
    ).toBeNull()
  })

  it('returns null when the date in the first line is missing or impossible (31.02.2026)', () => {
    expect(parseCnbDaily(FILE.replace('09.10.2026', '31.02.2026'))).toBeNull()
    expect(parseCnbDaily(FILE.replace('09.10.2026 #195\n', ''))).toBeNull()
    expect(parseCnbDaily(FILE.replace('09.10.2026', '2026-10-09'))).toBeNull()
  })

  it('leaves out a currency whose rate is not a positive number and keeps the other', () => {
    const broken = FILE.replace('USA|dolar|1|USD|21,745', 'USA|dolar|1|USD|n/a')
    expect(parseCnbDaily(broken)).toEqual({
      date: '2026-10-09',
      rates: { EUR: 24.365 },
    })
    const zero = FILE.replace('EMU|euro|1|EUR|24,365', 'EMU|euro|1|EUR|0,000')
    expect(parseCnbDaily(zero)?.rates).toEqual({ USD: 21.745 })
    const noAmount = FILE.replace(
      'EMU|euro|1|EUR|24,365',
      'EMU|euro|0|EUR|24,365',
    )
    expect(parseCnbDaily(noAmount)?.rates).toEqual({ USD: 21.745 })
  })
})

describe('ratesAreFresh', () => {
  it('a rate is fresh up to and including 45 days, and stale from day 46', () => {
    expect(ratesAreFresh('2026-10-12', '2026-10-12')).toBe(true)
    expect(ratesAreFresh('2026-08-28', '2026-10-12')).toBe(true) // 45 days
    expect(ratesAreFresh('2026-08-27', '2026-10-12')).toBe(false) // 46 days
  })

  it('a date in the future is not fresh', () => {
    expect(ratesAreFresh('2026-10-13', '2026-10-12')).toBe(false)
    expect(ratesAreFresh('not a date', '2026-10-12')).toBe(false)
  })
})

describe('chooseRates', () => {
  const fetched = { date: '2026-10-09', rates: { EUR: 24.365, USD: 21.745 } }
  const seed = (value: number, asOf = '2026-10-01') => ({
    value,
    sourceUrl: 'https://www.cnb.cz',
    evidence: 'sha256:abc',
    asOf,
  })

  it('uses the fetched rate when it is fresh, for each currency on its own', () => {
    const partial = { date: '2026-10-09', rates: { EUR: 24.365 } }
    expect(
      chooseRates(partial, { EUR: seed(25), USD: seed(23) }, '2026-10-12'),
    ).toEqual({
      EUR: { rate: 24.365, date: '2026-10-09', source: 'cnb' },
      USD: { rate: 23, date: '2026-10-01', source: 'data' },
    })
  })

  it('falls back to the verified record in the data when the fetch gave nothing', () => {
    expect(
      chooseRates(null, { EUR: seed(25), USD: seed(23) }, '2026-10-12'),
    ).toEqual({
      EUR: { rate: 25, date: '2026-10-01', source: 'data' },
      USD: { rate: 23, date: '2026-10-01', source: 'data' },
    })
  })

  it('does not use a stale fetched rate, and does not use a stale or unverified record', () => {
    const old = { date: '2026-07-01', rates: { EUR: 24, USD: 21 } }
    expect(chooseRates(old, undefined, '2026-10-12')).toEqual({})
    const stale = seed(25, '2026-07-01')
    const noEvidence = { ...seed(23), evidence: null }
    const placeholder = { ...seed(23), value: 'TODO_VERIFY' as const }
    expect(
      chooseRates(null, { EUR: stale, USD: noEvidence }, '2026-10-12'),
    ).toEqual({})
    expect(chooseRates(null, { EUR: placeholder }, '2026-10-12')).toEqual({})
  })

  it('returns no rate when neither is usable, so euro and dollar fees stay unpriced', () => {
    expect(chooseRates(null, undefined, '2026-10-12')).toEqual({})
  })

  it('says where each rate came from and its own date, to show "kurz ČNB z ..."', () => {
    const chosen = chooseRates(fetched, undefined, '2026-10-12')
    expect(chosen.EUR).toEqual({
      rate: 24.365,
      date: '2026-10-09',
      source: 'cnb',
    })
    expect(chosen.USD?.source).toBe('cnb')
  })
})

describe('fetchCnbRates', () => {
  function respond(body: string, init: { status?: number } = {}) {
    return vi.fn(async () => new Response(body, { status: init.status ?? 200 }))
  }

  it('asks the bank for its daily file with one plain request and parses the answer', async () => {
    const fetchImpl = respond(FILE)
    const result = await fetchCnbRates(fetchImpl as unknown as typeof fetch)
    expect(result?.rates).toEqual({ EUR: 24.365, USD: 21.745 })
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ]
    expect(url).toBe(CNB_DAILY_URL)
    expect(new URL(url).hostname).toBe('www.cnb.cz')
    expect(init.headers).toBeUndefined()
    expect(init.credentials).toBeUndefined()
    expect(init.signal).toBeDefined()
  })

  it('returns null on an HTTP error', async () => {
    for (const status of [404, 500, 503]) {
      expect(
        await fetchCnbRates(
          respond(FILE, { status }) as unknown as typeof fetch,
        ),
      ).toBeNull()
    }
  })

  it('returns null on a network error or a timeout, and never throws', async () => {
    const down = vi.fn(async () => {
      throw new TypeError('fetch failed')
    })
    expect(await fetchCnbRates(down as unknown as typeof fetch)).toBeNull()
    const timeout = vi.fn(async () => {
      throw new DOMException('The operation timed out.', 'TimeoutError')
    })
    expect(await fetchCnbRates(timeout as unknown as typeof fetch)).toBeNull()
  })

  it('returns null when the answer cannot be read', async () => {
    expect(
      await fetchCnbRates(
        respond('<html>oops</html>') as unknown as typeof fetch,
      ),
    ).toBeNull()
    expect(
      await fetchCnbRates(respond('') as unknown as typeof fetch),
    ).toBeNull()
  })
})
