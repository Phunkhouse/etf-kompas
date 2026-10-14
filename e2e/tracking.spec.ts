import { test, expect } from '@playwright/test'
import { randomEmail, randomIp } from './lead-helpers'
import { marker, stored, walk } from './track-helpers'

// First-party events (Phase 5, PR 2): cases P-1 to P-6 of docs/PHASE-5-PLAN.md. The
// server runs on the in-memory store; each test is its own visitor (its own IP, and
// a campaign value that marks its events in the shared store). Every test starts
// without a stored cookie choice.
test.use({ storageState: { cookies: [], origins: [] } })

test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

test('P-1 the first visit sends page_view and sets no cookie @smoke', async ({
  page,
  request,
  context,
}) => {
  const utm = marker()
  await page.goto(`/?utm_source=${utm}`)
  await expect
    .poll(async () =>
      (await stored(request)).events
        .filter((e) => e.utmSource === utm)
        .map((e) => e.name),
    )
    .toEqual(['page_view'])
  expect(await context.cookies()).toEqual([])
})

test('P-2 the funnel is observed in order and lead appears once, P-3 a repeat adds none', async ({
  page,
  request,
}) => {
  const utm = marker()
  const email = await walk(page, request, utm)
  const address = randomEmail()
  await email.fill(address)
  await page.getByRole('button', { name: 'Poslat mi srovnání' }).click()
  await expect(page.getByText('Hotovo. Srovnání je připravené.')).toBeVisible()
  const names = async () =>
    (await stored(request)).events
      .filter((e) => e.utmSource === utm)
      .map((e) => e.name)
  await expect
    .poll(names, { timeout: 15_000 })
    .toEqual([
      'page_view',
      'calc_start',
      'calc_result',
      'gate_view',
      'form_focus',
      'lead',
    ])
  const result = (await stored(request)).events.find(
    (e) => e.utmSource === utm && e.name === 'calc_result',
  )
  expect(result).toMatchObject({
    calcMonthly: expect.any(Number),
    calcYears: expect.any(Number),
  })

  // the same address again, as a new visit: still one lead event
  await page.goto(`/?utm_source=${utm}`)
  await page.getByRole('textbox', { name: 'Váš e-mail' }).fill(address)
  await page.getByRole('button', { name: 'Poslat mi srovnání' }).click()
  await expect(page.getByText('Hotovo. Srovnání je připravené.')).toBeVisible()
  const leads = (await stored(request)).events.filter(
    (e) => e.utmSource === utm && e.name === 'lead',
  )
  expect(leads).toHaveLength(1)
})

test('P-4 campaign values, the click id and the variant are stored', async ({
  page,
  request,
}) => {
  const utm = marker()
  await page.goto(`/?v=b&utm_source=${utm}&fbclid=click123`)
  await expect
    .poll(async () =>
      (await stored(request)).events.find((e) => e.utmSource === utm),
    )
    .toMatchObject({ name: 'page_view', fbclid: 'click123' })
  // b is shown only when the data gives an amount to name; either way it is what the page says
  const shown = await page.locator('main').getAttribute('data-variant')
  const row = (await stored(request)).events.find((e) => e.utmSource === utm)
  expect(row?.variant).toBe(shown)

  const email = page.getByRole('textbox', { name: 'Váš e-mail' })
  const address = randomEmail()
  await email.fill(address)
  await page.getByRole('button', { name: 'Poslat mi srovnání' }).click()
  await expect(page.getByText('Hotovo. Srovnání je připravené.')).toBeVisible()
  const lead = (await (await request.get('/api/test-leads')).json()) as {
    leads: { email: string; utmSource: string | null; fbclid: string | null }[]
  }
  expect(lead.leads.find((l) => l.email === address)).toMatchObject({
    utmSource: utm,
    fbclid: 'click123',
  })
})

test('P-5 after "Přijmout vše" the session cookie and the lead share an id', async ({
  page,
  request,
  context,
}) => {
  const utm = marker()
  await page.goto(`/?utm_source=${utm}`)
  await page.getByRole('button', { name: 'Přijmout vše' }).click()
  await expect
    .poll(async () => (await context.cookies()).map((c) => c.name))
    .toContain('kompas_sid')
  const sid = (await context.cookies()).find(
    (c) => c.name === 'kompas_sid',
  )!.value
  const address = randomEmail()
  await page.getByRole('textbox', { name: 'Váš e-mail' }).fill(address)
  await page.getByRole('button', { name: 'Poslat mi srovnání' }).click()
  await expect(page.getByText('Hotovo. Srovnání je připravené.')).toBeVisible()
  const state = await stored(request)
  expect(state.leads.find((l) => l.email === address)?.sessionId).toBe(sid)
  const lead = state.events.find(
    (e) => e.utmSource === utm && e.name === 'lead',
  )
  expect(lead).toMatchObject({ sessionId: sid, consentMeasurement: true })
})

test('P-5 after "Odmítnout vše" there is no session cookie and the lead has no id', async ({
  page,
  request,
  context,
}) => {
  const utm = marker()
  await page.goto(`/?utm_source=${utm}`)
  await page.getByRole('button', { name: 'Odmítnout vše' }).click()
  const address = randomEmail()
  await page.getByRole('textbox', { name: 'Váš e-mail' }).fill(address)
  await page.getByRole('button', { name: 'Poslat mi srovnání' }).click()
  await expect(page.getByText('Hotovo. Srovnání je připravené.')).toBeVisible()
  expect((await context.cookies()).map((c) => c.name)).not.toContain(
    'kompas_sid',
  )
  const state = await stored(request)
  expect(state.leads.find((l) => l.email === address)?.sessionId).toBeNull()
  // events were still counted, without the consent flag
  const views = state.events.filter(
    (e) => e.utmSource === utm && e.name === 'page_view',
  )
  expect(views).toHaveLength(1)
  expect(views[0].consentMeasurement).toBe(false)
})
