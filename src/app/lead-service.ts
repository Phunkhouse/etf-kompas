// Wires the lead rules to the real store, the clock and the request. Everything
// else (the rules) lives in src/server/leads.ts; this file only connects.
import { headers } from 'next/headers'
import { leadEnv } from '@/config/env'
import {
  purgeOldRateLimits,
  submitLead,
  type LeadDeps,
  type LeadFormState,
  type LeadInput,
} from '@/server/leads'
import type { MemoryLeadStore } from '@/server/lead-ports'
import { createMemoryLeadStore } from '@/server/memory-store'
import { createSupabaseStore } from '@/server/supabase-store'

const globalForLeads = globalThis as typeof globalThis & {
  __memoryLeads?: MemoryLeadStore
}

// The memory store lives on `globalThis` so every request in one server sees the same data.
export function memoryLeads(): MemoryLeadStore | null {
  if (process.env.LEAD_STORE !== 'memory') return null
  globalForLeads.__memoryLeads ??= createMemoryLeadStore()
  return globalForLeads.__memoryLeads
}

let deps: LeadDeps | null = null

export function leadDeps(): LeadDeps {
  if (deps) return deps
  const env = leadEnv()
  const adapters =
    env.LEAD_STORE === 'memory'
      ? memoryLeads()!
      : createSupabaseStore({
          url: env.SUPABASE_URL,
          secretKey: env.SUPABASE_SECRET_KEY,
        })
  deps = {
    store: adapters.store,
    limiter: adapters.limiter,
    now: () => new Date(),
    secrets: { ipHash: env.IP_HASH_SECRET },
    minFillMs: env.LEAD_STORE === 'memory' ? env.LEAD_MIN_FILL_MS : undefined,
  }
  return deps
}

// The address the platform saw. Vercel puts the real client first in
// x-forwarded-for; without it (local run) every visitor is one.
export async function clientIp(): Promise<string> {
  const list = await headers()
  const forwarded = list.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || list.get('x-real-ip') || 'unknown'
}

export async function handleLead(input: LeadInput): Promise<LeadFormState> {
  let ready: LeadDeps
  try {
    ready = leadDeps()
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'lead setup failed')
    return {
      status: 'error',
      email: typeof input.email === 'string' ? input.email : '',
    }
  }
  const state = await submitLead(input, { ip: await clientIp() }, ready)
  // Now and then, tidy the counters; never on the visitor's way.
  if (Math.random() < 0.02) {
    void purgeOldRateLimits(ready).catch(() => {})
  }
  return state
}
