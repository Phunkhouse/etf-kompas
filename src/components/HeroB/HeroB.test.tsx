import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { HeroNote, HeroTwin } from '@/server/hero'
import { HeroB } from './HeroB'

const twins: HeroTwin[] = [
  { fundId: 'cspx', ticker: 'CSPX', ter: 0.07, type: 'accumulating' },
  { fundId: 'vuaa', ticker: 'VUAA', ter: 0.07, type: 'accumulating' },
  { fundId: 'cndx', ticker: 'CNDX', ter: 0.3, type: 'accumulating' },
  { fundId: 'eqqq', ticker: 'EQQQ', ter: 0.3, type: 'distributing' },
]

function note(over: Partial<HeroNote> = {}): HeroNote {
  return {
    fundId: 'cspx',
    ticker: 'CSPX',
    sellers: ['DEGIRO', 'Trading 212', 'XTB'],
    othersUnverified: true,
    originals: { tickers: ['VOO', 'QQQ'], mostlyNo: true },
    ...over,
  }
}

const mutedLine = () => screen.getByTestId('hero-note').textContent ?? ''

const B_LINE =
  'Částka v nadpisu: 3 000 Kč měsíčně, 10 let, odhad bez českých daní a inflace.'
const flatText = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

describe('HeroB: the two headlines (note 0041)', () => {
  it('shows the neutral question in variant a, and no amount sentence', () => {
    render(<HeroB twins={twins} note={note()} dataAsOf={null} variant="a" />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Americké indexy z Česka: u koho je koupíte a za kolik?',
    )
    expect(flatText(screen.getByTestId('hero-note').textContent)).not.toContain(
      'Částka v nadpisu',
    )
  })

  it('is variant a when no variant is given', () => {
    render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Americké indexy z Česka',
    )
  })

  it('shows the saving in variant b: "U stejného fondu můžete zbytečně zaplatit až X Kč. Kde?"', () => {
    render(
      <HeroB
        twins={twins}
        note={note()}
        dataAsOf={null}
        variant="b"
        savingKc={28302}
      />,
    )
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(flatText(h1.textContent)).toBe(
      'U stejného fondu můžete zbytečně zaplatit až 28 302 Kč. Kde?',
    )
  })

  it('keeps the amount and "Kč" on one line with non-breaking spaces', () => {
    render(
      <HeroB
        twins={twins}
        note={note()}
        dataAsOf={null}
        variant="b"
        savingKc={28302}
      />,
    )
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      '28 302 Kč',
    )
  })

  it('says under the table which setting the amount is for, only in variant b', () => {
    const { unmount } = render(
      <HeroB
        twins={twins}
        note={note()}
        dataAsOf={null}
        variant="b"
        savingKc={28302}
      />,
    )
    expect(flatText(screen.getByTestId('hero-note').textContent)).toContain(
      B_LINE,
    )
    unmount()
    render(<HeroB twins={twins} note={note()} dataAsOf={null} variant="a" />)
    expect(flatText(screen.getByTestId('hero-note').textContent)).not.toContain(
      B_LINE,
    )
  })

  it('has the same table, button and callout in both variants', () => {
    const { unmount } = render(
      <HeroB
        twins={twins}
        note={note()}
        dataAsOf={null}
        variant="b"
        savingKc={28302}
      />,
    )
    expect(screen.getByRole('table', { name: 'Cena fondů' })).toBeTruthy()
    expect(
      screen.getByRole('link', { name: 'Spočítat, kolik mě to bude stát' }),
    ).toBeTruthy()
    expect(screen.getByRole('note')).toBeTruthy()
    unmount()
    render(<HeroB twins={twins} note={note()} dataAsOf={null} variant="a" />)
    expect(screen.getByRole('table', { name: 'Cena fondů' })).toBeTruthy()
  })

  it('never shows the placeholder "X XXX": variant b without an amount falls back to a', () => {
    const { container } = render(
      <HeroB
        twins={twins}
        note={note()}
        dataAsOf={null}
        variant="b"
        savingKc={null}
      />,
    )
    expect(container.textContent).not.toMatch(/X\s*XXX/)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Americké indexy z Česka',
    )
    expect(flatText(screen.getByTestId('hero-note').textContent)).not.toContain(
      'Částka v nadpisu',
    )
  })

  it('does not name a saving of 0 Kč or less either', () => {
    render(
      <HeroB
        twins={twins}
        note={note()}
        dataAsOf={null}
        variant="b"
        savingKc={0}
      />,
    )
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Americké indexy z Česka',
    )
  })
})

