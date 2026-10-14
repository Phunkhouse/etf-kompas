import { describe, expect, it, vi } from 'vitest'
import { leadEnv, trackingEnv } from './env'

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
