import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  it('renders its children', () => {
    render(
      <Container>
        <p>Obsah</p>
      </Container>,
    )
    expect(screen.getByText('Obsah')).toBeDefined()
  })
})
