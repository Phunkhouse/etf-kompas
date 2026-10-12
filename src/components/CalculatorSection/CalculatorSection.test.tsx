import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calculatorData } from '@/server/calculator-data'
import { bundledData } from '@/server/data/bundled'
import { CalculatorSection } from './CalculatorSection'

const RATES = {
  EUR: { rate: 24.365, date: '2026-10-09', source: 'cnb' as const },
}

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

describe('CalculatorSection', () => {
  it('is the dark band the hero button jumps to, named after its heading', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    const { container } = render(<CalculatorSection data={data} />)
    expect(container.querySelector('#spocitat')).not.toBeNull()
    expect(
      screen.getByRole('region', { name: 'Kolik vás to bude stát?' }),
    ).toBeTruthy()
  })

  it('has no start button by default', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    render(<CalculatorSection data={data} />)
    expect(
      screen.queryByRole('link', { name: 'Ukázat, kolik mě to bude stát' }),
    ).toBeNull()
  })

  it('as a hero (hero a) has the start button and the muted line, and keeps the heading for the region', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    render(<CalculatorSection data={data} hero />)
    expect(
      screen
        .getByRole('link', { name: 'Ukázat, kolik mě to bude stát' })
        .getAttribute('href'),
    ).toBe('#vysledek')
    expect(
      screen.getByText('Příklad výpočtu. Investování nese riziko ztráty.'),
    ).toBeTruthy()
    // the heading is hidden visually, not removed
    expect(
      screen.getByRole('heading', { name: 'Kolik vás to bude stát?' }),
    ).toBeTruthy()
    expect(
      screen.getByRole('region', { name: 'Kolik vás to bude stát?' }),
    ).toBeTruthy()
  })

  it('as a hero, still shows the failure state (and no start button) without data', () => {
    render(<CalculatorSection data={null} hero />)
    expect(screen.getByRole('button', { name: 'Zkusit znovu' })).toBeTruthy()
    expect(
      screen.queryByRole('link', { name: 'Ukázat, kolik mě to bude stát' }),
    ).toBeNull()
  })

  it('has the e-mail form inside the band, at #formular', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    const { container } = render(<CalculatorSection data={data} />)
    expect(container.querySelector('#spocitat #formular')).not.toBeNull()
    expect(screen.getByRole('textbox', { name: 'Váš e-mail' })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Poslat mi srovnání' }),
    ).toBeTruthy()
  })

  it('has the e-mail form in hero a too, and when the numbers failed to load', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    const { unmount } = render(<CalculatorSection data={data} hero />)
    expect(screen.getByRole('textbox', { name: 'Váš e-mail' })).toBeTruthy()
    unmount()
    render(<CalculatorSection data={null} />)
    expect(screen.getByRole('textbox', { name: 'Váš e-mail' })).toBeTruthy()
  })

  it('shows the failure state when there is no data', () => {
    render(<CalculatorSection data={null} />)
    expect(screen.getByRole('button', { name: 'Zkusit znovu' })).toBeTruthy()
  })
})
