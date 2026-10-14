import { describe, expect, it } from 'vitest'
import { retentionConfig } from './retention'

// Phase 6, PR 2: cases RC-1 to RC-3 of docs/PHASE-6-PLAN.md. Written first.
describe('retentionConfig', () => {
  it('RC-1 defaults to 6 months and 30 days and says it is provisional', () => {
    expect(retentionConfig({})).toEqual({
      leadMonthsAfterLastContact: 6,
      daysAfterUnsubscribe: 30,
      provisional: true,
    })
  })

  it('RC-2 environment values override the defaults', () => {
    const config = retentionConfig({
      RETENTION_LEAD_MONTHS: '12',
      RETENTION_UNSUBSCRIBED_DAYS: '7',
    })
    expect(config.leadMonthsAfterLastContact).toBe(12)
    expect(config.daysAfterUnsubscribe).toBe(7)
  })

  it('RC-2 an empty variable counts as not set', () => {
    expect(
      retentionConfig({ RETENTION_LEAD_MONTHS: '' }).leadMonthsAfterLastContact,
    ).toBe(6)
  })

  it.each(['0', '-1', '1.5', 'abc', '99999'])(
    'RC-3 rejects %s and names the variable, never the value',
    (value) => {
      let message = ''
      try {
        retentionConfig({ RETENTION_LEAD_MONTHS: value })
      } catch (error) {
        message = error instanceof Error ? error.message : ''
      }
      expect(message).toContain('RETENTION_LEAD_MONTHS')
      expect(message).not.toContain(value)
    },
  )

  it('RC-3 rejects a bad value of the second variable too', () => {
    expect(() => retentionConfig({ RETENTION_UNSUBSCRIBED_DAYS: '0' })).toThrow(
      /RETENTION_UNSUBSCRIBED_DAYS/,
    )
  })
})
