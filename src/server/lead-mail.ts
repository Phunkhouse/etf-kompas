// The e-mails of the lead flow: a results link and the two messages built from it. The
// sandbox rule lives in `deliver`; a failure to send is an answer, never an exception.
// No imports from next or react.
import { kompasEmail, optInEmail } from './emails'
import type { LeadRecord, LeadStore } from './lead-ports'
import { deliver, type Delivery, type Mailer } from './mailer'
import { signLink } from './signed-links'
import { hashToken, newToken } from './tokens'

export const TOKEN_DAYS = 30
export const OPTIN_DAYS = 7
const DAY_MS = 86_400_000

export type MailDeps = {
  mailer: Mailer
  mode: 'live' | 'sandbox'
  // read at the moment of sending, so a test or a settings change can add to it
  allowlist: string[]
  siteUrl: string
  controller: string
  linkSecret: string
}

// A new results link for a lead: only its hash is stored (SPEC §26).
export async function issueResultsToken(
  store: LeadStore,
  leadId: string,
  now: Date,
): Promise<string> {
  const token = newToken()
  await store.addToken({
    tokenHash: hashToken(token),
    leadId,
    createdAt: now,
    expiresAt: new Date(now.getTime() + TOKEN_DAYS * DAY_MS),
  })
  return token
}

const url = (mail: MailDeps, path: string) =>
  `${mail.siteUrl.replace(/\/+$/, '')}${path}`

function footer(mail: MailDeps, leadId: string) {
  return {
    unsubscribeUrl: url(
      mail,
      `/odhlasit/${signLink({ purpose: 'unsubscribe', leadId }, mail.linkSecret)}`,
    ),
    privacyUrl: url(mail, '/zasady'),
    controller: mail.controller,
  }
}

// The Kompas e-mail with the link of `token`.
export async function sendKompas(
  lead: LeadRecord,
  token: string,
  mail: MailDeps | undefined,
): Promise<Delivery> {
  if (!mail) return 'skipped'
  const content = kompasEmail({
    ...footer(mail, lead.id),
    monthly: lead.calcMonthly,
    years: lead.calcYears,
    resultsUrl: url(mail, `/srovnani/${token}`),
    pdfUrl: url(mail, `/srovnani/${token}/pdf`),
  })
  return deliver(mail.mailer, mail, { to: lead.email, ...content })
}

// The opt-in e-mail for the tips: the link lasts 7 days.
export async function sendOptIn(
  lead: LeadRecord,
  mail: MailDeps | undefined,
  now: Date,
): Promise<Delivery> {
  if (!mail) return 'skipped'
  const expiresAt = new Date(now.getTime() + OPTIN_DAYS * DAY_MS)
  const content = optInEmail({
    ...footer(mail, lead.id),
    confirmUrl: url(
      mail,
      `/potvrdit/${signLink({ purpose: 'optin', leadId: lead.id, expiresAt }, mail.linkSecret)}`,
    ),
  })
  return deliver(mail.mailer, mail, { to: lead.email, ...content })
}

// Whether a new opt-in e-mail is due: the lead has not confirmed, and the last one is
// gone out more than 7 days ago (or never).
export function optInDue(lead: LeadRecord, now: Date): boolean {
  if (lead.consentConfirmedAt !== null) return false
  if (lead.optinSentAt === null) return true
  return now.getTime() >= lead.optinSentAt.getTime() + OPTIN_DAYS * DAY_MS
}
