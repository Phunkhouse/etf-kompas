import { dataSchema, TODO_VERIFY } from './schema'

export type Mode = 'strict' | 'draft'

export type IssueCode =
  | 'MALFORMED'
  | 'MISSING_SOURCE'
  | 'UNKNOWN_SOURCE'
  | 'TODO_VERIFY'
  | 'STALE'
  | 'FUTURE_DATE'

export type Issue = {
  code: IssueCode
  severity: 'error' | 'warning'
  path: string
  message: string
}

export type ValidationResult = { ok: boolean; issues: Issue[] }

export const MAX_AGE_DAYS = 120
export const MAX_AGE_DAYS_BROKER_FEE = 45
const BROKER_FEE_KEYS = new Set(['fxFeePct', 'custodyFeePct'])
const META_FIELDS = [
  'sourceUrl',
  'asOf',
  'verifiedBy',
  'verifiedOn',
  'evidence',
] as const

type Sourced = { value: unknown } & Record<
  (typeof META_FIELDS)[number],
  string | null
>

function formatPath(path: PropertyKey[]): string {
  return path.reduce<string>((acc, part) => {
    if (typeof part === 'number') return `${acc}[${part}]`
    const key = String(part)
    return acc ? `${acc}.${key}` : key
  }, '')
}

function isSourced(node: unknown): node is Sourced {
  return (
    typeof node === 'object' &&
    node !== null &&
    'value' in node &&
    META_FIELDS.every((field) => field in node)
  )
}

function isBlank(text: string | null): boolean {
  return text === null || text.trim() === ''
}

function parseIsoDate(text: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null
  const time = Date.parse(`${text}T00:00:00Z`)
  if (Number.isNaN(time)) return null
  return new Date(time).toISOString().slice(0, 10) === text ? time : null
}

const DAY_MS = 24 * 60 * 60 * 1000

export function validateData(
  input: unknown,
  options: { today: string; mode: Mode },
): ValidationResult {
  const issues: Issue[] = []
  const todayTime = parseIsoDate(options.today)
  if (todayTime === null) throw new Error(`Invalid today: ${options.today}`)

  const parsed = dataSchema.safeParse(input)
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({
        code: 'MALFORMED',
        severity: 'error',
        path: formatPath(issue.path),
        message: issue.message,
      })
    }
    return { ok: false, issues }
  }

  const knownSources = new Set(parsed.data.sources.map((s) => s.url))

  function add(code: IssueCode, path: string, message: string) {
    const severity =
      code === 'TODO_VERIFY' && options.mode === 'draft' ? 'warning' : 'error'
    issues.push({ code, severity, path, message })
  }

  function checkRecord(
    record: Sourced,
    path: string,
    key: string,
    isFee: boolean,
  ) {
    const isPlaceholder =
      record.value === TODO_VERIFY ||
      META_FIELDS.some((field) => record[field] === TODO_VERIFY)
    if (isPlaceholder) {
      add('TODO_VERIFY', path, 'Value is still TODO_VERIFY')
      return
    }

    for (const field of META_FIELDS) {
      if (isBlank(record[field])) {
        add('MISSING_SOURCE', `${path}.${field}`, `${field} is missing`)
      }
    }

    const { sourceUrl, asOf, verifiedOn } = record
    if (!isBlank(sourceUrl)) {
      let isHttps = false
      try {
        isHttps = new URL(sourceUrl as string).protocol === 'https:'
      } catch {
        isHttps = false
      }
      if (!isHttps) {
        add('MALFORMED', `${path}.sourceUrl`, 'sourceUrl must be an https URL')
      } else if (!knownSources.has(sourceUrl as string)) {
        add(
          'UNKNOWN_SOURCE',
          `${path}.sourceUrl`,
          'sourceUrl is not listed in sources.json',
        )
      }
    }

    if (!isBlank(verifiedOn) && parseIsoDate(verifiedOn as string) === null) {
      add('MALFORMED', `${path}.verifiedOn`, 'verifiedOn must be YYYY-MM-DD')
    }

    if (!isBlank(asOf)) {
      const asOfTime = parseIsoDate(asOf as string)
      if (asOfTime === null) {
        add('MALFORMED', `${path}.asOf`, 'asOf must be YYYY-MM-DD')
      } else if (asOfTime > todayTime!) {
        add('FUTURE_DATE', `${path}.asOf`, 'asOf is in the future')
      } else {
        const limit =
          BROKER_FEE_KEYS.has(key) || isFee
            ? MAX_AGE_DAYS_BROKER_FEE
            : MAX_AGE_DAYS
        const ageDays = Math.round((todayTime! - asOfTime) / DAY_MS)
        if (ageDays > limit) {
          add(
            'STALE',
            `${path}.asOf`,
            `asOf is ${ageDays} days old (limit ${limit})`,
          )
        }
      }
    }
  }

  function walk(node: unknown, path: PropertyKey[]) {
    if (isSourced(node)) {
      // broker fees (version 2) and exchange rates go stale as fast as fees
      const isFee = path[0] === 'rates' || path.includes('fees')
      checkRecord(node, formatPath(path), String(path[path.length - 1]), isFee)
    } else if (Array.isArray(node)) {
      node.forEach((child, index) => walk(child, [...path, index]))
    } else if (typeof node === 'object' && node !== null) {
      for (const [key, child] of Object.entries(node)) {
        walk(child, [...path, key])
      }
    }
  }

  walk(parsed.data.etfs, ['etfs'])
  walk(parsed.data.brokers, ['brokers'])
  walk(parsed.data.rates, ['rates'])

  return { ok: issues.every((i) => i.severity !== 'error'), issues }
}
