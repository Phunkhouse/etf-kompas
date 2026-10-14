// What a results link shows (SPEC §26): the lead behind a token, while the token is
// valid. Every way of not working (never issued, expired, malformed, deleted lead,
// a token from before the lead was deleted) gives the same `unknown`, so the page
// cannot be used to find out which addresses exist. No imports from next or react.
import type { LeadRecord } from './lead-ports'
import type { LeadDeps } from './leads'
import { hashToken } from './tokens'

const SHAPE = /^[A-Za-z0-9_-]{43}$/

export type ResultsLookup =
  | { status: 'ok'; lead: LeadRecord; expiresAt: Date }
  | { status: 'unknown' }
  | { status: 'error' }

export async function resolveResults(
  token: string,
  deps: Pick<LeadDeps, 'store' | 'now'>,
): Promise<ResultsLookup> {
  if (!SHAPE.test(token)) return { status: 'unknown' }
  try {
    const record = await deps.store.findToken(hashToken(token))
    if (!record || record.expiresAt <= deps.now()) return { status: 'unknown' }
    const lead = await deps.store.findById(record.leadId)
    if (!lead || lead.deletedAt !== null) return { status: 'unknown' }
    // A lead that was deleted and signed up again is a new person (S-7): links
    // from before that are dead.
    if (record.createdAt < lead.createdAt) return { status: 'unknown' }
    return { status: 'ok', lead, expiresAt: record.expiresAt }
  } catch {
    return { status: 'error' }
  }
}
