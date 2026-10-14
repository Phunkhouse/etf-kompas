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
