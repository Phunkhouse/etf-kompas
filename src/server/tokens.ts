// Tokens for the results page (SPEC §26): 32 random bytes, URL-safe, and only
// their hash is stored. Uses node:crypto, no imports from next or react.
import { createHash, randomBytes } from 'node:crypto'

export function newToken(): string {
  return randomBytes(32).toString('base64url')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}
