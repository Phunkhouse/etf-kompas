import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatKc } from '@/lib/format'
import { priceBrokers } from '@/server/broker-pricing'
import { calculatorData, type CalculatorData } from '@/server/calculator-data'
import type { ChosenRates } from '@/server/cnb'
import { fundFeeKc } from '@/server/cost'
import { bundledData } from '@/server/data/bundled'
import { Calculator } from './Calculator'

const RATES: ChosenRates = {
  EUR: { rate: 24.365, date: '2026-10-09', source: 'cnb' },
  USD: { rate: 21.745, date: '2026-10-09', source: 'cnb' },
}

// Real DEGIRO data: the only broker with verified fees today.
function oneBroker(): CalculatorData {
  const data = calculatorData(bundledData, RATES, 'cspx')!
  // the real data has more priced brokers now; these tests are about one of them
  return { ...data, pricing: data.pricing.filter((b) => b.id === 'degiro') }
}

// A second priced broker: a copy of DEGIRO with dearer orders, so the spread
// between the two is more than 0 Kč.
function twoBrokers(dearer = true): CalculatorData {
  const data = oneBroker()
  const copy = structuredClone(data.pricing[0])
  copy.id = 'other'
  if (dearer) {
    for (const record of copy.fees!.purchase) {
      if (typeof record.value !== 'string') {
        record.value = { ...record.value, fixed: record.value.fixed * 4 }
      }
    }
  }
  return { ...data, pricing: [...data.pricing, copy] }
}

// No exchange rates: DEGIRO cannot be priced, so only the fund fee is known.
function noBrokerPriced(): CalculatorData {
  const data = calculatorData(bundledData, {}, 'cspx')!
  // no broker with a price at all (Trading 212 needs no rate, so it would be priced)
  return { ...data, pricing: [] }
}

// The calculator's own numbers, for comparing against what is on screen.
function expected(data: CalculatorData, monthly = 3000, years = 10) {
  const input = { monthly, years, grossReturn: 6 }
  return priceBrokers(data.pricing, data.fundId, data.ter, data.rates, input)
}

const kc = (text: string) => Number(text.replace(/\D/g, ''))

// Reduced motion: no animation to wait for.
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

describe('Calculator: inputs', () => {
  it('asks the question and starts at 3 000 Kč and 10 years', () => {
    render(<Calculator data={oneBroker()} />)
    expect(
      screen.getByRole('heading', { name: 'Kolik vás to bude stát?' }),
    ).toBeTruthy()
    expect(screen.getByRole('slider', { name: /měsíčně/ })).toHaveProperty(
      'value',
      '3000',
    )
    expect(
      screen
        .getByRole('button', { name: /10 let/ })
        .getAttribute('aria-pressed'),
    ).toBe('true')
  })

  it('goes from 500 to 20 000 Kč in steps of 500', () => {
    render(<Calculator data={oneBroker()} />)
    const slider = screen.getByRole('slider', { name: /měsíčně/ })
    expect(slider).toHaveProperty('min', '500')
    expect(slider).toHaveProperty('max', '20000')
    expect(slider).toHaveProperty('step', '500')
  })

  it('offers 5, 10 and 20 years', () => {
    render(<Calculator data={oneBroker()} />)
    for (const years of [5, 10, 20]) {
      expect(
        screen.getByRole('button', { name: new RegExp(`${years}\\sl`) }),
      ).toBeTruthy()
    }
  })
})

