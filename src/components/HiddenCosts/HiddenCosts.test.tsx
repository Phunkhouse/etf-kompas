import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HiddenCosts } from './HiddenCosts'

const flat = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

describe('HiddenCosts: "Za co platíte, aniž to vidíte"', () => {
  it('is a section named after its heading', () => {
    render(<HiddenCosts />)
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Za co platíte, aniž to vidíte',
      }),
    ).toBeTruthy()
    expect(
      screen.getByRole('region', { name: 'Za co platíte, aniž to vidíte' }),
    ).toBeTruthy()
  })

  it('has three numbered cards, in this order: fund fee, conversion, tax', () => {
    render(<HiddenCosts />)
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(
      items.map(
        (item) => within(item).getByRole('heading', { level: 3 }).textContent,
      ),
    ).toEqual(['Roční poplatek fondu', 'Převod korun', 'Daň ze zisků'])
  })

  it('says each in one plain sentence', () => {
    render(<HiddenCosts />)
    const sentences = screen
      .getAllByRole('listitem')
      .map((item) =>
        flat(within(item).getByText(/\.|ověřit zdroj/).textContent),
      )
    expect(sentences).toEqual([
      'Fond si každý rok vezme malé procento z vašich peněz. Nikdo vám za to nepošle fakturu.',
      'Když fond nebo broker účtuje v cizí měně, platí se za převod z korun.',
      // No tax statement until a source is read and a reviewer has checked it
      // (docs/TAX-SOURCES.md): the card says so instead of claiming something.
      '[ověřit zdroj]',
    ])
  })

  it('says nothing about who takes what from the profits until a source stands behind it', () => {
    render(<HiddenCosts />)
    const body = flat(document.body.textContent)
    expect(body).not.toMatch(/stáhne|zahraničí|vyplacených/)
  })

  it('contains no figures: it must not state a fee, a rate or an amount', () => {
    const { container } = render(<HiddenCosts />)
    expect(container.textContent).not.toMatch(/\d|%|Kč/)
  })
})
