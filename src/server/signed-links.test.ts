import { describe, expect, it } from 'vitest'
import { signLink, verifyLink } from './signed-links'

// Phase 4, PR 4: test case T-3 of docs/PHASE-4-PLAN.md. Links in e-mails (opt-in and
// unsubscribe) are signed, so nobody can make one up. Written first.
const SECRET = 'a-link-secret-of-at-least-32-bytes!!!'
const NOW = new Date('2026-10-14T10:00:00Z')
const DAY = 86_400_000
const LEAD = '11111111-1111-4111-8111-111111111111'

describe('signLink and verifyLink', () => {
  it('makes a URL-safe token that verifies for its lead and purpose', () => {
    const token = signLink(
      {
        purpose: 'optin',
        leadId: LEAD,
        expiresAt: new Date(NOW.getTime() + DAY),
      },
      SECRET,
    )
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
    expect(verifyLink(token, 'optin', SECRET, NOW)).toEqual({
      ok: true,
      leadId: LEAD,
    })
  })

  it('works one second before the expiry and not at the expiry', () => {
    const expiresAt = new Date(NOW.getTime() + 7 * DAY)
    const token = signLink(
      { purpose: 'optin', leadId: LEAD, expiresAt },
      SECRET,
    )
    expect(
      verifyLink(token, 'optin', SECRET, new Date(expiresAt.getTime() - 1000))
        .ok,
    ).toBe(true)
    expect(verifyLink(token, 'optin', SECRET, expiresAt)).toEqual({ ok: false })
  })

  it('has no expiry for the unsubscribe link, even years later', () => {
    const token = signLink({ purpose: 'unsubscribe', leadId: LEAD }, SECRET)
    const later = new Date('2031-01-01T00:00:00Z')
    expect(verifyLink(token, 'unsubscribe', SECRET, later)).toEqual({
      ok: true,
      leadId: LEAD,
    })
  })

  it('rejects an opt-in link used as unsubscribe, and the other way round', () => {
    const optin = signLink(
      {
        purpose: 'optin',
        leadId: LEAD,
        expiresAt: new Date(NOW.getTime() + DAY),
      },
      SECRET,
    )
    const unsub = signLink({ purpose: 'unsubscribe', leadId: LEAD }, SECRET)
    expect(verifyLink(optin, 'unsubscribe', SECRET, NOW)).toEqual({ ok: false })
    expect(verifyLink(unsub, 'optin', SECRET, NOW)).toEqual({ ok: false })
  })

  it('rejects a link signed with another secret', () => {
    const token = signLink({ purpose: 'unsubscribe', leadId: LEAD }, SECRET)
    expect(
      verifyLink(
        token,
        'unsubscribe',
        'another-secret-of-32-bytes-at-least!',
        NOW,
      ),
    ).toEqual({ ok: false })
  })

  it('rejects a token with one character changed, in the payload or in the signature', () => {
    const token = signLink({ purpose: 'unsubscribe', leadId: LEAD }, SECRET)
    const [payload, signature] = token.split('.')
    const flip = (text: string) => (text[0] === 'A' ? 'B' : 'A') + text.slice(1)
    expect(
      verifyLink(`${flip(payload)}.${signature}`, 'unsubscribe', SECRET, NOW)
        .ok,
    ).toBe(false)
    expect(
      verifyLink(`${payload}.${flip(signature)}`, 'unsubscribe', SECRET, NOW)
        .ok,
    ).toBe(false)
  })

  it('cannot be turned into a link for another lead', () => {
    const mine = signLink({ purpose: 'unsubscribe', leadId: LEAD }, SECRET)
    const other = signLink(
      {
        purpose: 'unsubscribe',
        leadId: '22222222-2222-4222-8222-222222222222',
      },
      SECRET,
    )
    const forged = `${other.split('.')[0]}.${mine.split('.')[1]}`
    expect(verifyLink(forged, 'unsubscribe', SECRET, NOW)).toEqual({
      ok: false,
    })
  })

  it.each([
    '',
    'abc',
    'a.b.c',
    '.',
    'x.',
    '.x',
    '../../etc/passwd',
    'A'.repeat(10_000),
  ])('rejects a malformed token without throwing: %j', (token) => {
    expect(verifyLink(token, 'optin', SECRET, NOW)).toEqual({ ok: false })
  })

  it('does not put the e-mail address or the secret into the token', () => {
    const token = signLink({ purpose: 'unsubscribe', leadId: LEAD }, SECRET)
    expect(token).not.toContain('@')
    expect(token).not.toContain(SECRET)
  })
})
