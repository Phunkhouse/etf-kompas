import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  it('is a contentinfo landmark with the risk line', () => {
    render(<SiteFooter />)
    expect(screen.getByRole('contentinfo')).toBeTruthy()
    expect(screen.getByText(/Investování nese riziko ztráty\./)).toBeTruthy()
  })

  it('shows the controller as a placeholder from the site config', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/Správce: \[SPRÁVCE\]/)).toBeTruthy()
  })

  it('has four links, in this order, to the method, the policy, the cookies and the contact', () => {
    render(<SiteFooter />)
    const nav = screen.getByRole('navigation', { name: 'Patička' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => l.textContent)).toEqual([
      'Jak počítáme',
      'Zásady zpracování',
      'Cookies',
      'Kontakt',
    ])
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      '/#jak-pocitame',
      '/zasady',
      '/zasady#cookies',
      '/zasady#kdo-zpracovava',
    ])
  })

  it('carries the test-project notice', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/Zkušební projekt/)).toBeTruthy()
  })
})
