import { describe, expect, it } from 'vitest'
import type { LeadRecord, EventRecord, EventName } from './lead-ports'
import { createMemoryLeadStore } from './memory-store'
import { deleteLeadByEmail, purgeDue, type RetentionDeps } from './retention'

// Phase 6, PR 2: cases RT-1 to RT-15 and DL-1 to DL-3 of docs/PHASE-6-PLAN.md.
// Written first. The clock is fixed: "now" is 2026-10-14, months are calendar months
// in UTC. Provisional periods: 6 months after the last contact, 30 days after unsubscribe.
const NOW = new Date('2026-10-14T12:00:00Z')
const DAY = 86_400_000
const CONFIG = {
  leadMonthsAfterLastContact: 6,
  daysAfterUnsubscribe: 30,
  provisional: true,
}
const daysAgo = (days: number) => new Date(NOW.getTime() - days * DAY)
const at = (iso: string) => new Date(iso)

let counter = 0
function uuid(): string {
  counter += 1
  return `00000000-0000-4000-8000-${String(counter).padStart(12, '0')}`
}

function lead(over: Partial<LeadRecord> = {}): LeadRecord {
  const id = over.id ?? uuid()
  return {
    id,
    email: `${id.slice(-12)}@example.cz`,
    createdAt: daysAgo(1),
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    fbclid: null,
    variant: 'a',
    calcMonthly: 3000,
    calcYears: 10,
    marketingConsent: false,
    consentTextVersion: null,
    consentConfirmedAt: null,
    optinSentAt: null,
    sessionId: null,
    emailStatus: 'sent',
    unsubscribedAt: null,
    deletedAt: null,
    ...over,
  }
}

function event(
  createdAt: Date,
  sessionId: string | null,
  name: EventName = 'page_view',
): EventRecord {
  return {
    id: uuid(),
    createdAt,
    sessionId,
    name,
    variant: 'a',
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    fbclid: null,
    device: 'phone',
    inAppBrowser: false,
    consentMeasurement: sessionId !== null,
    calcMonthly: null,
    calcYears: null,
  }
}

function setup() {
  const memory = createMemoryLeadStore()
  const logs: string[] = []
  const deps: RetentionDeps = {
    retention: memory.retention,
    limiter: memory.limiter,
    now: () => NOW,
    config: CONFIG,
    log: (line) => logs.push(line),
  }
  return {
    memory,
    deps,
    logs,
    async add(record: LeadRecord) {
      await memory.store.save(record)
      await memory.store.addToken({
        tokenHash: `hash-${record.id}`,
        leadId: record.id,
        createdAt: record.createdAt,
        expiresAt: new Date(record.createdAt.getTime() + 30 * DAY),
      })
      return record
    },
    ids: () => memory.leads().map((l) => l.id),
  }
}

describe('purgeDue: the 6-month clock', () => {
  it('RT-1 keeps a lead of 5 months and 29 days and deletes one of 6 months and 1 day', async () => {
    const t = setup()
    const kept = await t.add(lead({ createdAt: at('2026-04-15T12:00:00Z') }))
    const gone = await t.add(lead({ createdAt: at('2026-04-13T12:00:00Z') }))
    const result = await purgeDue(t.deps)
    expect(t.ids()).toEqual([kept.id])
    expect(result.leads).toBe(1)
    expect(t.ids()).not.toContain(gone.id)
  })

  it('RT-2 the last contact is the later of created and confirmed', async () => {
    const t = setup()
    const renewed = await t.add(
      lead({
        createdAt: daysAgo(240),
        consentConfirmedAt: daysAgo(60),
      }),
    )
    const old = await t.add(
      lead({
        createdAt: daysAgo(400),
        consentConfirmedAt: daysAgo(210),
      }),
    )
    await purgeDue(t.deps)
    expect(t.ids()).toEqual([renewed.id])
    expect(t.ids()).not.toContain(old.id)
  })

  it('RT-3 the time the opt-in e-mail was sent does not renew the contact', async () => {
    const t = setup()
    const old = await t.add(
      lead({ createdAt: daysAgo(240), optinSentAt: daysAgo(2) }),
    )
    await purgeDue(t.deps)
    expect(t.ids()).not.toContain(old.id)
  })
})

