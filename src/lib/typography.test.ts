import { describe, expect, it } from 'vitest'
import { nbsp } from './typography'

const N = ' '

describe('nbsp', () => {
  it('joins one-letter words to the next word', () => {
    expect(nbsp('Kolik to u vás dělá?')).toBe(`Kolik to u${N}vás dělá?`)
    expect(nbsp('v a v domě')).toBe(`v${N}a${N}v${N}domě`)
    expect(nbsp('U fondu')).toBe(`U${N}fondu`)
  })

  it('joins a number to its unit', () => {
    expect(nbsp('výnos 6 % ročně')).toBe(`výnos 6${N}% ročně`)
    expect(nbsp('Za 10 let')).toBe(`Za 10${N}let`)
    expect(nbsp('3 000 Kč')).toBe(`3 000${N}Kč`)
  })

  it('leaves longer words and plain text alone', () => {
    expect(nbsp('Na jak dlouho')).toBe('Na jak dlouho')
    expect(nbsp('')).toBe('')
  })
})
