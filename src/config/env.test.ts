import { describe, expect, it } from 'vitest'
import { leadEnv } from './env'

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
