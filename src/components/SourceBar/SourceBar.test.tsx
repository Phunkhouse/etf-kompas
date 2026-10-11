import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SourceBar } from './SourceBar'

describe('SourceBar', () => {
  it('names the source and the month of the oldest number', () => {
    render(<SourceBar dataAsOf="2026-06-30" />)
    expect(
      screen.getByText(/Čísla z oficiálních stránek fondů/).textContent,
    ).toContain('aktualizováno 6. 2026')
  })

  it('leaves the date out when there is no data', () => {
    render(<SourceBar dataAsOf={null} />)
    const text = screen.getByText(
      /Čísla z oficiálních stránek fondů/,
    ).textContent
    expect(text).not.toContain('aktualizováno')
  })

  it('carries the short risk line', () => {
    render(<SourceBar dataAsOf="2026-06-30" />)
    expect(screen.getByText('Investování nese riziko ztráty.')).toBeTruthy()
  })
})
