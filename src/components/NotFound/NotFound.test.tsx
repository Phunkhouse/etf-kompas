import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NotFound } from './NotFound'

const flat = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

describe('NotFound: the 404 card', () => {
  it('says "404" and "Tuhle stránku jsme nenašli" as the only h1', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Tuhle stránku jsme nenašli',
      }),
    ).toBeTruthy()
  })

  it('says why in two plain sentences', () => {
    render(<NotFound />)
    expect(flat(screen.getByText(/Odkaz je možná starý/).textContent)).toBe(
      'Odkaz je možná starý nebo v něm je překlep. Cenu fondů a kalkulačku najdete na úvodní stránce.',
    )
  })

  it('has the button "Zpět na úvod" to the home page, and the link "Jak počítáme"', () => {
    render(<NotFound />)
    expect(
      screen.getByRole('link', { name: 'Zpět na úvod' }).getAttribute('href'),
    ).toBe('/')
    expect(
      screen.getByRole('link', { name: 'Jak počítáme' }).getAttribute('href'),
    ).toBe('/#jak-pocitame')
  })
})
