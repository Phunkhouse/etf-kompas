// Wires the first-party event rules to the store and the request. The rules are in
// src/server/events.ts; this file only connects. It needs no e-mail settings.
import { eventEnv } from '@/config/env'
import { recordEvent, type EventDeps, type EventResult } from '@/server/events'
import { createSupabaseStore } from '@/server/supabase-store'
import { memoryLeads } from './lead-service'

let deps: EventDeps | null = null

function eventDeps(): EventDeps {
  if (deps) return deps
  const env = eventEnv()
  const adapters =
    env.LEAD_STORE === 'memory'
      ? memoryLeads()!
      : createSupabaseStore({
          url: env.SUPABASE_URL,
          secretKey: env.SUPABASE_SECRET_KEY,
        })
  deps = {
    events: adapters.events,
    limiter: adapters.limiter,
    now: () => new Date(),
    secrets: { ipHash: env.IP_HASH_SECRET },
  }
  return deps
}

export async function handleEvent(
  body: unknown,
  ip: string,
): Promise<EventResult | 'error'> {
  try {
    return await recordEvent(body, { ip }, eventDeps())
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'event failed')
    return 'error'
  }
}
