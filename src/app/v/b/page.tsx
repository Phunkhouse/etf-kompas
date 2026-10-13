import { LandingPage } from '../../landing-page'

// Variant b. Visitors reach it as `/?v=b`; the URL /v/b works too (note 0028).
// Variant b has its own headline only when there is a saving to name (two brokers
// with verified prices, note 0041); otherwise this page shows variant a, and says
// so in data-variant.
export default function VariantB() {
  return <LandingPage requested="b" />
}
