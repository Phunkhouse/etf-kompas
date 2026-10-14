// An in-memory store and limiter for tests and for the e2e run (LEAD_STORE=memory).
// It forgets everything on restart and is refused on Vercel, so it cannot hold
// real leads by mistake. No imports from next or react.
import type {
  LeadRecord,
  MemoryLeadStore,
  RateLimiter,
  TokenRecord,
} from './lead-ports'

export function createMemoryLeadStore(): MemoryLeadStore {
  if (process.env.VERCEL) {
    throw new Error('The in-memory lead store is not allowed on Vercel.')
  }
  const leads = new Map<string, LeadRecord>()
  const tokens: TokenRecord[] = []
  const windows = new Map<
    string,
    { key: string; windowStart: Date; hits: number }
  >()

  const limiter: RateLimiter = {
    async hit(key, windowStart, limit) {
      const id = `${key}|${windowStart.toISOString()}`
      const row = windows.get(id) ?? { key, windowStart, hits: 0 }
      row.hits += 1
      windows.set(id, row)
      return row.hits <= limit
    },
    async purgeBefore(date) {
      for (const [id, row] of windows) {
        if (row.windowStart < date) windows.delete(id)
      }
    },
  }

  return {
    store: {
      async findByEmail(email) {
        for (const lead of leads.values()) {
          if (lead.email === email) return { ...lead }
        }
        return null
      },
      async save(lead) {
        leads.set(lead.id, { ...lead })
      },
      async addToken(token) {
        tokens.push({ ...token })
      },
    },
    limiter,
    leads: () => [...leads.values()].map((lead) => ({ ...lead })),
    tokens: () => tokens.map((token) => ({ ...token })),
    limiterWindows: () => [...windows.values()].map((row) => ({ ...row })),
  }
}
