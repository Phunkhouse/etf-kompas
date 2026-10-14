// First-party events (Phase 5, PR 2, SPEC §9). The browser sends them to
// POST /api/event; the server writes `lead` itself. Cookieless and aggregate: no IP
// and no user agent is stored, and nothing in an event may look like an e-mail
// address. Pure rules: the store and limiter are passed in. No imports from next or
// react.
import { z } from 'zod'
import { hitEventLimit } from './rate-limits'
import type {
  EventName,
  EventRecord,
  EventStore,
  LeadRecord,
  RateLimiter,
} from './lead-ports'

const MAX_LENGTH = 100

// What the browser may send. `lead` is not in the list: only the server writes it,
// so nobody can invent conversions.
export const BROWSER_EVENTS = [
  'page_view',
  'calc_start',
  'calc_result',
  'gate_view',
  'form_focus',
] as const satisfies readonly EventName[]

// The slider grid and horizons of the calculator (the same as in leads.ts).
const MONTHLY = z
  .number()
  .int()
  .min(500)
  .max(20000)
  .refine((value) => value % 500 === 0)
const YEARS = z.union([z.literal(5), z.literal(10), z.literal(20)])

// A campaign value: no control characters, cut to a safe length, empty is null,
// and never anything that looks like an e-mail address.
const campaign = z
  .string()
  .nullish()
  .transform((value) =>
    value === undefined || value === null
      ? null
      : value
          .replace(/[\u0000-\u001f\u007f]/g, '')
          .trim()
          .slice(0, MAX_LENGTH),
  )
  .transform((value) => (value === '' ? null : value))
  .refine((value) => value === null || !value.includes('@'))

const eventSchema = z
  .strictObject({
    sessionId: z.uuid(),
    name: z.enum(BROWSER_EVENTS),
    variant: z.enum(['a', 'b']),
    utm_source: campaign,
    utm_medium: campaign,
    utm_campaign: campaign,
    utm_content: campaign,
    utm_term: campaign,
    fbclid: campaign,
    device: z.enum(['phone', 'desktop']),
    inAppBrowser: z.boolean(),
    // whether the visitor had agreed to measurement when the event was sent
    measurement: z.boolean(),
    monthly: MONTHLY.optional(),
    years: YEARS.optional(),
  })
  .refine((event) =>
    event.name === 'calc_result'
      ? event.monthly !== undefined && event.years !== undefined
      : event.monthly === undefined && event.years === undefined,
  )

export type BrowserEvent = z.infer<typeof eventSchema>

export function parseEvent(
  body: unknown,
): { ok: true; event: BrowserEvent } | { ok: false } {
  const parsed = eventSchema.safeParse(body)
  return parsed.success ? { ok: true, event: parsed.data } : { ok: false }
}

export type EventDeps = {
  events: EventStore
  limiter: RateLimiter
  now: () => Date
  secrets: { ipHash: string }
}

export type EventResult = 'ok' | 'invalid' | 'limited'

export async function recordEvent(
  body: unknown,
  request: { ip: string },
  deps: EventDeps,
): Promise<EventResult> {
  const limit = await hitEventLimit(deps, request.ip)
  if (!limit.ok) return 'limited'
  const parsed = parseEvent(body)
  if (!parsed.ok) return 'invalid'
  const { event } = parsed
  await deps.events.add({
    id: crypto.randomUUID(),
    // The server's clock; a time from the browser is never read.
    createdAt: deps.now(),
    sessionId: event.sessionId,
    name: event.name,
    variant: event.variant,
    utmSource: event.utm_source,
    utmMedium: event.utm_medium,
    utmCampaign: event.utm_campaign,
    utmContent: event.utm_content,
    utmTerm: event.utm_term,
    // The click id is kept on the first event of a visit only.
    fbclid: event.name === 'page_view' ? event.fbclid : null,
    device: event.device,
    inAppBrowser: event.inAppBrowser,
    consentMeasurement: event.measurement,
    calcMonthly: event.name === 'calc_result' ? (event.monthly ?? null) : null,
    calcYears: event.name === 'calc_result' ? (event.years ?? null) : null,
  })
  return 'ok'
}

// The server's own `lead` event, written when a lead is stored for the first time.
// The session id is passed only when the visitor agreed to measurement. The id is the
// one the vendors dedupe on (the `event_id`).
export function leadEvent(
  lead: LeadRecord,
  sessionId: string | null,
  now: Date,
  id: string,
): EventRecord {
  return {
    id,
    createdAt: now,
    sessionId,
    name: 'lead',
    variant: lead.variant,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    utmContent: lead.utmContent,
    utmTerm: lead.utmTerm,
    fbclid: null,
    device: null,
    inAppBrowser: null,
    consentMeasurement: sessionId !== null,
    calcMonthly: null,
    calcYears: null,
  }
}

// A session id from the lead form: a UUID, or nothing.
export function validSessionId(value: unknown): string | null {
  return typeof value === 'string' && z.uuid().safeParse(value).success
    ? value
    : null
}
