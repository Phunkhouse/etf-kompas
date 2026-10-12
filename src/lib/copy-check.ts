// Checks the Czech copy module against the plain-language rules (SPEC §25,
// decision note 0002). Pure: no imports from next, react or the file system.
// Rules: (a) glossary, (b) "ETF" at most once, (c) no abbreviation in a
// headline, (d) tickers only next to a plain name, (e) banned wording.

export type CopyRule =
  'glossary' | 'etf-once' | 'headline' | 'ticker' | 'banned' | 'sample-call'

export type CopyIssue = { rule: CopyRule; path: string; message: string }

export type CopyCheckOptions = { tickers: string[] }

type Term = {
  name: string
  // Regular expression source. A trailing \p{L}* matches Czech inflection.
  source: string
  caseSensitive?: boolean
  // Allowed inside a table row that has a plainName (decision on the wireframe's
  // "odborně S&P 500, značka VOO" sub-label).
  allowedInRow?: boolean
  // Also allowed under a key named "lead" (hero lead, note 0039).
  allowedInLead?: boolean
}

const GLOSSARY: Term[] = [
  { name: 'TER', source: 'TER', caseSensitive: true },
  { name: 'UCITS', source: 'UCITS', caseSensitive: true },
  { name: 'domicil', source: String.raw`domicil\p{L}*` },
  { name: 'fond sídlí v Irsku', source: 'fond sídlí v Irsku' },
  {
    name: 'S&P 500',
    source: '(?:S&P)[ -]?500',
    allowedInRow: true,
    allowedInLead: true,
  },
  {
    name: 'Nasdaq 100',
    source: 'Nasdaq[ -]?100',
    allowedInRow: true,
    allowedInLead: true,
  },
  { name: 'kurzový rozdíl', source: String.raw`kurzov\p{L}* rozdíl\p{L}*` },
  { name: 'FX poplatek', source: String.raw`FX poplat\p{L}*` },
  {
    name: 'srážková daň z dividend',
    source: String.raw`srážkov\p{L}* da\p{L}* z dividend\p{L}*`,
  },
  {
    name: 'ilustrativní předpoklad',
    source: String.raw`ilustrativn\p{L}* předpoklad\p{L}*`,
  },
  { name: 'Metodika', source: String.raw`metodik\p{L}*` },
  { name: 'Zdroje', source: 'zdroje' },
  { name: 'gate', source: 'gate' },
  { name: 'odemknout', source: String.raw`odemkn\p{L}*` },
]

// SPEC §25 rule 7.
const BANNED: Term[] = [
  { name: 'zaručeně', source: String.raw`zaručen\p{L}*` },
  {
    name: 'garantovaný výnos',
    source: String.raw`garantovan\p{L}* výnos\p{L}*`,
  },
  { name: 'bez rizika', source: 'bez rizika' },
  { name: 'zbohatněte', source: String.raw`zbohatn\p{L}*` },
  { name: 'pasivní příjem', source: String.raw`pasivn\p{L}* příj\p{L}*` },
  {
    name: 'finanční svoboda',
    source: String.raw`finančn\p{L}* svobod\p{L}*`,
  },
  { name: 'revoluční', source: String.raw`revolučn\p{L}*` },
  {
    name: 'tajemství bohatých',
    source: String.raw`tajemstv\p{L}* bohat\p{L}*`,
  },
  { name: 'exkluzivní', source: String.raw`exkluzivn\p{L}*` },
  { name: 'nenechte si ujít', source: 'nenechte si ujít' },
  { name: 'poslední šance', source: String.raw`poslední šanc\p{L}*` },
]

const NOT_IN_WORD_BEFORE = String.raw`(?<![\p{L}\p{N}])`
const NOT_IN_WORD_AFTER = String.raw`(?![\p{L}\p{N}])`

function wordRegExp(source: string, caseSensitive = false): RegExp {
  return new RegExp(
    `${NOT_IN_WORD_BEFORE}(?:${source})${NOT_IN_WORD_AFTER}`,
    // No "g" flag: these are only used with test(), and a global regular
    // expression remembers lastIndex between calls.
    caseSensitive ? 'u' : 'iu',
  )
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
}

const ETF_WORD = wordRegExp('ETF', true)
const WORDMARK = /ETF Kompas/g
const ABBREVIATION = /\p{Lu}{2,}/u
const EMOJI = /\p{Extended_Pictographic}/u
const NON_EMOJI_SYMBOLS = /[©®™]/g

