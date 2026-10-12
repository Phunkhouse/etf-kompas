// What the landing page needs from the data files, in one place for both hero
// variants: the oldest date and the hero table rows. The calculator's data comes
// from calculatorData() with the exchange rates (src/server/calculator-data.ts).
import { heroRows, type HeroRow } from './availability'
import { oldestAsOf } from './data/freshness'
import { dataSchema } from './data/schema'

export type LandingData = {
  dataAsOf: string | null
  rows: HeroRow[]
}

const HERO_FUNDS = ['voo', 'qqq', 'cspx']

export function landingData(raw: unknown): LandingData {
  const data = dataSchema.parse(raw)
  return {
    dataAsOf: oldestAsOf(raw),
    rows: heroRows(data, HERO_FUNDS),
  }
}
