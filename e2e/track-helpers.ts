import { expect, type APIRequestContext, type Page } from '@playwright/test'

// Shared by the tracking specs: the in-memory view of the events, a marker that tells one
// test's events from another's, and the path of a visitor.
export type StoredEvent = {
  id: string
  name: string
  sessionId: string | null
  variant: string | null
  utmSource: string | null
  fbclid: string | null
  consentMeasurement: boolean
  calcMonthly: number | null
  calcYears: number | null
}
export type StoredLead = { email: string; sessionId: string | null }

export async function stored(request: APIRequestContext) {
  const response = await request.get('/api/test-leads')
  return (await response.json()) as {
    events: StoredEvent[]
    leads: StoredLead[]
  }
}

export const marker = () => `t${crypto.randomUUID().slice(0, 8)}`

// The whole path of a visitor, up to the submit.
export async function walk(
  page: Page,
  request: APIRequestContext,
  utm: string,
  query = '',
) {
  await page.goto(`/?utm_source=${utm}${query}`)
  await page.getByRole('slider').first().focus()
  await page.keyboard.press('ArrowRight')
  await page.locator('[data-track="result"]').scrollIntoViewIfNeeded()
  // a person reads the result before moving on: calc_result needs one second in view
  await expect
    .poll(async () =>
      (await stored(request)).events
        .filter((e) => e.utmSource === utm)
        .map((e) => e.name),
    )
    .toContain('calc_result')
  await page.locator('#formular').scrollIntoViewIfNeeded()
  // a person reads the form before clicking into it: wait for gate_view
  await expect
    .poll(async () =>
      (await stored(request)).events
        .filter((e) => e.utmSource === utm)
        .map((e) => e.name),
    )
    .toContain('gate_view')
  const email = page.getByRole('textbox', { name: 'Váš e-mail' })
  await email.focus()
  return email
}
