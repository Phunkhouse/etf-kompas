// Contract for storing leads (Phase 4, PR 1). Types only: the rules live in
// `leads.ts`, the adapters (memory, Supabase) only keep and fetch. Pure: no
// imports from next or react.
export type EmailStatus = 'queued' | 'sent' | 'failed' | 'bounced'

export type LeadRecord = {
  id: string
  email: string // lowercased
  createdAt: Date
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  utmTerm: string | null
  fbclid: string | null
  variant: 'a' | 'b'
  calcMonthly: number // whole Kč, on the slider grid (column calc_monthly_bucket)
  calcYears: number // 5, 10 or 20
  marketingConsent: boolean
  consentTextVersion: string | null
  consentConfirmedAt: Date | null // double opt-in, set by the confirmation link
  optinSentAt: Date | null // when the opt-in e-mail last went out (once until confirmed or expired)
  // The visit's session id, only when the visitor agreed to measurement
  sessionId: string | null
  emailStatus: EmailStatus
  unsubscribedAt: Date | null
  deletedAt: Date | null
}

export type TokenRecord = {
  tokenHash: string
  leadId: string
  createdAt: Date
  expiresAt: Date
}

export type LeadStore = {
  findByEmail(email: string): Promise<LeadRecord | null>
  // Insert, or replace the row with the same id.
  save(lead: LeadRecord): Promise<void>
  addToken(token: TokenRecord): Promise<void>
  // The results page (PR 2): a token by its hash, and a lead by its id.
  findToken(tokenHash: string): Promise<TokenRecord | null>
  findById(id: string): Promise<LeadRecord | null>
}

// First-party events (Phase 5, PR 2). Cookieless and aggregate: no IP, no user agent,
// no e-mail. `sessionId` is null for the server-side `lead` of a visitor who did not
// agree to measurement.
export type EventName =
  | 'page_view'
  | 'calc_start'
  | 'calc_result'
  | 'gate_view'
  | 'form_focus'
  | 'lead'

export type EventRecord = {
  id: string
  createdAt: Date
  sessionId: string | null
  name: EventName
  variant: 'a' | 'b' | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmContent: string | null
  utmTerm: string | null
  fbclid: string | null // page_view only
  device: 'phone' | 'desktop' | null
  inAppBrowser: boolean | null
  consentMeasurement: boolean
  calcMonthly: number | null // calc_result only
  calcYears: number | null // calc_result only
}

export type EventStore = {
  add(event: EventRecord): Promise<void>
}

export type RateLimiter = {
  // Counts one hit in the window and says whether it is within the limit.
  hit(key: string, windowStart: Date, limit: number): Promise<boolean>
  // Removes windows that started before the date.
  purgeBefore(date: Date): Promise<void>
}

// What `createMemoryLeadStore()` (src/server/memory-store.ts) returns: the two
// ports plus a view for tests and for the e2e test route. Refuses to be created
// when NODE_ENV is "production".
export type MemoryLeadStore = {
  store: LeadStore
  limiter: RateLimiter
  events: EventStore
  leads(): LeadRecord[]
  eventRows(): EventRecord[]
  tokens(): TokenRecord[]
  limiterWindows(): { key: string; windowStart: Date; hits: number }[]
  // Test only: makes every token of this address expired.
  expireTokens(email: string, now: Date): void
}
