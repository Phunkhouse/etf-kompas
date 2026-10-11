import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { HeroRow } from '@/server/availability'
import { HeroTable } from './HeroTable'

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

describe('HeroTable', () => {
  it('is a table with the three columns', () => {
    render(<HeroTable rows={rows} dataAsOf="2026-06-30" />)
    const table = screen.getByRole('table', { name: 'Cena a dostupnost' })
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Co koupíte', 'Roční poplatek', 'Koupíte z ČR?'])
  })

  it('shows each fund with its plain name first and the technical name after', () => {
    render(<HeroTable rows={rows} dataAsOf={null} />)
    const voo = screen.getByRole('row', { name: /Americký fond na 500/ })
    expect(voo.textContent).toContain('odborně S&P 500, značka VOO')
  })

  it('shows the fees from the data with a decimal comma', () => {
    render(<HeroTable rows={rows} dataAsOf={null} />)
    // textContent keeps the non-breaking space that getByText would normalise
    const cells = screen.getAllByRole('cell').map((cell) => cell.textContent)
    expect(cells).toContain('0,03\u00a0%')
    expect(cells).toContain('0,18\u00a0%')
    expect(cells).toContain('0,07\u00a0%')
  })

  it('marks an unchecked fund as [ověřit] with how many firms say no', () => {
    render(<HeroTable rows={rows} dataAsOf={null} />)
    const voo = screen.getByRole('row', { name: /Americký fond na 500/ })
    expect(within(voo).getByText('[ověřit]')).toBeTruthy()
    expect(within(voo).getByText(/Ne u 3 z 5 firem/)).toBeTruthy()
    expect(within(voo).queryByText('Ano')).toBeNull()
  })

  it('says Ano for a buyable fund, and highlights only that row', () => {
    render(<HeroTable rows={rows} dataAsOf={null} />)
    const cspx = screen.getByRole('row', { name: /Evropská verze/ })
    expect(within(cspx).getByText('Ano')).toBeTruthy()
    expect(cspx.getAttribute('data-highlight')).toBe('true')
    const highlighted = screen
      .getAllByRole('row')
      .filter((r) => r.getAttribute('data-highlight') === 'true')
    expect(highlighted).toHaveLength(1)
  })

  it('says Ne only when the fund is verified as not buyable everywhere', () => {
    render(
      <HeroTable
        rows={[row('voo', 0.03, 'no', 5), row('cspx', 0.07, 'yes')]}
        dataAsOf={null}
      />,
    )
    const voo = screen.getByRole('row', { name: /Americký fond na 500/ })
    expect(within(voo).getByText('Ne')).toBeTruthy()
    expect(within(voo).queryByText('[ověřit]')).toBeNull()
  })

  it('shows [ověřit] instead of a fee while the fee is unverified', () => {
    render(
      <HeroTable rows={[row('voo', null, 'unverified')]} dataAsOf={null} />,
    )
    const voo = screen.getByRole('row', { name: /Americký fond na 500/ })
    expect(within(voo).getAllByText('[ověřit]')).toHaveLength(2)
  })

  it('names the source and the month of the oldest number', () => {
    render(<HeroTable rows={rows} dataAsOf="2026-06-30" />)
    expect(
      screen.getByText(/zdroj: stránky fondů a firem/).textContent,
    ).toContain('ověřeno k 6. 2026')
  })

  it('leaves the source line out without a date', () => {
    render(<HeroTable rows={rows} dataAsOf={null} />)
    expect(screen.queryByText(/zdroj:/)).toBeNull()
  })
})
