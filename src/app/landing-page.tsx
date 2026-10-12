import { Landing, type Variant } from '@/components/Landing'
import { calculatorData } from '@/server/calculator-data'
import { bundledData } from '@/server/data/bundled'
import { landingData } from '@/server/landing-data'
import { getRates } from './rates'

// The fund the calculator prices: the European twin of the S&P 500 (note 0036).
const CALCULATOR_FUND = 'cspx'

// The landing page both A/B variants share (note 0041): one layout, only the h1
// differs. `variant` is the one the visitor is shown.
export async function LandingPage({ variant }: { variant: Variant }) {
  const { dataAsOf, twins, note, faqFacts } = landingData(bundledData)
  const calculator = calculatorData(
    bundledData,
    await getRates(),
    CALCULATOR_FUND,
  )
  return (
    <Landing
      variant={variant}
      dataAsOf={dataAsOf}
      twins={twins}
      note={note}
      faqFacts={faqFacts}
      calculator={calculator}
    />
  )
}
