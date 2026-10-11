import { TODO_VERIFY } from './schema'

// The oldest `asOf` among the values that are filled in, or null when none is.
// The page shows it as "aktualizováno {měsíc}", so it never looks fresher than
// the oldest number on it (decision agreed with David, 2026-10-11).
export function oldestAsOf(data: unknown): string | null {
  let oldest: string | null = null

  function walk(node: unknown) {
    if (Array.isArray(node)) {
      node.forEach(walk)
      return
    }
    if (typeof node !== 'object' || node === null) return
    const record = node as Record<string, unknown>
    if (
      'value' in record &&
      record.value !== TODO_VERIFY &&
      typeof record.asOf === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(record.asOf)
    ) {
      if (oldest === null || record.asOf < oldest) oldest = record.asOf
      return
    }
    Object.values(record).forEach(walk)
  }

  walk(data)
  return oldest
}
