import { describe, expect, it } from 'vitest'
import { hashIp } from './ip-hash'
import { createMemoryLeadStore } from './memory-store'
import { hashToken, newToken } from './tokens'
import {
  purgeOldRateLimits,
  submitLead,
  type LeadDeps,
  type LeadInput,
} from './leads'

// Phase 4, PR 1: test cases V, S, H, R and T-1 of docs/PHASE-4-PLAN.md.
// Ports are the in-memory ones and the clock is fixed, so nothing here is random
// or slow. These tests are written first and fail until the code exists.
const START = new Date('2026-10-14T10:00:00Z')
const SECRET = 'a-test-secret-of-at-least-32-bytes!!'
const RESULTS_PATH = /^\/srovnani\/([A-Za-z0-9_-]{43})$/

function setup(start = START) {
  const memory = createMemoryLeadStore()
  let current = start
  const deps: LeadDeps = {
    store: memory.store,
    limiter: memory.limiter,
    now: () => current,
    secrets: { ipHash: SECRET },
  }
  return {
    memory,
    deps,
    at: (date: Date) => {
      current = date
    },
  }
}

const valid = (extra: Partial<LeadInput> = {}): LeadInput => ({
  email: 'jmeno@domena.cz',
  monthly: '5000',
  years: '10',
  t: '5000',
  website: '',
  ...extra,
})
const from = (ip: string) => ({ ip })
const ME = from('203.0.113.7')

function tokenOf(result: { status: string; resultsPath?: string }): string {
  const match = RESULTS_PATH.exec(result.resultsPath ?? '')
  if (!match) throw new Error(`no results path in ${JSON.stringify(result)}`)
  return match[1]
}

describe('V: the calculator values', () => {
  it.each([
    ['500', '5'],
    ['5000', '10'],
    ['20000', '20'],
    [5000, 10],
  ])('V-1 accepts monthly %j and years %j', async (monthly, years) => {
    const { deps, memory } = setup()
    const result = await submitLead(valid({ monthly, years }), ME, deps)
    expect(result.status).toBe('ok')
    expect(memory.leads()[0]).toMatchObject({
      calcMonthly: Number(monthly),
      calcYears: Number(years),
    })
  })

  it.each([
    ['zero', '0'],
    ['below the grid', '250'],
    ['off the grid', '5250'],
    ['above the grid', '20500'],
    ['a float', '5000.5'],
    ['negative', '-500'],
    ['text', 'hodně'],
    ['empty', ''],
    ['missing', undefined],
  ])('V-1 rejects monthly: %s', async (_label, monthly) => {
    const { deps, memory } = setup()
    const result = await submitLead(valid({ monthly }), ME, deps)
    expect(result.status).toBe('invalid')
    expect(memory.leads()).toHaveLength(0)
  })

  it.each([
    ['not offered', '7'],
    ['zero', '0'],
    ['too long', '30'],
    ['a float', '10.5'],
    ['missing', undefined],
  ])('V-2 rejects years: %s', async (_label, years) => {
    const { deps, memory } = setup()
    const result = await submitLead(valid({ years }), ME, deps)
    expect(result.status).toBe('invalid')
    expect(memory.leads()).toHaveLength(0)
  })

  it('V-3 keeps the variant when it is a or b, else uses a', async () => {
    for (const [sent, kept] of [
      ['a', 'a'],
      ['b', 'b'],
      ['c', 'a'],
      [undefined, 'a'],
    ] as const) {
      const { deps, memory } = setup()
      await submitLead(valid({ variant: sent }), ME, deps)
      expect(memory.leads()[0].variant).toBe(kept)
    }
  })

  it('V-3 stores the UTM fields and fbclid, cut to 200 characters, without control characters, empty as null', async () => {
    const { deps, memory } = setup()
    await submitLead(
      valid({
        utm_source: 'instagram',
        utm_medium: 'x'.repeat(300),
        utm_campaign: 'a\u0000b\nc',
        utm_content: '',
        fbclid: 'AbC123',
      }),
      ME,
      deps,
    )
    expect(memory.leads()[0]).toMatchObject({
      utmSource: 'instagram',
      utmMedium: 'x'.repeat(200),
      utmCampaign: 'abc',
      utmContent: null,
      utmTerm: null,
      fbclid: 'AbC123',
    })
  })
})

