import type { APIRequestContext } from '@playwright/test'

// Every test is its own visitor: its own IP for the rate limit, its own address.
export function randomIp(): string {
  const part = () => Math.floor(Math.random() * 250) + 1
  return `203.${part()}.${part()}.${part()}`
}

export function randomEmail(): string {
  return `test-${crypto.randomUUID()}@domena.cz`
}

export type StoredLead = {
  email: string
  calcMonthly: number
  calcYears: number
  variant: string
  utmSource: string | null
  fbclid: string | null
  marketingConsent: boolean
}

// The in-memory store, through the test-only route (404 outside LEAD_STORE=memory).
export async function storedLeads(
  request: APIRequestContext,
): Promise<StoredLead[]> {
  const response = await request.get('/api/test-leads')
  return ((await response.json()) as { leads: StoredLead[] }).leads
}

export type RecordedMail = {
  to: string
  subject: string
  html: string
  text: string
  headers?: Record<string, string>
}

type TestState = {
  leads: (StoredLead & {
    consentConfirmedAt: string | null
    unsubscribedAt: string | null
    optinSentAt: string | null
    emailStatus: string
  })[]
  mails: RecordedMail[]
}

// What the in-memory server stored and "sent" (test-only route, 404 elsewhere).
export async function testState(
  request: APIRequestContext,
): Promise<TestState> {
  const response = await request.get('/api/test-leads')
  return (await response.json()) as TestState
}

export async function mailsTo(
  request: APIRequestContext,
  email: string,
): Promise<RecordedMail[]> {
  return (await testState(request)).mails.filter((m) => m.to === email)
}

// Puts an address on the sandbox allowlist, so mail to it is really "sent".
export async function allow(request: APIRequestContext, email: string) {
  await request.post('/api/test-leads', { data: { allowEmail: email } })
}

// The first link of a kind in a mail, as a path on the site under test.
export function linkIn(mail: RecordedMail, prefix: string): string {
  const match = mail.text.match(
    new RegExp(`https?://[^/\\s]+(${prefix}[^\\s"'<>)]+)`),
  )
  if (!match) throw new Error(`no ${prefix} link in: ${mail.text}`)
  return match[1]
}
