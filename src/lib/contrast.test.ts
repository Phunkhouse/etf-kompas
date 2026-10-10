import { describe, expect, it } from 'vitest'
import { checkPairs, contrastRatio } from './contrast'
import { contrastPairs } from '@/styles/contrast-pairs'

describe('contrastRatio', () => {
  it('is 21 for black on white and 1 for identical colours', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5)
    expect(contrastRatio('#16150F', '#16150F')).toBeCloseTo(1, 5)
  })

  it('does not depend on the order of the colours', () => {
    expect(contrastRatio('#16150F', '#F6F3EC')).toBe(
      contrastRatio('#F6F3EC', '#16150F'),
    )
  })

  it('matches the ratios in the design guide', () => {
    expect(contrastRatio('#16150F', '#F6F3EC')).toBeCloseTo(16.5, 1)
    expect(contrastRatio('#6B665A', '#F6F3EC')).toBeCloseTo(5.16, 2)
    expect(contrastRatio('#6B665A', '#F4D9D1')).toBeCloseTo(4.27, 2)
  })

  it('rejects colours that are not #RRGGBB', () => {
    expect(() => contrastRatio('#FFF', '#000000')).toThrow()
  })
})

describe('checkPairs', () => {
  it('flags a pair below its minimum', () => {
    const [result] = checkPairs([
      { fg: 'muted', bg: 'no-bg', min: 4.5, use: 'known failing pair' },
    ])
    expect(result.ok).toBe(false)
  })

  it('passes every pair the UI uses', () => {
    const failing = checkPairs(contrastPairs).filter((r) => !r.ok)
    expect(failing).toEqual([])
  })
})
