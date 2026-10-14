// GET /api/purge: deletes the personal data whose time is up (docs/PHASE-6-PLAN.md).
// Vercel Cron calls it once a day with `Authorization: Bearer $CRON_SECRET`. Without a
// configured secret nothing is allowed. The answer carries counts only.
import { timingSafeEqual } from 'node:crypto'
import { runPurge } from '@/app/purge-service'

const NO_STORE = { 'Cache-Control': 'no-store' }

function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') ?? ''
  if (!header.startsWith('Bearer ')) return false
  const given = Buffer.from(header.slice('Bearer '.length))
  const wanted = Buffer.from(secret)
  return given.length === wanted.length && timingSafeEqual(given, wanted)
}

export async function GET(request: Request) {
  // It reads the request headers, so it runs per request, never at build time.
  if (!authorised(request)) {
    return new Response(null, { status: 401, headers: NO_STORE })
  }
  try {
    return Response.json(await runPurge(), { headers: NO_STORE })
  } catch {
    // No detail: the message could carry a value.
    console.error('retention: the purge failed')
    return new Response(null, { status: 500, headers: NO_STORE })
  }
}
