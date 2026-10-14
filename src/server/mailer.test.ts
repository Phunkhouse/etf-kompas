import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createRecordingMailer,
  createResendMailer,
  deliver,
  type MailMessage,
} from './mailer'

// Phase 4, PR 4: test cases E-1 and E-2 (the sandbox rule) of docs/PHASE-4-PLAN.md.
// Written first.
const MESSAGE: MailMessage = {
  to: 'jan@domena.cz',
  subject: 'Vaše srovnání je připravené',
  html: '<p>Ahoj</p>',
  text: 'Ahoj',
  headers: { 'List-Unsubscribe': '<https://example.test/odhlasit/x>' },
}

afterEach(() => vi.unstubAllGlobals())

describe('deliver: live mode', () => {
  it('sends to any address and says sent', async () => {
    const mailer = createRecordingMailer()
    const result = await deliver(
      mailer,
      { mode: 'live', allowlist: [] },
      MESSAGE,
    )
    expect(result).toBe('sent')
    expect(mailer.sent()).toEqual([MESSAGE])
  })

  it('says failed, and does not throw, when the mailer fails', async () => {
    const mailer = createRecordingMailer()
    mailer.failing = true
    expect(
      await deliver(mailer, { mode: 'live', allowlist: [] }, MESSAGE),
    ).toBe('failed')
  })

  it('says failed when the mailer throws', async () => {
    const mailer = {
      send: async (): Promise<'sent'> => {
        throw new Error('down')
      },
    }
    expect(
      await deliver(mailer, { mode: 'live', allowlist: [] }, MESSAGE),
    ).toBe('failed')
  })
})

describe('deliver: sandbox mode', () => {
  it('sends to an address on the allowlist, ignoring case and spaces', async () => {
    const mailer = createRecordingMailer()
    const result = await deliver(
      mailer,
      { mode: 'sandbox', allowlist: [' Jan@Domena.CZ ', 'david@pm.me'] },
      MESSAGE,
    )
    expect(result).toBe('sent')
    expect(mailer.sent()).toHaveLength(1)
  })

  it('does not send to any other address, and says skipped', async () => {
    const mailer = createRecordingMailer()
    const result = await deliver(
      mailer,
      { mode: 'sandbox', allowlist: ['david@pm.me'] },
      MESSAGE,
    )
    expect(result).toBe('skipped')
    expect(mailer.sent()).toHaveLength(0)
  })

  it('sends to nobody with an empty allowlist', async () => {
    const mailer = createRecordingMailer()
    expect(
      await deliver(mailer, { mode: 'sandbox', allowlist: [] }, MESSAGE),
    ).toBe('skipped')
  })

  it('never calls the network for a skipped address', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const mailer = createResendMailer({ apiKey: 're_x', from: 'a <a@b.cz>' })
    await deliver(mailer, { mode: 'sandbox', allowlist: [] }, MESSAGE)
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})

describe('createResendMailer', () => {
  function stubFetch(ok = true, status = 200) {
    const spy = vi.fn<typeof fetch>(
      async () => ({ ok, status, json: async () => ({ id: 'x' }) }) as Response,
    )
    vi.stubGlobal('fetch', spy)
    return spy
  }

  it('posts the message to the Resend API with the key as a bearer token', async () => {
    const spy = stubFetch()
    const mailer = createResendMailer({
      apiKey: 're_secret',
      from: 'ETF Kompas (test) <kompas@send.example.cz>',
      replyTo: 'david@pm.me',
    })
    expect(await mailer.send(MESSAGE)).toBe('sent')
    const [url, init] = spy.mock.calls[0]
    expect(String(url)).toBe('https://api.resend.com/emails')
    expect(init?.method).toBe('POST')
    const headers = init?.headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer re_secret')
    expect(JSON.parse(init?.body as string)).toEqual({
      from: 'ETF Kompas (test) <kompas@send.example.cz>',
      to: ['jan@domena.cz'],
      reply_to: 'david@pm.me',
      subject: MESSAGE.subject,
      html: MESSAGE.html,
      text: MESSAGE.text,
      headers: MESSAGE.headers,
    })
  })

  it('leaves out reply_to when there is none', async () => {
    const spy = stubFetch()
    await createResendMailer({ apiKey: 're_x', from: 'a <a@b.cz>' }).send(
      MESSAGE,
    )
    expect(JSON.parse(spy.mock.calls[0][1]?.body as string)).not.toHaveProperty(
      'reply_to',
    )
  })

  it('says failed for an error answer, and keeps the key and the address out of the error', async () => {
    stubFetch(false, 422)
    const mailer = createResendMailer({
      apiKey: 're_secret',
      from: 'a <a@b.cz>',
    })
    expect(await mailer.send(MESSAGE)).toBe('failed')
  })

  it('says failed, and does not throw, when the network is down', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const mailer = createResendMailer({ apiKey: 're_x', from: 'a <a@b.cz>' })
    expect(await mailer.send(MESSAGE)).toBe('failed')
  })

  it('gives up after a few seconds instead of holding the visitor', async () => {
    const spy = stubFetch()
    await createResendMailer({ apiKey: 're_x', from: 'a <a@b.cz>' }).send(
      MESSAGE,
    )
    expect(spy.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal)
  })
})
