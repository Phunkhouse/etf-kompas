import { describe, expect, it } from 'vitest'
import { copy, czCount, legalCopy, subscribeCopy } from './copy'

// Phase 6, PR 2: case CP-1 of docs/PHASE-6-PLAN.md. The pages name both periods and
// say they are provisional; the numbers come from the settings, not from the text.
const config = {
  leadMonthsAfterLastContact: 6,
  daysAfterUnsubscribe: 30,
  provisional: true,
}
const retentionSection = legalCopy.privacy.sections.find(
  (section) => section.id === 'jak-dlouho',
)!
const privacyText = (settings = config) =>
  (retentionSection.text as (c: string, r: typeof config) => string)(
    '[SPRÁVCE]',
    settings,
  )

describe('retention in the copy', () => {
  it('CP-1 the privacy text names both periods and says they are provisional', () => {
    const text = privacyText()
    expect(text).toContain('6 měsíců')
    expect(text).toContain('30 dní'.replace('dní', 'dnů'))
    expect(text).toContain('předběžné')
    expect(text).toContain('[doplnit]')
  })

  it('CP-1 the numbers follow the settings, with the right Czech plural', () => {
    const text = privacyText({
      ...config,
      leadMonthsAfterLastContact: 1,
      daysAfterUnsubscribe: 2,
    })
    expect(text).toContain('1 měsíc ')
    expect(text).toContain('2 dny')
  })

  it('CP-1 once the periods are no longer provisional the text stops saying so', () => {
    expect(privacyText({ ...config, provisional: false })).not.toContain(
      'předběžné',
    )
  })

  it('CP-1 the unsubscribe page names its period and says it is provisional', () => {
    const text = subscribeCopy.unsubscribe.kept(30)
    expect(text).toContain('30 dnů')
    expect(text).toContain('předběžná')
  })

  it('czCount follows the Czech plural rule', () => {
    expect(czCount(1, 'den', 'dny', 'dnů')).toBe('1 den')
    expect(czCount(3, 'den', 'dny', 'dnů')).toBe('3 dny')
    expect(czCount(5, 'den', 'dny', 'dnů')).toBe('5 dnů')
    expect(czCount(30, 'den', 'dny', 'dnů')).toBe('30 dnů')
  })

  it('no checked copy says that the e-mail is not stored', () => {
    expect(JSON.stringify(copy)).not.toContain('nikam neukládáme')
  })
})