describe('Calculator: a broker is priced', () => {
  it('says the cost at the dearest verified broker, "u ověřených brokerů nejvýš"', () => {
    const data = oneBroker()
    render(<Calculator data={data} />)
    const total = expected(data).headline!.result.totalKc
    const sentence = screen.getByText(/u ověřených brokerů/).textContent!
    expect(sentence.replace(/\s/g, ' ')).toContain('Za 10 let')
    expect(sentence).toContain('CSPX')
    expect(sentence).toContain('nejvýš')
    expect(sentence.replace(/\s/g, ' ')).toContain(
      formatKc(total).replace(/\s/g, ' '),
    )
  })

  it('shows three parts that add up to the total', () => {
    const data = oneBroker()
    render(<Calculator data={data} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0].textContent).toMatch(/roční poplatek fondu/)
    expect(items[1].textContent).toMatch(/převod korun/)
    expect(items[2].textContent).toMatch(/poplatky brokera/)
    const parts = items.map((item) =>
      kc(within(item).getByText(/Kč/).textContent!),
    )
    expect(parts[0] + parts[1] + parts[2]).toBe(
      expected(data).headline!.result.totalKc,
    )
  })

  it('matches the pure calculation for the chosen amount and years', async () => {
    const data = oneBroker()
    render(<Calculator data={data} />)
    fireEvent.change(screen.getByRole('slider', { name: /měsíčně/ }), {
      target: { value: '8000' },
    })
    await userEvent.click(screen.getByRole('button', { name: /20 let/ }))
    const total = expected(data, 8000, 20).headline!.result.totalKc
    expect(screen.getAllByRole('status')[0].textContent).toBe(formatKc(total))
  })

  it('changes the result when the slider moves and when a chip is chosen', async () => {
    render(<Calculator data={oneBroker()} />)
    const result = () => screen.getAllByRole('status')[0].textContent
    const first = result()
    fireEvent.change(screen.getByRole('slider', { name: /měsíčně/ }), {
      target: { value: '20000' },
    })
    const second = result()
    expect(second).not.toBe(first)
    await userEvent.click(screen.getByRole('button', { name: /5 let/ }))
    expect(result()).not.toBe(second)
  })

  it('shows the illustrative value after costs, as an example and not a promise', () => {
    const data = oneBroker()
    render(<Calculator data={data} />)
    const line = screen.getByText(/Ilustrativní hodnota po 10 letech/)
    const text = line.textContent!.replace(/\s/g, ' ')
    expect(text).toContain(
      formatKc(expected(data).headline!.result.valueKc).replace(/\s/g, ' '),
    )
    expect(text).toMatch(/6 % ročně/)
    expect(text).toMatch(/příklad, ne slib/)
  })

  it('states the assumptions: 6 % a year, no Czech tax, no inflation', () => {
    render(<Calculator data={oneBroker()} />)
    expect(screen.getByText(/Počítáme s výnosem 6\s%/)).toBeTruthy()
    expect(screen.getByText(/Nepočítáme české daně ani inflaci/)).toBeTruthy()
  })

  it('never says "nejlevnější" and has no control for the return', () => {
    const { container } = render(<Calculator data={twoBrokers()} />)
    expect(container.textContent).not.toMatch(/nejlevn/i)
    expect(screen.getAllByRole('slider')).toHaveLength(1)
  })
})

describe('Calculator: no broker is priced yet', () => {
  it('shows only the fund fee, and no total', () => {
    const data = noBrokerPriced()
    render(<Calculator data={data} />)
    const fundFee = fundFeeKc(
      { monthly: 3000, years: 10, grossReturn: 6 },
      data.ter,
    )
    expect(
      screen
        .getByText(/roční poplatek fondu/)
        .parentElement!.textContent!.replace(/\s/g, ' '),
    ).toContain(formatKc(fundFee).replace(/\s/g, ' '))
    expect(screen.queryByText(/nejvýš/)).toBeNull()
    expect(screen.queryByText(/poplatky brokera/)).toBeNull()
    expect(screen.queryByText(/převod korun/)).toBeNull()
  })

  it('says the broker prices are still being verified', () => {
    render(<Calculator data={noBrokerPriced()} />)
    expect(screen.getByText(/ceny brokerů ověřujeme/i)).toBeTruthy()
  })

  it('has no saving box', () => {
    render(<Calculator data={noBrokerPriced()} />)
    expect(screen.queryByText(/ponecháte až/)).toBeNull()
  })
})

describe('Calculator: the saving box', () => {
  it('is hidden with one priced broker', () => {
    render(<Calculator data={oneBroker()} />)
    expect(screen.queryByText(/ponecháte až/)).toBeNull()
    expect(
      screen.queryByRole('link', { name: /Ukázat, u kterého brokera/ }),
    ).toBeNull()
  })

  it('shows the spread between brokers when two are priced', () => {
    const data = twoBrokers()
    render(<Calculator data={data} />)
    const spread = expected(data).spreadKc!
    expect(spread).toBeGreaterThan(0)
    const box = screen.getByText(/ponecháte až/)
    expect(box.textContent!.replace(/\s/g, ' ')).toContain(
      formatKc(spread).replace(/\s/g, ' '),
    )
    expect(screen.getByText(/Odhad, bez českých daní a inflace/)).toBeTruthy()
  })

  it('has a button that goes to the e-mail form', () => {
    render(<Calculator data={twoBrokers()} />)
    const button = screen.getByRole('link', {
      name: /Ukázat, u kterého brokera to koupím/,
    })
    expect(button.getAttribute('href')).toBe('#formular')
  })

  it('updates with the inputs', async () => {
    const data = twoBrokers()
    render(<Calculator data={data} />)
    const text = () => screen.getByText(/ponecháte až/).textContent
    const before = text()
    await userEvent.click(screen.getByRole('button', { name: /20 let/ }))
    expect(text()).not.toBe(before)
  })

  it('is hidden when the two brokers cost the same (0 Kč)', () => {
    render(<Calculator data={twoBrokers(false)} />)
    expect(screen.queryByText(/ponecháte až/)).toBeNull()
  })
})

describe('Calculator: failure', () => {
  it('shows no amount, says why, and offers a retry', async () => {
    const onRetry = vi.fn()
    const { container } = render(<Calculator data={null} onRetry={onRetry} />)
    expect(
      screen.getByText('Částku teď nespočítáme, aby nebyla nepřesná'),
    ).toBeTruthy()
    expect(container.textContent).not.toMatch(/\d\sKč/)
    await userEvent.click(screen.getByRole('button', { name: 'Zkusit znovu' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
