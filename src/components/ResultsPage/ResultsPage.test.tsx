import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Comparison } from '@/server/comparison'
import { ResultsPage } from './ResultsPage'

const flat = (text: string | null) => (text ?? '').replace(/\s/g, ' ')

function build(overrides: Partial<Comparison> = {}): Comparison {
  return {
    setup: { monthly: 3000, years: 10, grossReturn: 6 },
    asOf: '2026-06-30',
    headlineFundId: 'cspx',
    funds: [
      {
        fundId: 'cspx',
        ticker: 'CSPX',
        name: 'iShares Core S&P 500 UCITS ETF',
        indexLabel: 'S&P 500',
        ter: 0.07,
        type: 'accumulating',
      },
      {
        fundId: 'vusa',
        ticker: 'VUSA',
        name: null,
        indexLabel: 'S&P 500',
        ter: null,
        type: null,
      },
    ],
    byFund: {
      cspx: {
        brokers: [
          {
            brokerId: 'a',
            name: 'Alfa',
            available: true,
            priced: { feesKc: 1000, totalKc: 3000 },
          },
          {
            brokerId: 'b',
            name: 'Beta',
            available: true,
            priced: { feesKc: 8000, totalKc: 10000 },
          },
          { brokerId: 'c', name: 'Gama', available: null, priced: null },
          { brokerId: 'd', name: 'Delta', available: false, priced: null },
        ],
        fundFeeKc: 2000,
        headlineKc: 10000,
        lowestKc: 3000,
        spreadKc: 7000,
      },
      vusa: {
        brokers: [
          { brokerId: 'a', name: 'Alfa', available: null, priced: null },
        ],
        fundFeeKc: null,
        headlineKc: null,
        lowestKc: null,
        spreadKc: null,
      },
    },
    ...overrides,
  }
}

describe('ResultsPage', () => {
  it('links to the PDF', () => {
    render(
      <ResultsPage comparison={build()} pdfHref="/srovnani/x/pdf" token="x" />,
    )
    expect(
      screen
        .getByRole('link', { name: 'Stáhnout PDF · 6 stran' })
        .getAttribute('href'),
    ).toBe('/srovnani/x/pdf')
  })

  it('has the title, the setup and the headline number', () => {
    render(
      <ResultsPage comparison={build()} pdfHref="/srovnani/x/pdf" token="x" />,
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Srovnání 5 fondů' }),
    ).toBeTruthy()
    const strip = screen.getByRole('region', { name: 'Váš výsledek' })
    expect(flat(strip.textContent)).toContain('3 000 Kč měsíčně · 10 let')
    expect(flat(strip.textContent)).toContain('10 000 Kč')
  })

  it('shows an unverified fee and type as [ověřit], not as a number', () => {
    render(
      <ResultsPage comparison={build()} pdfHref="/srovnani/x/pdf" token="x" />,
    )
    const table = screen.getByRole('table', { name: 'Fondy vedle sebe' })
    const vusa = within(table).getByRole('row', { name: /VUSA/ })
    expect(within(vusa).getAllByText('[ověřit]')).toHaveLength(2)
    const cspx = within(table).getByRole('row', { name: /CSPX/ })
    expect(flat(cspx.textContent)).toContain('0,07 %')
    expect(within(cspx).getByText('Acc')).toBeTruthy()
  })

  it('shows Ano, Ne and [ověřit] for availability, and a dash for no price', () => {
    render(
      <ResultsPage comparison={build()} pdfHref="/srovnani/x/pdf" token="x" />,
    )
    const table = screen.getByRole('table', { name: 'U kterého brokera?' })
    expect(
      within(within(table).getByRole('row', { name: /Alfa/ })).getByText('Ano'),
    ).toBeTruthy()
    const delta = within(table).getByRole('row', { name: /Delta/ })
    expect(within(delta).getByText('Ne')).toBeTruthy()
    expect(flat(delta.textContent)).toContain('–')
    const gama = within(table).getByRole('row', { name: /Gama/ })
    expect(within(gama).getAllByText('[ověřit]').length).toBeGreaterThan(0)
  })

  it('lists the brokers in the order it is given, not by cost', () => {
    render(
      <ResultsPage comparison={build()} pdfHref="/srovnani/x/pdf" token="x" />,
    )
    const table = screen.getByRole('table', { name: 'U kterého brokera?' })
    const names = within(table)
      .getAllByRole('rowheader')
      .map((cell) => cell.textContent)
    expect(names).toEqual(['Alfa', 'Beta', 'Gama', 'Delta'])
  })

  it('names the spread and the lowest cost, without the word "nejlevnější"', () => {
    const { container } = render(
      <ResultsPage comparison={build()} pdfHref="/srovnani/x/pdf" token="x" />,
    )
    expect(flat(container.textContent)).toContain(
      'Mezi ověřenými brokery se výsledek liší až o 7 000 Kč. Nejnižší možné poplatky s vaším nastavením: 3 000 Kč za 10 let.',
    )
    expect(container.textContent).not.toMatch(/nejlevnější/i)
  })

  it('leaves out the spread sentence without two priced brokers', () => {
    const base = build()
    const comparison = build({
      byFund: {
        ...base.byFund,
        cspx: { ...base.byFund.cspx, spreadKc: null, lowestKc: 3000 },
      },
    })
    const { container } = render(
      <ResultsPage
        comparison={comparison}
        pdfHref="/srovnani/x/pdf"
        token="x"
      />,
    )
    expect(container.textContent).not.toContain('Mezi ověřenými brokery')
  })

  it('shows the fund fee when no broker is priced', () => {
    const base = build()
    const comparison = build({
      byFund: {
        ...base.byFund,
        cspx: {
          ...base.byFund.cspx,
          headlineKc: null,
          spreadKc: null,
          lowestKc: null,
        },
      },
    })
    render(
      <ResultsPage
        comparison={comparison}
        pdfHref="/srovnani/x/pdf"
        token="x"
      />,
    )
    const strip = screen.getByRole('region', { name: 'Váš výsledek' })
    expect(flat(strip.textContent)).toContain('bude stát')
    expect(flat(strip.textContent)).toContain('2 000 Kč')
  })

  it('says how long the link works and that tax text is still to be filled in', () => {
    const { container } = render(
      <ResultsPage comparison={build()} pdfHref="/srovnani/x/pdf" token="x" />,
    )
    expect(container.textContent).toContain('Odkaz platí 30 dní.')
    expect(container.textContent).toContain(
      'Text se doplní podle ověřeného podkladu',
    )
  })
})
