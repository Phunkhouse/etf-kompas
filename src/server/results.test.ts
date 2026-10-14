import { describe, expect, it, vi } from 'vitest'
import { createMemoryLeadStore } from './memory-store'
import { resolveResults } from './results'
import { submitLead, type LeadDeps } from './leads'
import { hashToken } from './tokens'

// Phase 4, PR 2: test case T-2 of docs/PHASE-4-PLAN.md (a token resolves its lead
// until it expires; everything else gives one "unknown" answer). Written first.
const START = new Date('2026-10-14T10:00:00Z')
const DAY = 86_400_000

function setup() {
  const memory = createMemoryLeadStore()
  let current = START
  const deps: LeadDeps = {
    store: memory.store,
    limiter: memory.limiter,
    now: () => current,
    secrets: { ipHash: 'a-test-secret-of-at-least-32-bytes!!' },
  }
  const submit = async (extra: Record<string, unknown> = {}) => {
    const result = await submitLead(
      { email: 'jmeno@domena.cz', monthly: '5000', years: '20', ...extra },
      { ip: '203.0.113.7' },
      deps,
    )
    if (result.status !== 'ok') throw new Error(result.status)
    return result.resultsPath.replace('/srovnani/', '')
  }
  return {
    memory,
    deps,
    submit,
    at: (date: Date) => {
      current = date
    },
    now: () => current,
  }
}

describe('T-2: resolveResults', () => {
  it('gives the lead for a valid token, with the setup it stored', async () => {
    const { deps, submit, memory } = setup()
    const token = await submit()
    const result = await resolveResults(token, deps)
    expect(result.status).toBe('ok')
    if (result.status !== 'ok') return
    expect(result.lead).toMatchObject({
      id: memory.leads()[0].id,
      calcMonthly: 5000,
      calcYears: 20,
    })
    expect(result.expiresAt).toEqual(new Date(START.getTime() + 30 * DAY))
  })

  it('works one second before the expiry and not at the expiry', async () => {
    const { deps, submit, at } = setup()
    const token = await submit()
    at(new Date(START.getTime() + 30 * DAY - 1000))
    expect((await resolveResults(token, deps)).status).toBe('ok')
    at(new Date(START.getTime() + 30 * DAY))
    expect(await resolveResults(token, deps)).toEqual({ status: 'unknown' })
  })

  it('says unknown for a token that was never issued', async () => {
    const { deps } = setup()
    expect(await resolveResults('A'.repeat(43), deps)).toEqual({
      status: 'unknown',
    })
  })

  it.each([
    ['empty', ''],
    ['too short', 'abc'],
    ['too long', 'A'.repeat(44)],
    ['a bad character', `${'A'.repeat(42)}!`],
    ['a space', `${'A'.repeat(42)} `],
    ['a path trick', '../../etc/passwd'],
    ['huge', 'A'.repeat(10_000)],
  ])(
    'says unknown for a malformed token (%s) without asking the store',
    async (_label, token) => {
      const { deps } = setup()
      const findToken = vi.spyOn(deps.store, 'findToken')
      expect(await resolveResults(token, deps)).toEqual({ status: 'unknown' })
      expect(findToken).not.toHaveBeenCalled()
    },
  )

  it('says the same for expired, unknown and malformed tokens', async () => {
    const { deps, submit, at } = setup()
    const token = await submit()
    at(new Date(START.getTime() + 31 * DAY))
    const answers = await Promise.all([
      resolveResults(token, deps),
      resolveResults('B'.repeat(43), deps),
      resolveResults('nope', deps),
    ])
    expect(new Set(answers.map((a) => JSON.stringify(a))).size).toBe(1)
  })

  it('says unknown when the lead is deleted', async () => {
    const { deps, submit, memory } = setup()
    const token = await submit()
    await deps.store.save({ ...memory.leads()[0], deletedAt: START })
    expect(await resolveResults(token, deps)).toEqual({ status: 'unknown' })
  })

  it('keeps a token of an unsubscribed lead working (the comparison is not marketing)', async () => {
    const { deps, submit, memory } = setup()
    const token = await submit()
    await deps.store.save({ ...memory.leads()[0], unsubscribedAt: START })
    expect((await resolveResults(token, deps)).status).toBe('ok')
  })

  it('does not honour a token from before the lead was deleted and signed up again', async () => {
    const { deps, submit, memory, at } = setup()
    const oldToken = await submit()
    await deps.store.save({ ...memory.leads()[0], deletedAt: START })
    at(new Date(START.getTime() + 2 * DAY))
    const newToken = await submit()
    expect(await resolveResults(oldToken, deps)).toEqual({ status: 'unknown' })
    expect((await resolveResults(newToken, deps)).status).toBe('ok')
  })

  it('keeps an older token working after a second submit of the same live lead', async () => {
    const { deps, submit, at } = setup()
    const first = await submit()
    at(new Date(START.getTime() + DAY))
    const second = await submit({ monthly: '2000' })
    expect((await resolveResults(first, deps)).status).toBe('ok')
    const result = await resolveResults(second, deps)
    expect(result.status === 'ok' && result.lead.calcMonthly).toBe(2000)
    // both links show the lead's latest setup, as there is one lead
    const old = await resolveResults(first, deps)
    expect(old.status === 'ok' && old.lead.calcMonthly).toBe(2000)
  })

  it('says error, not unknown, when the store fails, so a page can answer 500', async () => {
    const { deps, submit } = setup()
    const token = await submit()
    deps.store = {
      ...deps.store,
      findToken: async () => {
        throw new Error('down')
      },
    }
    expect(await resolveResults(token, deps)).toEqual({ status: 'error' })
  })

  it('looks the token up by its hash only', async () => {
    const { deps, submit } = setup()
    const token = await submit()
    const findToken = vi.spyOn(deps.store, 'findToken')
    await resolveResults(token, deps)
    expect(findToken).toHaveBeenCalledWith(hashToken(token))
  })
})
