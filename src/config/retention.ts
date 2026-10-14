// How long personal data is kept (SPEC §19, docs/LEGAL-PACK.md point 5). The two
// numbers are PROVISIONAL: David chose them "for now" on 2026-10-14 and no lawyer has
// seen them. They live here and in two environment variables, so changing a period
// is a configuration change, never a code change. Pure: no imports from next or react.
import { z } from 'zod'

export type RetentionConfig = {
  // a lead is deleted this many calendar months after its last contact
  leadMonthsAfterLastContact: number
  // a lead that unsubscribed is deleted this many days later
  daysAfterUnsubscribe: number
  // the pages say so while this is true
  provisional: boolean
}

const DEFAULTS = { months: 6, days: 30 }

// A whole number from 1 up to a limit, from text. An empty variable counts as not set.
const whole = (max: number, fallback: number) =>
  z.preprocess(
    (value) => (value === '' || value === undefined ? undefined : value),
    z
      .string()
      .regex(/^\d+$/)
      .transform(Number)
      .pipe(z.number().int().min(1).max(max))
      .default(fallback),
  )

const schema = z.object({
  RETENTION_LEAD_MONTHS: whole(120, DEFAULTS.months),
  RETENTION_UNSUBSCRIBED_DAYS: whole(3650, DEFAULTS.days),
})

export function retentionConfig(
  source: Record<string, string | undefined> = process.env,
): RetentionConfig {
  const parsed = schema.safeParse({
    RETENTION_LEAD_MONTHS: source.RETENTION_LEAD_MONTHS,
    RETENTION_UNSUBSCRIBED_DAYS: source.RETENTION_UNSUBSCRIBED_DAYS,
  })
  if (!parsed.success) {
    // The names only, never a value.
    const names = parsed.error.issues
      .map((issue) => issue.path.join('.'))
      .join(', ')
    throw new Error(`Invalid environment variables: ${names}`)
  }
  return {
    leadMonthsAfterLastContact: parsed.data.RETENTION_LEAD_MONTHS,
    daysAfterUnsubscribe: parsed.data.RETENTION_UNSUBSCRIBED_DAYS,
    provisional: true,
  }
}
