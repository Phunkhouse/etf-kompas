import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders its text', () => {
    render(<Tag>Cena a dostupnost</Tag>)
    expect(screen.getByText('Cena a dostupnost').tagName).toBe('SPAN')
  })

  it('can be a heading so a section can be labelled by it', () => {
    render(<Tag as="h2">Časté dotazy</Tag>)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Časté dotazy' }),
    ).toBeDefined()
  })
})
