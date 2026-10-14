// Lead handling for the e-mail form (SPEC §3.3, §26). Pure rules: the store and the
// limiter are passed in, so the same code runs against Supabase, in memory and in
// tests. No imports from next or react.
import {
  issueResultsToken,
  optInDue,
  sendKompas,
  sendOptIn,
  type MailDeps,
} from './lead-mail'
import type {
  EventStore,
  LeadRecord,
  LeadStore,
  RateLimiter,
} from './lead-ports'
import { sendLeadToMeta, type CapiConfig } from './capi'
import { leadEvent, validSessionId } from './events'
import { hitEmailLimit, hitIpLimit } from './rate-limits'
import { newToken } from './tokens'

// What the form and the API send. Everything is "unknown": it comes from outside.
export type LeadInput = {
  email?: unknown
  tips?: unknown
  monthly?: unknown
  years?: unknown
  // honeypot: a field people never see
  website?: unknown
  // milliseconds from the page loading to the submit, set by JavaScript
  t?: unknown
  variant?: unknown
  utm_source?: unknown
  utm_medium?: unknown
  utm_campaign?: unknown
  utm_content?: unknown
  utm_term?: unknown
  fbclid?: unknown
  // the visit's session id; the browser fills it only after the visitor agreed to measurement
  sid?: unknown
  // "1" only when the visitor agreed to advertising; the browser fills it at submit
  ads?: unknown
  // the Meta browser id (cookie _fbp), sent only with advertising consent
  fbp?: unknown
}

export type Lead = { email: string; tips: boolean }

export type LeadFormState =
  | { status: 'idle' }
  | { status: 'invalid'; email: string }
  | { status: 'error'; email: string }
  | { status: 'limited'; retryAfterSeconds: number }
  | {
      status: 'ok'
      resultsPath: string
      // The id the vendors dedupe the `lead` on (the id of the stored `lead` event).
      // Only for a new lead; null for a repeat submit and for a bot.
      eventId: string | null
      // what became of the e-mail with the link: only `sent` may be said to the visitor
      email: { status: 'sent' | 'skipped' | 'failed'; address: string }
    }

export type LeadDeps = {
  store: LeadStore
  limiter: RateLimiter
  // First-party events: the server writes `lead` itself (PR 2)
  events?: EventStore
  // The Meta Conversions API (only when fully configured) and the way to run a task
  // after the answer has gone out (Next's `after`; in tests a collector).
  capi?: CapiConfig
  afterResponse?: (task: () => Promise<void>) => void
  now: () => Date
  secrets: { ipHash: string }
  // E-mail (PR 4): without it no e-mail goes out
  mail?: MailDeps
  // The shortest time a person needs to fill the form; default 2000 ms. Only
  // end-to-end tests lower it, because a test types faster than a person.
  minFillMs?: number
}

export type LeadRequest = { ip: string; userAgent?: string | null }

// The wording the visitor agreed to is versioned, so a later change is visible.
export const CONSENT_TEXT_VERSION = '2026-10-tips-v1'

const MAX_LENGTH = 254
const MAX_TRACKING_LENGTH = 200
const MIN_FILL_MS = 2000
const RATE_LIMIT_KEEP_DAYS = 2
const DAY_MS = 86_400_000

// The slider grid of the calculator (Calculator.tsx) and its horizons.
const MONTHLY_MIN = 500
const MONTHLY_MAX = 20000
const MONTHLY_STEP = 500
const YEARS = [5, 10, 20]

// A plain address: letters, digits and a few signs before the at sign, a domain
// of labels with letters, digits and hyphens, and a top-level domain of at least
// two letters. No spaces, no two at signs, no dot at either end of the domain.
const ADDRESS =
  /^[a-z0-9._%+-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/

export function validateLead(
  input: LeadInput,
): { ok: true; lead: Lead } | { ok: false } {
  if (typeof input.email !== 'string') return { ok: false }
  const email = input.email.trim().toLowerCase()
  if (email.length === 0 || email.length > MAX_LENGTH) return { ok: false }
  if (!ADDRESS.test(email)) return { ok: false }
  // A ticked checkbox is sent as "on"; an unticked one is not sent at all.
  return { ok: true, lead: { email, tips: input.tips === 'on' } }
}

// A whole number from a number or a string of digits; anything else is null.
function wholeNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isInteger(value) ? value : null
  if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) {
    return Number(value.trim())
  }
  return null
}

function validateSetup(
  input: LeadInput,
): { monthly: number; years: number } | null {
  const monthly = wholeNumber(input.monthly)
  const years = wholeNumber(input.years)
  if (monthly === null || years === null) return null
  if (monthly < MONTHLY_MIN || monthly > MONTHLY_MAX) return null
  if (monthly % MONTHLY_STEP !== 0) return null
  if (!YEARS.includes(years)) return null
  return { monthly, years }
}

// Cut to a safe length, without control characters; empty becomes null.
function tracking(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const clean = value.replace(/[\u0000-\u001f\u007f]/g, '').trim()
  return clean === '' ? null : clean.slice(0, MAX_TRACKING_LENGTH)
}

// Honeypot filled, or submitted faster than a person can. A missing time is a
// browser without JavaScript and passes.
function looksLikeBot(input: LeadInput, minFillMs: number): boolean {
  const { website, t } = input
  if (website !== undefined && website !== null && website !== '') return true
  if (t === undefined || t === null || t === '') return false
  const ms = typeof t === 'number' ? t : Number(t)
  return !Number.isFinite(ms) || ms < minFillMs
}

