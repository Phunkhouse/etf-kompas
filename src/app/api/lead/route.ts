// POST /api/lead: the same lead rules as the form's server action, with real HTTP
// statuses (SPEC §22 asks for a 429 on the 6th request). Thin: parse, call, answer.
import { handleLead } from '@/app/lead-service'
import type { LeadInput } from '@/server/leads'

async function readInput(request: Request): Promise<LeadInput> {
  const type = request.headers.get('content-type') ?? ''
  if (type.includes('application/json')) {
    const body: unknown = await request.json()
    return body && typeof body === 'object' ? (body as LeadInput) : {}
  }
  const form = await request.formData()
  return Object.fromEntries(form.entries())
}

export async function POST(request: Request) {
  let input: LeadInput
  try {
    input = await readInput(request)
  } catch {
    return Response.json({ status: 'invalid', email: '' }, { status: 400 })
  }
  const state = await handleLead(input)
  switch (state.status) {
    case 'ok':
      return Response.json(state)
    case 'limited':
      return Response.json(state, {
        status: 429,
        headers: { 'Retry-After': String(state.retryAfterSeconds) },
      })
    case 'invalid':
      return Response.json(state, { status: 400 })
    default:
      return Response.json(state, { status: 500 })
  }
}
