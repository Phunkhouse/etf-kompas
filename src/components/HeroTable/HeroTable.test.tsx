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
    render(<HeroTable twins={twins} dataVerifiedOn="2026-06-30" />)
    const table = screen.getByRole('table', {
      name: 'Cena fondů',
    })
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Co koupíte', 'Poplatek*', 'Typ'])
  })

  it('has one row for each twin, four in all', () => {
    render(<HeroTable twins={twins} dataVerifiedOn={null} />)
    // the header row and four funds
    expect(screen.getAllByRole('row')).toHaveLength(5)
  })

  it('titles each row with the index and describes it under the title: manager and ticker, then what it holds', () => {
    render(<HeroTable twins={twins} dataVerifiedOn={null} />)
    const cspx = screen.getByRole('row', { name: /iShares CSPX/ })
    expect(cspx.textContent).toContain('S&P 500')
    expect(cspx.textContent).toContain('iShares CSPX, 500 největších firem')
    const vuaa = screen.getByRole('row', { name: /Vanguard VUAA/ })
    expect(vuaa.textContent).toContain('S&P 500')
    expect(vuaa.textContent).toContain('Vanguard VUAA, 500 největších firem')
    const cndx = screen.getByRole('row', { name: /iShares CNDX/ })
    expect(cndx.textContent).toContain('Nasdaq 100')
    expect(cndx.textContent).toContain(
      'iShares CNDX, 100 technologických firem',
    )
    const eqqq = screen.getByRole('row', { name: /Invesco EQQQ/ })
    expect(eqqq.textContent).toContain('Nasdaq 100')
    expect(eqqq.textContent).toContain(
      'Invesco EQQQ, 100 technologických firem',
    )
  })

  it('puts the index first and the description after it', () => {
    render(<HeroTable twins={twins} dataVerifiedOn={null} />)
    const text = screen.getByRole('row', { name: /iShares CSPX/ }).textContent!
    expect(text.indexOf('S&P 500')).toBeLessThan(text.indexOf('iShares CSPX'))
  })

  it('no longer says "odborně", "značka" or "správce" in a row', () => {
    render(<HeroTable twins={twins} dataVerifiedOn={null} />)
    expect(screen.queryByText(/odborně|značka|správce/)).toBeNull()
  })

  it('explains the asterisk of the fee column under the table, without needing a date', () => {
    render(<HeroTable twins={twins} dataVerifiedOn={null} />)
    expect(screen.getByText(/^\* Roční poplatek fondu/).textContent).toMatch(
      /^\* Roční poplatek fondu/,
    )
  })

  it('shows the fees from the data with a decimal comma', () => {
    render(<HeroTable twins={twins} dataVerifiedOn={null} />)
    // textContent keeps the non-breaking space that getByText would normalise
    const cells = screen.getAllByRole('cell').map((cell) => cell.textContent)
    expect(cells).toContain('0,07 %')
    expect(cells).toContain('0,30 %')
  })

  it('shows the type as Acc or Dist', () => {
    render(<HeroTable twins={twins} dataVerifiedOn={null} />)
    const cspx = screen.getByRole('row', { name: /iShares CSPX/ })
    expect(within(cspx).getByText('Acc')).toBeTruthy()
    const eqqq = screen.getByRole('row', { name: /Invesco EQQQ/ })
    expect(within(eqqq).getByText('Dist')).toBeTruthy()
    expect(within(eqqq).queryByText('Acc')).toBeNull()
  })

  it('shows [ověřit] for an unverified fee and for an unverified type', () => {
    render(
      <HeroTable twins={[twin('cspx', null, null)]} dataVerifiedOn={null} />,
    )
    const cspx = screen.getByRole('row', { name: /iShares CSPX/ })
    expect(within(cspx).getAllByText('[ověřit]')).toHaveLength(2)
    expect(within(cspx).queryByText('Acc')).toBeNull()
    expect(within(cspx).queryByText('Dist')).toBeNull()
  })

  it('has no buying column, no Ano or Ne, and highlights no row', () => {
    render(<HeroTable twins={twins} dataVerifiedOn={null} />)
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
    render(<HeroTable twins={twins} dataVerifiedOn="2026-06-30" />)
    expect(
      screen
        .getByText(/zdroj: stránky fondů a brokerů/)
        .textContent!.replace(/\s/g, ' '),
    ).toContain('ověřeno k 6. 2026')
  })

  it('leaves the source line out without a date', () => {
    render(<HeroTable twins={twins} dataVerifiedOn={null} />)
    expect(screen.queryByText(/zdroj:/)).toBeNull()
  })
})
