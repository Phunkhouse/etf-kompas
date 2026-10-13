// Which headline the page shows (decision note 0041). Variant b names the saving
// between brokers, so it is shown only when the calculator itself would show that
// saving (two brokers with verified prices and a difference above 0 Kč).
// Pure: no imports from next or react.
import {
  DEFAULT_MONTHLY,
  DEFAULT_YEARS,
  GROSS_RETURN,
} from '@/lib/calculator-defaults'
import { priceBrokers } from './broker-pricing'
import type { CalculatorData } from './calculator-data'

export type HeroVariant = 'a' | 'b'

// The saving at the calculator's starting setting: the highest cost minus the
// lowest among the brokers with verified prices; null while the saving box would
// not show (fewer than two priced brokers, or no difference).
export function heroSavingKc(data: CalculatorData | null): number | null {
  if (data === null) return null
  const prices = priceBrokers(data.pricing, data.fundId, data.ter, data.rates, {
    monthly: DEFAULT_MONTHLY,
    years: DEFAULT_YEARS,
    grossReturn: GROSS_RETURN,
  })
  return prices.spreadKc
}

// Variant b only when asked for AND there is a saving to name; otherwise a.
export function chooseHeroVariant(
  requested: HeroVariant,
  savingKc: number | null,
): { variant: HeroVariant; savingKc: number | null } {
  if (requested === 'b' && savingKc !== null && savingKc > 0) {
    return { variant: 'b', savingKc }
  }
  return { variant: 'a', savingKc: null }
}
