import { afterEach, describe, expect, it, vi } from 'vitest'
import type { LeadRecord } from './lead-ports'
import { createSupabaseStore } from './supabase-store'

const config = { url: 'https://abc.supabase.co/', secretKey: 'sb_secret_x' }

const lead: LeadRecord = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'jmeno@domena.cz',
  createdAt: new Date('2026-10-14T10:00:00Z'),
  utmSource: 'ig',
  utmMedium: null,
  utmCampaign: null,
  utmContent: null,
  utmTerm: null,
  fbclid: null,
  variant: 'b',
  calcMonthly: 5000,
  calcYears: 10,
  sessionId: null,
  marketingConsent: true,
  consentTextVersion: 'v1',
  consentConfirmedAt: null,
  optinSentAt: null,
  emailStatus: 'queued',
  unsubscribedAt: null,
  deletedAt: null,
}

function stubFetch(body: unknown, ok = true, status = 200) {
  const spy = vi.fn<typeof fetch>(
    async () => ({ ok, status, json: async () => body }) as Response,
  )
  vi.stubGlobal('fetch', spy)
  return spy
}

afterEach(() => vi.unstubAllGlobals())

// The first call: its address and its options (never undefined).
function firstCall(spy: ReturnType<typeof stubFetch>): {
  url: string
  init: RequestInit
} {
  const [url, init] = spy.mock.calls[0]
  return { url: String(url), init: init ?? {} }
}

describe('createSupabaseStore', () => {
  it('saves a lead as a snake_case row, merging on id, with the key in apikey only', async () => {
    const fetchSpy = stubFetch(null)
    await createSupabaseStore(config).store.save(lead)
    const [url, init] = fetchSpy.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ]
    expect(url).toBe('https://abc.supabase.co/rest/v1/leads?on_conflict=id')
    expect(init.method).toBe('POST')
    const headers = init.headers as Record<string, string>
    expect(headers.apikey).toBe('sb_secret_x')
    expect(headers.Authorization).toBeUndefined()
    expect(headers.Prefer).toContain('merge-duplicates')
    expect(JSON.parse(init.body as string)).toMatchObject({
      id: lead.id,
      calc_monthly_bucket: 5000,
      calc_years: 10,
      marketing_consent: true,
      created_at: '2026-10-14T10:00:00.000Z',
      deleted_at: null,
    })
  })

  it('sends a legacy JWT key as a bearer token too', async () => {
    const fetchSpy = stubFetch(null)
    await createSupabaseStore({ ...config, secretKey: 'eyJabc' }).store.save(
      lead,
    )
    const { init } = firstCall(fetchSpy)
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer eyJabc',
    )
  })

  it('finds a lead by e-mail and maps the row back, or gives null', async () => {
    const { store } = createSupabaseStore(config)
    stubFetch([
      {
        id: lead.id,
        email: lead.email,
        created_at: '2026-10-14T10:00:00+00:00',
        utm_source: 'ig',
        utm_medium: null,
        utm_campaign: null,
        utm_content: null,
        utm_term: null,
        fbclid: null,
        variant: 'b',
        calc_monthly_bucket: 5000,
        calc_years: 10,
        session_id: null,
        marketing_consent: true,
        consent_text_version: 'v1',
        consent_confirmed_at: null,
        optin_sent_at: null,
        email_status: 'queued',
        unsubscribed_at: null,
        deleted_at: null,
      },
    ])
    await expect(store.findByEmail('jmeno@domena.cz')).resolves.toEqual(lead)
    stubFetch([])
    await expect(store.findByEmail('nikdo@domena.cz')).resolves.toBeNull()
  })

  it('encodes the e-mail in the query', async () => {
    const fetchSpy = stubFetch([])
    await createSupabaseStore(config).store.findByEmail('a+b@domena.cz')
    expect(fetchSpy.mock.calls[0][0]).toContain('email=eq.a%2Bb%40domena.cz')
  })

  it('stores a token as its hash row', async () => {
    const fetchSpy = stubFetch(null)
    await createSupabaseStore(config).store.addToken({
      tokenHash: 'abc',
      leadId: lead.id,
      createdAt: new Date('2026-10-14T10:00:00Z'),
      expiresAt: new Date('2026-11-13T10:00:00Z'),
    })
    const { init } = firstCall(fetchSpy)
    expect(JSON.parse(init.body as string)).toEqual({
      token_hash: 'abc',
      lead_id: lead.id,
      created_at: '2026-10-14T10:00:00.000Z',
      expires_at: '2026-11-13T10:00:00.000Z',
    })
  })

  it('finds a token by its hash and a lead by its id', async () => {
    const { store } = createSupabaseStore(config)
    const spy = stubFetch([
      {
        token_hash: 'abc',
        lead_id: lead.id,
        created_at: '2026-10-14T10:00:00+00:00',
        expires_at: '2026-11-13T10:00:00+00:00',
      },
    ])
    await expect(store.findToken('abc')).resolves.toEqual({
      tokenHash: 'abc',
      leadId: lead.id,
      createdAt: new Date('2026-10-14T10:00:00Z'),
      expiresAt: new Date('2026-11-13T10:00:00Z'),
    })
    expect(firstCall(spy).url).toContain('/result_tokens?token_hash=eq.abc')
    stubFetch([])
    await expect(store.findToken('zzz')).resolves.toBeNull()
    const byId = stubFetch([])
    await expect(store.findById(lead.id)).resolves.toBeNull()
    expect(firstCall(byId).url).toContain(`/leads?id=eq.${lead.id}`)
  })

  it('counts a hit through the rpc and reads the answer', async () => {
    const { limiter } = createSupabaseStore(config)
    const fetchSpy = stubFetch(true)
    await expect(
      limiter.hit('ip:x', new Date('2026-10-14T10:00:00Z'), 5),
    ).resolves.toBe(true)
    expect(fetchSpy.mock.calls[0][0]).toBe(
      'https://abc.supabase.co/rest/v1/rpc/rate_limit_hit',
    )
    const { init } = firstCall(fetchSpy)
    expect(JSON.parse(init.body as string)).toEqual({
      p_key: 'ip:x',
      p_window_start: '2026-10-14T10:00:00.000Z',
      p_limit: 5,
    })
    stubFetch(false)
    await expect(limiter.hit('ip:x', new Date(), 5)).resolves.toBe(false)
  })

  it('purges old windows by date', async () => {
    const fetchSpy = stubFetch(null)
    await createSupabaseStore(config).limiter.purgeBefore(
      new Date('2026-10-12T10:00:00Z'),
    )
    const [url, init] = fetchSpy.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ]
    expect(url).toContain(
      '/rate_limits?window_start=lt.2026-10-12T10%3A00%3A00.000Z',
    )
    expect(init.method).toBe('DELETE')
  })

  it('throws on an error answer, with the status and no data in the message', async () => {
    stubFetch({ message: 'jmeno@domena.cz exists' }, false, 409)
    const failure = createSupabaseStore(config).store.save(lead)
    await expect(failure).rejects.toThrow('409')
    await expect(failure).rejects.not.toThrow('jmeno')
  })
})

