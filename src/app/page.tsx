import { LandingPage } from './landing-page'

// Variant a, the default. `/?v=b` is rewritten to /v/b (next.config.ts), and any
// other value of `v` falls through to this page (decision notes 0028 and 0041).
export default function Home() {
  return <LandingPage requested="a" />
}
