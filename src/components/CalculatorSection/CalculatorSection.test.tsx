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

  it('has the e-mail form inside the band, at #formular', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    const { container } = render(<CalculatorSection data={data} />)
    expect(container.querySelector('#spocitat #formular')).not.toBeNull()
    expect(screen.getByRole('textbox', { name: 'Váš e-mail' })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Poslat mi srovnání' }),
    ).toBeTruthy()
  })

  it('has the e-mail form when the numbers failed to load too', () => {
    render(<CalculatorSection data={null} />)
    expect(screen.getByRole('textbox', { name: 'Váš e-mail' })).toBeTruthy()
  })

  it('has no start button and no hidden heading: it is no longer a hero', () => {
    const data = calculatorData(bundledData, RATES, 'cspx')
    render(<CalculatorSection data={data} />)
    expect(
      screen.queryByRole('link', { name: 'Ukázat, kolik mě to bude stát' }),
    ).toBeNull()
  })

  it('shows the failure state when there is no data', () => {
    render(<CalculatorSection data={null} />)
    expect(screen.getByRole('button', { name: 'Zkusit znovu' })).toBeTruthy()
  })
})
