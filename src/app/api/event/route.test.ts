import { beforeEach, describe, expect, it } from 'vitest'
import { POST } from './route'

// Cases R-1 and R-2 of docs/PHASE-5-PLAN.md. The route runs on the in-memory store.
beforeEach(() => {
  process.env.LEAD_STORE = 'memory'
})

const body = {
  sessionId: '3b1f1c0e-6a52-4c1c-9d5e-0f7a1b2c3d4e',
  name: 'page_view',
  variant: 'a',
  device: 'phone',
  inAppBrowser: false,
  measurement: false,
}

const post = (payload: string, ip = '198.51.100.1') =>
  POST(
    new Request('http://localhost/api/event', {
      method: 'POST',
      headers: { 'x-forwarded-for': ip },
      body: payload,
    }),
  )

describe('POST /api/event', () => {
  it('R-1 answers 204 with no body for a valid event', async () => {
    const response = await post(JSON.stringify(body), '198.51.100.2')
    expect(response.status).toBe(204)
    expect(await response.text()).toBe('')
  })

  it('R-1 answers 400 for an invalid or unreadable body', async () => {
    expect(
      (await post(JSON.stringify({ ...body, name: 'x' }), '198.51.100.3'))
        .status,
    ).toBe(400)
    expect((await post('not json', '198.51.100.3')).status).toBe(400)
  })

  it('R-1 answers 413 over 2 KB', async () => {
    const big = JSON.stringify({ ...body, utm_source: 'x'.repeat(3000) })
    expect((await post(big, '198.51.100.4')).status).toBe(413)
  })

  it('R-1 has no GET: other methods are 405 by the framework', () => {
    // Only POST is exported; Next answers anything else with 405.
    return import('./route').then((module) => {
      expect(Object.keys(module)).toEqual(['POST'])
    })
  })

  it('R-2 sets no cookie', async () => {
    const response = await post(JSON.stringify(body), '198.51.100.5')
    expect(response.headers.get('set-cookie')).toBeNull()
  })
})
