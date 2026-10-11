// What the landing page needs from the data files, in one place for both hero
// variants: the oldest date, the hero table rows and the calculator inputs.
import {
  buyability,
  heroRows,
  type Buyability,
  type HeroRow,
} from './availability'
import { calculatorInputs, type CalculatorInputs } from './calculator-inputs'
import { oldestAsOf } from './data/freshness'
import { dataSchema } from './data/schema'

export type LandingData = {
  dataAsOf: string | null
  rows: HeroRow[]
  // null when a number the calculator needs is not verified
  calculator: {
    inputs: CalculatorInputs
    featuredBuyability: Buyability
  } | null
}

// The American fund the page is about, its European twin, and the firm whose
// conversion fee is used (decision notes 0019 and 0025, METHODOLOGY).
const FEATURED = 'voo'
const TWIN = 'cspx'
const HERO_FUNDS = ['voo', 'qqq', 'cspx']
const FEE_BROKER = 'degiro'

export function landingData(raw: unknown): LandingData {
  const data = dataSchema.parse(raw)
  const inputs = calculatorInputs(data, {
    featured: FEATURED,
    alternative: TWIN,
    broker: FEE_BROKER,
  })
  return {
    dataAsOf: oldestAsOf(raw),
    rows: heroRows(data, HERO_FUNDS),
    calculator: inputs
      ? { inputs, featuredBuyability: buyability(FEATURED, data.brokers) }
      : null,
  }
}
