// A view of the in-memory store for Playwright. It exists only when the server runs
// with LEAD_STORE=memory (never on Vercel); everywhere else it is a plain 404.
import { connection } from 'next/server'
import { memoryLeads, memoryMail } from '@/app/lead-service'

export async function GET() {
  // Read at request time, not once at build time.
  await connection()
  const memory = memoryLeads()
  if (!memory) return new Response('Not found', { status: 404 })
  return Response.json({
    leads: memory.leads(),
    tokens: memory.tokens(),
    // what the recording mailer "sent" (nothing leaves the machine)
    mails: memoryMail()?.mailer.sent() ?? [],
  })
}

// Test only: `{ email, expireTokens: true }` makes every token of that address expired.
export async function POST(request: Request) {
  const memory = memoryLeads()
  if (!memory) return new Response('Not found', { status: 404 })
  const body = (await request.json()) as {
    email?: string
    expireTokens?: boolean
    allowEmail?: string
  }
  // Puts an address on the sandbox allowlist, so mail to it is really "sent".
  if (typeof body.allowEmail === 'string') {
    memoryMail()?.allowlist.push(body.allowEmail.toLowerCase())
  }
  if (typeof body.email === 'string' && body.expireTokens) {
    memory.expireTokens(body.email.toLowerCase(), new Date())
  }
  return Response.json({ ok: true })
}
