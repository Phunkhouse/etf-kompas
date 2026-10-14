import { describe, expect, it } from 'vitest'
import { createMemoryLeadStore } from './memory-store'
import { createRecordingMailer, type MailMessage } from './mailer'
import { resolveResults } from './results'
import { verifyLink } from './signed-links'
import { submitLead, type LeadDeps, type LeadInput } from './leads'

// Phase 4, PR 4: the e-mails sent when a lead is stored (E-1 to E-5 of
// docs/PHASE-4-PLAN.md): the Kompas e-mail, and the opt-in e-mail for the tips box.
// Written first.
const START = new Date('2026-10-14T10:00:00Z')
const DAY = 86_400_000
const LINK_SECRET = 'a-link-secret-of-at-least-32-bytes!!!'
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
      controller: '[SPRÁVCE] – [IČO], [adresa]',
      linkSecret: LINK_SECRET,
    },
  }
  let ip = 0
  const submit = (extra: Partial<LeadInput> = {}) =>
    submitLead(
      { email: 'jan@domena.cz', monthly: '5000', years: '20', ...extra },
      { ip: `203.0.113.${++ip}` },
      deps,
    )
  return {
    memory,
    mailer,
    deps,
    submit,
    at: (date: Date) => {
      current = date
    },
  }
}

const first = (mails: MailMessage[], subject: string) =>
  mails.find((m) => m.subject === subject)
const KOMPAS = 'Vaše srovnání je připravené'
const OPTIN = 'Potvrďte odběr tipů k investování'

describe('the Kompas e-mail', () => {
  it('goes to the address, with a results link that works, a PDF link and an unsubscribe link', async () => {
    const { submit, mailer, memory, deps } = setup()
    const result = await submit()
    expect(result).toMatchObject({
      status: 'ok',
      email: { status: 'sent', address: 'jan@domena.cz' },
    })
    const mail = first(mailer.sent(), KOMPAS)!
    expect(mail.to).toBe('jan@domena.cz')

    const token = mail.text.match(
      new RegExp(`${SITE}/srovnani/([A-Za-z0-9_-]{43})`),
    )![1]
    expect((await resolveResults(token, deps)).status).toBe('ok')
    expect(mail.text).toContain(`${SITE}/srovnani/${token}/pdf`)
    const unsub = mail.text.match(
      new RegExp(`${SITE}/odhlasit/([^\\s"'<>)]+)`),
    )![1]
    expect(verifyLink(unsub, 'unsubscribe', LINK_SECRET, START)).toEqual({
      ok: true,
      leadId: memory.leads()[0].id,
    })
  })

  it('shows the setup the visitor chose in the e-mail', async () => {
    const { submit, mailer } = setup()
    await submit({ monthly: '10000', years: '20' })
    expect(first(mailer.sent(), KOMPAS)!.text.replace(/\s/g, ' ')).toContain(
      '10 000 Kč měsíčně',
    )
  })

  it('marks the lead as sent', async () => {
    const { submit, memory } = setup()
    await submit()
    expect(memory.leads()[0].emailStatus).toBe('sent')
  })

  it('is sent again for the same address (a new link each time)', async () => {
    const { submit, mailer } = setup()
    await submit()
    await submit()
    const links = mailer
      .sent()
      .filter((m) => m.subject === KOMPAS)
      .map((m) => m.text.match(/\/srovnani\/([A-Za-z0-9_-]{43})/)![1])
    expect(links).toHaveLength(2)
    expect(links[0]).not.toBe(links[1])
  })

  it('is not sent for a honeypot, an invalid address or a limited request', async () => {
    const { submit, mailer } = setup()
    await submit({ website: 'http://spam.example' })
    await submit({ email: 'chyba' })
    for (let i = 0; i < 3; i++) await submit()
    const before = mailer.sent().length
    const limited = await submit()
    expect(limited.status).toBe('limited')
    expect(mailer.sent()).toHaveLength(before)
    expect(mailer.sent().every((m) => m.to === 'jan@domena.cz')).toBe(true)
  })

  it('without a mailer says skipped and still stores the lead', async () => {
    const { submit, deps, memory } = setup()
    delete deps.mail
    const result = await submit()
    expect(result).toMatchObject({ status: 'ok', email: { status: 'skipped' } })
    expect(memory.leads()).toHaveLength(1)
  })
})

describe('sandbox mode (E-2, E-3)', () => {
  it('sends to an allowlisted address', async () => {
    const { submit, mailer } = setup({
      mode: 'sandbox',
      allowlist: ['JAN@domena.cz'],
    })
    const result = await submit()
    expect(result).toMatchObject({ email: { status: 'sent' } })
    expect(mailer.sent()).toHaveLength(1)
  })

  it('stores a lead of any other address and sends nothing: skipped, status stays queued, the links are still returned', async () => {
    const { submit, mailer, memory } = setup({
      mode: 'sandbox',
      allowlist: ['david@pm.me'],
    })
    const result = await submit()
    expect(result).toMatchObject({
      status: 'ok',
      resultsPath: expect.stringMatching(/^\/srovnani\/[A-Za-z0-9_-]{43}$/),
      email: { status: 'skipped', address: 'jan@domena.cz' },
    })
    expect(mailer.sent()).toHaveLength(0)
    expect(memory.leads()[0].emailStatus).toBe('queued')
  })
})

