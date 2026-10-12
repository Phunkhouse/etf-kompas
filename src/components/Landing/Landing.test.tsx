import { render, screen, within } from '@testing-library/react'
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

const twins = [
  { fundId: 'cspx', ticker: 'CSPX', ter: 0.07, type: 'accumulating' as const },
  { fundId: 'vuaa', ticker: 'VUAA', ter: 0.07, type: 'accumulating' as const },
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

// Rev. 5 (note 0041): both variants share one layout and differ only in the h1.
describe.each(['a', 'b'] as const)(
  'Landing, variant %s: the one layout',
  (variant) => {
    const data = calculatorData(bundledData, RATES, 'cspx')

    it('has the hero table with four rows, and the button that jumps to the calculator', () => {
      render(
        <Landing
          variant={variant}
          dataAsOf="2026-06-30"
          twins={twins}
          note={note}
          calculator={data}
        />,
      )
      const table = screen.getByRole('table', { name: 'Cena fondů' })
      expect(within(table).getAllByRole('row')).toHaveLength(5)
      expect(
        screen
          .getByRole('link', { name: 'Spočítat, kolik mě to bude stát' })
          .getAttribute('href'),
      ).toBe('#spocitat')
    })

    it('has the headline, then the table, then the calculator band, then the explainers', () => {
      render(
        <Landing
          variant={variant}
          dataAsOf={null}
          twins={twins}
          note={note}
          calculator={data}
        />,
      )
      const order = [
        screen.getByRole('heading', { level: 1 }),
        screen.getByRole('table', { name: 'Cena fondů' }),
        screen.getByRole('region', { name: 'Kolik vás to bude stát?' }),
        screen.getByRole('region', { name: 'Za co platíte, aniž to vidíte' }),
      ]
      for (let i = 1; i < order.length; i += 1) {
        expect(
          order[i - 1].compareDocumentPosition(order[i]) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy()
      }
    })

    it('has nothing left of the calculator-first hero', () => {
      render(<Landing variant={variant} dataAsOf={null} calculator={data} />)
      expect(
        screen.queryByRole('link', { name: 'Ukázat, kolik mě to bude stát' }),
      ).toBeNull()
      expect(screen.queryByText(/Zjistěte to za 20 sekund/)).toBeNull()
      expect(
        screen.queryByText('Příklad výpočtu. Investování nese riziko ztráty.'),
      ).toBeNull()
    })

    it('marks the page with the variant it shows, for the tracking that comes later', () => {
      render(<Landing variant={variant} dataAsOf={null} />)
      expect(screen.getByRole('main').getAttribute('data-variant')).toBe(
        variant,
      )
    })
  },
)

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
