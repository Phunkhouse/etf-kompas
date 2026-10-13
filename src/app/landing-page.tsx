import { Landing } from '@/components/Landing'
import { calculatorData } from '@/server/calculator-data'
import { bundledData } from '@/server/data/bundled'
import {
  chooseHeroVariant,
  heroSavingKc,
  type HeroVariant,
} from '@/server/hero-variant'
import { landingData } from '@/server/landing-data'
import { getRates } from './rates'

// The fund the calculator prices: the European twin of the S&P 500 (note 0036).
const CALCULATOR_FUND = 'cspx'

// The landing page both A/B variants share (note 0041): one layout, only the h1
// differs. `requested` is the variant the URL asks for; variant b is shown only
// when there is a saving to name (the hide rule), otherwise everyone gets a.
export async function LandingPage({ requested }: { requested: HeroVariant }) {
  const { dataAsOf, twins, note, faqFacts } = landingData(bundledData)
  const calculator = calculatorData(
    bundledData,
    await getRates(),
    CALCULATOR_FUND,
  )
  const { variant, savingKc } = chooseHeroVariant(
    requested,
    heroSavingKc(calculator),
  )
  return (
    <Landing
      variant={variant}
      savingKc={savingKc}
      dataAsOf={dataAsOf}
      twins={twins}
      note={note}
      faqFacts={faqFacts}
      calculator={calculator}
    />
  )
}
