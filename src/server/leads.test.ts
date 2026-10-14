import { describe, expect, it } from 'vitest'
import { validateLead } from './leads'

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
