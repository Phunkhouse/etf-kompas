import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TrustBlock } from './TrustBlock'

const flat = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

describe('TrustBlock: "Proč nám věřit"', () => {
  it('is a section named after its label', () => {
    render(<TrustBlock />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Proč nám věřit' }),
    ).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Proč nám věřit' })).toBeTruthy()
  })

  it('has three items, in this order, each with the id the header links to', () => {
    const { container } = render(<TrustBlock />)
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.map((h) => h.textContent)).toEqual([
      'Odkud máme čísla',
      'Jak počítáme',
      'Nic neprodáváme',
    ])
    for (const id of ['odkud-mame-cisla', 'jak-pocitame', 'nic-neprodavame']) {
      expect(container.querySelector(`#${id}`)).not.toBeNull()
    }
    expect(
      within(container.querySelector('#jak-pocitame') as HTMLElement).getByRole(
        'heading',
        { level: 3 },
      ).textContent,
    ).toBe('Jak počítáme')
  })

  it('says where the numbers come from, and that each has a date', () => {
    const { container } = render(<TrustBlock />)
    expect(
      flat(container.querySelector('#odkud-mame-cisla')!.textContent),
    ).toContain(
      'Z dokumentů fondů, ze stránek brokerů a od České národní banky. U každého čísla je datum.',
    )
  })

  it('says what is counted, what is not, and that it is an example', () => {
    const { container } = render(<TrustBlock />)
    const text = flat(container.querySelector('#jak-pocitame')!.textContent)
    expect(text).toContain(
      'Počítáme poplatek fondu, převod korun a poplatky brokera.',
    )
    expect(text).toContain(
      'Nepočítáme české daně, inflaci ani rozdíl mezi nákupní a prodejní cenou.',
    )
    expect(text).toContain('Jedna investice měsíčně. Je to příklad, ne slib.')
  })

  it('explains that the commission is charged on every monthly investment, so a fixed fee weighs most on small deposits', () => {
    const { container } = render(<TrustBlock />)
    const text = flat(container.querySelector('#jak-pocitame')!.textContent)
    expect(text).toContain(
      'Provizi brokera počítáme u každé měsíční investice zvlášť. Pevná částka za objednávku proto nejvíc zdraží malé měsíční vklady.',
    )
  })

  it('says it sells nothing and gives no advice', () => {
    const { container } = render(<TrustBlock />)
    expect(
      flat(container.querySelector('#nic-neprodavame')!.textContent),
    ).toContain('Nedostáváme provize. Nejde o investiční poradenství.')
  })

  it('has no figures: no fee, rate, amount or date typed into the text', () => {
    const { container } = render(<TrustBlock />)
    expect(container.textContent).not.toMatch(/\d|%|Kč/)
  })
})
