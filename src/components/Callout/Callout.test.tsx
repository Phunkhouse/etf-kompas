import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Callout } from './Callout'

describe('Callout', () => {
  it('is exposed as a note with its content', () => {
    render(
      <Callout>
        <strong>ETF</strong> je fond, který jen kopíruje trh.
      </Callout>,
    )
    expect(screen.getByRole('note').textContent).toContain('ETF je fond')
  })

  it('renders the risk variant as a note too', () => {
    render(<Callout variant="risk">Investování nese riziko ztráty.</Callout>)
    expect(screen.getByRole('note').textContent).toBe(
      'Investování nese riziko ztráty.',
    )
  })
})
