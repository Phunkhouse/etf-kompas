// Lead handling for the e-mail form (SPEC §3.3, §26). Pure rules: the store and the
// limiter are passed in, so the same code runs against Supabase, in memory and in
// tests. No imports from next or react.
import { hashEmail, hashIp } from './ip-hash'
import type { LeadRecord, LeadStore, RateLimiter } from './lead-ports'
import { hashToken, newToken } from './tokens'

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
}

export type Lead = { email: string; tips: boolean }

export type LeadFormState =
  | { status: 'idle' }
  | { status: 'invalid'; email: string }
  | { status: 'error'; email: string }
  | { status: 'limited'; retryAfterSeconds: number }
  | { status: 'ok'; resultsPath: string }

export type LeadDeps = {
  store: LeadStore
  limiter: RateLimiter
  now: () => Date
  secrets: { ipHash: string }
  // The shortest time a person needs to fill the form; default 2000 ms. Only
  // end-to-end tests lower it, because a test types faster than a person.
  minFillMs?: number
}

export type LeadRequest = { ip: string }

// The wording the visitor agreed to is versioned, so a later change is visible.
export const CONSENT_TEXT_VERSION = '2026-10-tips-v1'

const MAX_LENGTH = 254
const MAX_TRACKING_LENGTH = 200
const MIN_FILL_MS = 2000
const IP_LIMIT_PER_HOUR = 5
const EMAIL_LIMIT_PER_DAY = 3
const TOKEN_DAYS = 30
const RATE_LIMIT_KEEP_DAYS = 2
const HOUR_MS = 3_600_000
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

function startOfHour(date: Date): Date {
  return new Date(Math.floor(date.getTime() / HOUR_MS) * HOUR_MS)
}

function startOfDay(date: Date): Date {
  return new Date(Math.floor(date.getTime() / DAY_MS) * DAY_MS)
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
    marketingConsent: tips,
    consentTextVersion: tips ? CONSENT_TEXT_VERSION : null,
    consentConfirmedAt: null,
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
      return { status: 'ok', resultsPath: `/srovnani/${newToken()}` }
    }

    const now = deps.now()
    const ipKey = `ip:${hashIp(request.ip, deps.secrets.ipHash, now)}`
    const withinIpLimit = await deps.limiter.hit(
      ipKey,
      startOfHour(now),
      IP_LIMIT_PER_HOUR,
    )
    if (!withinIpLimit) {
      const next = startOfHour(now).getTime() + HOUR_MS
      return {
        status: 'limited',
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((next - now.getTime()) / 1000),
        ),
      }
    }

    const result = validateLead(input)
    const setup = validateSetup(input)
    if (!result.ok || !setup) return { status: 'invalid', email: typed(input) }
    const { email, tips } = result.lead

    const emailKey = `email:${hashEmail(email, deps.secrets.ipHash)}`
    const withinEmailLimit = await deps.limiter.hit(
      emailKey,
      startOfDay(now),
      EMAIL_LIMIT_PER_DAY,
    )
    if (!withinEmailLimit) {
      const next = startOfDay(now).getTime() + DAY_MS
      return {
        status: 'limited',
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((next - now.getTime()) / 1000),
        ),
      }
    }

    const existing = await deps.store.findByEmail(email)
    const lead = existing
      ? mergeLead(existing, input, tips, setup, now)
      : newLead(input, email, tips, setup, now, crypto.randomUUID())
    await deps.store.save(lead)

    const token = newToken()
    await deps.store.addToken({
      tokenHash: hashToken(token),
      leadId: lead.id,
      createdAt: now,
      expiresAt: new Date(now.getTime() + TOKEN_DAYS * DAY_MS),
    })
    return { status: 'ok', resultsPath: `/srovnani/${token}` }
  } catch {
    return { status: 'error', email: typed(input) }
  }
}

// Old windows are no use to anyone. Called now and then, never on the way of a visitor's answer.
export async function purgeOldRateLimits(deps: LeadDeps): Promise<void> {
  const cutoff = deps.now().getTime() - RATE_LIMIT_KEEP_DAYS * DAY_MS
  await deps.limiter.purgeBefore(new Date(cutoff))
}