describe('S: storage and idempotency', () => {
  it('S-1 stores a valid lead lowercased, queued, with its link', async () => {
    const { deps, memory } = setup()
    const result = await submitLead(
      valid({ email: ' Jmeno@Domena.CZ ', variant: 'b', utm_source: 'ig' }),
      ME,
      deps,
    )
    expect(result).toMatchObject({
      status: 'ok',
      resultsPath: expect.stringMatching(RESULTS_PATH),
    })
    expect(memory.leads()).toHaveLength(1)
    expect(memory.leads()[0]).toMatchObject({
      email: 'jmeno@domena.cz',
      createdAt: START,
      variant: 'b',
      utmSource: 'ig',
      calcMonthly: 5000,
      calcYears: 10,
      marketingConsent: false,
      consentTextVersion: null,
      consentConfirmedAt: null,
      emailStatus: 'queued',
      unsubscribedAt: null,
      deletedAt: null,
    })
  })

  it('S-2 the same address twice, in any case, is one lead and ok both times', async () => {
    const { deps, memory } = setup()
    const first = await submitLead(valid({ email: 'Jan@Domena.cz' }), ME, deps)
    const second = await submitLead(valid({ email: 'jan@domena.cz' }), ME, deps)
    expect(first.status).toBe('ok')
    expect(second.status).toBe('ok')
    expect(memory.leads()).toHaveLength(1)
  })

  it('S-2 the second submit updates the setup but keeps id and creation time', async () => {
    const { deps, memory, at } = setup()
    await submitLead(valid({ monthly: '5000', years: '10' }), ME, deps)
    const before = memory.leads()[0]
    at(new Date('2026-10-14T12:00:00Z'))
    await submitLead(valid({ monthly: '2000', years: '20' }), ME, deps)
    expect(memory.leads()).toHaveLength(1)
    expect(memory.leads()[0]).toMatchObject({
      id: before.id,
      createdAt: before.createdAt,
      calcMonthly: 2000,
      calcYears: 20,
    })
  })

  it('S-3 the second submit gives a new link, and the old token stays in the store', async () => {
    const { deps, memory } = setup()
    const first = await submitLead(valid(), ME, deps)
    const second = await submitLead(valid(), ME, deps)
    expect(tokenOf(first)).not.toBe(tokenOf(second))
    const hashes = memory.tokens().map((t) => t.tokenHash)
    expect(hashes).toContain(hashToken(tokenOf(first)))
    expect(hashes).toContain(hashToken(tokenOf(second)))
    expect(new Set(memory.tokens().map((t) => t.leadId)).size).toBe(1)
  })

  it('S-4 tips: on once stays on; a later submit can turn it on but never off', async () => {
    const { deps, memory } = setup()
    await submitLead(valid({ tips: 'on' }), ME, deps)
    expect(memory.leads()[0].marketingConsent).toBe(true)
    await submitLead(valid({ tips: undefined }), ME, deps)
    expect(memory.leads()[0].marketingConsent).toBe(true)

    const other = setup()
    await submitLead(valid({ email: 'b@domena.cz' }), ME, other.deps)
    expect(other.memory.leads()[0].marketingConsent).toBe(false)
    await submitLead(
      valid({ email: 'b@domena.cz', tips: 'on' }),
      ME,
      other.deps,
    )
    expect(other.memory.leads()[0].marketingConsent).toBe(true)
  })

  it('S-5 stores the consent text version with tips, and never confirms by itself', async () => {
    const { deps, memory } = setup()
    await submitLead(valid({ tips: 'on' }), ME, deps)
    const lead = memory.leads()[0]
    expect(lead.consentTextVersion).toEqual(expect.any(String))
    expect(lead.consentTextVersion).not.toBe('')
    expect(lead.consentConfirmedAt).toBeNull()
  })

  it('S-6 a store failure says error with the address as typed, and leaves nothing', async () => {
    const { deps, memory } = setup()
    deps.store = {
      ...memory.store,
      save: async () => {
        throw new Error('down')
      },
    }
    const result = await submitLead(valid({ email: 'Jan@Domena.cz' }), ME, deps)
    expect(result).toEqual({ status: 'error', email: 'Jan@Domena.cz' })
    expect(memory.leads()).toHaveLength(0)
    expect(memory.tokens()).toHaveLength(0)
  })

  it('S-7 a deleted lead who submits again is a new person: the row is reset', async () => {
    const { deps, memory, at } = setup()
    await submitLead(
      valid({ tips: 'on', utm_source: 'old', variant: 'b' }),
      ME,
      deps,
    )
    const old = memory.leads()[0]
    await deps.store.save({
      ...old,
      consentConfirmedAt: START,
      unsubscribedAt: START,
      deletedAt: START,
    })
    at(new Date('2026-10-20T09:00:00Z'))
    const result = await submitLead(
      valid({ utm_source: 'new', variant: 'a' }),
      ME,
      deps,
    )
    expect(result.status).toBe('ok')
    expect(memory.leads()).toHaveLength(1)
    expect(memory.leads()[0]).toMatchObject({
      deletedAt: null,
      unsubscribedAt: null,
      consentConfirmedAt: null,
      marketingConsent: false,
      consentTextVersion: null,
      utmSource: 'new',
      variant: 'a',
    })
  })

  it('S-7 an unsubscribed lead still gets the link; unsubscribed_at stays until a new confirmation', async () => {
    const { deps, memory } = setup()
    await submitLead(valid(), ME, deps)
    await deps.store.save({ ...memory.leads()[0], unsubscribedAt: START })
    const result = await submitLead(valid({ tips: 'on' }), ME, deps)
    expect(result.status).toBe('ok')
    expect(memory.leads()[0]).toMatchObject({
      unsubscribedAt: START,
      consentConfirmedAt: null,
    })
  })
})

