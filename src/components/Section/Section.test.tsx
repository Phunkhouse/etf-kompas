import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Section } from './Section'

describe('Section', () => {
  it('is a labelled region when given a heading id', () => {
    render(
      <Section labelledBy="faq">
        <h2 id="faq">Časté dotazy</h2>
      </Section>,
    )
    expect(screen.getByRole('region', { name: 'Časté dotazy' })).toBeDefined()
  })

  it('marks dark sections so child components can switch colours', () => {
    const { container } = render(
      <Section tone="dark">
        <p>Kalkulačka</p>
      </Section>,
    )
    expect(container.querySelector('section')?.dataset.tone).toBe('dark')
  })
})
