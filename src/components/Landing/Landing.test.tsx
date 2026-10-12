import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Landing } from './Landing'

describe('Landing', () => {
  it('has the page landmarks: banner, main and contentinfo', () => {
    render(<Landing variant="a" dataAsOf="2026-06-30" />)
    expect(screen.getByRole('banner')).toBeTruthy()
    expect(screen.getByRole('main')).toBeTruthy()
    expect(screen.getByRole('contentinfo')).toBeTruthy()
  })

  it('shows the hero a headline as the only h1', () => {
    render(<Landing variant="a" dataAsOf={null} />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0].textContent).toContain(
      'Které fondy si z Česka opravdu koupíte?',
    )
  })

  it('shows a different headline for variant b', () => {
    render(<Landing variant="b" dataAsOf={null} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'Americké indexy z Česka: u koho je koupíte a za kolik?',
    )
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
    expect(
      screen.getByRole('table', { name: 'Roční poplatek a typ fondu' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('link', { name: /Spočítat, kolik zaplatím/ }),
    ).toBeTruthy()
  })

  it('does not show the table in variant a', () => {
    render(<Landing variant="a" dataAsOf="2026-06-30" />)
    expect(screen.queryByRole('table')).toBeNull()
  })
})
