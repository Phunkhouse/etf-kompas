'use server'

// The server action behind the e-mail form. Thin: it reads the form, hands it to
// the lead logic and returns the state. It works without JavaScript (a native POST).
import type { LeadFormState } from '@/server/leads'
import { handleLead } from './lead-service'

const FIELDS = [
  'email',
  'tips',
  'monthly',
  'years',
  'website',
  't',
  'variant',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'sid',
  'ads',
  'fbp',
] as const

export async function sendLead(
  _previous: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const input = Object.fromEntries(
    FIELDS.map((name) => [name, formData.get(name)]),
  )
  return handleLead(input)
}
