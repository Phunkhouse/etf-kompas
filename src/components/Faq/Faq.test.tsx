import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { OriginalsFacts } from '@/server/hero'
import { Faq } from './Faq'

const flat = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

const facts = (over: Partial<OriginalsFacts> = {}): OriginalsFacts => ({
  tickers: ['VOO', 'QQQ'],
  verifiedNo: 3,
  total: 5,
  europeanSold: true,
  ...over,
})

function answers(container: HTMLElement) {
  return [...container.querySelectorAll('details')].map((details) =>
    flat(details.textContent),
  )
}

describe('Faq: "Časté dotazy"', () => {
  it('is a section named after its label, at the id the header links to', () => {
    const { container } = render(<Faq facts={facts()} />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Časté dotazy' }),
    ).toBeTruthy()
    expect(screen.getByRole('region', { name: 'Časté dotazy' })).toBeTruthy()
    expect(container.querySelector('#caste-dotazy')).not.toBeNull()
  })

  it('has four questions, in this order, as items that start closed', () => {
    const { container } = render(<Faq facts={facts()} />)
    const items = [...container.querySelectorAll('details')]
    expect(items).toHaveLength(4)
    expect(items.every((details) => !details.open)).toBe(true)
    expect(
      items.map((details) => details.querySelector('summary')!.textContent),
    ).toEqual([
      'Můžu si americký fond koupit z Česka?',
      'Je to zdarma?',
      'Co uděláte s mým e-mailem?',
      'Radíte mi, co koupit?',
    ])
  })

  it('answers "Je to zdarma?"', () => {
    const { container } = render(<Faq facts={facts()} />)
    expect(answers(container)[1]).toContain(
      'Ano. Srovnání je zdarma. Nedostáváme provize a nic vám neprodáváme.',
    )
  })

  it('answers the e-mail question without a retention period, and says it is a trial', () => {
    const { container } = render(<Faq facts={facts()} />)
    const text = answers(container)[2]
    expect(text).toContain(
      'Pošleme vám na něj srovnání. Tipy k investování jen když to zaškrtnete. V každém e-mailu bude odkaz na odhlášení. Zatím jde o zkušební provoz: e-mail nikam neukládáme.',
    )
    expect(text).not.toMatch(/\d/)
  })

  it('answers "Radíte mi, co koupit?" with no', () => {
    const { container } = render(<Faq facts={facts()} />)
    expect(answers(container)[3]).toContain(
      'Ne. Ukazujeme poplatky a dostupnost. Není to investiční ani daňové poradenství. Rozhodnutí je na vás.',
    )
  })
})

describe('Faq: the answer about the American funds comes from the data', () => {
  const first = (container: HTMLElement) => answers(container)[0]

  it('with some brokers verified: says how many, and that the others are being checked', () => {
    const { container } = render(<Faq facts={facts()} />)
    const text = first(container)
    expect(text).toContain(
      'Zatím to vypadá, že ne. U 3 z 5 brokerů máme ověřeno, že VOO a QQQ nenabízí. U ostatních ověřujeme.',
    )
    expect(text).toContain('Stejné indexy koupíte v evropské verzi.')
  })

  it('gives the reason in a hedged sentence', () => {
    const { container } = render(<Faq facts={facts()} />)
    expect(first(container)).toContain(
      'Důvodem bývá, že americké fondy nemají evropský klíčový informační dokument (KID).',
    )
  })

  it('with every broker verified: says none of them offers them', () => {
    const { container } = render(
      <Faq facts={facts({ verifiedNo: 5, total: 5 })} />,
    )
    const text = first(container)
    expect(text).toContain('Ne.')
    expect(text).toContain(
      'Ani jeden z 5 ověřených brokerů VOO a QQQ nenabízí.',
    )
    expect(text).not.toContain('U ostatních ověřujeme')
  })

  it('with nobody verified yet: says it is being checked, and claims no count', () => {
    const { container } = render(<Faq facts={facts({ verifiedNo: 0 })} />)
    const text = first(container)
    expect(text).toContain(
      'U kterých brokerů koupíte VOO a QQQ, zatím ověřujeme.',
    )
    expect(text).not.toMatch(/\d/)
    expect(text).not.toContain('Zatím to vypadá, že ne')
  })

  it('says the European version can be bought only when a seller is verified', () => {
    const { container } = render(<Faq facts={facts({ europeanSold: false })} />)
    expect(first(container)).not.toContain(
      'Stejné indexy koupíte v evropské verzi.',
    )
  })

  it('has a careful answer without facts at all', () => {
    const { container } = render(<Faq />)
    const text = first(container)
    expect(text).toContain('zatím ověřujeme')
    expect(text).not.toMatch(/\d/)
  })
})
