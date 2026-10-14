import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { memoryLeads } from '@/app/lead-service'
import * as route from './route'

const { GET } = route

// Phase 6, PR 2: cases PR-1 to PR-4 of docs/PHASE-6-PLAN.md. Written first. The
// route runs on the in-memory store.
const SECRET = 'a-cron-secret-of-at-least-32-bytes!!!'
const DAY = 86_400_000

beforeEach(() => {
  process.env.LEAD_STORE = 'memory'
  vi.stubEnv('CRON_SECRET', SECRET)
})
afterEach(() => vi.unstubAllEnvs())

const call = (authorization?: string) =>
  GET(
    new Request('http://localhost/api/purge', {
      headers: authorization ? { authorization } : {},
    }),
  )

async function oldLead(email: string) {
  const memory = memoryLeads()!
  await memory.store.save({
    id: crypto.randomUUID(),
    email,
    createdAt: new Date(Date.now() - 400 * DAY),
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    fbclid: null,
    variant: 'a',
    calcMonthly: 3000,
    calcYears: 10,
    marketingConsent: false,
    consentTextVersion: null,
    consentConfirmedAt: null,
    optinSentAt: null,
    sessionId: null,
    emailStatus: 'sent',
    unsubscribedAt: null,
    deletedAt: null,
  })
}

describe('GET /api/purge', () => {
  it('PR-1 answers 401 without the header, with a wrong secret or a non-Bearer header, and deletes nothing', async () => {
    await oldLead('pr1@example.cz')
    expect((await call()).status).toBe(401)
    expect((await call('Bearer wrong')).status).toBe(401)
    expect((await call(`Basic ${SECRET}`)).status).toBe(401)
    expect((await call(SECRET)).status).toBe(401)
    expect(
      memoryLeads()!
        .leads()
        .some((lead) => lead.email === 'pr1@example.cz'),
    ).toBe(true)
  })

  it('PR-2 answers 401 when CRON_SECRET is not configured, whatever the header', async () => {
    vi.stubEnv('CRON_SECRET', '')
    expect((await call('Bearer ')).status).toBe(401)
    expect((await call('Bearer undefined')).status).toBe(401)
    expect((await call()).status).toBe(401)
  })

  it('PR-3 answers 200 with the counts only for the right secret', async () => {
    await oldLead('pr3@example.cz')
    const response = await call(`Bearer ${SECRET}`)
    expect(response.status).toBe(200)
    const body = await response.json()
    expect(Object.keys(body).sort()).toEqual([
      'events',
      'failed',
      'leads',
      'rateLimits',
    ])
    expect(body.leads).toBeGreaterThanOrEqual(1)
    expect(JSON.stringify(body)).not.toContain('@')
    expect(
      memoryLeads()!
        .leads()
        .some((lead) => lead.email === 'pr3@example.cz'),
    ).toBe(false)
  })

  it('PR-4 sets no cookie and is never cached', async () => {
    const response = await call(`Bearer ${SECRET}`)
    expect(response.headers.get('set-cookie')).toBeNull()
    expect(response.headers.get('cache-control')).toContain('no-store')
  })

  it('PR-4 does not offer other methods', async () => {
    expect(Object.keys(route)).toEqual(['GET'])
  })
})
