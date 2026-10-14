import { test, expect, type APIRequestContext } from '@playwright/test'
import { randomEmail, randomIp } from './lead-helpers'

// Phase 4, PR 2 (an unknown link answers 200 and not 404: the page streams after a
// static shell, and a real 404 would need a Proxy that repeats the lookup): the results page behind the e-mail form (SPEC §22, §26). Written
// first. The server runs on the in-memory store; `POST /api/test-leads` can
// expire a lead's tokens (test-only, 404 outside LEAD_STORE=memory).
const field = { name: 'Váš e-mail' }
const send = { name: 'Poslat mi srovnání' }
const GENERIC = 'Tento odkaz už nefunguje'

test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

async function signUp(
  request: APIRequestContext,
  email = randomEmail(),
  data: Record<string, unknown> = {},
): Promise<{ email: string; path: string }> {
  const response = await request.post('/api/lead', {
    headers: { 'x-forwarded-for': randomIp() },
    data: { email, monthly: 3000, years: 10, ...data },
  })
  const body = (await response.json()) as { resultsPath: string }
  return { email, path: body.resultsPath }
}

async function expireTokens(request: APIRequestContext, email: string) {
  const response = await request.post('/api/test-leads', {
    data: { email, expireTokens: true },
  })
  expect(response.status()).toBe(200)
}

test('the success state links to the comparison, and the link opens it @smoke', async ({
  page,
}) => {
  await page.goto('/?v=b')
  await page.getByRole('textbox', field).fill(randomEmail())
  await page.getByRole('button', send).click()
  await page.getByRole('link', { name: 'Otevřít srovnání' }).click()
  await expect(page).toHaveURL(/\/srovnani\/[A-Za-z0-9_-]{43}$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Srovnání 5 fondů' }),
  ).toBeVisible()
})

test("shows the visitor's setup and the same headline number as the calculator", async ({
  page,
}) => {
  await page.goto('/?v=b')
  const headline = await page
    .locator('#spocitat')
    .getByRole('status')
    .first()
    .textContent()
  expect(headline).toBeTruthy()

  const { request } = page.context()
  const { path } = await signUp(request)
  await page.goto(path)
  const strip = page.getByRole('region', { name: 'Váš výsledek' })
  await expect(strip).toContainText(/3\s000\sKč měsíčně\s·\s10\slet/)
  await expect(strip).toContainText(headline!.replace(/\s/g, ' ').trim())
})

test('shows five funds, five brokers and the spread, and never says cheapest', async ({
  page,
}) => {
  const { path } = await signUp(page.context().request)
  await page.goto(path)
  const funds = page.getByRole('table', { name: /Fondy vedle sebe/ })
  await expect(funds.getByRole('row')).toHaveCount(6) // header and five funds
  const brokers = page.getByRole('table', { name: /U kterého brokera/ })
  await expect(brokers.getByRole('row')).toHaveCount(6) // header and five brokers
  await expect(
    page.getByText(/Mezi ověřenými brokery se výsledek liší až o/),
  ).toBeVisible()
  await expect(page.getByText(/nejlevnější/i)).toHaveCount(0)
})

test('the fund picker changes the broker table', async ({ page }) => {
  const { path } = await signUp(page.context().request)
  await page.goto(path)
  const brokers = page.getByRole('table', { name: /U kterého brokera/ })
  const before = await brokers.textContent()
  await page.getByRole('tab', { name: 'CNDX' }).click()
  await expect(page.getByRole('tab', { name: 'CNDX' })).toHaveAttribute(
    'aria-selected',
    'true',
  )
  expect(await brokers.textContent()).not.toBe(before)
})

test('says how long the link works and does not name the visitor', async ({
  page,
}) => {
  const { email, path } = await signUp(page.context().request)
  await page.goto(path)
  await expect(page.getByText('Odkaz platí 30 dní.')).toBeVisible()
  expect(await page.content()).not.toContain(email)
})

test('is out of search engines and out of shared caches', async ({ page }) => {
  const { path } = await signUp(page.context().request)
  const response = await page.goto(path)
  const headers = response!.headers()
  expect(headers['x-robots-tag']).toContain('noindex')
  expect(headers['cache-control']).toContain('private')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  )
})

test.describe('a link that does not work', () => {
  const generic = async (page: import('@playwright/test').Page) => {
    await expect(page.getByRole('heading', { name: GENERIC })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Zpět na úvod' })).toBeVisible()
    await expect(page.getByText(/Srovnání 5 fondů/)).toHaveCount(0)
  }

  test('an unknown token gives the generic message, out of search and caches', async ({
    page,
  }) => {
    const response = await page.goto(`/srovnani/${'A'.repeat(43)}`)
    await generic(page)
    expect(response!.headers()['x-robots-tag']).toContain('noindex')
    expect(response!.headers()['cache-control']).toContain('private')
  })

  test('a malformed token gives the same', async ({ page }) => {
    const response = await page.goto('/srovnani/abc')
    expect(response!.headers()['x-robots-tag']).toContain('noindex')
    await generic(page)
  })

  test('an expired token gives the same, and shows nothing of the lead', async ({
    page,
  }) => {
    const { request } = page.context()
    const { email, path } = await signUp(request)
    await expireTokens(request, email)
    await page.goto(path)
    await generic(page)
    expect(await page.content()).not.toContain(email)
  })

  test('the way back goes to the landing page', async ({ page }) => {
    await page.goto(`/srovnani/${'A'.repeat(43)}`)
    await page.getByRole('link', { name: 'Zpět na úvod' }).click()
    await expect(page).toHaveURL('/')
  })
})
