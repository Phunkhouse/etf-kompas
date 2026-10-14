// The limits of SPEC §26: 5 requests per hashed IP in an hour, 3 e-mails per hashed
// address in a day. One place, so the form, "send the link again" and the results
// page count the same. No imports from next or react.
import { hashEmail, hashIp } from './ip-hash'
import type { RateLimiter } from './lead-ports'

export const IP_LIMIT_PER_HOUR = 5
export const EMAIL_LIMIT_PER_DAY = 3
const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000

export type LimitDeps = {
  limiter: RateLimiter
  now: () => Date
  secrets: { ipHash: string }
}

export type Limit = { ok: true } | { ok: false; retryAfterSeconds: number }

function startOf(date: Date, size: number): Date {
  return new Date(Math.floor(date.getTime() / size) * size)
}

async function hit(
  deps: LimitDeps,
  key: string,
  size: number,
  limit: number,
): Promise<Limit> {
  const now = deps.now()
  const start = startOf(now, size)
  if (await deps.limiter.hit(key, start, limit)) return { ok: true }
  const seconds = Math.ceil((start.getTime() + size - now.getTime()) / 1000)
  return { ok: false, retryAfterSeconds: Math.max(1, seconds) }
}

export function hitIpLimit(deps: LimitDeps, ip: string): Promise<Limit> {
  const key = `ip:${hashIp(ip, deps.secrets.ipHash, deps.now())}`
  return hit(deps, key, HOUR_MS, IP_LIMIT_PER_HOUR)
}

export function hitEmailLimit(deps: LimitDeps, email: string): Promise<Limit> {
  const key = `email:${hashEmail(email, deps.secrets.ipHash)}`
  return hit(deps, key, DAY_MS, EMAIL_LIMIT_PER_DAY)
}
