import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  it('is a banner with the logo linking home', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('banner')).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'ETF Kompas' }).getAttribute('href'),
    ).toBe('/')
  })

  it('has a named navigation with the three section links', () => {
    render(<SiteHeader />)
    const nav = screen.getByRole('navigation', { name: 'Hlavní nabídka' })
    expect(nav.querySelectorAll('a')).toHaveLength(3)
  })

  it('has a call to action that jumps to the gate', () => {
    render(<SiteHeader />)
    expect(
      screen
        .getByRole('link', { name: /Poslat mi srovnání/ })
        .getAttribute('href'),
    ).toBe('#gate')
  })
})
