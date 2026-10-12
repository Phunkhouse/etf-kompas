import { Landing } from '@/components/Landing'
import { calculatorData } from '@/server/calculator-data'
import { bundledData } from '@/server/data/bundled'
import { landingData } from '@/server/landing-data'
import { getRates } from './rates'

// The fund the calculator prices: the European twin of the S&P 500 (note 0036).
const CALCULATOR_FUND = 'cspx'

// Hero a, the default. `/?v=b` is rewritten to /v/b (next.config.ts), and any
// other value of `v` falls through to this page (decision note 0028).
export default async function Home() {
  const { dataAsOf } = landingData(bundledData)
  const calculator = calculatorData(
    bundledData,
    await getRates(),
    CALCULATOR_FUND,
  )
  return <Landing variant="a" dataAsOf={dataAsOf} calculator={calculator} />
}
