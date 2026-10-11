import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Landing } from './Landing'

describe('Landing', () => {
  it('has the page landmarks: banner, main and contentinfo', () => {
    render(<Landing variant="a" dataAsOf="2026-06-30" />)
    expect(screen.getByRole('banner')).toBeTruthy()
    expect(screen.getByRole('main')).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy()
  })

  it('shows the hero a headline as the only h1', () => {
    render(<Landing variant="a" dataAsOf={null} />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0].textContent).toContain('Kolik z vašich peněz')
  })

  it('shows a different headline for variant b', () => {
    render(<Landing variant="b" dataAsOf={null} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Americký, nebo evropský fond?',
    )
  })
})
