import { afterEach, describe, expect, it, vi } from 'vitest'
import { noStorage, submitLead, validateLead, type Lead } from './leads'

describe('validateLead: the e-mail address', () => {
  it.each([
    'jmeno@domena.cz',
    'jan.novak@example.com',
    'a+tip@sub.domena.cz',
    'x_y-z@domena.co.uk',
  ])('accepts %s', (email) => {
    const result = validateLead({ email })
    expect(result.ok).toBe(true)
  })

  it('trims spaces and lowercases the address', () => {
    const result = validateLead({ email: '  Jan.Novak@Domena.CZ ' })
    expect(result).toEqual({
      ok: true,
      lead: { email: 'jan.novak@domena.cz', tips: false },
    })
  })

  it.each([
    ['empty', ''],
    ['only spaces', '   '],
    ['no at sign', 'jmeno'],
    ['nothing after the at sign', 'jmeno@'],
    ['nothing before the at sign', '@domena.cz'],
    ["no top-level domain (the drawing's own example)", 'jmeno@domena'],
    ['a space inside', 'jan novak@domena.cz'],
    ['two at signs', 'a@b@domena.cz'],
    ['a dot at the end of the domain', 'jmeno@domena.'],
    ['a dot at the start of the domain', 'jmeno@.cz'],
    ['longer than 254 characters', `${'a'.repeat(250)}@domena.cz`],
  ])('rejects %s', (_label, email) => {
    expect(validateLead({ email })).toEqual({ ok: false })
  })

  it.each([undefined, null, 42, {}, ['jmeno@domena.cz']])(
    'rejects a value that is not text: %j',
    (email) => {
      expect(validateLead({ email })).toEqual({ ok: false })
    },
  )
})

describe('validateLead: the tips checkbox', () => {
  it('is true only when the browser sent "on" (a ticked checkbox)', () => {
    const lead = (tips: unknown) => {
      const result = validateLead({ email: 'jmeno@domena.cz', tips })
      return result.ok ? result.lead.tips : null
    }
    expect(lead('on')).toBe(true)
    expect(lead(undefined)).toBe(false)
    expect(lead(null)).toBe(false)
    expect(lead('')).toBe(false)
    expect(lead('off')).toBe(false)
    expect(lead(true)).toBe(false)
  })
})

describe('submitLead', () => {
  afterEach(() => vi.restoreAllMocks())

  it('gives the valid lead to the sink once and says ok', async () => {
    const sink = vi.fn<(lead: Lead) => Promise<void>>().mockResolvedValue()
    const state = await submitLead(
      { email: ' Jmeno@Domena.cz ', tips: 'on' },
      sink,
    )
    expect(state).toEqual({ status: 'ok' })
    expect(sink).toHaveBeenCalledTimes(1)
    expect(sink).toHaveBeenCalledWith({ email: 'jmeno@domena.cz', tips: true })
  })

  it('says invalid, with the text as typed, and does not call the sink', async () => {
    const sink = vi.fn<(lead: Lead) => Promise<void>>().mockResolvedValue()
    const state = await submitLead({ email: 'jmeno@domena' }, sink)
    expect(state).toEqual({ status: 'invalid', email: 'jmeno@domena' })
    expect(sink).not.toHaveBeenCalled()
  })

  it('keeps an empty field empty when it says invalid', async () => {
    const state = await submitLead({ email: undefined }, noStorage)
    expect(state).toEqual({ status: 'invalid', email: '' })
  })

  it('says error, with the address as typed, when the sink fails', async () => {
    const sink = vi
      .fn<(lead: Lead) => Promise<void>>()
      .mockRejectedValue(new Error('down'))
    const state = await submitLead({ email: 'jmeno@domena.cz' }, sink)
    expect(state).toEqual({ status: 'error', email: 'jmeno@domena.cz' })
  })

  it('never throws, whatever the input or the sink does', async () => {
    const sink = () => {
      throw new Error('sync failure')
    }
    await expect(
      submitLead({ email: 'jmeno@domena.cz' }, sink as never),
    ).resolves.toEqual({ status: 'error', email: 'jmeno@domena.cz' })
    await expect(submitLead({ email: {} }, noStorage)).resolves.toMatchObject({
      status: 'invalid',
    })
  })
})

describe('noStorage (before Phase 4)', () => {
  afterEach(() => vi.restoreAllMocks())

  it('resolves and keeps nothing: no log, no network', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    try {
      await expect(
        noStorage({ email: 'jmeno@domena.cz', tips: false }),
      ).resolves.toBeUndefined()
      expect(log).not.toHaveBeenCalled()
      expect(info).not.toHaveBeenCalled()
      expect(error).not.toHaveBeenCalled()
      expect(fetchSpy).not.toHaveBeenCalled()
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('makes submitLead say ok for a valid address', async () => {
    await expect(
      submitLead({ email: 'jmeno@domena.cz' }, noStorage),
    ).resolves.toEqual({ status: 'ok' })
  })
})
