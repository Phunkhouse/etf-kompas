import {
  test,
  expect,
  type Page,
  type APIRequestContext,
} from '@playwright/test'
import { randomEmail, randomIp } from './lead-helpers'
import { marker, stored, walk } from './track-helpers'

// The lead for the vendors (Phase 5, PR 4): cases E-1 to E-5 of docs/PHASE-5-PLAN.md. The
// server runs with fake tag ids, the vendor scripts are stubbed, and the server-side call
// goes to our own stub route /api/test-capi (decision 6), never to Meta. Every test starts
// without a stored cookie choice and is its own visitor.
test.use({ storageState: { cookies: [], origins: [] } })

type Layer = { dataLayer?: IArguments[]; fbq?: { queue: unknown[][] } }
type Captured = {
  path: string
  body: { data: CapiEvent[]; test_event_code?: string }
}
type CapiEvent = {
  event_name: string
  event_id: string
  user_data: { em: string[]; fbc?: string }
}

test.beforeEach(async ({ context, page }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
  await page.route(/googletagmanager\.com|connect\.facebook\.net/, (route) =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
  )
})

async function capiFor(request: APIRequestContext, fbclid: string) {
  const response = await request.get('/api/test-capi/state')
  const { requests } = (await response.json()) as { requests: Captured[] }
  return requests.filter((r) => r.body.data[0].user_data.fbc?.endsWith(fbclid))
}

const gaEvents = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as Layer).dataLayer ?? [])
      .map((entry) => Array.from(entry) as unknown[])
      .filter((call) => call[0] === 'event')
      .map((call) => call[1]),
  )

const metaCalls = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as Layer).fbq?.queue.map((call) => Array.from(call)) ??
      [],
  )

async function submit(page: Page, address = randomEmail()) {
  await page.getByRole('textbox', { name: 'Váš e-mail' }).fill(address)
  await page.getByRole('button', { name: 'Poslat mi srovnání' }).click()
  await expect(page.getByText('Hotovo. Srovnání je připravené.')).toBeVisible()
  return address
}

test('E-1 all agreed: the browser and the server send the same lead', async ({
  page,
  request,
}) => {
  const utm = marker()
  const click = `ok${utm}`
  await page.goto('/')
  await page.getByRole('button', { name: 'Přijmout vše' }).click()
  await walk(page, request, utm, `&fbclid=${click}`)
  await submit(page)
  await expect
    .poll(() => gaEvents(page))
    .toEqual([
      'page_view',
      'calc_start',
      'calc_result',
      'gate_view',
      'form_focus',
      'generate_lead',
    ])
  const id = await page.locator('#formular').getAttribute('data-lead-event-id')
  expect(id).toMatch(/^[0-9a-f-]{36}$/)
  const meta = await metaCalls(page)
  expect(meta.at(-1)).toEqual(['track', 'Lead', {}, { eventID: id }])
  await expect.poll(async () => (await capiFor(request, click)).length).toBe(1)
  const sent = (await capiFor(request, click))[0].body.data[0]
  expect(sent).toMatchObject({ event_name: 'Lead', event_id: id })
  expect(sent.user_data.em[0]).toMatch(/^[0-9a-f]{64}$/)
  // the Test Events code set in playwright.config.ts goes in the body (Phase 6)
  expect((await capiFor(request, click))[0].body.test_event_code).toBe(
    'TEST12345',
  )
  const first = (await stored(request)).events.find(
    (e) => e.utmSource === utm && e.name === 'lead',
  )
  expect(first?.id).toBe(id)
})

test('E-2 everything refused: the lead is stored and counted, no vendor gets it', async ({
  page,
  request,
}) => {
  const utm = marker()
  const click = `no${utm}`
  await page.goto(`/?utm_source=${utm}&fbclid=${click}`)
  await page.getByRole('button', { name: 'Odmítnout vše' }).click()
  await submit(page)
  expect(
    (await stored(request)).events.filter(
      (e) => e.utmSource === utm && e.name === 'lead',
    ),
  ).toHaveLength(1)
  expect(
    await page.evaluate(() => 'dataLayer' in window || 'fbq' in window),
  ).toBe(false)
  expect(await capiFor(request, click)).toEqual([])
})

test('E-3 measurement only: GA4 gets the lead, the Pixel and Meta do not', async ({
  page,
  request,
}) => {
  const utm = marker()
  const click = `ga${utm}`
  await page.goto(`/?utm_source=${utm}&fbclid=${click}`)
  await page.getByRole('button', { name: 'Nastavit' }).click()
  const dialog = page.getByRole('dialog', { name: 'Nastavení cookies' })
  await dialog.getByRole('switch', { name: 'Měření návštěvnosti' }).check()
  await dialog.getByRole('button', { name: 'Uložit výběr' }).click()
  await submit(page)
  await expect.poll(() => gaEvents(page)).toContain('generate_lead')
  expect(await page.evaluate(() => 'fbq' in window)).toBe(false)
  expect(await capiFor(request, click)).toEqual([])
})

test('E-4 the same address twice is one lead for each vendor and one server call', async ({
  page,
  request,
}) => {
  const utm = marker()
  const click = `tw${utm}`
  await page.goto(`/?utm_source=${utm}&fbclid=${click}`)
  await page.getByRole('button', { name: 'Přijmout vše' }).click()
  const address = await submit(page)
  await page.goto(`/?utm_source=${utm}&fbclid=${click}`)
  await submit(page, address)
  await expect.poll(async () => (await capiFor(request, click)).length).toBe(1)
  expect(await gaEvents(page)).not.toContain('generate_lead')
  expect((await metaCalls(page)).filter((call) => call[1] === 'Lead')).toEqual(
    [],
  )
})

for (const failure of ['fail500', 'hang']) {
  test(`E-5 Meta answers ${failure}: the visitor still gets the comparison`, async ({
    page,
    request,
  }) => {
    const utm = marker()
    const click = `x${utm}${failure}`
    await page.goto(`/?utm_source=${utm}&fbclid=${click}`)
    await page.getByRole('button', { name: 'Přijmout vše' }).click()
    const address = await submit(page)
    await expect(
      page.getByRole('link', { name: 'Otevřít srovnání' }),
    ).toBeVisible()
    expect(
      (await (await request.get('/api/test-leads')).json()).leads.some(
        (l: { email: string }) => l.email === address,
      ),
    ).toBe(true)
  })
}