function typed(input: LeadInput): string {
  return typeof input.email === 'string' ? input.email : ''
}

type Setup = { monthly: number; years: number }

function newLead(
  input: LeadInput,
  email: string,
  tips: boolean,
  setup: Setup,
  now: Date,
  id: string,
): LeadRecord {
  return {
    id,
    email,
    createdAt: now,
    utmSource: tracking(input.utm_source),
    utmMedium: tracking(input.utm_medium),
    utmCampaign: tracking(input.utm_campaign),
    utmContent: tracking(input.utm_content),
    utmTerm: tracking(input.utm_term),
    fbclid: tracking(input.fbclid),
    variant: input.variant === 'b' ? 'b' : 'a',
    calcMonthly: setup.monthly,
    calcYears: setup.years,
    sessionId: validSessionId(input.sid),
    marketingConsent: tips,
    consentTextVersion: tips ? CONSENT_TEXT_VERSION : null,
    consentConfirmedAt: null,
    optinSentAt: null,
    emailStatus: 'queued',
    unsubscribedAt: null,
    deletedAt: null,
  }
}

// The same address again. A deleted lead starts over (a new person); any other
// lead keeps its first attribution and gets the new setup. Tips can be switched
// on by a submit but never off.
function mergeLead(
  existing: LeadRecord,
  input: LeadInput,
  tips: boolean,
  setup: Setup,
  now: Date,
): LeadRecord {
  if (existing.deletedAt !== null) {
    return newLead(input, existing.email, tips, setup, now, existing.id)
  }
  const turnsOn = tips && !existing.marketingConsent
  return {
    ...existing,
    calcMonthly: setup.monthly,
    calcYears: setup.years,
    marketingConsent: existing.marketingConsent || tips,
    consentTextVersion: turnsOn
      ? CONSENT_TEXT_VERSION
      : existing.consentTextVersion,
  }
}

export async function submitLead(
  input: LeadInput,
  request: LeadRequest,
  deps: LeadDeps,
): Promise<LeadFormState> {
  try {
    // A bot gets a believable success that leads nowhere, and uses no quota.
    if (looksLikeBot(input, deps.minFillMs ?? MIN_FILL_MS)) {
      return {
        status: 'ok',
        resultsPath: `/srovnani/${newToken()}`,
        eventId: null,
        email: { status: 'skipped', address: typed(input) },
      }
    }

    const now = deps.now()
    const byIp = await hitIpLimit(deps, request.ip)
    if (!byIp.ok) {
      return { status: 'limited', retryAfterSeconds: byIp.retryAfterSeconds }
    }

    const result = validateLead(input)
    const setup = validateSetup(input)
    if (!result.ok || !setup) return { status: 'invalid', email: typed(input) }
    const { email, tips } = result.lead

    const byEmail = await hitEmailLimit(deps, email)
    if (!byEmail.ok) {
      return { status: 'limited', retryAfterSeconds: byEmail.retryAfterSeconds }
    }

    const existing = await deps.store.findByEmail(email)
    let lead = existing
      ? mergeLead(existing, input, tips, setup, now)
      : newLead(input, email, tips, setup, now, crypto.randomUUID())
    await deps.store.save(lead)
    // `lead` is counted once per person: a new address (or one that was deleted and
    // comes back), never a repeat submit. A failed write never fails the lead.
    const isNew = !existing || existing.deletedAt !== null
    const eventId = isNew ? crypto.randomUUID() : null
    if (deps.events && eventId) {
      try {
        await deps.events.add(leadEvent(lead, lead.sessionId, now, eventId))
      } catch {
        // the conversion is stored; only its first-party count is lost
      }
    }
    // The same conversion to Meta from the server, after the answer: only with
    // advertising consent (the form sends ads=1), only when configured.
    if (eventId && input.ads === '1' && deps.capi && deps.afterResponse) {
      const capi = deps.capi
      const lead_ = {
        eventId,
        email: lead.email,
        time: now,
        ip: request.ip,
        userAgent: request.userAgent ?? null,
        fbclid: lead.fbclid,
        fbp: tracking(input.fbp),
      }
      deps.afterResponse(() => sendLeadToMeta(capi, lead_))
    }
    const token = await issueResultsToken(deps.store, lead.id, now)

    // The e-mails come after the lead is stored: a failure to send never fails the
    // submit. Only a message that was really sent is recorded as sent.
    const delivery = await sendKompas(lead, token, deps.mail)
    if (delivery !== 'skipped') {
      lead = { ...lead, emailStatus: delivery === 'sent' ? 'sent' : 'failed' }
      await deps.store.save(lead)
    }
    if (tips && optInDue(lead, now)) {
      if ((await sendOptIn(lead, deps.mail, now)) === 'sent') {
        lead = { ...lead, optinSentAt: now }
        await deps.store.save(lead)
      }
    }
    return {
      status: 'ok',
      resultsPath: `/srovnani/${token}`,
      eventId,
      email: { status: delivery, address: lead.email },
    }
  } catch {
    return { status: 'error', email: typed(input) }
  }
}

// Old windows are no use to anyone. Called now and then, never on the way of a visitor's answer.
export async function purgeOldRateLimits(deps: LeadDeps): Promise<void> {
  const cutoff = deps.now().getTime() - RATE_LIMIT_KEEP_DAYS * DAY_MS
  await deps.limiter.purgeBefore(new Date(cutoff))
}
