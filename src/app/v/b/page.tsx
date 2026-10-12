import { Landing } from '@/components/Landing'
import { getRates } from '@/app/rates'
import { calculatorData } from '@/server/calculator-data'
import { bundledData } from '@/server/data/bundled'
import { landingData } from '@/server/landing-data'

const CALCULATOR_FUND = 'cspx'

// Hero b. Visitors reach it as `/?v=b`; the URL /v/b works too (decision note 0028).
export default async function VariantB() {
  const { dataAsOf, twins, note } = landingData(bundledData)
  const calculator = calculatorData(
    bundledData,
    await getRates(),
    CALCULATOR_FUND,
  )
  return (
    <Landing
      variant="b"
      dataAsOf={dataAsOf}
      twins={twins}
      note={note}
      calculator={calculator}
    />
  )
}
