'use server'

// The server actions behind the links in the e-mails and the "send the link again" forms.
// Thin: read the form, call the service, answer. The rules are in src/server.
import { redirect } from 'next/navigation'
import { resendByEmail, resendForToken } from '@/server/resend-link'
import { confirmOptIn, resubscribe } from '@/server/subscriptions'
import { clientIp, leadDeps, subscriptionDeps } from './lead-service'

const text = (data: FormData, name: string) => {
  const value = data.get(name)
  return typeof value === 'string' ? value : ''
}

export type ResendByEmailState =
  { status: 'idle' } | { status: 'invalid'; email: string } | { status: 'done' }

// The form on a link that does not work: the same answer for every address.
export async function resendByEmailAction(
  _previous: ResendByEmailState,
  formData: FormData,
): Promise<ResendByEmailState> {
  const email = text(formData, 'email')
  const result = await resendByEmail(
    email,
    { ip: await clientIp() },
    leadDeps(),
  )
  return result.status === 'invalid'
    ? { status: 'invalid', email }
    : { status: 'done' }
}

export type ResendMineState =
  { status: 'idle' } | { status: 'sent' | 'skipped' | 'failed' | 'limited' }

// The card on the comparison page: a new link to the lead's own address.
// `useActionState` passes the previous state last, after the bound token; it is not needed.
export async function resendMineAction(
  token: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _previous: ResendMineState,
): Promise<ResendMineState> {
  const result = await resendForToken(token, leadDeps())
  if (result.status === 'unknown' || result.status === 'error') {
    return { status: 'failed' }
  }
  return { status: result.status }
}

export async function confirmTipsAction(formData: FormData): Promise<void> {
  const token = text(formData, 'token')
  await confirmOptIn(token, subscriptionDeps())
  // back to the same page: it now says the tips are confirmed (or that the link is dead)
  redirect(`/potvrdit/${encodeURIComponent(token)}`)
}

export async function resubscribeAction(formData: FormData): Promise<void> {
  const token = text(formData, 'token')
  await resubscribe(token, subscriptionDeps())
  redirect(`/odhlasit/${encodeURIComponent(token)}/zpet`)
}
