import { Landing } from '@/components/Landing'
import { bundledData } from '@/server/data/bundled'
import { landingData } from '@/server/landing-data'

// Hero a, the default. `/?v=b` is rewritten to /v/b (next.config.ts), and any
// other value of `v` falls through to this page (decision note 0028).
export default function Home() {
  const { dataAsOf, calculator } = landingData(bundledData)
  return <Landing variant="a" dataAsOf={dataAsOf} calculator={calculator} />
}
