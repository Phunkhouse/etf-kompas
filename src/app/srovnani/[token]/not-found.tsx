import { ResultsGone } from '@/components/ResultsGone'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

// A results link that does not work: the same page for every reason.
export default function ResultsGonePage() {
  return (
    <>
      <SiteHeader base="/" />
      <main>
        <ResultsGone />
      </main>
      <SiteFooter />
    </>
  )
}
