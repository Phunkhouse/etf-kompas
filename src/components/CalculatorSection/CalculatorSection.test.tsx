import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Buyability } from '@/server/availability'
import type { CalculatorInputs } from '@/server/calculator-inputs'
import { CalculatorSection } from './CalculatorSection'

// Invented numbers, not real fund data. The "us" fund is the cheaper one.
const inputs: CalculatorInputs = {
  featured: {
    id: 'us',
    indexGroup: 'g',
    ter: 0.03,
    dividendYieldPct: 1.11,
    withholdingRate: 15,
  },
  alternative: {
    id: 'eu',
    indexGroup: 'g',
    ter: 0.07,
    dividendYieldPct: 1.11,
    withholdingRate: 15,
  },
  fxFeePct: 0.25,
}

function buyability(
  state: Buyability['state'],
  verifiedNoCount: number,
): Buyability {
  return { state, yesCount: state === 'yes' ? 1 : 0, verifiedNoCount, total: 5 }
}

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

describe('CalculatorSection', () => {
  it('is the region the hero button jumps to, named by its h2', () => {
    const { container } = render(
      <CalculatorSection
        inputs={inputs}
        featuredBuyability={buyability('unverified', 3)}
      />,
    )
    expect(container.querySelector('section')?.id).toBe('spocitat')
    expect(
      screen.getByRole('region', { name: 'Kolik to u vás dělá?' }),
    ).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2 })).toBeTruthy()
  })

  it('says how many firms are verified as not selling the cheaper fund', () => {
    render(
      <CalculatorSection
        inputs={inputs}
        featuredBuyability={buyability('unverified', 3)}
      />,
    )
    expect(screen.getByText(/zaplatíte méně o/)).toBeTruthy()
    expect(screen.getByText(/nekoupíte u 3 z 5 firem/)).toBeTruthy()
  })

  it('does not claim a count it does not have', () => {
    render(
      <CalculatorSection
        inputs={inputs}
        featuredBuyability={buyability('unverified', 0)}
      />,
    )
    expect(screen.getByText(/zatím ověřujeme/)).toBeTruthy()
    expect(screen.queryByText(/z 5 firem/)).toBeNull()
  })

  it('says "nowhere" only when the fund is verified as not buyable', () => {
    render(
      <CalculatorSection
        inputs={inputs}
        featuredBuyability={buyability('no', 5)}
      />,
    )
    expect(screen.getByText(/u žádné z 5 firem/)).toBeTruthy()
  })

  it('adds no note when the cheaper fund can be bought from Czechia', () => {
    render(
      <CalculatorSection
        inputs={inputs}
        featuredBuyability={buyability('yes', 0)}
      />,
    )
    expect(screen.queryByText(/Je americký fond levnější/)).toBeNull()
  })
})
