import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Comparison } from '@/server/comparison'
import { BrokerPicker } from './BrokerPicker'

const flat = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

const comparison: Comparison = {
  setup: { monthly: 3000, years: 10, grossReturn: 6 },
  asOf: null,
  headlineFundId: 'cspx',
  funds: ['cspx', 'cndx'].map((fundId) => ({
    fundId,
    ticker: fundId.toUpperCase(),
    name: null,
    indexLabel: 'S&P 500',
    ter: 0.07,
    type: 'accumulating' as const,
  })),
  byFund: {
    cspx: {
      brokers: [
        {
          brokerId: 'a',
          name: 'Alfa',
          available: true,
          priced: { feesKc: 1000, totalKc: 3000 },
        },
      ],
      fundFeeKc: 2000,
      headlineKc: 3000,
      lowestKc: 3000,
      spreadKc: null,
    },
    cndx: {
      brokers: [
        {
          brokerId: 'a',
          name: 'Alfa',
          available: true,
          priced: { feesKc: 5000, totalKc: 9000 },
        },
      ],
      fundFeeKc: 4000,
      headlineKc: 9000,
      lowestKc: 9000,
      spreadKc: null,
    },
  },
}

describe('BrokerPicker', () => {
  it('starts on the headline fund, with its tab selected', () => {
    render(<BrokerPicker comparison={comparison} />)
    expect(
      screen.getByRole('tab', { name: 'CSPX' }).getAttribute('aria-selected'),
    ).toBe('true')
    expect(
      screen.getByRole('tab', { name: 'CNDX' }).getAttribute('aria-selected'),
    ).toBe('false')
    expect(flat(screen.getByRole('table').textContent)).toContain('3 000 Kč')
  })

  it('shows the other fund after a click', async () => {
    render(<BrokerPicker comparison={comparison} />)
    await userEvent.click(screen.getByRole('tab', { name: 'CNDX' }))
    const table = screen.getByRole('table')
    expect(flat(table.textContent)).toContain('9 000 Kč')
    expect(flat(table.textContent)).not.toContain('3 000 Kč')
    expect(
      screen.getByRole('tab', { name: 'CNDX' }).getAttribute('aria-selected'),
    ).toBe('true')
  })

  it('moves between the tabs with the arrow keys', async () => {
    render(<BrokerPicker comparison={comparison} />)
    screen.getByRole('tab', { name: 'CSPX' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(
      screen.getByRole('tab', { name: 'CNDX' }),
    )
    expect(within(screen.getByRole('tabpanel')).getByRole('table')).toBeTruthy()
    await userEvent.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(
      screen.getByRole('tab', { name: 'CSPX' }),
    )
  })
})
