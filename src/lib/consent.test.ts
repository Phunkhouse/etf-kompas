import { describe, expect, it } from 'vitest'
import { CONSENT_COOKIE, CONSENT_VERSION, parseConsent } from './consent'

const cookie = (value: string) => `${CONSENT_COOKIE}=${value}`

describe('parseConsent', () => {
  it('returns null when there is no choice yet', () => {
    expect(parseConsent('')).toBeNull()
    expect(parseConsent('theme=dark; other=1')).toBeNull()
  })

  it('reads the choice among other cookies', () => {
    const header = `a=1; ${cookie(`v${CONSENT_VERSION}-m1-a0-1760000000`)}; b=2`
    expect(parseConsent(header)).toEqual({
      version: CONSENT_VERSION,
      measurement: true,
      advertising: false,
      decidedAt: 1760000000,
    })
  })

  it('treats a damaged value as no choice', () => {
    expect(parseConsent(cookie('garbage'))).toBeNull()
    expect(parseConsent(cookie(`v${CONSENT_VERSION}-m2-a0-1`))).toBeNull()
  })

  it('treats a choice for an older policy version as no choice', () => {
    expect(parseConsent(cookie('v0-m1-a1-1760000000'))).toBeNull()
  })
})
