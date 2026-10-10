import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Wordmark } from './Wordmark'

describe('Wordmark', () => {
  it('has the brand name as its accessible name', () => {
    render(<Wordmark />)
    expect(screen.getByRole('img', { name: 'ETF Kompas' })).toBeDefined()
  })

  it('uses the light lettering on dark backgrounds', () => {
    render(<Wordmark tone="dark" />)
    expect(
      screen.getByRole('img', { name: 'ETF Kompas' }).getAttribute('src'),
    ).toContain('etf-kompas-logo-dark.svg')
  })

  it('can be a link', () => {
    render(<Wordmark href="/" />)
    expect(
      screen.getByRole('link', { name: 'ETF Kompas' }).getAttribute('href'),
    ).toBe('/')
  })

  it('loads eagerly when it is the header logo', () => {
    render(<Wordmark priority />)
    expect(
      screen.getByRole('img', { name: 'ETF Kompas' }).getAttribute('loading'),
    ).not.toBe('lazy')
  })
})
