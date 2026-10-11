import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { CalcFund } from '@/server/calc'
import { Calculator } from './Calculator'

// Invented numbers, not real fund data.
const us: CalcFund = {
  id: 'us',
  indexGroup: 'g',
  ter: 0.3,
  dividendYieldPct: 1.5,
  withholdingRate: 30,
}
const eu: CalcFund = { ...us, id: 'eu', ter: 0.07, withholdingRate: 15 }

const resultText = () =>
  screen.getAllByRole('status')[0].textContent?.replace(/\s/g, ' ')

// Reduced motion: the result is final at once, with no count-up to wait for.
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

describe('Calculator', () => {
  it('starts at 3 000 Kč and 10 years', () => {
    render(<Calculator featured={us} alternative={eu} fxFeePct={0.5} />)
    expect(screen.getByRole('slider', { name: /měsíčně/ })).toHaveProperty(
      'value',
      '3000',
    )
    expect(
      screen
        .getByRole('button', { name: /10 let/ })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    expect(
      screen.getByText(/Za 10 let u amerického fondu zaplatíte víc o/),
    ).toBeTruthy()
  })

  it('shows three cost lines that add up to the fund total', () => {
    render(<Calculator featured={us} alternative={eu} fxFeePct={0.5} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    const kc = (text: string) => Number(text.replace(/\D/g, ''))
    const parts = items.map((item) =>
      kc(within(item).getAllByText(/Kč/)[0].textContent!),
    )
    const total = kc(
      screen
        .getByText(/zaplatíte celkem/)
        .textContent!.match(/celkem ([\d\s]+Kč)/)![1],
    )
    expect(parts[0] + parts[1] + parts[2]).toBe(total)
  })

  it('changes the result when the slider moves', () => {
    render(<Calculator featured={us} alternative={eu} fxFeePct={0.5} />)
    const before = resultText()
    const slider = screen.getByRole('slider', { name: /měsíčně/ })
    // jsdom cannot press arrow keys on a range input; e2e covers the keyboard.
    fireEvent.change(slider, { target: { value: '20000' } })
    expect(slider).toHaveProperty('value', '20000')
    expect(resultText()).not.toBe(before)
  })

  it('changes the result and the text when a horizon chip is chosen', async () => {
    render(<Calculator featured={us} alternative={eu} fxFeePct={0.5} />)
    const before = resultText()
    await userEvent.click(screen.getByRole('button', { name: /20 let/ }))
    expect(
      screen
        .getByRole('button', { name: /20 let/ })
        .getAttribute('aria-pressed'),
    ).toBe('true')
    expect(
      screen
        .getByRole('button', { name: /10 let/ })
        .getAttribute('aria-pressed'),
    ).toBe('false')
    expect(screen.getByText(/Za 20 let/)).toBeTruthy()
    expect(resultText()).not.toBe(before)
  })

  it('says the conversion fee is not counted when fxFeePct is absent', () => {
    render(<Calculator featured={us} alternative={eu} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(
      screen.getByText(/Převod korun na dolary zatím nepočítáme/),
    ).toBeTruthy()
  })

  it('states the return assumption as an example', () => {
    render(<Calculator featured={us} alternative={eu} fxFeePct={0.5} />)
    expect(
      screen.getByText(
        /výnosem 6.%.ročně u obou fondů. Je to příklad, ne slib/,
      ),
    ).toBeTruthy()
  })

  it('says "méně" when the featured fund is the cheaper one', () => {
    render(<Calculator featured={eu} alternative={us} fxFeePct={0.5} />)
    expect(screen.getByText(/zaplatíte méně o/)).toBeTruthy()
  })

  it('shows the cheaper note only while the featured fund is cheaper', () => {
    const note = 'Z Česka ho ale zatím nekoupíte u všech firem.'
    const { rerender } = render(
      <Calculator featured={eu} alternative={us} cheaperNote={note} />,
    )
    expect(screen.getByText(note)).toBeTruthy()
    rerender(<Calculator featured={us} alternative={eu} cheaperNote={note} />)
    expect(screen.queryByText(note)).toBeNull()
    rerender(
      <Calculator
        featured={us}
        alternative={{ ...us, id: 'x' }}
        cheaperNote={note}
      />,
    )
    expect(screen.queryByText(note)).toBeNull()
  })

  it('can use an h2 heading with an id for the page section', () => {
    render(
      <Calculator
        featured={us}
        alternative={eu}
        headingAs="h2"
        headingId="calculator-heading"
      />,
    )
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading.id).toBe('calculator-heading')
    expect(heading.textContent).toContain('Kolik to u vás dělá?')
  })

  it('shows no difference for two equal funds', () => {
    render(<Calculator featured={us} alternative={{ ...us, id: 'x' }} />)
    expect(screen.getByText(/je rozdíl mezi oběma fondy/)).toBeTruthy()
    expect(resultText()).toBe('0 Kč')
  })
})