describe('a failing mailer (E-1)', () => {
  it('does not fail the submit: the lead is stored, the links are returned, the state says failed', async () => {
    const { submit, mailer, memory } = setup()
    mailer.failing = true
    const result = await submit()
    expect(result).toMatchObject({
      status: 'ok',
      resultsPath: expect.any(String),
      email: { status: 'failed', address: 'jan@domena.cz' },
    })
    expect(memory.leads()).toHaveLength(1)
    expect(memory.leads()[0].emailStatus).toBe('failed')
  })
})

describe('the opt-in e-mail for the tips box (E-5)', () => {
  it('is sent with the Kompas e-mail when tips is ticked, with a link that lasts 7 days', async () => {
    const { submit, mailer, memory } = setup()
    await submit({ tips: 'on' })
    const subjects = mailer.sent().map((m) => m.subject)
    expect(subjects).toEqual([KOMPAS, OPTIN])
    expect(memory.leads()[0].optinSentAt).toEqual(START)

    const mail = first(mailer.sent(), OPTIN)!
    const token = mail.text.match(
      new RegExp(`${SITE}/potvrdit/([^\\s"'<>)]+)`),
    )![1]
    const id = memory.leads()[0].id
    expect(verifyLink(token, 'optin', LINK_SECRET, START)).toEqual({
      ok: true,
      leadId: id,
    })
    expect(
      verifyLink(
        token,
        'optin',
        LINK_SECRET,
        new Date(START.getTime() + 7 * DAY - 1000),
      ).ok,
    ).toBe(true)
    expect(
      verifyLink(
        token,
        'optin',
        LINK_SECRET,
        new Date(START.getTime() + 7 * DAY),
      ).ok,
    ).toBe(false)
  })

  it('is not sent without the tips box', async () => {
    const { submit, mailer, memory } = setup()
    await submit()
    expect(mailer.sent().map((m) => m.subject)).toEqual([KOMPAS])
    expect(memory.leads()[0].optinSentAt).toBeNull()
  })

  it('is not sent again within 7 days, and is sent again after them', async () => {
    const { submit, mailer, at } = setup()
    await submit({ tips: 'on' })
    at(new Date(START.getTime() + 2 * DAY))
    await submit({ tips: 'on' })
    expect(mailer.sent().filter((m) => m.subject === OPTIN)).toHaveLength(1)
    at(new Date(START.getTime() + 8 * DAY))
    await submit({ tips: 'on' })
    expect(mailer.sent().filter((m) => m.subject === OPTIN)).toHaveLength(2)
  })

  it('is not sent to a lead who has already confirmed', async () => {
    const { submit, mailer, memory, deps } = setup()
    await submit({ tips: 'on' })
    await deps.store.save({ ...memory.leads()[0], consentConfirmedAt: START })
    await submit({ tips: 'on' })
    expect(mailer.sent().filter((m) => m.subject === OPTIN)).toHaveLength(1)
  })

  it('is sent to an unsubscribed lead who ticks the box again: that is a new request', async () => {
    const { submit, mailer, memory, deps } = setup()
    await submit()
    await deps.store.save({ ...memory.leads()[0], unsubscribedAt: START })
    await submit({ tips: 'on' })
    expect(mailer.sent().filter((m) => m.subject === OPTIN)).toHaveLength(1)
    expect(memory.leads()[0].unsubscribedAt).toEqual(START)
  })

  it('is sent to a deleted lead who signs up again with the box ticked (a new person)', async () => {
    const { submit, mailer, memory, deps, at } = setup()
    await submit({ tips: 'on' })
    await deps.store.save({ ...memory.leads()[0], deletedAt: START })
    at(new Date(START.getTime() + 1 * DAY))
    await submit({ tips: 'on' })
    expect(mailer.sent().filter((m) => m.subject === OPTIN)).toHaveLength(2)
    expect(memory.leads()[0].deletedAt).toBeNull()
  })

  it('is not marked as sent when it was not sent (sandbox, or a failure), so it is tried again', async () => {
    const sandbox = setup({ mode: 'sandbox', allowlist: [] })
    await sandbox.submit({ tips: 'on' })
    expect(sandbox.memory.leads()[0].optinSentAt).toBeNull()
    expect(sandbox.mailer.sent()).toHaveLength(0)

    const failing = setup()
    failing.mailer.failing = true
    await failing.submit({ tips: 'on' })
    expect(failing.memory.leads()[0].optinSentAt).toBeNull()
  })
})
