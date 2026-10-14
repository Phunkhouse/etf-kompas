import { describe, expect, it, vi } from 'vitest'
import {
  buildLeadRequest,
  sendLeadToMeta,
  sha256,
  type CapiConfig,
  type CapiLead,
} from './capi'
import { createMemoryLeadStore } from './memory-store'
import { submitLead, type LeadDeps, type LeadInput } from './leads'

// Phase 5, PR 4: cases L-1, L-2, C-1 to C-6 of docs/PHASE-5-PLAN.md. The fetch is a
// spy and the clock is fixed: nothing leaves the machine.
const START = new Date('2026-10-14T10:00:00Z')
const SECRET = 'a-test-secret-of-at-least-32-bytes!!'
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const CONFIG: CapiConfig = {
  pixelId: '1234567890',
  token: 'secret-token-xyz',
  version: 'v0.0',
  base: 'https://graph.example.test',
  siteUrl: 'https://kompas.example.test',
}

function setup(capi: CapiConfig | null = CONFIG) {
  const memory = createMemoryLeadStore()
  const tasks: (() => Promise<void>)[] = []
  const deps: LeadDeps = {
    store: memory.store,
    limiter: memory.limiter,
    events: memory.events,
    capi: capi ?? undefined,
    afterResponse: (task) => tasks.push(task),
    now: () => START,
    secrets: { ipHash: SECRET },
  }
  return { memory, deps, tasks }
}
const form = (extra: Partial<LeadInput> = {}): LeadInput => ({
  email: ' Jmeno@Domena.cz ',
  monthly: '5000',
  years: '10',
  t: '5000',
  website: '',
  ads: '1',
  fbclid: 'abc123',
  ...extra,
})
const REQUEST = { ip: '203.0.113.7', userAgent: 'Mozilla/5.0 Test' }

describe('L: the event id of a lead', () => {
  it('L-1 a new lead has an id equal to its stored lead event; a repeat has null; a bot has null', async () => {
    const { memory, deps } = setup()
    const first = await submitLead(form(), REQUEST, deps)
    const second = await submitLead(form(), REQUEST, deps)
    const bot = await submitLead(
      form({ website: 'x', email: 'bot@domena.cz' }),
      REQUEST,
      deps,
    )
    expect(first.status === 'ok' && first.eventId).toMatch(UUID)
    expect(second.status === 'ok' && second.eventId).toBeNull()
    expect(bot.status === 'ok' && bot.eventId).toBeNull()
    const events = memory.eventRows().filter((row) => row.name === 'lead')
    expect(events).toHaveLength(1)
    expect(events[0].id).toBe(first.status === 'ok' ? first.eventId : null)
  })

  it('L-2 the id is the same in the state, the event row and the Meta body', async () => {
    const { memory, deps, tasks } = setup()
    const spy = vi.fn<typeof fetch>(async () => new Response('{}'))
    vi.stubGlobal('fetch', spy)
    const state = await submitLead(form(), REQUEST, deps)
    await tasks[0]()
    vi.unstubAllGlobals()
    const id = state.status === 'ok' ? state.eventId : null
    expect(id).toMatch(UUID)
    expect(memory.eventRows()[0].id).toBe(id)
    const body = JSON.parse(String(spy.mock.calls[0][1]?.body))
    expect(body.data[0].event_id).toBe(id)
  })
})

describe('C: the Meta Conversions API request', () => {
  const lead: CapiLead = {
    eventId: '3b1f1c0e-6a52-4c1c-9d5e-0f7a1b2c3d4e',
    email: ' Jmeno@Domena.cz ',
    time: START,
    ip: '203.0.113.7',
    userAgent: 'Mozilla/5.0 Test',
    fbclid: 'abc123',
    fbp: 'fb.1.1.2',
  }

  it('C-1 builds the url and body from the documented fields, with the e-mail only hashed', () => {
    const { url, body } = buildLeadRequest(CONFIG, lead)
    expect(url).toBe('https://graph.example.test/v0.0/1234567890/events')
    const event = (body as { data: Record<string, unknown>[] }).data[0]
    expect(event).toMatchObject({
      event_name: 'Lead',
      event_id: lead.eventId,
      event_time: Math.floor(START.getTime() / 1000),
      action_source: 'website',
      event_source_url: 'https://kompas.example.test',
    })
    expect((event.user_data as { em: string[] }).em).toEqual([
      sha256('jmeno@domena.cz'),
    ])
    expect(JSON.stringify(body)).not.toMatch(/jmeno@domena/i)
  })

  it('C-3 the IP and the user agent are in the user data', () => {
    const { body } = buildLeadRequest(CONFIG, lead)
    expect(
      (body as { data: { user_data: object }[] }).data[0].user_data,
    ).toMatchObject({
      client_ip_address: '203.0.113.7',
      client_user_agent: 'Mozilla/5.0 Test',
    })
  })

  it('C-4 fbc only with a click id, fbp only when sent', () => {
    const none = buildLeadRequest(CONFIG, { ...lead, fbclid: null, fbp: null })
    const user = (
      none.body as { data: { user_data: Record<string, unknown> }[] }
    ).data[0].user_data
    expect(user).not.toHaveProperty('fbc')
    expect(user).not.toHaveProperty('fbp')
    const some = buildLeadRequest(CONFIG, lead)
    const full = (
      some.body as { data: { user_data: Record<string, unknown> }[] }
    ).data[0].user_data
    expect(full.fbc).toBe(`fb.1.${START.getTime()}.abc123`)
    expect(full.fbp).toBe('fb.1.1.2')
  })

  it('C-2 sends one request for a new lead with advertising consent', async () => {
    const { deps, tasks } = setup()
    const spy = vi.fn<typeof fetch>(async () => new Response('{}'))
    vi.stubGlobal('fetch', spy)
    await submitLead(form({ fbp: 'fb.1.1.2' }), REQUEST, deps)
    expect(spy).not.toHaveBeenCalled() // C-6: nothing before the answer has gone out
    expect(tasks).toHaveLength(1)
    await tasks[0]()
    vi.unstubAllGlobals()
    expect(spy).toHaveBeenCalledTimes(1)
    const body = JSON.parse(String(spy.mock.calls[0][1]?.body))
    expect(body.data[0].user_data.fbp).toBe('fb.1.1.2')
    expect(body.access_token).toBe('secret-token-xyz')
  })

  it.each([
    ['ads is not "1"', { ads: 'on' }, CONFIG],
    ['ads is missing', { ads: undefined }, CONFIG],
    ['it is not configured', {}, null],
    ['the submit is a bot', { website: 'x' }, CONFIG],
  ])('C-2 sends nothing when %s', async (_label, extra, capi) => {
    const { deps, tasks } = setup(capi)
    await submitLead(form(extra), REQUEST, deps)
    expect(tasks).toHaveLength(0)
  })

  it('C-2 sends nothing for a repeat of the same address', async () => {
    const { deps, tasks } = setup()
    await submitLead(form(), REQUEST, deps)
    await submitLead(form(), REQUEST, deps)
    expect(tasks).toHaveLength(1)
  })
})