describe('purgeDue: the 30-day clock after unsubscribe', () => {
  it('RT-4 keeps one unsubscribed 29 days ago and deletes one unsubscribed 31 days ago', async () => {
    const t = setup()
    const recent = await t.add(lead({ unsubscribedAt: daysAgo(29) }))
    const due = await t.add(lead({ unsubscribedAt: daysAgo(31) }))
    await purgeDue(t.deps)
    expect(t.ids()).toEqual([recent.id])
    expect(t.ids()).not.toContain(due.id)
  })

  it('RT-5 a lead that subscribed again follows only the 6-month clock', async () => {
    const t = setup()
    const back = await t.add(
      lead({ createdAt: daysAgo(100), unsubscribedAt: null }),
    )
    await purgeDue(t.deps)
    expect(t.ids()).toEqual([back.id])
  })
})

describe('purgeDue: what goes with a lead', () => {
  it('RT-6 deletes the lead’s result tokens and leaves other tokens alone', async () => {
    const t = setup()
    const due = await t.add(lead({ createdAt: daysAgo(300) }))
    const keep = await t.add(lead())
    await purgeDue(t.deps)
    expect(t.memory.tokens().map((token) => token.leadId)).toEqual([keep.id])
    expect(t.ids()).not.toContain(due.id)
  })

  it('RT-7 deletes the events of the due lead’s session and no others', async () => {
    const t = setup()
    const sessionA = uuid()
    const sessionB = uuid()
    await t.add(lead({ createdAt: daysAgo(300), sessionId: sessionA }))
    await t.memory.events.add(event(daysAgo(2), sessionA))
    await t.memory.events.add(event(daysAgo(2), sessionB))
    const result = await purgeDue(t.deps)
    expect(t.memory.eventRows().map((e) => e.sessionId)).toEqual([sessionB])
    expect(result.events).toBe(1)
  })

  it('RT-8 a due lead without a session id deletes no events by session', async () => {
    const t = setup()
    await t.add(lead({ createdAt: daysAgo(300), sessionId: null }))
    await t.memory.events.add(event(daysAgo(2), uuid()))
    await t.memory.events.add(event(daysAgo(2), null, 'lead'))
    await purgeDue(t.deps)
    expect(t.memory.eventRows()).toHaveLength(2)
  })
})

describe('purgeDue: events and rate limits by age', () => {
  it('RT-9 deletes events older than 6 months and keeps newer ones, with or without a lead', async () => {
    const t = setup()
    await t.memory.events.add(event(at('2026-04-13T12:00:00Z'), uuid()))
    await t.memory.events.add(event(at('2026-04-15T12:00:00Z'), uuid()))
    const result = await purgeDue(t.deps)
    expect(t.memory.eventRows()).toHaveLength(1)
    expect(t.memory.eventRows()[0].createdAt).toEqual(
      at('2026-04-15T12:00:00Z'),
    )
    expect(result.events).toBe(1)
  })

  it('RT-10 the server-side lead events (no session id) follow the age rule only', async () => {
    const t = setup()
    await t.memory.events.add(event(daysAgo(300), null, 'lead'))
    await t.memory.events.add(event(daysAgo(10), null, 'lead'))
    await purgeDue(t.deps)
    expect(t.memory.eventRows().map((e) => e.createdAt)).toEqual([daysAgo(10)])
  })

  it('RT-11 purges old rate-limit windows and keeps recent ones', async () => {
    const t = setup()
    await t.memory.limiter.hit('ip:old', daysAgo(3), 5)
    await t.memory.limiter.hit('ip:new', daysAgo(1), 5)
    const result = await purgeDue(t.deps)
    expect(t.memory.limiterWindows().map((w) => w.key)).toEqual(['ip:new'])
    expect(result.rateLimits).toBe(1)
  })
})

