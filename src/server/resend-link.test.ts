import { describe, expect, it } from 'vitest'
import { createMemoryLeadStore } from './memory-store'
import { createRecordingMailer } from './mailer'
import { resendByEmail, resendForToken } from './resend-link'
import { resolveResults } from './results'
import { submitLead, type LeadDeps } from './leads'

// Phase 4, PR 4: "Poslat odkaz znovu" (T-4 of docs/PHASE-4-PLAN.md). Written first.
const START = new Date('2026-10-14T10:00:00Z')
const DAY = 86_400_000
const SITE = 'https://kompas.test'

function setup(
  options: { mode?: 'live' | 'sandbox'; allowlist?: string[] } = {},
) {
  const memory = createMemoryLeadStore()
  const mailer = createRecordingMailer()
  let current = START
  const deps: LeadDeps = {
    store: memory.store,
    limiter: memory.limiter,
    now: () => current,
    secrets: { ipHash: 'a-test-secret-of-at-least-32-bytes!!' },
    mail: {
      mailer,
      mode: options.mode ?? 'live',
      allowlist: options.allowlist ?? [],
      siteUrl: SITE,
      controller: '[SPRÁVCE]',
      linkSecret: 'a-link-secret-of-at-least-32-bytes!!!',
    },
  }
  return {
    memory,
    mailer,
    deps,
    at: (date: Date) => {
      current = date
    },
    async lead(email = 'jan@domena.cz') {
      const result = await submitLead(
        { email, monthly: '5000', years: '20' },
        { ip: '198.51.100.1' },
        deps,
      )
      if (result.status !== 'ok') throw new Error(result.status)
      return result.resultsPath.replace('/srovnani/', '')
    },
  }
}

const tokenOf = (text: string) =>
  text.match(/\/srovnani\/([A-Za-z0-9_-]{43})/)![1]

describe('resendByEmail: always the same answer', () => {
  it('sends a new link to an address we have, and says ok', async () => {
    const t = setup()
    const old = await t.lead()
    const before = t.mailer.sent().length
    expect(
      await resendByEmail('jan@domena.cz', { ip: '203.0.113.7' }, t.deps),
    ).toEqual({ status: 'ok' })
    const mails = t.mailer.sent()
    expect(mails).toHaveLength(before + 1)
    const fresh = tokenOf(mails[mails.length - 1].text)
    expect(fresh).not.toBe(old)
    expect((await resolveResults(fresh, t.deps)).status).toBe('ok')
    expect(mails[mails.length - 1].to).toBe('jan@domena.cz')
  })

  it('says ok for an address we do not have, and sends and stores nothing', async () => {
    const t = setup()
    await t.lead()
    const sent = t.mailer.sent().length
    const tokens = t.memory.tokens().length
    expect(
      await resendByEmail('nikdo@domena.cz', { ip: '203.0.113.7' }, t.deps),
    ).toEqual({ status: 'ok' })
    expect(t.mailer.sent()).toHaveLength(sent)
    expect(t.memory.tokens()).toHaveLength(tokens)
  })

  it('says ok for a deleted lead and sends nothing', async () => {
    const t = setup()
    await t.lead()
    await t.deps.store.save({ ...t.memory.leads()[0], deletedAt: START })
    const sent = t.mailer.sent().length
    expect(
      await resendByEmail('jan@domena.cz', { ip: '203.0.113.7' }, t.deps),
    ).toEqual({ status: 'ok' })
    expect(t.mailer.sent()).toHaveLength(sent)
  })

  it('also sends to an unsubscribed lead: the comparison is not marketing', async () => {
    const t = setup()
    await t.lead()
    await t.deps.store.save({ ...t.memory.leads()[0], unsubscribedAt: START })
    const sent = t.mailer.sent().length
    await resendByEmail('jan@domena.cz', { ip: '203.0.113.7' }, t.deps)
    expect(t.mailer.sent()).toHaveLength(sent + 1)
  })

  it('says ok in sandbox for an address that is not on the allowlist, and sends nothing', async () => {
    const t = setup({ mode: 'sandbox', allowlist: [] })
    await t.lead()
    expect(
      await resendByEmail('jan@domena.cz', { ip: '203.0.113.7' }, t.deps),
    ).toEqual({ status: 'ok' })
    expect(t.mailer.sent()).toHaveLength(0)
  })

  it('says ok, and sends nothing more, once the address has been asked for 3 times in a day', async () => {
    const t = setup()
    await t.lead() // the first of the 3
    await resendByEmail('jan@domena.cz', { ip: '203.0.113.1' }, t.deps)
    await resendByEmail('jan@domena.cz', { ip: '203.0.113.2' }, t.deps)
    const sent = t.mailer.sent().length
    expect(
      await resendByEmail('jan@domena.cz', { ip: '203.0.113.3' }, t.deps),
    ).toEqual({ status: 'ok' })
    expect(t.mailer.sent()).toHaveLength(sent)
  })

  it('says ok, and sends nothing more, after 5 requests from one IP in an hour', async () => {
    const t = setup()
    await t.lead('a@domena.cz')
    for (let i = 0; i < 5; i++) {
      await resendByEmail(`x${i}@domena.cz`, { ip: '203.0.113.9' }, t.deps)
    }
    const sent = t.mailer.sent().length
    expect(
      await resendByEmail('a@domena.cz', { ip: '203.0.113.9' }, t.deps),
    ).toEqual({ status: 'ok' })
    expect(t.mailer.sent()).toHaveLength(sent)
  })

  it('says invalid for text that is not an address, so the form can say so', async () => {
    const t = setup()
    expect(await resendByEmail('chyba', { ip: '203.0.113.7' }, t.deps)).toEqual(
      { status: 'invalid' },
    )
    expect(
      await resendByEmail(undefined, { ip: '203.0.113.7' }, t.deps),
    ).toEqual({ status: 'invalid' })
  })

  it('takes the time into account: the next day the address can be asked for again', async () => {
    const t = setup()
    await t.lead()
    await resendByEmail('jan@domena.cz', { ip: '203.0.113.1' }, t.deps)
    await resendByEmail('jan@domena.cz', { ip: '203.0.113.2' }, t.deps)
    t.at(new Date(START.getTime() + DAY))
    const sent = t.mailer.sent().length
    await resendByEmail('jan@domena.cz', { ip: '203.0.113.3' }, t.deps)
    expect(t.mailer.sent()).toHaveLength(sent + 1)
  })
})

