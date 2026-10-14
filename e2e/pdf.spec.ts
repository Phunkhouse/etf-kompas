import { test, expect, type APIRequestContext } from '@playwright/test'
import { randomEmail, randomIp } from './lead-helpers'

// Phase 4, PR 3: the personalised PDF behind the results link (SPEC §3.2, §22).
// Written first. The route handler can answer a real 404 (the page cannot).
test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

async function signUp(
  request: APIRequestContext,
  data: Record<string, unknown> = {},
) {
  const email = randomEmail()
  const response = await request.post('/api/lead', {
    headers: { 'x-forwarded-for': randomIp() },
    data: { email, monthly: 3000, years: 10, ...data },
  })
  const body = (await response.json()) as { resultsPath: string }
  return { email, path: body.resultsPath }
}

const pages = (body: Buffer) =>
  (body.toString('latin1').match(/\/Type\s*\/Page\b(?!s)/g) ?? []).length

test('a valid link gives a six page PDF, private and out of search @smoke', async ({
  request,
}) => {
  const { path } = await signUp(request)
  const response = await request.get(`${path}/pdf`)
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/pdf')
  expect(response.headers()['cache-control']).toContain('private')
  expect(response.headers()['x-robots-tag']).toContain('noindex')
  expect(response.headers()['content-disposition']).toMatch(/^inline/)
  const body = await response.body()
  expect(body.subarray(0, 5).toString()).toBe('%PDF-')
  expect(pages(body)).toBe(6)
})

test('does not contain the e-mail address of the visitor', async ({
  request,
}) => {
  const { email, path } = await signUp(request)
  const body = await (await request.get(`${path}/pdf`)).body()
  expect(body.toString('latin1')).not.toContain(email)
})

test('an unknown, a malformed and an expired link give a real 404', async ({
  request,
}) => {
  expect((await request.get(`/srovnani/${'A'.repeat(43)}/pdf`)).status()).toBe(
    404,
  )
  expect((await request.get('/srovnani/abc/pdf')).status()).toBe(404)
  const { email, path } = await signUp(request)
  await request.post('/api/test-leads', {
    data: { email, expireTokens: true },
  })
  expect((await request.get(`${path}/pdf`)).status()).toBe(404)
})

test('the results page and the success state link to the PDF', async ({
  page,
}) => {
  await page.goto('/?v=b')
  await page.getByRole('textbox', { name: 'Váš e-mail' }).fill(randomEmail())
  await page.getByRole('button', { name: 'Poslat mi srovnání' }).click()
  const link = page.getByRole('link', { name: /Stáhnout PDF · 6 stran/ })
  await expect(link).toHaveAttribute('href', /\/srovnani\/[\w-]{43}\/pdf$/)
  await expect(link).not.toHaveAttribute('download', /.*/)
  await expect(link).not.toHaveAttribute('target', /.*/)

  await page.getByRole('link', { name: 'Otevřít srovnání' }).click()
  await expect(
    page.getByRole('link', { name: /Stáhnout PDF · 6 stran/ }).first(),
  ).toHaveAttribute('href', /\/pdf$/)
})
