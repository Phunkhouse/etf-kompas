import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PrivacyPolicy } from './PrivacyPolicy'

const flat = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

// The drawn page: seven sections, with "[doplnit]" where the text is not decided
// yet. The wording is the wireframe's own; nothing is added.
const SECTIONS = [
  ['kdo-zpracovava', 'Kdo údaje zpracovává'],
  ['jake-udaje', 'Jaké údaje zpracováváme'],
  ['proc-a-zaklad', 'Proč a na jakém základě'],
  ['jak-dlouho', 'Jak dlouho'],
  ['komu-predavame', 'Komu údaje předáváme'],
  ['vase-prava', 'Vaše práva'],
  ['cookies', 'Cookies'],
] as const

describe('PrivacyPolicy: the page', () => {
  it('has the label, the title as the only h1, and the date as a gap', () => {
    const { container } = render(<PrivacyPolicy />)
    expect(screen.getByText('Právní')).toBeTruthy()
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Zásady zpracování osobních údajů',
      }),
    ).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(flat(container.textContent)).toContain('Platí od [doplnit]')
  })

  it('has seven sections, in this order, each with its id', () => {
    const { container } = render(<PrivacyPolicy />)
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings.map((h) => h.textContent)).toEqual(
      SECTIONS.map(([, title]) => title),
    )
    for (const [id, title] of SECTIONS) {
      const section = container.querySelector(`#${id}`)
      expect(section, `#${id}`).not.toBeNull()
      expect(
        within(section as HTMLElement).getByRole('heading').textContent,
      ).toBe(title)
    }
  })

  it('has a contents list with a link to each section', () => {
    render(<PrivacyPolicy />)
    const nav = screen.getByRole('navigation', { name: 'Obsah' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((l) => l.textContent)).toEqual(
      SECTIONS.map(([, title]) => title),
    )
    expect(links.map((l) => l.getAttribute('href'))).toEqual(
      SECTIONS.map(([id]) => `#${id}`),
    )
  })
})

describe("PrivacyPolicy: the wording is the drawing's own", () => {
  const text = (container: HTMLElement, id: string) =>
    flat(container.querySelector(`#${id}`)!.textContent)

  it('1: who processes the data, with the controller from the site config', () => {
    const { container } = render(<PrivacyPolicy />)
    expect(text(container, 'kdo-zpracovava')).toContain(
      'Správcem je [SPRÁVCE] – [IČO], [adresa]. Napsat nám můžete na [doplnit].',
    )
  })

  it('2: which data', () => {
    const { container } = render(<PrivacyPolicy />)
    expect(text(container, 'jake-udaje')).toContain(
      'Váš e-mail, nastavení kalkulačky (měsíční částka a počet let) a technické údaje o návštěvě, ty jen když povolíte cookies.',
    )
  })

  it('3: why and on what basis', () => {
    const { container } = render(<PrivacyPolicy />)
    expect(text(container, 'proc-a-zaklad')).toContain(
      'Zaslání srovnání, o které jste požádali (e-mail, nastavení). Nepovinné tipy k investování jen s vaším souhlasem. Měření a reklama jen s vaším souhlasem. Právní základ u každého účelu: [doplnit].',
    )
  })

  it('4: how long, with the number of months left as a gap', () => {
    const { container } = render(<PrivacyPolicy />)
    expect(text(container, 'jak-dlouho')).toContain(
      'E-mail uchováváme do odhlášení, nejdéle [doplnit] měsíců. Souhlas můžete kdykoli odvolat, odkaz je v každém e-mailu.',
    )
  })

  it('5: who gets it, with each processor left as a gap', () => {
    const { container } = render(<PrivacyPolicy />)
    expect(text(container, 'komu-predavame')).toContain(
      'Zpracovatelům, které potřebujeme: služba pro rozesílání e-mailů [doplnit], hosting [doplnit], měření návštěvnosti [doplnit]. Každý z nich má smlouvu o zpracování.',
    )
  })

  it('6: the rights, including the complaint to the data protection office', () => {
    const { container } = render(<PrivacyPolicy />)
    expect(text(container, 'vase-prava')).toContain(
      'Můžete požádat o přístup k údajům, opravu, výmaz, omezení zpracování a vznést námitku. Máte právo podat stížnost u Úřadu pro ochranu osobních údajů.',
    )
  })

  it('7: cookies', () => {
    const { container } = render(<PrivacyPolicy />)
    expect(text(container, 'cookies')).toContain(
      'Přehled, co a proč používáme, a nastavení najdete přes odkaz Cookies v patičce.',
    )
  })
})

describe('PrivacyPolicy: nothing is invented', () => {
  it('shows each gap as a marker: seven in all (date, e-mail, basis, months, three processors)', () => {
    const { container } = render(<PrivacyPolicy />)
    const gaps = container.querySelectorAll('[data-placeholder]')
    expect(gaps).toHaveLength(7)
    expect([...gaps].every((g) => g.textContent === '[doplnit]')).toBe(true)
  })

  it('has no number of months, no date and no figure of its own', () => {
    const { container } = render(<PrivacyPolicy />)
    const withoutGaps = flat(container.textContent).replace(/\[doplnit\]/g, '')
    expect(withoutGaps).not.toMatch(/\d/)
  })
})
