// The Meta Conversions API call for a new lead (Phase 5, PR 4). Pure: the HTTP call
// goes through an injected `fetch`, the clock is a parameter. No imports from next or
// react. It is made only with advertising consent and only when fully configured
// (`metaServerEnv`); a failure is logged without the e-mail, the token or the
// response body and never reaches the visitor.
import { createHash } from 'node:crypto'

export type CapiConfig = {
  pixelId: string
  token: string
  // The Graph API version, e.g. "vNN.N". No default: TODO_VERIFY in Meta's documentation.
  version: string
  // https://graph.facebook.com, or a local stub in the e2e run
  base: string
  // the public address of the site, sent as the event source
  siteUrl: string
}

export type CapiLead = {
  eventId: string
  email: string
  time: Date
  ip: string
  userAgent: string | null
  fbclid: string | null
  fbp: string | null
}

const TIMEOUT_MS = 3000

export const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex')

// `fbc` is built from the stored click id (format from Meta's documentation, checked
// in Test Events at the end of the phase: TODO_VERIFY).
function fbc(lead: CapiLead): string | null {
  return lead.fbclid ? `fb.1.${lead.time.getTime()}.${lead.fbclid}` : null
}

export function buildLeadRequest(
  config: CapiConfig,
  lead: CapiLead,
): { url: string; body: unknown } {
  const userData: Record<string, unknown> = {
    em: [sha256(lead.email.trim().toLowerCase())],
    client_ip_address: lead.ip,
  }
  if (lead.userAgent) userData.client_user_agent = lead.userAgent
  const click = fbc(lead)
  if (click) userData.fbc = click
  if (lead.fbp) userData.fbp = lead.fbp
  return {
    url: `${config.base.replace(/\/+$/, '')}/${config.version}/${config.pixelId}/events`,
    body: {
      data: [
        {
          event_name: 'Lead',
          event_id: lead.eventId,
          event_time: Math.floor(lead.time.getTime() / 1000),
          action_source: 'website',
          event_source_url: config.siteUrl,
          user_data: userData,
        },
      ],
      access_token: config.token,
    },
  }
}

export async function sendLeadToMeta(
  config: CapiConfig,
  lead: CapiLead,
  doFetch: typeof fetch = fetch,
): Promise<void> {
  const { url, body } = buildLeadRequest(config, lead)
  try {
    const response = await doFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!response.ok) {
      console.error(`Meta Conversions API answered ${response.status}.`)
    }
  } catch (error) {
    // the name only: a message can carry the address or the token
    console.error(
      `Meta Conversions API call failed (${error instanceof Error ? error.name : 'error'}).`,
    )
  }
}
