import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Pill } from './Pill'

describe('Pill', () => {
  it('shows its status as text', () => {
    render(<Pill tone="negative">[ověřit]</Pill>)
    expect(screen.getByText('[ověřit]')).toBeDefined()
  })

  it('renders the three tones with different styles', () => {
    render(
      <>
        <Pill tone="negative">ne</Pill>
        <Pill tone="positive">ano</Pill>
        <Pill tone="unverified">ověřit</Pill>
      </>,
    )
    const classes = new Set(
      ['ne', 'ano', 'ověřit'].map((text) => screen.getByText(text).className),
    )
    expect(classes.size).toBe(3)
  })
})
