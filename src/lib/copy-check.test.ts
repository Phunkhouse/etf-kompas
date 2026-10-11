import { describe, expect, it } from 'vitest'
import { checkCopy, type CopyIssue, type CopyRule } from './copy-check'

const TICKERS = ['VOO', 'QQQ', 'CSPX']

function run(copy: unknown, tickers = TICKERS): CopyIssue[] {
  return checkCopy(copy, { tickers })
}

function paths(issues: CopyIssue[], rule: CopyRule): string[] {
  return issues.filter((i) => i.rule === rule).map((i) => i.path)
}

describe('glossary (rule a)', () => {
  it('passes clean copy', () => {
    expect(
      run({ a: { text: 'Roční poplatek fondu je malé procento.' } }),
    ).toEqual([])
  })

  it.each([
    ['TER', 'Poplatek TER je nízký.'],
    ['UCITS', 'Fond typu UCITS.'],
    ['domicil', 'Domicil fondu je Irsko.'],
    ['fond sídlí v Irsku', 'Tento fond sídlí v Irsku.'],
    ['S&P 500', 'Sleduje S&P 500.'],
    ['Nasdaq 100', 'Sleduje Nasdaq 100.'],
    ['kurzový rozdíl', 'Platíte kurzový rozdíl.'],
    ['FX poplatek', 'Účtuje se FX poplatek.'],
    ['srážková daň z dividend', 'Odvádí se srážková daň z dividend.'],
    ['ilustrativní předpoklad', 'To je ilustrativní předpoklad.'],
    ['Metodika', 'Metodika výpočtu.'],
    ['Zdroje', 'Zdroje dat.'],
    ['broker', 'Zvolte vhodný broker.'],
    ['gate', 'Otevřete gate.'],
    ['odemknout', 'Můžete odemknout srovnání.'],
  ])('flags "%s" with its path', (_term, text) => {
    expect(paths(run({ page: { intro: text } }), 'glossary')).toEqual([
      'page.intro',
    ])
  })

  it('flags TER but not "ter" inside other words', () => {
    expect(paths(run({ a: 'materiál a internet' }), 'glossary')).toEqual([])
    expect(paths(run({ a: 'Roční TER' }), 'glossary')).toEqual(['a'])
  })

  it('treats TER and UCITS as case-sensitive', () => {
    expect(paths(run({ a: 'ter a ucits' }), 'glossary')).toEqual([])
  })

  it('ignores case for the other terms', () => {
    expect(paths(run({ a: 'metodika', b: 'METODIKA' }), 'glossary')).toEqual([
      'a',
      'b',
    ])
  })

  it('does not flag a term inside a longer word', () => {
    expect(paths(run({ a: 'Podzdroje a zdrojem' }), 'glossary')).toEqual([])
  })

  it('does not flag the singular "zdroj" (only "Zdroje")', () => {
    expect(
      paths(run({ a: 'zdroj: oficiální stránky fondů' }), 'glossary'),
    ).toEqual([])
  })

  it('catches inflected forms of broker', () => {
    expect(
      paths(run({ a: 'U brokera', b: 'Pro brokerů' }), 'glossary'),
    ).toEqual(['a', 'b'])
  })

  it('matches terms at word edges next to punctuation and diacritics', () => {
    expect(paths(run({ a: '(Zdroje).', b: '„Metodika“' }), 'glossary')).toEqual(
      ['a', 'b'],
    )
  })

  it('sees through non-breaking spaces', () => {
    expect(paths(run({ a: 'fond sídlí v Irsku' }), 'glossary')).toEqual(['a'])
  })

  it('does not check text under legal', () => {
    expect(
      run({ legal: { privacy: 'TER, UCITS, ETF, ETF, broker!' } }),
    ).toEqual([])
  })

  it('checks the result of functions (called with a sample argument)', () => {
    const copy = { fn: (years: number) => `Za ${years} let platíte TER` }
    expect(paths(run(copy), 'glossary')).toEqual(['fn'])
  })

  it('reports a function that cannot be called with the sample', () => {
    const copy = {
      fn: (value: number) =>
        (value as unknown as { toFixed: () => string }).toFixed(),
    }
    expect(paths(run(copy), 'sample-call')).toEqual(['fn'])
  })
})

describe('"ETF" at most once (rule b)', () => {
  it('passes one ETF', () => {
    expect(
      paths(run({ a: 'ETF je fond.', b: 'Jiný text.' }), 'etf-once'),
    ).toEqual([])
  })

  it('reports the second ETF and names the first', () => {
    const issues = run({ a: 'ETF je fond.', b: { c: 'Další ETF.' } })
    expect(paths(issues, 'etf-once')).toEqual(['b.c'])
    expect(issues.find((i) => i.rule === 'etf-once')?.message).toContain('a')
  })

  it('does not count the wordmark "ETF Kompas"', () => {
    expect(
      paths(
        run({ a: 'ETF Kompas', b: 'ETF je fond.', c: 'ETF Kompas' }),
        'etf-once',
      ),
    ).toEqual([])
  })

  it('does not count ETFs or other words that contain ETF', () => {
    expect(paths(run({ a: 'ETF', b: 'ETFko a ETFs' }), 'etf-once')).toEqual([])
  })

  it('does not count text under legal', () => {
    expect(
      paths(run({ a: 'ETF je fond.', legal: { b: 'ETF' } }), 'etf-once'),
    ).toEqual([])
  })
})