describe('H: honeypot and time', () => {
  async function silent(extra: Partial<LeadInput>) {
    const { deps, memory } = setup()
    const result = await submitLead(valid(extra), ME, deps)
    expect(result.status).toBe('ok')
    expect(result).toMatchObject({
      resultsPath: expect.stringMatching(RESULTS_PATH),
    })
    expect(memory.leads()).toHaveLength(0)
    expect(memory.tokens()).toHaveLength(0)
    expect(memory.limiterWindows()).toHaveLength(0)
    return { result, deps, memory }
  }

  it('H-1 a filled honeypot looks like success but stores, sends and counts nothing', async () => {
    const { result, memory } = await silent({ website: 'http://spam.example' })
    // the link points nowhere: its hash is in no store
    expect(
      memory.tokens().some((t) => t.tokenHash === hashToken(tokenOf(result))),
    ).toBe(false)
  })

  it.each([
    ['under 2 s', '1999'],
    ['zero', '0'],
    ['negative', '-5'],
    ['not a number', 'abc'],
    ['a float that is too small', '1500.5'],
  ])('H-2 a time %s is handled like the honeypot', async (_label, t) => {
    await silent({ t })
  })

  it.each([
    ['exactly 2 s', '2000'],
    ['slow', '600000'],
    ['missing (no JavaScript)', undefined],
  ])('H-2 a time that is %s passes', async (_label, t) => {
    const { deps, memory } = setup()
    await submitLead(valid({ t }), ME, deps)
    expect(memory.leads()).toHaveLength(1)
  })
})

