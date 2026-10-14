// The visitor's cookie choice. Stored in one first-party cookie that is itself an
// essential cookie (it only remembers the choice). Format: `v1-m0-a1-1760000000`
// = policy version, measurement, advertising, time of the choice (Unix seconds).
// The browser script in `consent-client.ts` writes it; this file reads it, for the
// server and for `track()`. A test keeps both in step.
export const CONSENT_COOKIE = 'kompas_consent'
// Raise it when the cookie categories change: everyone is asked again.
export const CONSENT_VERSION = 1
// TODO_VERIFY: how long a choice is kept (legal). Six months until then.
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180

export type Consent = {
  version: number
  measurement: boolean
  advertising: boolean
  // Unix seconds
  decidedAt: number
}

const VALUE = /^v(\d+)-m([01])-a([01])-(\d+)$/

// Reads a `Cookie` header or `document.cookie`. Returns null when there is no
// choice yet, the value is damaged, or it belongs to an older policy version.
export function parseConsent(cookies: string): Consent | null {
  for (const part of cookies.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name !== CONSENT_COOKIE) continue
    const match = VALUE.exec(rest.join('='))
    if (!match) return null
    const consent = {
      version: Number(match[1]),
      measurement: match[2] === '1',
      advertising: match[3] === '1',
      decidedAt: Number(match[4]),
    }
    return consent.version === CONSENT_VERSION ? consent : null
  }
  return null
}
