// An in-memory store and limiter for tests and for the e2e run (LEAD_STORE=memory).
// It forgets everything on restart and is refused on Vercel, so it cannot hold
// real leads by mistake. No imports from next or react.
import type {
  EventRecord,
  LeadRecord,
  MemoryLeadStore,
  RateLimiter,
  RetentionStore,
  TokenRecord,
} from './lead-ports'

export function createMemoryLeadStore(): MemoryLeadStore {
  if (process.env.VERCEL) {
    throw new Error('The in-memory lead store is not allowed on Vercel.')
  }
  const leads = new Map<string, LeadRecord>()
  const tokens: TokenRecord[] = []
  const events: EventRecord[] = []
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
      let removed = 0
      for (const [id, row] of windows) {
        if (row.windowStart < date) {
          windows.delete(id)
          removed += 1
        }
      }
      return removed
    },
  }

  const retention: RetentionStore = {
    async dueCandidates(createdBefore, unsubscribedBefore) {
      return [...leads.values()]
        .filter(
          (lead) =>
            lead.createdAt < createdBefore ||
            (lead.unsubscribedAt !== null &&
              lead.unsubscribedAt < unsubscribedBefore),
        )
        .map((lead) => ({ ...lead }))
    },
    async deleteLead(id) {
      leads.delete(id)
      for (let i = tokens.length - 1; i >= 0; i -= 1) {
        if (tokens[i].leadId === id) tokens.splice(i, 1)
      }
    },
    async deleteEventsBySession(sessionIds) {
      return removeEvents((event) =>
        event.sessionId !== null ? sessionIds.includes(event.sessionId) : false,
      )
    },
    async deleteEventsBefore(date) {
      return removeEvents((event) => event.createdAt < date)
    },
  }

  function removeEvents(test: (event: EventRecord) => boolean): number {
    let removed = 0
    for (let i = events.length - 1; i >= 0; i -= 1) {
      if (test(events[i])) {
        events.splice(i, 1)
        removed += 1
      }
    }
    return removed
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
      async findToken(tokenHash) {
        const found = tokens.find((token) => token.tokenHash === tokenHash)
        return found ? { ...found } : null
      },
      async findById(id) {
        const found = leads.get(id)
        return found ? { ...found } : null
      },
    },
    limiter,
    retention,
    events: {
      async add(event) {
        events.push({ ...event })
      },
    },
    eventRows: () => events.map((event) => ({ ...event })),
    leads: () => [...leads.values()].map((lead) => ({ ...lead })),
    tokens: () => tokens.map((token) => ({ ...token })),
    limiterWindows: () => [...windows.values()].map((row) => ({ ...row })),
    ageLead(email, days) {
      const shift = (value: Date | null) =>
        value === null ? null : new Date(value.getTime() - days * 86_400_000)
      for (const [id, lead] of leads) {
        if (lead.email !== email) continue
        leads.set(id, {
          ...lead,
          createdAt: shift(lead.createdAt)!,
          consentConfirmedAt: shift(lead.consentConfirmedAt),
          optinSentAt: shift(lead.optinSentAt),
          unsubscribedAt: shift(lead.unsubscribedAt),
        })
      }
    },
    expireTokens(email, now) {
      const ids = [...leads.values()]
        .filter((lead) => lead.email === email)
        .map((lead) => lead.id)
      for (const token of tokens) {
        if (ids.includes(token.leadId)) {
          token.expiresAt = new Date(now.getTime() - 1000)
        }
      }
    },
  }
}