describe('HeroB', () => {
  it('has the headline as h1 and names the section after it', () => {
    render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('Americké indexy z Česka')
    expect(
      screen.getByRole('region', { name: heading.textContent ?? '' }),
    ).toBeTruthy()
  })

  it('has the button in a block with the id the sticky bar watches', () => {
    const { container } = render(
      <HeroB twins={twins} note={note()} dataAsOf={null} />,
    )
    const block = container.querySelector('#hero-cta')
    expect(block).not.toBeNull()
    expect(block!.querySelector('a[href="#spocitat"]')?.textContent).toMatch(
      /Spočítat, kolik mě to bude stát/,
    )
  })

  it('has the lead, the table and a button that jumps to the calculator', () => {
    render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
    expect(
      screen.getByText(/Stejné firmy ze S&P 500 a Nasdaq 100/),
    ).toBeTruthy()
    expect(screen.getByRole('table')).toBeTruthy()
    expect(
      screen
        .getByRole('link', { name: /Spočítat, kolik mě to bude stát/ })
        .getAttribute('href'),
    ).toBe('#spocitat')
  })

  it('explains ETF once, in a note', () => {
    render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
    expect(screen.getByRole('note').textContent).toContain(
      'ETF je fond, který jen kopíruje trh',
    )
  })

  it('has a link "nebo rovnou srovnání brokerů" that goes to the e-mail form', () => {
    render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
    expect(
      screen
        .getByRole('link', { name: 'nebo rovnou srovnání brokerů' })
        .getAttribute('href'),
    ).toBe('#formular')
  })

  describe('the callout', () => {
    const calloutText = () =>
      (screen.getByRole('note').textContent ?? '').replace(/\s/g, ' ')

    it('explains ETF in one sentence and, when the data shows it, says what can be bought', () => {
      render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
      expect(calloutText()).toContain('ETF je fond, který jen kopíruje trh.')
      expect(calloutText()).toContain(
        'Americké fondy (VOO, QQQ) u většiny brokerů z Česka nekoupíte, evropské verze stejných indexů ano.',
      )
    })

    it('does not say the originals are mostly not sold without a majority in the data', () => {
      render(
        <HeroB
          twins={twins}
          note={note({
            originals: { tickers: ['VOO', 'QQQ'], mostlyNo: false },
          })}
          dataAsOf={null}
        />,
      )
      expect(calloutText()).toContain('ETF je fond, který jen kopíruje trh.')
      expect(calloutText()).not.toContain('nekoupíte')
    })

    it('does not say the European versions can be bought while no seller is verified', () => {
      render(
        <HeroB twins={twins} note={note({ sellers: [] })} dataAsOf={null} />,
      )
      expect(calloutText()).not.toContain('evropské verze stejných indexů ano')
    })

    it('has only the ETF sentence without a note', () => {
      render(<HeroB twins={twins} dataAsOf={null} />)
      expect(calloutText()).toContain('ETF je fond, který jen kopíruje trh.')
      expect(calloutText()).not.toContain('nekoupíte')
    })
  })

  describe('the muted line under the table', () => {
    it('names where the first twin is sold, with the month it was verified', () => {
      render(<HeroB twins={twins} note={note()} dataAsOf="2026-10-12" />)
      const text = mutedLine().replace(/\s/g, ' ')
      expect(text).toContain('CSPX: DEGIRO, Trading 212, XTB')
      expect(text).toContain('ověřeno k 10. 2026')
    })

    it('says the others are being verified only while they are', () => {
      const { unmount } = render(
        <HeroB twins={twins} note={note()} dataAsOf={null} />,
      )
      expect(mutedLine()).toContain('U ostatních fondů a brokerů ověřujeme.')
      unmount()
      render(
        <HeroB
          twins={twins}
          note={note({ othersUnverified: false })}
          dataAsOf={null}
        />,
      )
      expect(mutedLine()).not.toContain('U ostatních')
    })

    it('says the originals are mostly not sold only when the data shows a majority', () => {
      const { unmount } = render(
        <HeroB twins={twins} note={note()} dataAsOf={null} />,
      )
      expect(mutedLine().replace(/\s/g, ' ')).toContain(
        'Americké VOO a QQQ u většiny brokerů nekoupíte.',
      )
      unmount()
      render(
        <HeroB
          twins={twins}
          note={note({
            originals: { tickers: ['VOO', 'QQQ'], mostlyNo: false },
          })}
          dataAsOf={null}
        />,
      )
      const text = mutedLine().replace(/\s/g, ' ')
      expect(text).not.toContain('u většiny brokerů')
      expect(text).toContain('VOO a QQQ')
      expect(text).toContain('ověřujeme')
    })

    it('does not claim a seller it does not have', () => {
      render(
        <HeroB twins={twins} note={note({ sellers: [] })} dataAsOf={null} />,
      )
      const text = mutedLine()
      expect(text).not.toContain('CSPX:')
      expect(text).toContain('CSPX')
      expect(text).toContain('ověřujeme')
    })

    it('ends with the line that this is price and availability only, no returns', () => {
      const { unmount } = render(
        <HeroB twins={twins} note={note()} dataAsOf={null} />,
      )
      expect(mutedLine().replace(/\s/g, ' ')).toMatch(
        /Jen cena a dostupnost, ne výnosy\.$/,
      )
      unmount()
      render(
        <HeroB twins={twins} note={note({ sellers: [] })} dataAsOf={null} />,
      )
      expect(mutedLine().replace(/\s/g, ' ')).toMatch(
        /Jen cena a dostupnost, ne výnosy\.$/,
      )
    })

    it('never says "nejlevnější"', () => {
      const { container } = render(
        <HeroB twins={twins} note={note()} dataAsOf="2026-10-12" />,
      )
      expect(container.textContent).not.toMatch(/nejlevn/i)
    })
  })
})
