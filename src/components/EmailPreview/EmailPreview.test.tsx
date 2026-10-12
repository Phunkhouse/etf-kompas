import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmailPreview } from './EmailPreview'

const flat = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

describe('EmailPreview: "Co dostanete e-mailem"', () => {
  it('is a section named after its heading', () => {
    render(<EmailPreview />)
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Fondy, brokeři a co z toho koupíte z Česka',
      }),
    ).toBeTruthy()
    expect(
      screen.getByRole('region', {
        name: 'Fondy, brokeři a co z toho koupíte z Česka',
      }),
    ).toBeTruthy()
  })

  it('has the label above the heading', () => {
    render(<EmailPreview />)
    expect(screen.getByText('Co dostanete e-mailem')).toBeTruthy()
  })

  it('says it opens at once and that every number has its source and month', () => {
    render(<EmailPreview />)
    expect(
      flat(screen.getByText(/Otevře se hned po odeslání/).textContent),
    ).toBe(
      'Otevře se hned po odeslání, nemusíte nic stahovat. U každého čísla uvádíme odkud je a z jakého měsíce.',
    )
  })

  it('repeats the button, which goes to the form', () => {
    render(<EmailPreview />)
    expect(
      screen
        .getByRole('link', { name: 'Poslat mi srovnání' })
        .getAttribute('href'),
    ).toBe('#formular')
  })

  it('shows two previews, page 1 and page 4, each with its caption', () => {
    render(<EmailPreview />)
    const figures = screen.getAllByRole('figure')
    expect(figures).toHaveLength(2)
    expect(
      figures.map((figure) =>
        flat(within(figure).getByText(/Strana/).textContent),
      ),
    ).toEqual(['Strana 1 · Srovnání', 'Strana 4 · Daně'])
  })

  it('draws the previews as abstract art that screen readers skip, not as images of real data', () => {
    const { container } = render(<EmailPreview />)
    expect(screen.queryAllByRole('img')).toHaveLength(0)
    expect(container.querySelectorAll('img')).toHaveLength(0)
    for (const figure of screen.getAllByRole('figure')) {
      expect(figure.querySelector('[aria-hidden="true"]')).not.toBeNull()
    }
    // the abstract art carries no numbers
    expect(container.textContent).not.toMatch(/\d{2}|Kč|%/)
  })
})
