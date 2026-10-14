import { connection } from 'next/server'
import { leadDeps } from '@/app/lead-service'
import { getRates } from '@/app/rates'
import { renderPdf } from '@/components/PdfDocument'
import { controllerLabel } from '@/config/site'
import { bundledData } from '@/server/data/bundled'
import { pdfModel } from '@/server/pdf-model'
import { resolveResults } from '@/server/results'

// Private to the visitor, out of search engines and out of shared caches (SPEC §26).
const PRIVATE = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, nofollow',
}

// The personalised PDF behind a results link (SPEC §3.2). The setup comes from the
// lead's stored amount and years, and the numbers are recomputed here with the same
// pricing as the calculator. Unlike the page, a route handler can answer a real 404.
export async function GET(
  _request: Request,
  { params }: RouteContext<'/srovnani/[token]/pdf'>,
) {
  // The clock and the store are read at request time, never at build time.
  await connection()
  const { token } = await params
  const found = await resolveResults(token, leadDeps())
  if (found.status === 'unknown') {
    return new Response('Not found', { status: 404, headers: PRIVATE })
  }
  if (found.status === 'error') {
    return new Response('Error', { status: 500, headers: PRIVATE })
  }

  const model = pdfModel(
    bundledData,
    await getRates(),
    { monthly: found.lead.calcMonthly, years: found.lead.calcYears },
    controllerLabel(),
  )
  if (!model) return new Response('Error', { status: 500, headers: PRIVATE })

  const bytes = await renderPdf(model)
  return new Response(new Uint8Array(bytes), {
    headers: {
      ...PRIVATE,
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="etf-kompas-srovnani.pdf"',
    },
  })
}