type Entry = {
  path: string
  key: string
  text: string
  inRow: boolean
}

function joinPath(base: string, key: string | number): string {
  if (typeof key === 'number') return `${base}[${key}]`
  return base ? `${base}.${key}` : key
}

function isRow(node: object): boolean {
  const plainName = (node as { plainName?: unknown }).plainName
  return typeof plainName === 'string' && plainName.trim() !== ''
}

// Collects every string in the copy, including the results of functions. A
// function is called once with the text "x" for every parameter.
function collect(
  node: unknown,
  path: string,
  key: string,
  inRow: boolean,
  entries: Entry[],
  issues: CopyIssue[],
): void {
  if (typeof node === 'string') {
    entries.push({ path, key, text: node.replace(/ /g, ' '), inRow })
    return
  }
  if (typeof node === 'function') {
    const fn = node as (...args: string[]) => unknown
    try {
      const result = fn(...Array<string>(fn.length).fill('x'))
      if (typeof result === 'string') {
        entries.push({ path, key, text: result.replace(/ /g, ' '), inRow })
      }
    } catch (error) {
      issues.push({
        rule: 'sample-call',
        path,
        message: `Could not call the function with a sample argument: ${String(error)}`,
      })
    }
    return
  }
  if (Array.isArray(node)) {
    node.forEach((child, index) =>
      collect(child, joinPath(path, index), key, inRow, entries, issues),
    )
    return
  }
  if (typeof node === 'object' && node !== null) {
    const rowHere = inRow || isRow(node)
    for (const [childKey, child] of Object.entries(node)) {
      // Legal pages (privacy policy, cookie text) are exempt.
      if (path === '' && childKey === 'legal') continue
      collect(
        child,
        joinPath(path, childKey),
        childKey,
        rowHere,
        entries,
        issues,
      )
    }
  }
}

function matchedTerms(
  text: string,
  terms: Term[],
  inRow: boolean,
  inLead = false,
): string[] {
  return terms
    .filter((term) => !(inRow && term.allowedInRow))
    .filter((term) => !(inLead && term.allowedInLead))
    .filter((term) => wordRegExp(term.source, term.caseSensitive).test(text))
    .map((term) => term.name)
}

export function checkCopy(
  copy: unknown,
  options: CopyCheckOptions,
): CopyIssue[] {
  const entries: Entry[] = []
  const issues: CopyIssue[] = []
  collect(copy, '', '', false, entries, issues)

  const tickerPatterns = options.tickers.map((ticker) => ({
    ticker,
    pattern: wordRegExp(escapeRegExp(ticker), true),
  }))

  let firstEtfPath: string | null = null

  for (const { path, key, text, inRow } of entries) {
    const glossary = matchedTerms(text, GLOSSARY, inRow, key === 'lead')
    if (glossary.length > 0) {
      issues.push({
        rule: 'glossary',
        path,
        message: `Glossary term not allowed: ${glossary.map((t) => `"${t}"`).join(', ')} (SPEC §25)`,
      })
    }

    if (text.replace(WORDMARK, ' ').match(ETF_WORD)) {
      if (firstEtfPath === null) {
        firstEtfPath = path
      } else {
        issues.push({
          rule: 'etf-once',
          path,
          message: `"ETF" may appear only once on the landing page; first use is at ${firstEtfPath}`,
        })
      }
    }

    if ((key === 'headline' || key === 'heading') && ABBREVIATION.test(text)) {
      issues.push({
        rule: 'headline',
        path,
        message:
          'A headline must not contain an abbreviation (two or more capitals)',
      })
    }

    if (!inRow) {
      const tickers = tickerPatterns
        .filter(({ pattern }) => pattern.test(text))
        .map(({ ticker }) => ticker)
      if (tickers.length > 0) {
        issues.push({
          rule: 'ticker',
          path,
          message: `Ticker outside a table row with a plainName: ${tickers.join(', ')}`,
        })
      }
    }

    const banned = matchedTerms(text, BANNED, false)
    if (text.includes('!')) banned.push('!')
    if (EMOJI.test(text.replace(NON_EMOJI_SYMBOLS, ''))) banned.push('emoji')
    if (banned.length > 0) {
      issues.push({
        rule: 'banned',
        path,
        message: `Banned wording: ${banned.map((t) => `"${t}"`).join(', ')} (SPEC §25 rule 7)`,
      })
    }
  }

  return issues
}