describe('resendForToken: the card on the results page', () => {
  it("sends a new link to the lead's own address and takes no address from the visitor", async () => {
    const t = setup()
    const old = await t.lead()
    const sent = t.mailer.sent().length
    expect(await resendForToken(old, t.deps)).toEqual({ status: 'sent' })
    const mail = t.mailer.sent()[sent]
    expect(mail.to).toBe('jan@domena.cz')
    expect(tokenOf(mail.text)).not.toBe(old)
  })

  it('says skipped in sandbox for an address that is not on the allowlist', async () => {
    const t = setup({ mode: 'sandbox', allowlist: [] })
    const old = await t.lead()
    expect(await resendForToken(old, t.deps)).toEqual({ status: 'skipped' })
    expect(t.mailer.sent()).toHaveLength(0)
  })

  it('says failed when the mailer fails', async () => {
    const t = setup()
    const old = await t.lead()
    t.mailer.failing = true
    expect(await resendForToken(old, t.deps)).toEqual({ status: 'failed' })
  })

  it('says unknown for an unknown, malformed or expired token and sends nothing', async () => {
    const t = setup()
    const old = await t.lead()
    const sent = t.mailer.sent().length
    expect(await resendForToken('A'.repeat(43), t.deps)).toEqual({
      status: 'unknown',
    })
    expect(await resendForToken('abc', t.deps)).toEqual({ status: 'unknown' })
    t.at(new Date(START.getTime() + 31 * DAY))
    expect(await resendForToken(old, t.deps)).toEqual({ status: 'unknown' })
    expect(t.mailer.sent()).toHaveLength(sent)
  })

  it('says limited, and sends nothing, after 3 e-mails in a day to that address', async () => {
    const t = setup()
    const old = await t.lead()
    await resendForToken(old, t.deps)
    await resendForToken(old, t.deps)
    const sent = t.mailer.sent().length
    expect(await resendForToken(old, t.deps)).toEqual({ status: 'limited' })
    expect(t.mailer.sent()).toHaveLength(sent)
  })
})
