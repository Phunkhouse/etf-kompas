import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { ResultsPage } from '@/components/ResultsPage'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { bundledData } from '@/server/data/bundled'
import { comparison } from '@/server/comparison'
import { resolveResults } from '@/server/results'
import { leadDeps } from '@/app/lead-service'
import { getRates } from '@/app/rates'

export const metadata: Metadata = {
  title: 'Srovnání 5 fondů · ETF Kompas',
  robots: { index: false, follow: false },
}

// The page may wait for the lookup before it answers: a link that does not work
// must be a real 404, not a 200 that is corrected after the shell is sent.
export const instant = false

// The comparison behind a results link (SPEC §3.2, §26). The setup comes from the
// lead's stored amount and years; the numbers are recomputed here with the same
// pricing as the calculator. Headers (noindex, private) are set in next.config.ts.
export default async function ResultsRoute({
  params,
}: PageProps<'/srovnani/[token]'>) {
  // The clock and the store are read at request time, never in the prerendered shell.
  await connection()
  const { token } = await params
  const found = await resolveResults(token, leadDeps())
  if (found.status === 'unknown') notFound()
  if (found.status === 'error') throw new Error('results lookup failed')

  const result = comparison(bundledData, await getRates(), {
    monthly: found.lead.calcMonthly,
    years: found.lead.calcYears,
  })
  if (!result) throw new Error('comparison data is not valid')

  return (
    <>
      <SiteHeader base="/" />
      <ResultsPage comparison={result} />
      <SiteFooter />
    </>
  )
}
