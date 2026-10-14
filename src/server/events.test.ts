import { describe, expect, it } from 'vitest'
import {
  parseEvent,
  recordEvent,
  validSessionId,
  type EventDeps,
} from './events'
import { createMemoryLeadStore } from './memory-store'
import { submitLead, type LeadDeps, type LeadInput } from './leads'

// Phase 5, PR 2: test cases E-1 to E-9 of docs/PHASE-5-PLAN.md. Ports are the
// in-memory ones and the clock is fixed.
const START = new Date('2026-10-14T10:00:00Z')
const SECRET = 'a-test-secret-of-at-least-32-bytes!!'
const SESSION = '3b1f1c0e-6a52-4c1c-9d5e-0f7a1b2c3d4e'

function setup() {
  const memory = createMemoryLeadStore()
  const deps: EventDeps = {
    events: memory.events,
    limiter: memory.limiter,
    now: () => START,
    secrets: { ipHash: SECRET },
  }
  return { memory, deps }
}

const body = (extra: Record<string, unknown> = {}) => ({
  sessionId: SESSION,
  name: 'page_view',
  variant: 'a',
  device: 'phone',
  inAppBrowser: false,
  measurement: false,
  ...extra,
})
const ME = { ip: '203.0.113.7' }

describe('E-1 the event shape', () => {
  it.each(['page_view', 'calc_start', 'gate_view', 'form_focus'])(
    'accepts %s',
    (name) => {
      expect(parseEvent(body({ name })).ok).toBe(true)
    },
  )

  it('accepts calc_result with a setup on the slider grid', () => {
    expect(
      parseEvent(body({ name: 'calc_result', monthly: 5000, years: 10 })).ok,
    ).toBe(true)
  })

  it.each([
    ['an unknown name', { name: 'purchase' }],
    ['the server-only name lead', { name: 'lead' }],
    ['an unknown property', { extra: 1 }],
    ['a string over 100 characters (cut, not rejected)', null],
    ['calc_result without a setup', { name: 'calc_result' }],
    [
      'an amount off the grid',
      { name: 'calc_result', monthly: 5001, years: 10 },
    ],
    ['years not 5, 10 or 20', { name: 'calc_result', monthly: 5000, years: 7 }],
    ['a setup on another event', { monthly: 5000, years: 10 }],
    ['an address in a campaign value', { utm_source: 'jan@domena.cz' }],
    ['a session id that is not a UUID', { sessionId: 'abc' }],
  ])('rejects %s', (label, extra) => {
    if (extra === null) {
      const parsed = parseEvent(body({ utm_source: 'x'.repeat(300) }))
      expect(parsed.ok && parsed.event.utm_source).toHaveLength(100)
      return
    }
    expect(parseEvent(body(extra)).ok).toBe(false)
  })
})

describe('E-2 variant and campaign values', () => {
  it('needs a variant a or b', () => {
    expect(parseEvent(body({ variant: 'c' })).ok).toBe(false)
  })

  it('trims a value, and a missing or empty one is null', () => {
    const parsed = parseEvent(body({ utm_source: '  ig  ', utm_medium: '  ' }))
    expect(parsed.ok && parsed.event.utm_source).toBe('ig')
    expect(parsed.ok && parsed.event.utm_medium).toBeNull()
    expect(parsed.ok && parsed.event.utm_term).toBeNull()
  })
})

describe('E-3 device and in-app browser', () => {
  it('device is phone or desktop only', () => {
    expect(parseEvent(body({ device: 'tablet' })).ok).toBe(false)
  })

  it('in-app browser must be a boolean, and no user agent is accepted', () => {
    expect(parseEvent(body({ inAppBrowser: 'yes' })).ok).toBe(false)
    expect(parseEvent(body({ userAgent: 'Mozilla/5.0' })).ok).toBe(false)
  })
})

describe('E-4 recording', () => {
  it('stores the row with the server time, the session and the consent flag', async () => {
    const { memory, deps } = setup()
    const result = await recordEvent(
      body({ measurement: true, createdAt: '1999-01-01T00:00:00Z' }),
      ME,
      deps,
    )
    // an unknown property (a time from the browser) is rejected, not read
    expect(result).toBe('invalid')
    expect(await recordEvent(body({ measurement: true }), ME, deps)).toBe('ok')
    expect(memory.eventRows()).toEqual([
      expect.objectContaining({
        createdAt: START,
        sessionId: SESSION,
        name: 'page_view',
        consentMeasurement: true,
      }),
    ])
  })
})

