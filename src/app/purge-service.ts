// Wires the retention rules to the real store, the clock and the settings. The rules
// are in src/server/retention.ts; this file only connects.
import { retentionConfig } from '@/config/retention'
import { eventEnv } from '@/config/env'
import { purgeDue, type PurgeResult } from '@/server/retention'
import { createSupabaseStore } from '@/server/supabase-store'
import { memoryLeads } from './lead-service'

export async function runPurge(): Promise<PurgeResult> {
  const env = eventEnv()
  const adapters =
    env.LEAD_STORE === 'memory'
      ? memoryLeads()!
      : createSupabaseStore({
          url: env.SUPABASE_URL,
          secretKey: env.SUPABASE_SECRET_KEY,
        })
  return purgeDue({
    retention: adapters.retention,
    limiter: adapters.limiter,
    now: () => new Date(),
    config: retentionConfig(),
    log: (line) => console.log(line),
  })
}
