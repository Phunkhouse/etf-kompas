// "Poslat odkaz znovu" (SPEC §26): a new results link by e-mail. Asked by an address on
// a dead link, the answer is the same whether the address is known or not; asked by
// the owner of a live link (the card on the results page), no address is taken from the
// visitor. No imports from next or react.
import { issueResultsToken, sendKompas } from './lead-mail'
import type { LeadDeps, LeadRequest } from './leads'
import { validateLead } from './leads'
import { hitEmailLimit, hitIpLimit } from './rate-limits'
import { resolveResults } from './results'

export async function resendByEmail(
  email: unknown,
  request: LeadRequest,
  deps: LeadDeps,
): Promise<{ status: 'ok' | 'invalid' }> {
  const checked = validateLead({ email })
  if (!checked.ok) return { status: 'invalid' }
  try {
    // A limited request gets the same answer, so nothing here tells an address apart.
    if (!(await hitIpLimit(deps, request.ip)).ok) return { status: 'ok' }
    if (!(await hitEmailLimit(deps, checked.lead.email)).ok) {
      return { status: 'ok' }
    }
    const lead = await deps.store.findByEmail(checked.lead.email)
    if (!lead || lead.deletedAt !== null) return { status: 'ok' }
    const token = await issueResultsToken(deps.store, lead.id, deps.now())
    await sendKompas(lead, token, deps.mail)
  } catch {
    // the same answer: a failure here must not tell the address apart either
  }
  return { status: 'ok' }
}

export async function resendForToken(
  token: string,
  deps: LeadDeps,
): Promise<{
  status: 'sent' | 'skipped' | 'failed' | 'limited' | 'unknown' | 'error'
}> {
  const found = await resolveResults(token, deps)
  if (found.status === 'unknown') return { status: 'unknown' }
  if (found.status === 'error') return { status: 'error' }
  try {
    if (!(await hitEmailLimit(deps, found.lead.email)).ok) {
      return { status: 'limited' }
    }
    const fresh = await issueResultsToken(deps.store, found.lead.id, deps.now())
    return { status: await sendKompas(found.lead, fresh, deps.mail) }
  } catch {
    return { status: 'error' }
  }
}
