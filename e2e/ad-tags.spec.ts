import { test, expect, type Page } from '@playwright/test'
import { randomIp } from './lead-helpers'
import { marker, walk } from './track-helpers'

// GA4 and the Meta Pixel (Phase 5, PR 3): cases A-1 to A-3 of docs/PHASE-5-PLAN.md. The
// server is built with fake ids (playwright.config.ts) and the two vendor scripts are
// answered by empty stubs, so nothing leaves the machine. A-4 (no ids) is the jsdom case
// T-1: a page without ids needs a second build. Every test starts without a stored choice.
test.use({ storageState: { cookies: [], origins: [] } })

type Layer = { dataLayer?: IArguments[]; fbq?: { queue: unknown[][] } }

test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

async function watch(page: Page) {
  const outside: string[] = []
  page.on('request', (request) => {
    const host = new URL(request.url()).hostname
    if (host !== 'localhost' && host !== '127.0.0.1')
      outside.push(request.url())
  })
  await page.route(/googletagmanager\.com|connect\.facebook\.net/, (route) =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
  )
  return outside
}

const gaEvents = (page: Page) =>
  page.evaluate(() =>
    ((window as unknown as Layer).dataLayer ?? [])
      .map((entry) => Array.from(entry) as unknown[])
      .filter((call) => call[0] === 'event')
      .map((call) => call[1]),
  )

test('A-1 before a choice and after "Odmítnout vše" no request leaves for Google or Meta', async ({
  page,
  request,
}) => {
  const outside = await watch(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Odmítnout vše' }).click()
  await walk(page, request, marker())
  expect(outside).toEqual([])
  expect(
    await page.evaluate(() => 'dataLayer' in window || 'fbq' in window),
  ).toBe(false)
})

test('A-2 "Přijmout vše" loads both tags and the events arrive in order', async ({
  page,
  request,
}) => {
  const outside = await watch(page)
  await page.goto('/')
  expect(outside).toEqual([])
  await page.getByRole('button', { name: 'Přijmout vše' }).click()
  await expect
    .poll(() => outside.map((url) => new URL(url).hostname).sort())
    .toEqual(['connect.facebook.net', 'www.googletagmanager.com'])
  await walk(page, request, marker())
  await expect
    .poll(() => gaEvents(page))
    .toEqual([
      'page_view',
      'calc_start',
      'calc_result',
      'gate_view',
      'form_focus',
    ])
  const meta = await page.evaluate(
    () =>
      (window as unknown as Layer).fbq?.queue.map((call) => Array.from(call)) ??
      [],
  )
  expect(meta.map((call) => call.slice(0, 2))).toEqual([
    ['init', '1234567890'],
    ['track', 'PageView'],
    ['track', 'ViewContent'],
  ])
})

test('A-3 measurement only requests the Google tag and not Meta', async ({
  page,
}) => {
  const outside = await watch(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Nastavit' }).click()
  const dialog = page.getByRole('dialog', { name: 'Nastavení cookies' })
  await dialog.getByRole('switch', { name: 'Měření návštěvnosti' }).check()
  await dialog.getByRole('button', { name: 'Uložit výběr' }).click()
  await expect
    .poll(() => outside.map((url) => new URL(url).hostname))
    .toEqual(['www.googletagmanager.com'])
  expect(await page.evaluate(() => 'fbq' in window)).toBe(false)
})
