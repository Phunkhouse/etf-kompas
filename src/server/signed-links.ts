// Links in e-mails (SPEC §26): the opt-in link and the unsubscribe link. A token is
// `payload.signature`: the payload says what the link is for, whose it is and until
// when; the signature is an HMAC of it with a secret only the server has. Nobody can
// make a link up, change it, or use one kind for the other. No imports from next or react.
import { createHmac, timingSafeEqual } from 'node:crypto'

export type LinkPurpose = 'optin' | 'unsubscribe'

type Payload = { p: LinkPurpose; l: string; e: number | null }

const URL_SAFE = /^[A-Za-z0-9_-]+$/
const MAX_LENGTH = 512

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function signLink(
  input: { purpose: LinkPurpose; leadId: string; expiresAt?: Date },
  secret: string,
): string {
  const payload: Payload = {
    p: input.purpose,
    l: input.leadId,
    e: input.expiresAt ? input.expiresAt.getTime() : null,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${encoded}.${sign(encoded, secret)}`
}

export function verifyLink(
  token: string,
  purpose: LinkPurpose,
  secret: string,
  now: Date,
): { ok: true; leadId: string } | { ok: false } {
  const fail = { ok: false } as const
  if (token.length === 0 || token.length > MAX_LENGTH) return fail
  const parts = token.split('.')
  if (parts.length !== 2) return fail
  const [encoded, signature] = parts
  if (!URL_SAFE.test(encoded) || !URL_SAFE.test(signature)) return fail

  const expected = Buffer.from(sign(encoded, secret))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return fail
  }
  try {
    const payload = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as Payload
    if (payload.p !== purpose || typeof payload.l !== 'string') return fail
    if (payload.e !== null && now.getTime() >= payload.e) return fail
    return { ok: true, leadId: payload.l }
  } catch {
    return fail
  }
}
