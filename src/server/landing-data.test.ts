import { describe, expect, it } from 'vitest'
import { landingData } from './landing-data'

describe('landingData (the real data files)', () => {
  it('gives the three hero rows in the order VOO, QQQ, CSPX', async () => {
    const { loadData } = await import('./data/load')
    const result = landingData(await loadData())
    expect(result.rows.map((row) => row.fundId)).toEqual(['voo', 'qqq', 'cspx'])
  })

  it('gives the date of the oldest number', async () => {
    const { loadData } = await import('./data/load')
    const result = landingData(await loadData())
    expect(result.dataAsOf).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('works on the bundled data the pages use, with the same result', async () => {
    const { loadData } = await import('./data/load')
    const { bundledData } = await import('./data/bundled')
    expect(landingData(bundledData)).toEqual(landingData(await loadData()))
  })

  it('rejects data that does not match the schema', () => {
    expect(() => landingData({ etfs: 1 })).toThrow()
  })
})
