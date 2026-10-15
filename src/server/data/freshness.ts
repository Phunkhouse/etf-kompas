import { TODO_VERIFY } from './schema'

// The oldest `asOf` among the values that are filled in, or null when none is.
export function oldestAsOf(data: unknown): string | null {
  return oldestDate(data, 'asOf')
}

// Use the earliest verification so the label never overstates how recently
// all of the filled records were checked.
export function oldestVerifiedOn(data: unknown): string | null {
  return oldestDate(data, 'verifiedOn')
}

function oldestDate(
  data: unknown,
  field: 'asOf' | 'verifiedOn',
): string | null {
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
      typeof record[field] === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(record[field])
    ) {
      if (oldest === null || record[field] < oldest) oldest = record[field]
      return
    }
    Object.values(record).forEach(walk)
  }

  walk(data)
  return oldest
}
