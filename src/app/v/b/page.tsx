import { Landing } from '@/components/Landing'
import { bundledData } from '@/server/data/bundled'
import { oldestAsOf } from '@/server/data/freshness'

// Hero b. Visitors reach it as `/?v=b`; the URL /v/b works too (decision note 0028).
export default function VariantB() {
  return <Landing variant="b" dataAsOf={oldestAsOf(bundledData)} />
}
