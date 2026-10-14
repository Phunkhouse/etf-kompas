// A view of the in-memory store for Playwright. It exists only when the server runs
// with LEAD_STORE=memory (never on Vercel); everywhere else it is a plain 404.
import { connection } from 'next/server'
import { memoryLeads } from '@/app/lead-service'

export async function GET() {
  // Read at request time, not once at build time.
  await connection()
  const memory = memoryLeads()
  if (!memory) return new Response('Not found', { status: 404 })
  return Response.json({
    leads: memory.leads(),
    tokens: memory.tokens(),
  })
}
