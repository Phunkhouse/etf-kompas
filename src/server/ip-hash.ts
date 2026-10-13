// The key a visitor is counted under (SPEC §26): a keyed hash of the IP with the
// UTC date mixed in, so the key changes every day and the IP is never stored.
import { createHmac } from 'node:crypto'

export function hashIp(ip: string, secret: string, day: Date): string {
  const date = day.toISOString().slice(0, 10)
  return createHmac('sha256', secret).update(`${ip}|${date}`).digest('hex')
}

// The same for an e-mail address, so the address is not a key as it is.
export function hashEmail(email: string, secret: string): string {
  return createHmac('sha256', secret).update(`email|${email}`).digest('hex')
}
