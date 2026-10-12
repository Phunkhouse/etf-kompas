import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calculatorData } from '@/server/calculator-data'
import { bundledData } from '@/server/data/bundled'
import { Landing } from './Landing'

const RATES = {
  EUR: { rate: 24.365, date: '2026-10-09', source: 'cnb' as const },
}

// Reduced motion: no animation to wait for.
beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  )
})
afterEach(() => vi.unstubAllGlobals())

describe('Landing', () => {
  it('has the page landmarks: banner, main and contentinfo', () => {
    render(<Landing variant="a" dataAsOf="2026-06-30" />)
    expect(screen.getByRole('banner')).toBeTruthy()
    expect(screen.getByRole('main')).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy()
  })

  it('shows the rev. 4 headline as the only h1 in hero a', () => {
    render(<Landing variant="a" dataAsOf={null} />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0].textContent).toContain(
      'Americké indexy z Česka: u koho je koupíte a za kolik?',
    )
  })

  it('shows the same headline in hero b: the heroes differ by layout, not wording', () => {
    render(<Landing variant="b" dataAsOf={null} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Americké indexy z Česka: u koho je koupíte a za kolik?',
    )
  })
})

describe('Landing, hero a', () => {
  it('says it takes 20 seconds, free and without registration', () => {
    render(<Landing variant="a" dataAsOf={null} />)
    expect(
      screen.getByText('Zjistěte to za 20 sekund. Zdarma, bez registrace.'),
    ).toBeTruthy()
  })

  it('has no table, and its calculator starts the page', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    render(<Landing variant="a" dataAsOf="2026-06-30" calculator={data} />)
    expect(screen.queryByRole('table')).toBeNull()
    expect(screen.getByRole('slider', { name: /měsíčně/ })).toBeTruthy()
    expect(
      screen
        .getByRole('link', { name: 'Ukázat, kolik mě to bude stát' })
        .getAttribute('href'),
    ).toBe('#vysledek')
  })

  it('puts the calculator band right after the headline', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    render(<Landing variant="a" dataAsOf={null} calculator={data} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    const band = screen.getByRole('region', { name: 'Kolik vás to bude stát?' })
    // the h1 comes before the calculator in the page
    expect(
      h1.compareDocumentPosition(band) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('does not show the "Ukázat" button in hero b', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    render(<Landing variant="b" dataAsOf={null} calculator={data} />)
    expect(
      screen.queryByRole('link', { name: 'Ukázat, kolik mě to bude stát' }),
    ).toBeNull()
  })
})

describe('Landing, variant b with the table', () => {
  const twins = [
    {
      fundId: 'cspx',
      ticker: 'CSPX',
      ter: 0.07,
      type: 'accumulating' as const,
    },
    {
      fundId: 'vuaa',
      ticker: 'VUAA',
      ter: 0.07,
      type: 'accumulating' as const,
    },
    { fundId: 'cndx', ticker: 'CNDX', ter: 0.3, type: 'accumulating' as const },
    { fundId: 'eqqq', ticker: 'EQQQ', ter: 0.3, type: 'distributing' as const },
  ]
  const note = {
    fundId: 'cspx',
    ticker: 'CSPX',
    sellers: ['DEGIRO'],
    othersUnverified: true,
    originals: { tickers: ['VOO', 'QQQ'], mostlyNo: true },
  }

  it('shows the hero table with its rows', () => {
    render(
      <Landing variant="b" dataAsOf="2026-06-30" twins={twins} note={note} />,
    )
    expect(screen.getByRole('table', { name: 'Cena fondů' })).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /Spočítat, kolik mě to bude stát/ }),
    ).toBeTruthy()
  })

  it('does not show the table in variant a', () => {
    render(<Landing variant="a" dataAsOf="2026-06-30" />)
    expect(screen.queryByRole('table')).toBeNull()
  })
})

describe('Landing, the explainer sections', () => {
  it.each(['a', 'b'] as const)(
    'has "Za co platíte" and "Co dostanete e-mailem" in hero %s, after the calculator band',
    (variant) => {
      const data = calculatorData(bundledData, RATES, 'cspx')
      render(<Landing variant={variant} dataAsOf={null} calculator={data} />)
      const band = screen.getByRole('region', {
        name: 'Kolik vás to bude stát?',
      })
      const costs = screen.getByRole('region', {
        name: 'Za co platíte, aniž to vidíte',
      })
      const preview = screen.getByRole('region', {
        name: 'Fondy, brokeři a co z toho koupíte z Česka',
      })
      const after = (a: Element, b: Element) =>
        Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)
      expect(after(band, costs)).toBe(true)
      expect(after(costs, preview)).toBe(true)
    },
  )

  it('has them without a calculator too, since they are static content', () => {
    render(<Landing variant="a" dataAsOf={null} />)
    expect(
      screen.getByRole('region', { name: 'Za co platíte, aniž to vidíte' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('region', {
        name: 'Fondy, brokeři a co z toho koupíte z Česka',
      }),
    ).toBeTruthy()
  })
})
