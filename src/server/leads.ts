// Lead handling for the e-mail form (SPEC §3.3, §26). Before Phase 4 a valid lead
// goes nowhere (`noStorage`); Phase 4 adds a sink that stores it and sends the
// e-mail. Pure: no imports from next or react.
export type LeadInput = { email: unknown; tips?: unknown }

export type Lead = { email: string; tips: boolean }

export type LeadFormState =
  | { status: 'idle' }
  | { status: 'invalid'; email: string }
  | { status: 'error'; email: string }
  | { status: 'ok' }

// Where a valid lead goes.
export type LeadSink = (lead: Lead) => Promise<void>

const MAX_LENGTH = 254

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

// Before Phase 4: nothing is stored, logged or sent.
export const noStorage: LeadSink = async () => {}

function typed(input: LeadInput): string {
  return typeof input.email === 'string' ? input.email : ''
}

export async function submitLead(
  input: LeadInput,
  sink: LeadSink,
): Promise<LeadFormState> {
  const result = validateLead(input)
  if (!result.ok) return { status: 'invalid', email: typed(input) }
  try {
    await sink(result.lead)
    return { status: 'ok' }
  } catch {
    return { status: 'error', email: typed(input) }
  }
}
