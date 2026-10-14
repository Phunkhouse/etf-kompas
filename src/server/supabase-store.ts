// The lead store and rate limiter on Supabase, over its REST API with plain
// `fetch` (no SDK, note to be written). The secret key bypasses RLS and must
// stay on the server. No imports from next or react.
import type {
  EmailStatus,
  LeadRecord,
  LeadStore,
  RateLimiter,
  TokenRecord,
} from './lead-ports'

type Row = {
  id: string
  email: string
  created_at: string
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  fbclid: string | null
  variant: 'a' | 'b' | null
  calc_monthly_bucket: number | null
  calc_years: number | null
  marketing_consent: boolean
  consent_text_version: string | null
  consent_confirmed_at: string | null
  email_status: EmailStatus
  unsubscribed_at: string | null
  deleted_at: string | null
}

type TokenRow = {
  token_hash: string
  lead_id: string
  created_at: string
  expires_at: string
}

const date = (value: string | null) => (value === null ? null : new Date(value))
const iso = (value: Date | null) =>
  value === null ? null : value.toISOString()

function fromRow(row: Row): LeadRecord {
  return {
    id: row.id,
    email: row.email,
    createdAt: new Date(row.created_at),
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    utmContent: row.utm_content,
    utmTerm: row.utm_term,
    fbclid: row.fbclid,
    variant: row.variant ?? 'a',
    calcMonthly: row.calc_monthly_bucket ?? 0,
    calcYears: row.calc_years ?? 0,
    marketingConsent: row.marketing_consent,
    consentTextVersion: row.consent_text_version,
    consentConfirmedAt: date(row.consent_confirmed_at),
    emailStatus: row.email_status,
    unsubscribedAt: date(row.unsubscribed_at),
    deletedAt: date(row.deleted_at),
  }
}

function toRow(lead: LeadRecord): Row {
  return {
    id: lead.id,
    email: lead.email,
    created_at: lead.createdAt.toISOString(),
    utm_source: lead.utmSource,
    utm_medium: lead.utmMedium,
    utm_campaign: lead.utmCampaign,
    utm_content: lead.utmContent,
    utm_term: lead.utmTerm,
    fbclid: lead.fbclid,
    variant: lead.variant,
    calc_monthly_bucket: lead.calcMonthly,
    calc_years: lead.calcYears,
    marketing_consent: lead.marketingConsent,
    consent_text_version: lead.consentTextVersion,
    consent_confirmed_at: iso(lead.consentConfirmedAt),
    email_status: lead.emailStatus,
    unsubscribed_at: iso(lead.unsubscribedAt),
    deleted_at: iso(lead.deletedAt),
  }
}

export type SupabaseConfig = { url: string; secretKey: string }

export function createSupabaseStore(config: SupabaseConfig): {
  store: LeadStore
  limiter: RateLimiter
} {
  const base = `${config.url.replace(/\/+$/, '')}/rest/v1`
  // The new secret keys (sb_secret_…) are not JWTs and go in `apikey` only.
  const auth: Record<string, string> = { apikey: config.secretKey }
  if (config.secretKey.startsWith('eyJ')) {
    auth.Authorization = `Bearer ${config.secretKey}`
  }

  async function call(
    path: string,
    init: { method: string; body?: unknown; prefer?: string },
  ): Promise<Response> {
    const response = await fetch(`${base}${path}`, {
      method: init.method,
      headers: {
        ...auth,
        'Content-Type': 'application/json',
        ...(init.prefer ? { Prefer: init.prefer } : {}),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: 'no-store',
    })
    if (!response.ok) {
      // The status only: the body can echo the data we sent.
      throw new Error(
        `Supabase ${init.method} ${path.split('?')[0]}: ${response.status}`,
      )
    }
    return response
  }

  const store: LeadStore = {
    async findByEmail(email) {
      const response = await call(
        `/leads?email=eq.${encodeURIComponent(email)}&select=*&limit=1`,
        { method: 'GET' },
      )
      const rows = (await response.json()) as Row[]
      return rows.length === 0 ? null : fromRow(rows[0])
    },
    async save(lead) {
      await call('/leads?on_conflict=id', {
        method: 'POST',
        body: toRow(lead),
        prefer: 'resolution=merge-duplicates,return=minimal',
      })
    },
    async findToken(tokenHash) {
      const response = await call(
        `/result_tokens?token_hash=eq.${encodeURIComponent(tokenHash)}&select=*&limit=1`,
        { method: 'GET' },
      )
      const rows = (await response.json()) as TokenRow[]
      if (rows.length === 0) return null
      return {
        tokenHash: rows[0].token_hash,
        leadId: rows[0].lead_id,
        createdAt: new Date(rows[0].created_at),
        expiresAt: new Date(rows[0].expires_at),
      }
    },
    async findById(id) {
      const response = await call(
        `/leads?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
        { method: 'GET' },
      )
      const rows = (await response.json()) as Row[]
      return rows.length === 0 ? null : fromRow(rows[0])
    },
    async addToken(token: TokenRecord) {
      await call('/result_tokens', {
        method: 'POST',
        body: {
          token_hash: token.tokenHash,
          lead_id: token.leadId,
          created_at: token.createdAt.toISOString(),
          expires_at: token.expiresAt.toISOString(),
        },
        prefer: 'return=minimal',
      })
    },
  }

  const limiter: RateLimiter = {
    async hit(key, windowStart, limit) {
      const response = await call('/rpc/rate_limit_hit', {
        method: 'POST',
        body: {
          p_key: key,
          p_window_start: windowStart.toISOString(),
          p_limit: limit,
        },
      })
      return (await response.json()) === true
    },
    async purgeBefore(cutoff) {
      await call(
        `/rate_limits?window_start=lt.${encodeURIComponent(cutoff.toISOString())}`,
        { method: 'DELETE', prefer: 'return=minimal' },
      )
    },
  }

  return { store, limiter }
}