describe('the events adapter', () => {
  it('posts one row with snake_case columns and no personal data', async () => {
    const { events } = createSupabaseStore(config)
    const spy = stubFetch(null, true, 201)
    await events.add({
      id: '22222222-2222-4222-8222-222222222222',
      createdAt: new Date('2026-10-14T10:00:00Z'),
      sessionId: '33333333-3333-4333-8333-333333333333',
      name: 'calc_result',
      variant: 'a',
      utmSource: 'ig',
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
      fbclid: null,
      device: 'phone',
      inAppBrowser: true,
      consentMeasurement: false,
      calcMonthly: 5000,
      calcYears: 10,
    })
    const [url, init] = spy.mock.calls[0]
    expect(String(url)).toBe('https://abc.supabase.co/rest/v1/events')
    expect(JSON.parse(String(init?.body))).toMatchObject({
      session_id: '33333333-3333-4333-8333-333333333333',
      name: 'calc_result',
      in_app_browser: true,
      consent_measurement: false,
      calc_monthly_bucket: 5000,
      calc_years: 10,
    })
  })

  describe('retention (Phase 6, PR 2: cases SB-1 and SB-2)', () => {
    const lead1 = '11111111-1111-4111-8111-111111111111'
    const countHeader = (total: number) =>
      new Headers({ 'content-range': `*/${total}` })

    function stubCounted(total: number, ok = true, status = 200) {
      const spy = vi.fn<typeof fetch>(
        async () =>
          ({
            ok,
            status,
            headers: countHeader(total),
            json: async () => [],
          }) as Response,
      )
      vi.stubGlobal('fetch', spy)
      return spy
    }

    it('SB-1 deletes one lead by id (the tokens cascade in the database)', async () => {
      const spy = stubFetch([])
      await createSupabaseStore(config).retention.deleteLead(lead1)
      const { url, init } = firstCall(spy)
      expect(url).toBe(`https://abc.supabase.co/rest/v1/leads?id=eq.${lead1}`)
      expect(init.method).toBe('DELETE')
    })

    it('SB-1 deletes events by session ids with an in filter and returns the count', async () => {
      const spy = stubCounted(3)
      const count = await createSupabaseStore(
        config,
      ).retention.deleteEventsBySession(['s-1', 's-2'])
      const { url, init } = firstCall(spy)
      expect(url).toContain('/events?session_id=in.(s-1,s-2)')
      expect(init.method).toBe('DELETE')
      expect(count).toBe(3)
    })

    it('SB-1 deletes nothing, and sends nothing, for an empty list of sessions', async () => {
      const spy = stubCounted(0)
      expect(
        await createSupabaseStore(config).retention.deleteEventsBySession([]),
      ).toBe(0)
      expect(spy).not.toHaveBeenCalled()
    })

    it('SB-1 deletes events older than a date with an lt filter on created_at', async () => {
      const spy = stubCounted(2)
      const count = await createSupabaseStore(
        config,
      ).retention.deleteEventsBefore(new Date('2026-04-14T12:00:00Z'))
      expect(firstCall(spy).url).toContain(
        '/events?created_at=lt.2026-04-14T12%3A00%3A00.000Z',
      )
      expect(count).toBe(2)
    })

    it('SB-1 lists candidates created before one date or unsubscribed before another', async () => {
      const spy = stubFetch([])
      await createSupabaseStore(config).retention.dueCandidates(
        new Date('2026-04-14T12:00:00Z'),
        new Date('2026-09-14T12:00:00Z'),
      )
      const { url } = firstCall(spy)
      expect(url).toContain('/leads?')
      expect(url).toContain('or=(created_at.lt.')
      expect(url).toContain('unsubscribed_at.lt.')
    })

    it('SB-1 counts the rate-limit rows it removes', async () => {
      const spy = stubCounted(4)
      expect(
        await createSupabaseStore(config).limiter.purgeBefore(
          new Date('2026-10-12T12:00:00Z'),
        ),
      ).toBe(4)
      expect(firstCall(spy).url).toContain('/rate_limits?window_start=lt.')
    })

    it('SB-2 an error answer is thrown with the status only, so the service can count it', async () => {
      stubCounted(0, false, 500)
      await expect(
        createSupabaseStore(config).retention.deleteEventsBefore(new Date()),
      ).rejects.toThrow('500')
    })
  })
})