describe('C-5 a failing call', () => {
  const lead: CapiLead = {
    eventId: '3b1f1c0e-6a52-4c1c-9d5e-0f7a1b2c3d4e',
    email: 'jmeno@domena.cz',
    time: START,
    ip: '203.0.113.7',
    userAgent: null,
    fbclid: null,
    fbp: null,
  }

  it('does not throw and logs neither the e-mail, the token nor the response body', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    for (const fail of [
      async () =>
        new Response('jmeno@domena.cz secret-token-xyz', { status: 500 }),
      async () => {
        throw new TypeError(
          'connect ECONNREFUSED jmeno@domena.cz secret-token-xyz',
        )
      },
    ]) {
      await expect(
        sendLeadToMeta(CONFIG, lead, fail as unknown as typeof fetch),
      ).resolves.toBeUndefined()
    }
    const text = JSON.stringify(log.mock.calls)
    expect(log).toHaveBeenCalledTimes(2)
    expect(text).not.toContain('jmeno@domena.cz')
    expect(text).not.toContain('secret-token-xyz')
    log.mockRestore()
  })

  it('is given a three-second timeout', async () => {
    const spy = vi.fn<typeof fetch>(async () => new Response('{}'))
    await sendLeadToMeta(CONFIG, lead, spy)
    expect(spy.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal)
  })

  it('does not change the returned state when the call fails', async () => {
    const { deps, tasks } = setup()
    const state = await submitLead(form(), REQUEST, deps)
    expect(state.status).toBe('ok')
    vi.stubGlobal('fetch', async () => {
      throw new Error('down')
    })
    vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(tasks[0]()).resolves.toBeUndefined()
    vi.unstubAllGlobals()
  })
})

// Phase 6: the optional Test Events code (cases T-6 to T-8, written first). With a code the
// call goes to Meta's Test Events tool and not to the real dataset, so it must be absent
// from the body in production.
describe('T: the test_event_code in the request', () => {
  const lead: CapiLead = {
    eventId: '3b1f1c0e-6a52-4c1c-9d5e-0f7a1b2c3d4e',
    email: 'jmeno@domena.cz',
    time: START,
    ip: '203.0.113.7',
    userAgent: 'Mozilla/5.0 Test',
    fbclid: 'abc123',
    fbp: null,
  }

  it('T-6 the body has test_event_code next to data when a code is set, and not otherwise', () => {
    const withCode = buildLeadRequest(
      { ...CONFIG, testEventCode: 'TEST15906' },
      lead,
    ).body as Record<string, unknown>
    expect(withCode.test_event_code).toBe('TEST15906')
    expect(Object.keys(withCode).sort()).toEqual([
      'access_token',
      'data',
      'test_event_code',
    ])
    for (const none of [undefined, null]) {
      const body = buildLeadRequest({ ...CONFIG, testEventCode: none }, lead)
        .body as Record<string, unknown>
      expect('test_event_code' in body).toBe(false)
    }
  })

  it('T-7 the code is in the body only, never in the address', () => {
    const { url } = buildLeadRequest(
      { ...CONFIG, testEventCode: 'TEST15906' },
      lead,
    )
    expect(url).not.toContain('TEST15906')
  })

  it('T-8 the code is sent through a real submit, and a failure does not log it', async () => {
    const { deps, tasks } = setup({ ...CONFIG, testEventCode: 'TEST15906' })
    const spy = vi.fn<typeof fetch>(
      async () => new Response('{}', { status: 500 }),
    )
    vi.stubGlobal('fetch', spy)
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    await submitLead(form(), REQUEST, deps)
    await tasks[0]()
    vi.unstubAllGlobals()
    const body = JSON.parse(String(spy.mock.calls[0][1]?.body))
    expect(body.test_event_code).toBe('TEST15906')
    expect(JSON.stringify(error.mock.calls)).not.toContain('TEST15906')
    error.mockRestore()
  })
})
