import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Pill } from '@/components/Pill'
import { Table, TableLabel } from './Table'

const columns = [
  { id: 'what', header: 'Co koupíte', width: '55%' },
  { id: 'fee', header: 'Poplatek', numeric: true },
  { id: 'cz', header: 'Z ČR?' },
]

const rows = [
  {
    id: 'voo',
    cells: {
      what: (
        <TableLabel title="Americký fond na 500 firem" detail="značka VOO" />
      ),
      fee: '0,0X %',
      cz: <Pill tone="negative">[ověřit]</Pill>,
    },
  },
  {
    id: 'ucits',
    highlight: true,
    cells: {
      what: <TableLabel title="Evropská verze prvního fondu" />,
      fee: '0,0X %',
      cz: <Pill tone="positive">ano</Pill>,
    },
  },
]

describe('Table', () => {
  it('has a name, column headers and one row per fund', () => {
    render(<Table caption="Cena a dostupnost" columns={columns} rows={rows} />)
    expect(
      screen.getByRole('table', { name: 'Cena a dostupnost' }),
    ).toBeDefined()
    expect(
      screen.getAllByRole('columnheader').map((h) => h.textContent),
    ).toEqual(['Co koupíte', 'Poplatek', 'Z ČR?'])
    expect(screen.getAllByRole('row')).toHaveLength(3)
  })

  it('uses the first column as the row header', () => {
    render(<Table caption="Cena" columns={columns} rows={rows} />)
    const header = screen.getByRole('rowheader', {
      name: /Americký fond na 500 firem/,
    })
    expect(header.textContent).toContain('značka VOO')
  })

  it('keeps the other cells of a row reachable through their row', () => {
    render(<Table caption="Cena" columns={columns} rows={rows} />)
    const row = screen.getByRole('row', { name: /Evropská verze/ })
    expect(within(row).getByText('ano')).toBeDefined()
    expect(within(row).getByText('0,0X %')).toBeDefined()
  })

  it('marks the highlighted row', () => {
    render(<Table caption="Cena" columns={columns} rows={rows} />)
    expect(
      screen.getByRole('row', { name: /Evropská verze/ }).dataset.highlight,
    ).toBe('true')
    expect(
      screen.getByRole('row', { name: /Americký fond/ }).dataset.highlight,
    ).toBeUndefined()
  })
})
