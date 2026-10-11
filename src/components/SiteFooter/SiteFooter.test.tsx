import { render, screen } from '@testing-library/react'
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

  it('names the two policies but does not link them yet', () => {
    render(<SiteFooter />)
    expect(screen.getByText('Zásady zpracování')).toBeTruthy()
    expect(screen.getByText('Cookies')).toBeTruthy()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('carries the test-project notice', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/Zkušební projekt/)).toBeTruthy()
  })
})
