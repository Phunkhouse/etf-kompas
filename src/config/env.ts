// What the lead flow reads from the environment (see .env.example). Parsed when
// first needed, not on import, so a build without secrets still works. An error
// names the variable and never shows a value.
import { z } from 'zod'

// Only for end-to-end tests: a test types faster than a person (see leads.ts).
const minFillMs = z.coerce.number().int().min(0).optional()

const leadEnvSchema = z.discriminatedUnion('LEAD_STORE', [
  z.object({
    LEAD_STORE: z.literal('memory'),
    LEAD_MIN_FILL_MS: minFillMs,
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
