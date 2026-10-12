'use server'

// The server action behind the e-mail form. Thin: it reads the form, hands it to
// the lead logic and returns the state. It works without JavaScript (a native POST).
import { noStorage, submitLead, type LeadFormState } from '@/server/leads'

export async function sendLead(
  _previous: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  return submitLead(
    { email: formData.get('email'), tips: formData.get('tips') },
    noStorage,
  )
}
