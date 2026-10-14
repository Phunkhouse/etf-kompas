import { describe, expect, it } from 'vitest'
import { createMemoryLeadStore } from './memory-store'
import { createRecordingMailer } from './mailer'
import { resolveResults } from './results'
import { signLink } from './signed-links'
import {
  checkLink,
  confirmOptIn,
  resubscribe,
  unsubscribe,
} from './subscriptions'
import { submitLead, type LeadDeps } from './leads'

// Phase 4, PR 4: confirming the tips (double opt-in), unsubscribing and subscribing
// back (P-5 and P-6 of docs/PHASE-4-PLAN.md; David's decisions of 2026-10-14: the
// confirmation happens on a click of the button, never on opening the link). Written first.
const START = new Date('2026-10-14T10:00:00Z')
const DAY = 86_400_000
const LINK_SECRET = 'a-link-secret-of-at-least-32-bytes!!!'

function setup() {
  const memory = createMemoryLeadStore()
  let current = START
  const deps: LeadDeps = {
    store: memory.store,
    limiter: memory.limiter,
    now: () => current,
    secrets: { ipHash: 'a-test-secret-of-at-least-32-bytes!!' },
    mail: {
      mailer: createRecordingMailer(),
      mode: 'live',
      allowlist: [],
      siteUrl: 'https://kompas.test',
      controller: '[SPRÁVCE]',
      linkSecret: LINK_SECRET,
    },
  }
  const sub = {
    store: memory.store,
    now: () => current,
    linkSecret: LINK_SECRET,
  }
  return {
    memory,
    deps,
    sub,
    at: (date: Date) => {
      current = date
    },
    async lead() {
      await submitLead(
        { email: 'jan@domena.cz', monthly: '5000', years: '20', tips: 'on' },
        { ip: '203.0.113.7' },
        deps,
      )
      return memory.leads()[0]
    },
    optin: (leadId: string, expiresAt = new Date(START.getTime() + 7 * DAY)) =>
      signLink({ purpose: 'optin', leadId, expiresAt }, LINK_SECRET),
    unsub: (leadId: string) =>
      signLink({ purpose: 'unsubscribe', leadId }, LINK_SECRET),
  }
}

describe('checkLink: opening the page changes nothing', () => {
  it('says valid or invalid and leaves the lead as it was', async () => {
    const t = setup()
    const lead = await t.lead()
    expect(await checkLink(t.optin(lead.id), 'optin', t.sub)).toEqual({
      status: 'valid',
    })
    expect(await checkLink('abc', 'optin', t.sub)).toEqual({
      status: 'invalid',
    })
    expect(t.memory.leads()[0]).toEqual(lead)
  })

  it('says invalid for a link of a lead that does not exist or is deleted', async () => {
    const t = setup()
    const lead = await t.lead()
    expect(
      await checkLink(
        t.optin('99999999-9999-4999-8999-999999999999'),
        'optin',
        t.sub,
      ),
    ).toEqual({ status: 'invalid' })
    await t.sub.store.save({ ...lead, deletedAt: START })
    expect(await checkLink(t.optin(lead.id), 'optin', t.sub)).toEqual({
      status: 'invalid',
    })
  })

  it('says confirmed for an opt-in link of a lead who has already confirmed', async () => {
    const t = setup()
    const lead = await t.lead()
    await confirmOptIn(t.optin(lead.id), t.sub)
    expect(await checkLink(t.optin(lead.id), 'optin', t.sub)).toEqual({
      status: 'confirmed',
    })
  })
})

