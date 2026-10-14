import { test, expect } from '@playwright/test'
import {
  randomEmail,
  randomIp,
  storedLeads,
  type StoredLead,
} from './lead-helpers'

// Phase 4, lead storage (SPEC §22): a valid address is stored with the visitor's
// setup, the same address twice is one lead, the honeypot is silent, and the
// 6th request from one address within the hour gets a 429. The server runs on the
// in-memory store (playwright.config.ts).
const field = { name: 'Váš e-mail' }
const send = { name: 'Poslat mi srovnání' }
const doneText = 'Hotovo. Váš e-mail jsme uložili.'

test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

async function leadFor(
  request: Parameters<typeof storedLeads>[0],
  email: string,
): Promise<StoredLead[]> {
  return (await storedLeads(request)).filter((lead) => lead.email === email)
}

test('a valid address is stored with the amount and the horizon from the calculator @smoke', async ({
  page,
  request,
}) => {
  const email = randomEmail()
  await page.goto('/?v=b')
  await page.getByRole('button', { name: '20 let' }).click()
  await page.getByRole('textbox', field).fill(email)
  await page.getByRole('button', send).click()
  await expect(page.getByText(doneText)).toBeVisible()
  expect(await leadFor(request, email)).toMatchObject([
    { calcMonthly: 3000, calcYears: 20, variant: 'b', marketingConsent: false },
  ])
})

test('the tips box is stored as consent to confirm', async ({
  page,
  request,
}) => {
  const email = randomEmail()
  await page.goto('/?v=b')
  await page.getByRole('textbox', field).fill(email)
  await page.getByRole('checkbox', { name: /tip k investování/ }).check()
  await page.getByRole('button', send).click()
  await expect(page.getByText(doneText)).toBeVisible()
  expect(await leadFor(request, email)).toMatchObject([
    { marketingConsent: true },
  ])
})

test('the campaign fields in the address are stored', async ({
  page,
  request,
}) => {
  const email = randomEmail()
  await page.goto('/?v=b&utm_source=instagram&fbclid=AbC123')
  await page.getByRole('textbox', field).fill(email)
  await page.getByRole('button', send).click()
  await expect(page.getByText(doneText)).toBeVisible()
  expect(await leadFor(request, email)).toMatchObject([
    { utmSource: 'instagram', fbclid: 'AbC123' },
  ])
})

test('the same address twice is one lead and both say done', async ({
  page,
  request,
}) => {
  const email = randomEmail()
  for (let i = 0; i < 2; i++) {
    await page.goto('/?v=b')
    await page.getByRole('textbox', field).fill(email)
    await page.getByRole('button', send).click()
    await expect(page.getByText(doneText)).toBeVisible()
  }
  expect(await leadFor(request, email)).toHaveLength(1)
})

test('a filled honeypot looks like success and stores nothing', async ({
  page,
  request,
}) => {
  const email = randomEmail()
  await page.goto('/?v=b')
  await page.getByRole('textbox', field).fill(email)
  await page.locator('input[name="website"]').evaluate((input) => {
    ;(input as HTMLInputElement).value = 'http://spam.example'
  })
  await page.getByRole('button', send).click()
  await expect(page.getByText(doneText)).toBeVisible()
  expect(await leadFor(request, email)).toHaveLength(0)
})

test('the 6th request from one address within the hour gets 429 with Retry-After', async ({
  request,
}) => {
  const headers = { 'x-forwarded-for': randomIp() }
  const post = (email: string) =>
    request.post('/api/lead', {
      headers,
      data: { email, monthly: 3000, years: 10 },
    })
  for (let i = 0; i < 5; i++) {
    expect((await post(randomEmail())).status()).toBe(200)
  }
  const sixth = await post(randomEmail())
  expect(sixth.status()).toBe(429)
  expect(Number(sixth.headers()['retry-after'])).toBeGreaterThan(0)
  expect(await sixth.json()).toMatchObject({ status: 'limited' })
})

test('the form says "too many tries" on the 6th submit from one address', async ({
  page,
}) => {
  for (let i = 0; i < 5; i++) {
    await page.goto('/?v=b')
    await page.getByRole('textbox', field).fill(randomEmail())
    await page.getByRole('button', send).click()
    await expect(page.getByText(doneText)).toBeVisible()
  }
  await page.goto('/?v=b')
  await page.getByRole('textbox', field).fill(randomEmail())
  await page.getByRole('button', send).click()
  await expect(page.getByText('Příliš mnoho pokusů.')).toBeVisible()
})

test('the API answers 400 for a wrong address and 200 with a link for a good one', async ({
  request,
}) => {
  const headers = { 'x-forwarded-for': randomIp() }
  const bad = await request.post('/api/lead', {
    headers,
    data: { email: 'jmeno@domena', monthly: 3000, years: 10 },
  })
  expect(bad.status()).toBe(400)
  const good = await request.post('/api/lead', {
    headers,
    data: { email: randomEmail(), monthly: 3000, years: 10 },
  })
  expect(good.status()).toBe(200)
  expect(await good.json()).toMatchObject({
    status: 'ok',
    resultsPath: expect.stringMatching(/^\/srovnani\/[A-Za-z0-9_-]{43}$/),
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('the posted form stores the lead with the calculator setting', async ({
    page,
    request,
  }) => {
    const email = randomEmail()
    await page.goto('/?v=b')
    await page.getByRole('textbox', field).fill(email)
    await page.getByRole('button', send).click()
    await expect(page.getByText(doneText)).toBeVisible()
    expect(await leadFor(request, email)).toMatchObject([
      { calcMonthly: 3000, calcYears: 10 },
    ])
  })
})
