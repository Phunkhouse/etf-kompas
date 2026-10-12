// What the landing page needs from the data files, in one place for both hero
// variants: the oldest date, the hero table and its muted line. The calculator's
// data comes from calculatorData() with the exchange rates
// (src/server/calculator-data.ts).
import { oldestAsOf } from './data/freshness'
import { dataSchema } from './data/schema'
import {
  heroNote,
  heroTwins,
  originalsFacts,
  type HeroNote,
  type HeroTwin,
  type OriginalsFacts,
} from './hero'

export type LandingData = {
  dataAsOf: string | null
  twins: HeroTwin[]
  note: HeroNote
  faqFacts: OriginalsFacts
}

// The four twins of the hero table (note 0036), the first one named in the muted
// line, and the American originals it mentions.
const HERO_FUNDS = ['cspx', 'vuaa', 'cndx', 'eqqq']
const ORIGINALS = ['voo', 'qqq']

export function landingData(raw: unknown): LandingData {
  const data = dataSchema.parse(raw)
  return {
    dataAsOf: oldestAsOf(raw),
    twins: heroTwins(data, HERO_FUNDS),
    note: heroNote(data, HERO_FUNDS[0], ORIGINALS),
    faqFacts: originalsFacts(data, HERO_FUNDS[0], ORIGINALS),
  }
}