describe('confirmOptIn (P-5)', () => {
  it('sets the confirmation, and gives a fresh results link that works', async () => {
    const t = setup()
    const lead = await t.lead()
    const result = await confirmOptIn(t.optin(lead.id), t.sub)
    expect(result.status).toBe('confirmed')
    if (result.status !== 'confirmed') return
    expect(t.memory.leads()[0]).toMatchObject({
      consentConfirmedAt: START,
      marketingConsent: true,
    })
    const token = result.resultsPath.replace('/srovnani/', '')
    expect((await resolveResults(token, t.deps)).status).toBe('ok')
  })

  it('a second use shows confirmed again and does not change the date', async () => {
    const t = setup()
    const lead = await t.lead()
    await confirmOptIn(t.optin(lead.id), t.sub)
    t.at(new Date(START.getTime() + 3 * DAY))
    const again = await confirmOptIn(t.optin(lead.id), t.sub)
    expect(again.status).toBe('confirmed')
    expect(t.memory.leads()[0].consentConfirmedAt).toEqual(START)
  })

  it('says invalid for an expired link and changes nothing', async () => {
    const t = setup()
    const lead = await t.lead()
    t.at(new Date(START.getTime() + 8 * DAY))
    expect(await confirmOptIn(t.optin(lead.id), t.sub)).toEqual({
      status: 'invalid',
    })
    expect(t.memory.leads()[0].consentConfirmedAt).toBeNull()
  })

  it('says invalid for an altered link, an unsubscribe link, and an unknown or deleted lead', async () => {
    const t = setup()
    const lead = await t.lead()
    const token = t.optin(lead.id)
    expect(await confirmOptIn(`${token}x`, t.sub)).toEqual({
      status: 'invalid',
    })
    expect(await confirmOptIn(t.unsub(lead.id), t.sub)).toEqual({
      status: 'invalid',
    })
    await t.sub.store.save({ ...lead, deletedAt: START })
    expect(await confirmOptIn(token, t.sub)).toEqual({ status: 'invalid' })
    expect(t.memory.leads()[0].consentConfirmedAt).toBeNull()
  })

  it('a confirmation clears an earlier unsubscribe: the visitor asked again', async () => {
    const t = setup()
    const lead = await t.lead()
    await t.sub.store.save({ ...lead, unsubscribedAt: START })
    await confirmOptIn(t.optin(lead.id), t.sub)
    expect(t.memory.leads()[0].unsubscribedAt).toBeNull()
  })

  it('says error, and not confirmed, when the store fails', async () => {
    const t = setup()
    const lead = await t.lead()
    const broken = {
      ...t.sub,
      store: {
        ...t.sub.store,
        save: async () => {
          throw new Error('down')
        },
      },
    }
    expect(await confirmOptIn(t.optin(lead.id), broken)).toEqual({
      status: 'error',
    })
  })
})

describe('unsubscribe and resubscribe (P-6)', () => {
  it('sets the date, and can be used again without moving it', async () => {
    const t = setup()
    const lead = await t.lead()
    expect(await unsubscribe(t.unsub(lead.id), t.sub)).toEqual({
      status: 'unsubscribed',
    })
    t.at(new Date(START.getTime() + 9 * DAY))
    expect(await unsubscribe(t.unsub(lead.id), t.sub)).toEqual({
      status: 'unsubscribed',
    })
    expect(t.memory.leads()[0].unsubscribedAt).toEqual(START)
  })

  it('works years later: the link has no expiry', async () => {
    const t = setup()
    const lead = await t.lead()
    t.at(new Date('2031-01-01T00:00:00Z'))
    expect((await unsubscribe(t.unsub(lead.id), t.sub)).status).toBe(
      'unsubscribed',
    )
  })

  it('changes nothing for an altered link, an opt-in link or a deleted lead', async () => {
    const t = setup()
    const lead = await t.lead()
    expect(await unsubscribe(`${t.unsub(lead.id)}x`, t.sub)).toEqual({
      status: 'invalid',
    })
    expect(await unsubscribe(t.optin(lead.id), t.sub)).toEqual({
      status: 'invalid',
    })
    await t.sub.store.save({ ...lead, deletedAt: START })
    expect(await unsubscribe(t.unsub(lead.id), t.sub)).toEqual({
      status: 'invalid',
    })
    expect(t.memory.leads()[0].unsubscribedAt).toBeNull()
  })

  it('keeps the consent record as it was (it only stops the mail)', async () => {
    const t = setup()
    const lead = await t.lead()
    await confirmOptIn(t.optin(lead.id), t.sub)
    await unsubscribe(t.unsub(lead.id), t.sub)
    expect(t.memory.leads()[0]).toMatchObject({
      marketingConsent: true,
      consentConfirmedAt: START,
    })
  })

  it('resubscribe clears the date and nothing else', async () => {
    const t = setup()
    const lead = await t.lead()
    await unsubscribe(t.unsub(lead.id), t.sub)
    const before = t.memory.leads()[0]
    expect(await resubscribe(t.unsub(lead.id), t.sub)).toEqual({
      status: 'subscribed',
    })
    expect(t.memory.leads()[0]).toEqual({ ...before, unsubscribedAt: null })
  })

  it('resubscribe does not confirm the tips', async () => {
    const t = setup()
    const lead = await t.lead()
    await unsubscribe(t.unsub(lead.id), t.sub)
    await resubscribe(t.unsub(lead.id), t.sub)
    expect(t.memory.leads()[0].consentConfirmedAt).toBeNull()
  })

  it('does not unsubscribe on opening the link: checking is a separate, harmless call', async () => {
    const t = setup()
    const lead = await t.lead()
    await checkLink(t.unsub(lead.id), 'unsubscribe', t.sub)
    expect(t.memory.leads()[0].unsubscribedAt).toBeNull()
  })
})
