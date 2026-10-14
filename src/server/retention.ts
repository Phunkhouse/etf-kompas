// Deleting personal data when its time is up (Phase 6, PR 2; SPEC §19,
// docs/LEGAL-PACK.md point 5). The periods are provisional and come in as `config`.
// The result and the log carry counts only: never an address, a lead id or a session id.
// No imports from next or react.
import type { RetentionConfig } from '@/config/retention'
import type {
  LeadRecord,
  LeadStore,
  RateLimiter,
  RetentionStore,
} from './lead-ports'
import { RATE_LIMIT_KEEP_DAYS } from './rate-limits'

const DAY_MS = 86_400_000

export type RetentionDeps = {
  retention: RetentionStore
  limiter: RateLimiter
  now: () => Date
  config: RetentionConfig
  // one fixed line per problem, no personal data
  log?: (line: string) => void
}

export type PurgeResult = {
  leads: number
  events: number
  rateLimits: number
  failed: number
}

// The later of the two moments the person did something. The time our own opt-in
// e-mail went out is not a contact from them.
function lastContact(lead: LeadRecord): Date {
  const confirmed = lead.consentConfirmedAt
  return confirmed !== null && confirmed > lead.createdAt
    ? confirmed
    : lead.createdAt
}

function monthsBefore(now: Date, months: number): Date {
  const date = new Date(now)
  date.setUTCMonth(date.getUTCMonth() - months)
  return date
}

export async function purgeDue(deps: RetentionDeps): Promise<PurgeResult> {
  const now = deps.now()
  const contactCutoff = monthsBefore(
    now,
    deps.config.leadMonthsAfterLastContact,
  )
  const unsubscribeCutoff = new Date(
    now.getTime() - deps.config.daysAfterUnsubscribe * DAY_MS,
  )
  const result: PurgeResult = { leads: 0, events: 0, rateLimits: 0, failed: 0 }
  const fail = (line: string) => {
    result.failed += 1
    deps.log?.(line)
  }

  // 1. leads: after the unsubscribe period, or the contact period, whichever is first
  let candidates: LeadRecord[] = []
  try {
    candidates = await deps.retention.dueCandidates(
      contactCutoff,
      unsubscribeCutoff,
    )
  } catch {
    fail('retention: the list of leads could not be read')
  }
  for (const lead of candidates) {
    const due =
      lastContact(lead) < contactCutoff ||
      (lead.unsubscribedAt !== null && lead.unsubscribedAt < unsubscribeCutoff)
    if (!due) continue
    try {
      // The events first: once the lead is gone nothing links its session to a
      // person, and a failure here must leave the lead for the next run.
      if (lead.sessionId !== null) {
        result.events += await deps.retention.deleteEventsBySession([
          lead.sessionId,
        ])
      }
      await deps.retention.deleteLead(lead.id)
      result.leads += 1
    } catch {
      fail('retention: one lead could not be deleted')
    }
  }

  // 2. events older than the lead period, with or without a lead
  try {
    result.events += await deps.retention.deleteEventsBefore(contactCutoff)
  } catch {
    fail('retention: old events could not be deleted')
  }

  // 3. old rate-limit windows
  try {
    result.rateLimits = await deps.limiter.purgeBefore(
      new Date(now.getTime() - RATE_LIMIT_KEEP_DAYS * DAY_MS),
    )
  } catch {
    fail('retention: old rate-limit windows could not be deleted')
  }

  deps.log?.(
    `retention: ${result.leads} leads, ${result.events} events, ${result.rateLimits} rate-limit rows deleted, ${result.failed} failed`,
  )
  return result
}

// Erasure on request: one person, now, whatever their dates say.
export async function deleteLeadByEmail(
  email: string,
  deps: { store: LeadStore; retention: RetentionStore },
): Promise<'deleted' | 'not_found'> {
  const lead = await deps.store.findByEmail(email.trim().toLowerCase())
  if (!lead) return 'not_found'
  if (lead.sessionId !== null) {
    await deps.retention.deleteEventsBySession([lead.sessionId])
  }
  await deps.retention.deleteLead(lead.id)
  return 'deleted'
}
