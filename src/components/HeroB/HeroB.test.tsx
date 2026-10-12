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

describe('HeroB', () => {
  it('has the headline as h1 and names the section after it', () => {
    render(<HeroB twins={twins} note={note()} dataAsOf={null} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('Americké indexy z Česka')
    expect(
      screen.getByRole('region', { name: heading.textContent ?? '' }),
    ).toBeTruthy()
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