describe('E-5 repeats', () => {
  it('stores the same event twice when it is sent twice', async () => {
    const { memory, deps } = setup()
    await recordEvent(body(), ME, deps)
    await recordEvent(body(), ME, deps)
    expect(memory.eventRows()).toHaveLength(2)
  })

  it('validSessionId accepts a UUID and nothing else', () => {
    expect(validSessionId(SESSION)).toBe(SESSION)
    expect(validSessionId('nope')).toBeNull()
    expect(validSessionId(undefined)).toBeNull()
  })
})

describe('E-6 the rate limit', () => {
  it('lets 120 events an hour through and limits the 121st, keyed by a hash', async () => {
    const { memory, deps } = setup()
    for (let i = 0; i < 120; i += 1) {
      expect(await recordEvent(body(), ME, deps)).toBe('ok')
    }
    expect(await recordEvent(body(), ME, deps)).toBe('limited')
    expect(await recordEvent(body(), { ip: '203.0.113.8' }, deps)).toBe('ok')
    const keys = memory.limiterWindows().map((row) => row.key)
    expect(keys.every((key) => key.startsWith('event:'))).toBe(true)
    expect(keys.join()).not.toContain('203.0.113')
  })
})

describe('E-8 the click id', () => {
  it('is kept on page_view only', async () => {
    const { memory, deps } = setup()
    await recordEvent(body({ fbclid: 'abc' }), ME, deps)
    await recordEvent(body({ name: 'calc_start', fbclid: 'abc' }), ME, deps)
    const rows = memory.eventRows()
    expect(rows[0].fbclid).toBe('abc')
    expect(rows[1].fbclid).toBeNull()
  })
})

describe('E-7 and E-9 the server-side lead event and the session on the lead', () => {
  function leadSetup() {
    const memory = createMemoryLeadStore()
    const deps: LeadDeps = {
      store: memory.store,
      limiter: memory.limiter,
      events: memory.events,
      now: () => START,
      secrets: { ipHash: SECRET },
    }
    return { memory, deps }
  }
  const form = (extra: Partial<LeadInput> = {}): LeadInput => ({
    email: 'jmeno@domena.cz',
    monthly: '5000',
    years: '10',
    t: '5000',
    website: '',
    variant: 'b',
    utm_source: 'ig',
    ...extra,
  })

  it('writes one lead event for a new address and none for a repeat', async () => {
    const { memory, deps } = leadSetup()
    await submitLead(form(), ME, deps)
    await submitLead(form(), ME, deps)
    const rows = memory.eventRows().filter((row) => row.name === 'lead')
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      variant: 'b',
      utmSource: 'ig',
      fbclid: null,
    })
  })

  it('does not fail the lead when the event cannot be written', async () => {
    const { memory, deps } = leadSetup()
    deps.events = {
      add: async () => {
        throw new Error('down')
      },
    }
    const result = await submitLead(form(), ME, deps)
    expect(result.status).toBe('ok')
    expect(memory.leads()).toHaveLength(1)
  })

  it('stores the session id on the lead and the event when one is sent', async () => {
    const { memory, deps } = leadSetup()
    await submitLead(form({ sid: SESSION }), ME, deps)
    expect(memory.leads()[0].sessionId).toBe(SESSION)
    expect(memory.eventRows()[0]).toMatchObject({
      sessionId: SESSION,
      consentMeasurement: true,
    })
  })

  it('stores no session id when none or a bad one is sent', async () => {
    const { memory, deps } = leadSetup()
    await submitLead(form({ email: 'a@domena.cz' }), ME, deps)
    await submitLead(form({ email: 'b@domena.cz', sid: 'junk' }), ME, deps)
    expect(memory.leads().map((lead) => lead.sessionId)).toEqual([null, null])
    expect(memory.eventRows().every((row) => row.sessionId === null)).toBe(true)
  })
})
