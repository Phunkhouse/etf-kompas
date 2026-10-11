import { Landing } from '@/components/Landing'
import { bundledData } from '@/server/data/bundled'
import { landingData } from '@/server/landing-data'

// Hero b. Visitors reach it as `/?v=b`; the URL /v/b works too (decision note 0028).
export default function VariantB() {
  const { dataAsOf, rows, calculator } = landingData(bundledData)
  return (
    <Landing
      variant="b"
      dataAsOf={dataAsOf}
      rows={rows}
      calculator={calculator}
    />
  )
}
