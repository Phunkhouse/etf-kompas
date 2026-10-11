import { describe, expect, it } from 'vitest'
import { formatKc, formatMonthYear, formatPercent } from './format'

describe('formatKc', () => {
  it('groups thousands with non-breaking spaces and adds Kč', () => {
    expect(formatKc(12480)).toBe('12 480 Kč')
    expect(formatKc(1234567)).toBe('1 234 567 Kč')
  })

  it('handles small numbers and zero', () => {
    expect(formatKc(0)).toBe('0 Kč')
    expect(formatKc(950)).toBe('950 Kč')
  })

  it('rounds to whole crowns', () => {
    expect(formatKc(1999.6)).toBe('2 000 Kč')
  })

  it('never contains a breaking space', () => {
    expect(formatKc(9876543)).not.toMatch(/ /)
  })
})

describe('formatPercent', () => {
  it('uses a decimal comma and a non-breaking space before the sign', () => {
    expect(formatPercent(0.07)).toBe('0,07 %')
    expect(formatPercent(6, 0)).toBe('6 %')
  })

  it('keeps trailing zeros', () => {
    expect(formatPercent(0.1)).toBe('0,10 %')
  })
})

describe('formatMonthYear', () => {
  it('formats month and year with a non-breaking space', () => {
    expect(formatMonthYear('2026-06-30')).toBe('6.\u00a02026')
    expect(formatMonthYear('2026-10-01')).toBe('10.\u00a02026')
  })

  it('rejects text that is not an ISO date', () => {
    expect(() => formatMonthYear('30. 6. 2026')).toThrow()
  })
})
