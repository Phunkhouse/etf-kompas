import { Landing } from '@/components/Landing'
import { bundledData } from '@/server/data/bundled'
import { oldestAsOf } from '@/server/data/freshness'

// Hero a, the default. `/?v=b` is rewritten to /v/b (next.config.ts), and any
// other value of `v` falls through to this page (decision note 0028).
export default function Home() {
  return <Landing variant="a" dataAsOf={oldestAsOf(bundledData)} />
}
