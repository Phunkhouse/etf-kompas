// POST /api/event: first-party events (SPEC §9). Thin: size, parse, call, answer. It
// reads no cookie and sets none; the IP is only used, hashed, as a rate-limit key.
import { handleEvent } from '@/app/event-service'

const MAX_BYTES = 2048

export async function POST(request: Request) {
  const text = await request.text()
  if (new TextEncoder().encode(text).length > MAX_BYTES) {
    return new Response(null, { status: 413 })
  }
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return new Response(null, { status: 400 })
  }
  const forwarded = request.headers
    .get('x-forwarded-for')
    ?.split(',')[0]
    ?.trim()
  const ip = forwarded || request.headers.get('x-real-ip') || 'unknown'
  switch (await handleEvent(body, ip)) {
    case 'ok':
      return new Response(null, { status: 204 })
    case 'invalid':
      return new Response(null, { status: 400 })
    case 'limited':
      return new Response(null, {
        status: 429,
        headers: { 'Retry-After': '3600' },
      })
    default:
      return new Response(null, { status: 500 })
  }
}