describe('R: rate limits', () => {
  const email = (i: number) => `lidi${i}@domena.cz`

  it('R-1 the 6th request from one IP within the hour is limited; the next hour is free', async () => {
    const { deps, memory, at } = setup()
    for (let i = 1; i <= 5; i++) {
      const r = await submitLead(valid({ email: email(i) }), ME, deps)
      expect(r.status).toBe('ok')
    }
    at(new Date('2026-10-14T10:30:00Z'))
    const sixth = await submitLead(valid({ email: email(6) }), ME, deps)
    expect(sixth).toMatchObject({ status: 'limited' })
    if (sixth.status !== 'limited') throw new Error('unreachable')
    expect(sixth.retryAfterSeconds).toBeGreaterThan(0)
    expect(sixth.retryAfterSeconds).toBeLessThanOrEqual(3600)
    expect(memory.leads()).toHaveLength(5)

    at(new Date('2026-10-14T11:00:00Z'))
    expect(
      (await submitLead(valid({ email: email(7) }), ME, deps)).status,
    ).toBe('ok')
  })

  it('R-1 another IP is not affected', async () => {
    const { deps } = setup()
    for (let i = 1; i <= 6; i++) {
      await submitLead(valid({ email: email(i) }), ME, deps)
    }
    const other = await submitLead(
      valid({ email: email(9) }),
      from('198.51.100.9'),
      deps,
    )
    expect(other.status).toBe('ok')
  })

  it('R-2 the 4th request for one address within the day is limited; the next day is free', async () => {
    const { deps, at } = setup()
    for (let i = 1; i <= 3; i++) {
      const r = await submitLead(valid(), from(`198.51.100.${i}`), deps)
      expect(r.status).toBe('ok')
    }
    const fourth = await submitLead(valid(), from('198.51.100.4'), deps)
    expect(fourth.status).toBe('limited')

    at(new Date('2026-10-15T00:00:00Z'))
    expect((await submitLead(valid(), from('198.51.100.5'), deps)).status).toBe(
      'ok',
    )
  })

  it('R-2 the address is hashed in the key, never stored as it is', async () => {
    const { deps, memory } = setup()
    await submitLead(valid({ email: 'Tajny.Clovek@Domena.cz' }), ME, deps)
    const keys = memory.limiterWindows().map((w) => w.key)
    expect(keys.some((k) => k.startsWith('email:'))).toBe(true)
    expect(keys.some((k) => k.startsWith('ip:'))).toBe(true)
    for (const key of keys) {
      expect(key.toLowerCase()).not.toContain('tajny')
      expect(key).not.toContain(ME.ip)
    }
  })

  it("R-3 honeypot requests do not use up the visitor's quota", async () => {
    const { deps } = setup()
    for (let i = 0; i < 10; i++) {
      await submitLead(valid({ email: email(i), website: 'x' }), ME, deps)
    }
    expect((await submitLead(valid(), ME, deps)).status).toBe('ok')
  })

  it('R-4 the key changes with the day and the secret, and never holds the IP', () => {
    const day1 = new Date('2026-10-14T10:00:00Z')
    const day1Later = new Date('2026-10-14T23:59:59Z')
    const day2 = new Date('2026-10-15T00:00:01Z')
    const a = hashIp('203.0.113.7', SECRET, day1)
    expect(hashIp('203.0.113.7', SECRET, day1Later)).toBe(a)
    expect(hashIp('203.0.113.7', SECRET, day2)).not.toBe(a)
    expect(hashIp('203.0.113.8', SECRET, day1)).not.toBe(a)
    expect(
      hashIp('203.0.113.7', 'another-secret-of-32-bytes-at-least', day1),
    ).not.toBe(a)
    expect(a).toMatch(/^[0-9a-f]{64}$/)
    expect(a).not.toContain('203')
  })

  it('R-7 an invalid address still counts against the IP, not against any address', async () => {
    const { deps, memory } = setup()
    for (let i = 0; i < 5; i++) {
      const r = await submitLead(valid({ email: 'chyba' }), ME, deps)
      expect(r.status).toBe('invalid')
    }
    expect((await submitLead(valid(), ME, deps)).status).toBe('limited')
    expect(memory.limiterWindows().every((w) => w.key.startsWith('ip:'))).toBe(
      true,
    )
  })

  it('R-5 a failing limiter says error and stores nothing', async () => {
    const { deps, memory } = setup()
    deps.limiter = {
      ...memory.limiter,
      hit: async () => {
        throw new Error('down')
      },
    }
    const result = await submitLead(valid(), ME, deps)
    expect(result).toEqual({ status: 'error', email: 'jmeno@domena.cz' })
    expect(memory.leads()).toHaveLength(0)
  })

  it('R-6 the cleanup removes windows older than 2 days and keeps the rest', async () => {
    const { deps, memory, at } = setup()
    await submitLead(valid(), ME, deps)
    expect(memory.limiterWindows().length).toBeGreaterThan(0)
    at(new Date('2026-10-17T10:00:00Z'))
    await submitLead(valid({ email: 'nova@domena.cz' }), ME, deps)
    await purgeOldRateLimits(deps)
    const windows = memory.limiterWindows()
    expect(windows.length).toBeGreaterThan(0)
    for (const w of windows) {
      expect(w.windowStart.getTime()).toBeGreaterThanOrEqual(
        new Date('2026-10-15T10:00:00Z').getTime(),
      )
    }
  })
})

describe('T-1: the results token', () => {
  it('is 43 URL-safe characters (32 random bytes), different every time', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      const token = newToken()
      expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/)
      seen.add(token)
    }
    expect(seen.size).toBe(1000)
  })

  it('hashes to 64 hex characters, the same way every time, never to itself', () => {
    const token = newToken()
    expect(hashToken(token)).toMatch(/^[0-9a-f]{64}$/)
    expect(hashToken(token)).toBe(hashToken(token))
    expect(hashToken(token)).not.toBe(token)
    expect(hashToken(newToken())).not.toBe(hashToken(token))
  })

  it('is stored only as a hash, valid for 30 days', async () => {
    const { deps, memory } = setup()
    const result = await submitLead(valid(), ME, deps)
    const token = tokenOf(result)
    const [record] = memory.tokens()
    expect(record.tokenHash).toBe(hashToken(token))
    expect(record.leadId).toBe(memory.leads()[0].id)
    expect(record.expiresAt).toEqual(new Date('2026-11-13T10:00:00Z'))
    expect(
      JSON.stringify([
        memory.leads(),
        memory.tokens(),
        memory.limiterWindows(),
      ]),
    ).not.toContain(token)
  })
})

describe('the form field contract', () => {
  it('never throws, whatever the input is', async () => {
    const { deps } = setup()
    for (const input of [
      {},
      { email: {} },
      { email: 'jmeno@domena.cz', monthly: {}, years: [] },
      { email: 'jmeno@domena.cz', t: {}, website: 5 },
    ] as LeadInput[]) {
      await expect(submitLead(input, ME, deps)).resolves.toBeDefined()
    }
  })
})
