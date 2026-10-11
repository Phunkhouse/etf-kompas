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
      'Které fondy si z Česka opravdu koupíte a kolik vás stojí?',
    )
  })
})

describe('Landing, variant b with the table', () => {
  it('shows the hero table with its rows', () => {
    const rows = [
      {
        fundId: 'cspx',
        ter: 0.07,
        buyability: {
          state: 'yes' as const,
          yesCount: 3,
          verifiedNoCount: 0,
          total: 5,
        },
        highlight: true,
      },
    ]
    render(<Landing variant="b" dataAsOf="2026-06-30" rows={rows} />)
    expect(
      screen.getByRole('table', { name: 'Cena a dostupnost' }),
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
