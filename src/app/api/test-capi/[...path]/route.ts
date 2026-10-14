// A stand-in for Meta's Conversions API in the end-to-end run. The server is pointed at it
// with META_GRAPH_BASE, which is honoured only with LEAD_STORE=memory (never on Vercel);
// everywhere else this route is a plain 404. It records what it gets. A request whose
// `fbc` ends in "fail500" is answered with 500, and one that ends in "hang" is answered
// after the server's own timeout has passed, so a test can check that a failing Meta never
// reaches the visitor.
import { connection } from 'next/server'

type Recorded = { path: string; body: Record<string, unknown> }
const globalForCapi = globalThis as typeof globalThis & {
  __capiRequests?: Recorded[]
}

function enabled() {
  return process.env.LEAD_STORE === 'memory'
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!enabled()) return new Response('Not found', { status: 404 })
  const { path } = await context.params
  const body = (await request.json()) as Recorded['body']
  ;(globalForCapi.__capiRequests ??= []).push({ path: path.join('/'), body })
  const data = (
    body.data as { user_data?: { fbc?: string } }[] | undefined
  )?.[0]
  const fbc = data?.user_data?.fbc ?? ''
  if (fbc.endsWith('fail500')) return new Response('{}', { status: 500 })
  if (fbc.endsWith('hang')) {
    await new Promise((resolve) => setTimeout(resolve, 6000))
  }
  return Response.json({ events_received: 1 })
}

export async function GET() {
  await connection()
  if (!enabled()) return new Response('Not found', { status: 404 })
  return Response.json({ requests: globalForCapi.__capiRequests ?? [] })
}
