import { Landing } from '@/components/Landing'
import { heroRows } from '@/server/availability'
import { bundledData } from '@/server/data/bundled'
import { dataSchema } from '@/server/data/schema'
import { oldestAsOf } from '@/server/data/freshness'

// Hero b. Visitors reach it as `/?v=b`; the URL /v/b works too (decision note 0028).
export default function VariantB() {
  const data = dataSchema.parse(bundledData)
  const rows = heroRows(data, ['voo', 'qqq', 'cspx'])
  return <Landing variant="b" dataAsOf={oldestAsOf(bundledData)} rows={rows} />
}