describe('purgeDue: failures, privacy, repeats', () => {
  it('RT-12 one failed delete is counted and the others still go', async () => {
    const t = setup()
    const bad = await t.add(lead({ createdAt: daysAgo(300) }))
    const good = await t.add(lead({ createdAt: daysAgo(301) }))
    const original = t.memory.retention.deleteLead
    t.deps.retention = {
      ...t.memory.retention,
      deleteLead: async (id) => {
        if (id === bad.id) throw new Error('boom')
        return original(id)
      },
    }
    const result = await purgeDue(t.deps)
    expect(result).toMatchObject({ leads: 1, failed: 1 })
    expect(t.ids()).toEqual([bad.id])
    expect(t.ids()).not.toContain(good.id)
  })

  it('RT-12 if the events of a lead cannot be deleted the lead is kept for the next run', async () => {
    const t = setup()
    const sessionId = uuid()
    const due = await t.add(lead({ createdAt: daysAgo(300), sessionId }))
    t.deps.retention = {
      ...t.memory.retention,
      deleteEventsBySession: async () => {
        throw new Error('boom')
      },
    }
    const result = await purgeDue(t.deps)
    expect(result).toMatchObject({ leads: 0, failed: 1 })
    expect(t.ids()).toEqual([due.id])
  })

  it('RT-13 the result and the log contain no e-mail address, lead id or session id', async () => {
    const t = setup()
    const sessionId = uuid()
    const due = await t.add(lead({ createdAt: daysAgo(300), sessionId }))
    t.deps.retention = {
      ...t.memory.retention,
      deleteLead: async () => {
        throw new Error(`failed for ${due.email}`)
      },
    }
    const result = await purgeDue(t.deps)
    const text = JSON.stringify(result) + t.logs.join('\n')
    expect(text).not.toContain(due.email)
    expect(text).not.toContain(due.id)
    expect(text).not.toContain(sessionId)
    expect(text).not.toContain('@')
  })

  it('RT-14 a second run right after the first deletes nothing', async () => {
    const t = setup()
    await t.add(lead({ createdAt: daysAgo(300), sessionId: uuid() }))
    await t.memory.events.add(event(daysAgo(300), uuid()))
    await purgeDue(t.deps)
    expect(await purgeDue(t.deps)).toEqual({
      leads: 0,
      events: 0,
      rateLimits: 0,
      failed: 0,
    })
  })

  it('RT-15 an address that was purged can be stored again as a new lead', async () => {
    const t = setup()
    const old = await t.add(lead({ createdAt: daysAgo(300) }))
    await purgeDue(t.deps)
    expect(await t.memory.store.findByEmail(old.email)).toBeNull()
    const again = lead({ email: old.email })
    await t.memory.store.save(again)
    expect((await t.memory.store.findByEmail(old.email))?.id).toBe(again.id)
  })

  it('uses the periods it is given, not fixed numbers', async () => {
    const t = setup()
    await t.add(lead({ createdAt: daysAgo(60) }))
    t.deps.config = { ...CONFIG, leadMonthsAfterLastContact: 1 }
    await purgeDue(t.deps)
    expect(t.ids()).toEqual([])
  })
})

describe('deleteLeadByEmail', () => {
  function erase(t: ReturnType<typeof setup>, email: string) {
    return deleteLeadByEmail(email, {
      store: t.memory.store,
      retention: t.memory.retention,
    })
  }

  it('DL-1 removes a recent lead, its tokens and its session’s events, ignoring the clocks', async () => {
    const t = setup()
    const sessionId = uuid()
    const target = await t.add(lead({ sessionId }))
    const other = await t.add(lead())
    await t.memory.events.add(event(daysAgo(1), sessionId))
    await t.memory.events.add(event(daysAgo(1), uuid()))
    expect(await erase(t, target.email)).toBe('deleted')
    expect(t.ids()).toEqual([other.id])
    expect(t.memory.tokens().map((token) => token.leadId)).toEqual([other.id])
    expect(t.memory.eventRows()).toHaveLength(1)
  })

  it('DL-2 matches the address trimmed and case-insensitively', async () => {
    const t = setup()
    const target = await t.add(lead({ email: 'jana@example.cz' }))
    expect(await erase(t, '  Jana@Example.CZ ')).toBe('deleted')
    expect(t.ids()).not.toContain(target.id)
  })

  it('DL-3 an unknown address says not found and deletes nothing', async () => {
    const t = setup()
    await t.add(lead())
    expect(await erase(t, 'nikdo@example.cz')).toBe('not_found')
    expect(t.ids()).toHaveLength(1)
  })
})