describe('headline abbreviations (rule c)', () => {
  it('flags capitals in a heading or headline', () => {
    const issues = run({
      hero: { headline: 'Co je ETF?' },
      calc: { heading: 'Poplatek TER' },
    })
    expect(paths(issues, 'headline')).toEqual(['hero.headline', 'calc.heading'])
  })

  it('passes a heading with single capitals', () => {
    expect(
      paths(run({ calc: { heading: 'Kolik to u vás dělá?' } }), 'headline'),
    ).toEqual([])
  })

  it('does not apply to other keys', () => {
    expect(
      paths(run({ calc: { caption: 'Pouze CZ trh' } }), 'headline'),
    ).toEqual([])
  })
})

describe('tickers (rule d)', () => {
  it('flags a ticker in plain text', () => {
    expect(paths(run({ a: 'Fond VOO je levný.' }), 'ticker')).toEqual(['a'])
  })

  it('allows a ticker inside a row with plainName', () => {
    const copy = {
      rows: [
        {
          plainName: '500 největších amerických firem',
          detail: 'značka VOO',
        },
      ],
    }
    expect(paths(run(copy), 'ticker')).toEqual([])
  })

  it('flags a ticker in a row without plainName', () => {
    const copy = { rows: [{ label: 'Americký fond', detail: 'značka VOO' }] }
    expect(paths(run(copy), 'ticker')).toEqual(['rows[0].detail'])
  })

  it('takes the ticker list from the options', () => {
    expect(paths(run({ a: 'Fond XYZ' }, ['XYZ']), 'ticker')).toEqual(['a'])
    expect(paths(run({ a: 'Fond XYZ' }, ['VOO']), 'ticker')).toEqual([])
  })

  it('flags the same ticker in several strings in a row', () => {
    expect(
      paths(run({ a: 'Fond VOO', b: 'Fond VOO', c: 'Fond VOO' }), 'ticker'),
    ).toEqual(['a', 'b', 'c'])
  })

  it('does not flag a ticker inside a longer word', () => {
    expect(paths(run({ a: 'VOOL a XVOO' }), 'ticker')).toEqual([])
  })

  it('lets a row with plainName name S&P 500 and Nasdaq 100, but not elsewhere', () => {
    const copy = {
      rows: [{ plainName: '500 firem', detail: 'odborně S&P 500, značka VOO' }],
      outside: 'Sleduje S&P 500.',
    }
    const issues = run(copy)
    expect(paths(issues, 'glossary')).toEqual(['outside'])
    expect(paths(issues, 'ticker')).toEqual([])
    expect(
      paths(
        run({ rows: [{ plainName: 'x', detail: 'odborně Nasdaq 100' }] }),
        'glossary',
      ),
    ).toEqual([])
  })

  it('still flags other glossary terms inside a row', () => {
    const copy = { rows: [{ plainName: 'x', detail: 'TER a UCITS' }] }
    expect(paths(run(copy), 'glossary')).toEqual(['rows[0].detail'])
  })
})

describe('banned wording (rule e)', () => {
  it.each([
    'Zaručeně vyděláte.',
    'Garantovaný výnos pro vás.',
    'Investujte bez rizika.',
    'Zbohatněte rychle.',
    'Pasivní příjem každý měsíc.',
    'Finanční svoboda je blízko.',
    'Revoluční nástroj.',
    'Tajemství bohatých.',
    'Exkluzivní nabídka.',
    'Nenechte si ujít šanci.',
    'Poslední šance.',
  ])('flags "%s"', (text) => {
    expect(paths(run({ a: text }), 'banned')).toEqual(['a'])
  })

  it('flags an exclamation mark', () => {
    expect(paths(run({ a: 'Hotovo!' }), 'banned')).toEqual(['a'])
  })

  it('flags an emoji but not ©, ® or ™', () => {
    expect(paths(run({ a: 'Super 🚀', b: '✅ hotovo' }), 'banned')).toEqual([
      'a',
      'b',
    ])
    expect(paths(run({ a: '© 2026 ETF Kompas® ™' }), 'banned')).toEqual([])
  })

  it('does not check text under legal', () => {
    expect(paths(run({ legal: { a: 'Zaručeně!' } }), 'banned')).toEqual([])
  })
})

describe('reporting', () => {
  it('reports every problem, not only the first', () => {
    const issues = run({
      a: 'TER',
      b: 'broker',
      c: 'Hotovo!',
      d: 'VOO',
    })
    expect(issues.map((i) => i.rule).sort()).toEqual([
      'banned',
      'glossary',
      'glossary',
      'ticker',
    ])
  })

  it('gives each issue a readable message', () => {
    const [issue] = run({ a: 'TER' })
    expect(issue.message).toMatch(/TER/)
  })
})

describe('the real copy', () => {
  it('passes with the real ticker list from data/etfs.json', async () => {
    const { copy } = await import('@/content/copy')
    const { loadTickers } = await import('@/server/data/load')
    const tickers = await loadTickers()
    expect(checkCopy(copy, { tickers })).toEqual([])
  })
})
