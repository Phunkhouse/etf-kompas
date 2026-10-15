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

  it('puts the amount of variant b in its own element, and variant a has none', () => {
    const { unmount } = render(
      <HeroB
        twins={twins}
        note={note()}
        dataAsOf={null}
        variant="b"
        savingKc={28302}
      />,
    )
    const amount = screen
      .getByRole('heading', { level: 1 })
      .querySelector('span')
    expect(amount).not.toBeNull()
    expect(flatText(amount!.textContent)).toBe('28 302 Kč')
    unmount()
    render(<HeroB twins={twins} note={note()} dataAsOf={null} variant="a" />)
    expect(
      screen.getByRole('heading', { level: 1 }).querySelector('span'),
    ).toBeNull()
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
    expect(screen.getByText(/Stejné firmy z S&P 500 a Nasdaq 100/)).toBeTruthy()
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

  it('says "Zdarma, bez registrace" right after the button, outside it', () => {
    render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
    const line = screen.getByText('Zdarma, bez registrace')
    const button = screen.getByRole('link', {
      name: 'Spočítat, kolik mě to bude stát',
    })
    expect(button.contains(line)).toBe(false)
    expect(
      button.compareDocumentPosition(line) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    // the button keeps its own label, so the link name is not changed by the line
    expect(button.textContent).toBe('Spočítat, kolik mě to bude stát')
  })

  it('has no link "nebo rovnou srovnání brokerů" under the button', () => {
    render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
    expect(
      screen.queryByRole('link', { name: /nebo rovnou srovnání/ }),
    ).toBeNull()
    expect(screen.getAllByRole('link')).toHaveLength(1) // only the button
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

  describe('the short line under the table and the note under the callout', () => {
    const detail = () =>
      (screen.getByTestId('hero-detail').textContent ?? '').replace(/\s/g, ' ')

    it('says how many known brokers there are and when they were verified, not who', () => {
      render(<HeroB twins={twins} note={note()} dataAsOf="2026-10-12" />)
      const text = mutedLine().replace(/\s/g, ' ')
      expect(text).toContain('CSPX: 3 známí brokeři')
      expect(text).toContain('ověřeno k 10. 2026')
      expect(text).not.toContain('DEGIRO')
      expect(text).not.toContain('Trading 212')
    })

    it('counts in Czech: 1 broker, 3 brokeři, 5 brokerů', () => {
      const names = ['DEGIRO', 'Fio e-Broker', 'IBKR', 'Trading 212', 'XTB']
      const line = (count: number) => {
        const { unmount } = render(
          <HeroB
            twins={twins}
            note={note({ sellers: names.slice(0, count) })}
            dataAsOf={null}
          />,
        )
        const text = mutedLine().replace(/\s/g, ' ')
        unmount()
        return text
      }
      expect(line(1)).toContain('CSPX: 1 známý broker')
      expect(line(3)).toContain('CSPX: 3 známí brokeři')
      expect(line(5)).toContain('CSPX: 5 známých brokerů')
    })

    it('leaves the date out without one', () => {
      render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
      expect(mutedLine()).not.toContain('ověřeno')
    })

    it('has no sentence about the American funds, the callout says it', () => {
      render(<HeroB twins={twins} note={note()} dataAsOf="2026-10-12" />)
      for (const text of [mutedLine(), detail()]) {
        expect(text).not.toContain('nekoupíte')
        expect(text).not.toContain('VOO')
        expect(text).not.toContain('U ostatních')
      }
    })

    it('names the brokers in a note under the callout, after it', () => {
      render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
      expect(detail()).toContain('Brokeři: DEGIRO, Trading 212, XTB.')
      expect(
        screen
          .getByRole('note')
          .compareDocumentPosition(screen.getByTestId('hero-detail')) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    })

    it('says this is price and availability only, no returns, in both places', () => {
      render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
      expect(detail()).toContain('Jen cena a dostupnost, ne výnosy.')
      // wide screens show it in the short line instead of the note
      expect(mutedLine().replace(/\s/g, ' ')).toContain(
        'jen cena a dostupnost, ne výnosy',
      )
    })

    it('has the setting of the amount in the note too, only in variant b', () => {
      const { unmount } = render(
        <HeroB
          twins={twins}
          note={note()}
          dataAsOf={null}
          variant="b"
          savingKc={28302}
        />,
      )
      expect(detail()).toContain(B_LINE)
      unmount()
      render(<HeroB twins={twins} note={note()} dataAsOf={null} variant="a" />)
      expect(detail()).not.toContain('Částka v nadpisu')
    })

    it('does not claim a seller it does not have, and has no names note', () => {
      render(
        <HeroB twins={twins} note={note({ sellers: [] })} dataAsOf={null} />,
      )
      expect(mutedLine()).toContain('U kterých brokerů koupíte CSPX')
      expect(mutedLine()).toContain('zatím ověřujeme')
      expect(screen.queryByTestId('hero-detail')).toBeNull()
    })

    it('never says "nejlevnější"', () => {
      const { container } = render(
        <HeroB twins={twins} note={note()} dataAsOf="2026-10-12" />,
      )
      expect(container.textContent).not.toMatch(/nejlevn/i)
    })
  })
})
