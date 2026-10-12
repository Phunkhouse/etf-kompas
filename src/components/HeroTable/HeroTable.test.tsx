import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { HeroTwin } from '@/server/hero'
import { HeroTable } from './HeroTable'

function twin(
  fundId: string,
  ter: number | null,
  type: HeroTwin['type'],
): HeroTwin {
  return { fundId, ticker: fundId.toUpperCase(), ter, type }
}

const twins = [
  twin('cspx', 0.07, 'accumulating'),
  twin('vuaa', 0.07, 'accumulating'),
  twin('cndx', 0.3, 'accumulating'),
  twin('eqqq', 0.3, 'distributing'),
]

describe('HeroTable', () => {
  it('is a table with three columns: what, annual fee and type', () => {
    render(<HeroTable twins={twins} dataAsOf="2026-06-30" />)
    const table = screen.getByRole('table', {
      name: 'Roční poplatek a typ fondu',
    })
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Co koupíte', 'Roční poplatek', 'Typ'])
  })

  it('has one row for each twin, four in all', () => {
    render(<HeroTable twins={twins} dataAsOf={null} />)
    // the header row and four funds
    expect(screen.getAllByRole('row')).toHaveLength(5)
  })

  it('shows each fund with its plain name first, then the technical name, ticker and manager', () => {
    render(<HeroTable twins={twins} dataAsOf={null} />)
    const cspx = screen.getByRole('row', { name: /značka CSPX/ })
    expect(cspx.textContent).toContain('Evropský fond na 500 největších firem')
    expect(cspx.textContent).toContain(
      'odborně S&P 500, značka CSPX, správce iShares',
    )
    const eqqq = screen.getByRole('row', { name: /značka EQQQ/ })
    expect(eqqq.textContent).toContain(
      'Evropský fond na 100 technologických firem',
    )
    expect(eqqq.textContent).toContain('správce Invesco')
  })

  it('shows the fees from the data with a decimal comma', () => {
    render(<HeroTable twins={twins} dataAsOf={null} />)
    // textContent keeps the non-breaking space that getByText would normalise
    const cells = screen.getAllByRole('cell').map((cell) => cell.textContent)
    expect(cells).toContain('0,07 %')
    expect(cells).toContain('0,30 %')
  })

  it('shows the type as Acc or Dist', () => {
    render(<HeroTable twins={twins} dataAsOf={null} />)
    const cspx = screen.getByRole('row', { name: /značka CSPX/ })
    expect(within(cspx).getByText('Acc')).toBeTruthy()
    const eqqq = screen.getByRole('row', { name: /značka EQQQ/ })
    expect(within(eqqq).getByText('Dist')).toBeTruthy()
    expect(within(eqqq).queryByText('Acc')).toBeNull()
  })

  it('shows [ověřit] for an unverified fee and for an unverified type', () => {
    render(<HeroTable twins={[twin('cspx', null, null)]} dataAsOf={null} />)
    const cspx = screen.getByRole('row', { name: /značka CSPX/ })
    expect(within(cspx).getAllByText('[ověřit]')).toHaveLength(2)
    expect(within(cspx).queryByText('Acc')).toBeNull()
    expect(within(cspx).queryByText('Dist')).toBeNull()
  })

  it('has no buying column, no Ano or Ne, and highlights no row', () => {
    render(<HeroTable twins={twins} dataAsOf={null} />)
    expect(screen.queryByText('Koupíte z ČR?')).toBeNull()
    expect(screen.queryByText('Ano')).toBeNull()
    expect(screen.queryByText('Ne')).toBeNull()
    expect(
      screen
        .getAllByRole('row')
        .filter((r) => r.getAttribute('data-highlight') === 'true'),
    ).toHaveLength(0)
  })

  it('names the source and the month of the oldest number', () => {
    render(<HeroTable twins={twins} dataAsOf="2026-06-30" />)
    expect(
      screen
        .getByText(/zdroj: stránky fondů a firem/)
        .textContent!.replace(/\s/g, ' '),
    ).toContain('ověřeno k 6. 2026')
  })

  it('leaves the source line out without a date', () => {
    render(<HeroTable twins={twins} dataAsOf={null} />)
    expect(screen.queryByText(/zdroj:/)).toBeNull()
  })
})
