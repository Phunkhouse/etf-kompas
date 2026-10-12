import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { HeroRow } from '@/server/availability'
import { HeroB } from './HeroB'

function row(
  fundId: string,
  ter: number | null,
  state: 'yes' | 'no' | 'unverified',
  verifiedNoCount = 0,
): HeroRow {
  return {
    fundId,
    ter,
    buyability: {
      state,
      yesCount: state === 'yes' ? 1 : 0,
      verifiedNoCount,
      total: 5,
    },
    highlight: state === 'yes',
  }
}

const rows = [
  row('voo', 0.03, 'unverified', 3),
  row('qqq', 0.18, 'unverified', 3),
  row('cspx', 0.07, 'yes'),
]

describe('HeroB', () => {
  it('has the headline as h1 and names the section after it', () => {
    render(<HeroB rows={rows} dataAsOf={null} />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain('Americké indexy z Česka')
    expect(
      screen.getByRole('region', { name: heading.textContent ?? '' }),
    ).toBeTruthy()
  })

  it('has the lead, the table and a button that jumps to the calculator', () => {
    render(<HeroB rows={rows} dataAsOf={null} />)
    expect(
      screen.getByText(/Stejné firmy ze S&P 500 a Nasdaq 100/),
    ).toBeTruthy()
    expect(screen.getByRole('table')).toBeTruthy()
    expect(
      screen
        .getByRole('link', { name: /Spočítat, kolik zaplatím/ })
        .getAttribute('href'),
    ).toBe('#spocitat')
  })

  it('explains ETF once, in a note', () => {
    render(<HeroB rows={rows} dataAsOf={null} />)
    expect(screen.getByRole('note').textContent).toContain(
      'ETF je fond, který jen kopíruje trh',
    )
  })

  it('says the highlight is not the cheapest, and names the cheapest fund', () => {
    render(<HeroB rows={rows} dataAsOf={null} />)
    const note = screen.getByText(/ne to nejlevnější/).textContent ?? ''
    expect(note).toContain(
      'Nejnižší poplatek má americký fond na 500 největších firem (VOO)',
    )
    expect(note).toContain('u 3 z 5 firem ho nekoupíte')
  })

  it('says "nowhere" only when the cheapest fund is verified as not buyable', () => {
    render(
      <HeroB
        rows={[row('voo', 0.03, 'no', 5), row('cspx', 0.07, 'yes')]}
        dataAsOf={null}
      />,
    )
    expect(screen.getByText(/ne to nejlevnější/).textContent).toContain(
      'u žádné z 5 firem ho nekoupíte',
    )
  })

  it('does not claim a count it does not have', () => {
    render(
      <HeroB
        rows={[row('voo', 0.03, 'unverified', 0), row('cspx', 0.07, 'yes')]}
        dataAsOf={null}
      />,
    )
    const note = screen.getByText(/ne to nejlevnější/).textContent ?? ''
    expect(note).toContain('zatím ověřujeme')
    expect(note).not.toContain('z 5 firem')
  })

  it('does not say "not the cheapest" when the highlighted fund is the cheapest', () => {
    render(
      <HeroB
        rows={[row('voo', 0.03, 'yes'), row('cspx', 0.07, 'unverified', 2)]}
        dataAsOf={null}
      />,
    )
    expect(screen.queryByText(/ne to nejlevnější/)).toBeNull()
    expect(screen.getByText(/Zvýrazněno je to, co koupíte z ČR\./)).toBeTruthy()
  })

  it('does not explain a highlight when nothing is highlighted', () => {
    render(
      <HeroB
        rows={[
          row('voo', 0.03, 'unverified', 3),
          row('cspx', 0.07, 'unverified', 3),
        ]}
        dataAsOf={null}
      />,
    )
    expect(screen.queryByText(/Zvýrazněno/)).toBeNull()
    expect(screen.getByText('Jen cena a dostupnost, ne výnosy.')).toBeTruthy()
  })
})
