// What the lead flow reads from the environment (see .env.example). Parsed when
// first needed, not on import, so a build without secrets still works. An error
// names the variable and never shows a value.
import { z } from 'zod'

// Only for end-to-end tests: a test types faster than a person (see leads.ts).
const minFillMs = z.coerce.number().int().min(0).optional()

// An empty variable (`NAME=` in .env.local) counts as not set.
const blank = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema)

// The e-mail settings both stores share. `live` sends to anyone; `sandbox` only to the
// allowlist (comma separated) and the page never says an e-mail was sent otherwise.
const mailShape = {
  EMAIL_MODE: blank(z.enum(['live', 'sandbox']).default('sandbox')),
  EMAIL_SANDBOX_ALLOWLIST: blank(
    z
      .string()
      .default('')
      .transform((list) =>
        list
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      ),
  ),
  EMAIL_REPLY_TO: blank(z.string().optional()),
}

const leadEnvSchema = z.discriminatedUnion('LEAD_STORE', [
  z.object({
    LEAD_STORE: z.literal('memory'),
    LEAD_MIN_FILL_MS: minFillMs,
    IP_HASH_SECRET: z
      .string()
      .min(32)
      .default('memory-store-only-not-a-secret!!'),
    TOKEN_SIGNING_SECRET: blank(
      z.string().min(32).default('memory-store-links-not-a-secret!!!'),
    ),
    SITE_URL: blank(z.url().default('http://localhost:3000')),
    ...mailShape,
  }),
  z.object({
    LEAD_STORE: z.literal('supabase').default('supabase'),
    SUPABASE_URL: z.url(),
    SUPABASE_SECRET_KEY: z.string().min(1),
    IP_HASH_SECRET: z.string().min(32),
    TOKEN_SIGNING_SECRET: z.string().min(32),
    SITE_URL: z.url(),
    RESEND_API_KEY: z.string().min(1),
    EMAIL_FROM: z.string().min(3),
    ...mailShape,
  }),
])

export type LeadEnv = z.infer<typeof leadEnvSchema>

export function leadEnv(
  source: Record<string, string | undefined> = process.env,
): LeadEnv {
  const parsed = leadEnvSchema.safeParse({
    ...source,
    LEAD_STORE: source.LEAD_STORE || 'supabase',
  })
  if (!parsed.success) {
    const names = parsed.error.issues
      .map((issue) => issue.path.join('.'))
      .join(', ')
    throw new Error(`Missing or invalid environment variables: ${names}`)
  }
  return parsed.data
}

// What the first-party events need: only the store and the hashing secret, so they
// work without the e-mail settings (SPEC §17.12).
const eventEnvSchema = z.discriminatedUnion('LEAD_STORE', [
  z.object({
    LEAD_STORE: z.literal('memory'),
    IP_HASH_SECRET: z
      .string()
      .min(32)
      .default('memory-store-only-not-a-secret!!'),
  }),
  z.object({
    LEAD_STORE: z.literal('supabase').default('supabase'),
    SUPABASE_URL: z.url(),
    SUPABASE_SECRET_KEY: z.string().min(1),
    IP_HASH_SECRET: z.string().min(32),
  }),
])

export type EventEnv = z.infer<typeof eventEnvSchema>

export function eventEnv(
  source: Record<string, string | undefined> = process.env,
): EventEnv {
  const parsed = eventEnvSchema.safeParse({
    ...source,
    LEAD_STORE: source.LEAD_STORE || 'supabase',
  })
  if (!parsed.success) {
    const names = parsed.error.issues
      .map((issue) => issue.path.join('.'))
      .join(', ')
    throw new Error(`Missing or invalid environment variables: ${names}`)
  }
  return parsed.data
}

// The ad and measurement tags (Phase 5, PR 3). Both are optional and not secret: the
// ids are visible on any page that uses the tags. They are read when the page is
// built and written into the tracker script. A missing or malformed id means that
// vendor is never loaded; the warning names the variable and never shows a value.
export type TrackingIds = { ga4: string | null; pixel: string | null }

const GA4_ID = /^G-[A-Z0-9]{4,20}$/
const PIXEL_ID = /^\d{6,20}$/

export function trackingEnv(
  source: Record<string, string | undefined> = process.env,
): TrackingIds {
  const read = (name: string, pattern: RegExp): string | null => {
    const value = source[name]?.trim()
    if (!value) return null
    if (pattern.test(value)) return value
    console.warn(`${name} is not a valid id and is ignored.`)
    return null
  }
  return {
    ga4: read('GA4_MEASUREMENT_ID', GA4_ID),
    pixel: read('META_PIXEL_ID', PIXEL_ID),
  }
}

// The Meta Conversions API (Phase 5, PR 4). The call is made only when the pixel id, the
// token and the Graph API version are all set; a half-configured set counts as not
// configured, with a warning that names the variable. There is no default version: it is
// read from Meta's documentation when the account exists (TODO_VERIFY). `META_GRAPH_BASE`
// points the call at a local stub and is honoured only with the in-memory store.
export type MetaServerConfig = {
  pixelId: string
  token: string
  version: string
  base: string
}

export function metaServerEnv(
  source: Record<string, string | undefined> = process.env,
): MetaServerConfig | null {
  const pixelId = trackingEnv(source).pixel
  const token = source.META_CAPI_TOKEN?.trim() || null
  const version = source.META_GRAPH_VERSION?.trim() || null
  if (!pixelId && !token && !version) return null
  if (!pixelId || !token || !version) {
    const missing = [
      !pixelId && 'META_PIXEL_ID',
      !token && 'META_CAPI_TOKEN',
      !version && 'META_GRAPH_VERSION',
    ].filter(Boolean)
    console.warn(
      `Meta Conversions API is off: ${missing.join(', ')} not set or not valid.`,
    )
    return null
  }
  if (!/^v\d+\.\d+$/.test(version)) {
    console.warn(
      'META_GRAPH_VERSION is not valid, Meta Conversions API is off.',
    )
    return null
  }
  const base =
    source.LEAD_STORE === 'memory' && source.META_GRAPH_BASE
      ? source.META_GRAPH_BASE
      : 'https://graph.facebook.com'
  return { pixelId, token, version, base }
}
