import { describe, expect, it, vi } from 'vitest'
import { leadEnv, metaServerEnv, trackingEnv } from './env'

const secret = 's'.repeat(32)

describe('leadEnv', () => {
  it('reads the Supabase settings by default', () => {
    expect(
      leadEnv({
        SUPABASE_URL: 'https://abc.supabase.co',
        SUPABASE_SECRET_KEY: 'sb_secret_x',
        IP_HASH_SECRET: secret,
        TOKEN_SIGNING_SECRET: 't'.repeat(32),
        SITE_URL: 'https://kompas.test',
        RESEND_API_KEY: 're_x',
        EMAIL_FROM: 'ETF Kompas <kompas@send.example.cz>',
        EMAIL_SANDBOX_ALLOWLIST: 'a@b.cz, C@d.cz',
        EMAIL_REPLY_TO: '',
      }),
    ).toMatchObject({
      LEAD_STORE: 'supabase',
      SUPABASE_URL: 'https://abc.supabase.co',
      EMAIL_MODE: 'sandbox',
      EMAIL_SANDBOX_ALLOWLIST: ['a@b.cz', 'C@d.cz'],
      EMAIL_REPLY_TO: undefined,
    })
  })

  it('keeps a domain entry of the allowlist as written', () => {
    expect(
      leadEnv({
        LEAD_STORE: 'memory',
        EMAIL_SANDBOX_ALLOWLIST: 'a@b.cz, @clientelo.cz',
      }),
    ).toMatchObject({ EMAIL_SANDBOX_ALLOWLIST: ['a@b.cz', '@clientelo.cz'] })
  })

  it('needs nothing else for the memory store', () => {
    expect(leadEnv({ LEAD_STORE: 'memory' })).toMatchObject({
      LEAD_STORE: 'memory',
    })
  })

  it('names the missing variables and shows no value', () => {
    const attempt = () =>
      leadEnv({
        SUPABASE_URL: 'not-a-url-with-a-secret-inside',
        IP_HASH_SECRET: 'short',
      })
    expect(attempt).toThrow(/SUPABASE_URL/)
    expect(attempt).toThrow(/SUPABASE_SECRET_KEY/)
    expect(attempt).toThrow(/IP_HASH_SECRET/)
    expect(attempt).not.toThrow(/secret-inside|short/)
  })
})

describe('trackingEnv', () => {
  it('V-1 both ids are optional', () => {
    expect(trackingEnv({})).toEqual({ ga4: null, pixel: null })
    expect(
      trackingEnv({ GA4_MEASUREMENT_ID: '', META_PIXEL_ID: '  ' }),
    ).toEqual({
      ga4: null,
      pixel: null,
    })
  })

  it('V-1 a valid G- id and a numeric pixel id pass', () => {
    expect(
      trackingEnv({
        GA4_MEASUREMENT_ID: 'G-ABCDE12345',
        META_PIXEL_ID: '1234567890',
      }),
    ).toEqual({ ga4: 'G-ABCDE12345', pixel: '1234567890' })
  })

  it('V-1 a malformed id is dropped with a warning that names the variable, never the value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const ids = trackingEnv({
      GA4_MEASUREMENT_ID: 'UA-1 <b>',
      META_PIXEL_ID: 'pixel-id',
    })
    expect(ids).toEqual({ ga4: null, pixel: null })
    const text = JSON.stringify(warn.mock.calls)
    expect(text).toContain('GA4_MEASUREMENT_ID')
    expect(text).toContain('META_PIXEL_ID')
    expect(text).not.toContain('<b>')
    expect(text).not.toContain('pixel-id')
    warn.mockRestore()
  })
})

describe('metaServerEnv', () => {
  const all = {
    META_PIXEL_ID: '1234567890',
    META_CAPI_TOKEN: 'tok-secret',
    META_GRAPH_VERSION: 'v0.0',
  }

  it('is off when nothing is set, and on when the three are', () => {
    expect(metaServerEnv({})).toBeNull()
    expect(metaServerEnv(all)).toEqual({
      pixelId: '1234567890',
      token: 'tok-secret',
      version: 'v0.0',
      base: 'https://graph.facebook.com',
      testEventCode: null,
    })
  })

  it('V-2 two of three count as off, with a warning that names the variable and not a value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(metaServerEnv({ ...all, META_GRAPH_VERSION: undefined })).toBeNull()
    expect(metaServerEnv({ ...all, META_CAPI_TOKEN: '' })).toBeNull()
    const text = JSON.stringify(warn.mock.calls)
    expect(text).toContain('META_GRAPH_VERSION')
    expect(text).toContain('META_CAPI_TOKEN')
    expect(text).not.toContain('tok-secret')
    warn.mockRestore()
  })

  it('C-7 META_GRAPH_BASE is honoured only with the in-memory store', () => {
    const stub = 'http://localhost:3100/api/test-capi'
    expect(metaServerEnv({ ...all, META_GRAPH_BASE: stub })?.base).toBe(
      'https://graph.facebook.com',
    )
    expect(
      metaServerEnv({ ...all, META_GRAPH_BASE: stub, LEAD_STORE: 'memory' })
        ?.base,
    ).toBe(stub)
  })

  // Phase 6: an optional Test Events code, so server events show up in Meta's Test
  // Events tool and not in the real dataset (cases T-1 to T-5, written first).
  describe('the Test Events code', () => {
    it('T-1 is null by default and when empty, with no warning', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      expect(metaServerEnv(all)?.testEventCode).toBeNull()
      expect(
        metaServerEnv({ ...all, META_TEST_EVENT_CODE: '' })?.testEventCode,
      ).toBeNull()
      expect(warn).not.toHaveBeenCalled()
      warn.mockRestore()
    })

    it('T-2 is read, trimmed, from META_TEST_EVENT_CODE', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      expect(
        metaServerEnv({ ...all, META_TEST_EVENT_CODE: ' TEST15906 ' })
          ?.testEventCode,
      ).toBe('TEST15906')
      warn.mockRestore()
    })

    it('T-3 a code that is not letters and digits is ignored, the API stays on, and the warning names the variable and not the value', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      for (const bad of ['TE ST', 'TEST-1;DROP', 'x'.repeat(40), 'ab']) {
        const config = metaServerEnv({ ...all, META_TEST_EVENT_CODE: bad })
        expect(config?.testEventCode).toBeNull()
        expect(config?.token).toBe('tok-secret')
      }
      const text = JSON.stringify(warn.mock.calls)
      expect(text).toContain('META_TEST_EVENT_CODE')
      expect(text).not.toContain('DROP')
      warn.mockRestore()
    })

    it('T-4 a valid code warns that events go to Test Events only, without showing it', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      metaServerEnv({ ...all, META_TEST_EVENT_CODE: 'TEST15906' })
      const text = JSON.stringify(warn.mock.calls)
      expect(text).toContain('META_TEST_EVENT_CODE')
      expect(text).toMatch(/Test Events/)
      expect(text).not.toContain('TEST15906')
      warn.mockRestore()
    })

    it('T-5 a code alone does not switch the API on', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      expect(metaServerEnv({ META_TEST_EVENT_CODE: 'TEST15906' })).toBeNull()
      warn.mockRestore()
    })
  })
})
