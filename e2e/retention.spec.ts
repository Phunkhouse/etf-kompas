import { test, expect, type APIRequestContext } from '@playwright/test'
import { randomEmail, randomIp, storedLeads } from './lead-helpers'

// Phase 6, PR 2: E2E-1 and E2E-2 of docs/PHASE-6-PLAN.md. The server runs on the
// in-memory store and a test CRON_SECRET (playwright.config.ts). The test route ages a
// lead by moving its dates back; the purge route is then called like Vercel Cron does.
const CRON_SECRET = 'e2e-cron-secret-of-at-least-32-bytes!'
const GENERIC = 'Tento odkaz už nefunguje'

test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

async function signUp(
  request: APIRequestContext,
  email: string,
): Promise<string> {
  const response = await request.post('/api/lead', {
    headers: { 'x-forwarded-for': randomIp() },
    data: { email, monthly: 3000, years: 10 },
  })
  expect(response.status()).toBe(200)
  return ((await response.json()) as { resultsPath: string }).resultsPath
}

async function ageAndPurge(request: APIRequestContext, email: string) {
  await request.post('/api/test-leads', { data: { email, ageDays: 400 } })
  return request.get('/api/purge', {
    headers: { authorization: `Bearer ${CRON_SECRET}` },
  })
}

test('E2E-1 an aged lead is purged and its results link stops working', async ({
  page,
  request,
}) => {
  const email = randomEmail()
  const path = await signUp(request, email)
  await page.goto(path)
  await expect(page.getByText('Odkaz platí 30 dní.')).toBeVisible()

  const purge = await ageAndPurge(request, email)
  expect(purge.status()).toBe(200)
  expect((await purge.json()).leads).toBeGreaterThanOrEqual(1)
  expect((await storedLeads(request)).some((l) => l.email === email)).toBe(
    false,
  )

  await page.goto(path)
  await expect(page.getByRole('heading', { name: GENERIC })).toBeVisible()
})

test('E2E-2 the same address can be submitted again afterwards as a new lead', async ({
  request,
}) => {
  const email = randomEmail()
  await signUp(request, email)
  await ageAndPurge(request, email)
  await signUp(request, email)
  expect(
    (await storedLeads(request)).filter((l) => l.email === email),
  ).toHaveLength(1)
})
