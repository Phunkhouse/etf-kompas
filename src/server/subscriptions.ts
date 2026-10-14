// Confirming the tips (double opt-in), unsubscribing and subscribing back. Opening a link
// changes nothing: `checkLink` only looks, because mail scanners open links before the
// visitor does (decision of David, 2026-10-14). No imports from next or react.
import { issueResultsToken } from './lead-mail'
import type { LeadRecord, LeadStore } from './lead-ports'
import { verifyLink, type LinkPurpose } from './signed-links'

export type SubscriptionDeps = {
  store: LeadStore
  now: () => Date
  linkSecret: string
}

// The lead a link is for, or null: bad signature, expired, wrong purpose, unknown or deleted.
async function leadOf(
  token: string,
  purpose: LinkPurpose,
  deps: SubscriptionDeps,
): Promise<LeadRecord | null> {
  const verified = verifyLink(token, purpose, deps.linkSecret, deps.now())
  if (!verified.ok) return null
  const lead = await deps.store.findById(verified.leadId)
  return lead && lead.deletedAt === null ? lead : null
}

export async function checkLink(
  token: string,
  purpose: LinkPurpose,
  deps: SubscriptionDeps,
): Promise<{ status: 'valid' | 'invalid' | 'confirmed' }> {
  try {
    const lead = await leadOf(token, purpose, deps)
    if (!lead) return { status: 'invalid' }
    if (purpose === 'optin' && lead.consentConfirmedAt !== null) {
      return { status: 'confirmed' }
    }
    return { status: 'valid' }
  } catch {
    return { status: 'invalid' }
  }
}

export async function confirmOptIn(
  token: string,
  deps: SubscriptionDeps,
): Promise<
  | { status: 'confirmed'; resultsPath: string }
  | { status: 'invalid' }
  | { status: 'error' }
> {
  try {
    const lead = await leadOf(token, 'optin', deps)
    if (!lead) return { status: 'invalid' }
    const now = deps.now()
    // An old link used again changes nothing: not the date, and not a later unsubscribe.
    if (lead.consentConfirmedAt === null) {
      await deps.store.save({
        ...lead,
        marketingConsent: true,
        consentConfirmedAt: now,
        unsubscribedAt: null,
      })
    }
    // "Zpět na srovnání": only the hash of the old link is kept, so a fresh one is made.
    const results = await issueResultsToken(deps.store, lead.id, now)
    return { status: 'confirmed', resultsPath: `/srovnani/${results}` }
  } catch {
    return { status: 'error' }
  }
}

export async function unsubscribe(
  token: string,
  deps: SubscriptionDeps,
): Promise<
  { status: 'unsubscribed' } | { status: 'invalid' } | { status: 'error' }
> {
  try {
    const lead = await leadOf(token, 'unsubscribe', deps)
    if (!lead) return { status: 'invalid' }
    // The first date stays; the consent record is not touched, only the mail stops.
    if (lead.unsubscribedAt === null) {
      await deps.store.save({ ...lead, unsubscribedAt: deps.now() })
    }
    return { status: 'unsubscribed' }
  } catch {
    return { status: 'error' }
  }
}

export async function resubscribe(
  token: string,
  deps: SubscriptionDeps,
): Promise<
  { status: 'subscribed' } | { status: 'invalid' } | { status: 'error' }
> {
  try {
    const lead = await leadOf(token, 'unsubscribe', deps)
    if (!lead) return { status: 'invalid' }
    if (lead.unsubscribedAt !== null) {
      await deps.store.save({ ...lead, unsubscribedAt: null })
    }
    return { status: 'subscribed' }
  } catch {
    return { status: 'error' }
  }
}
