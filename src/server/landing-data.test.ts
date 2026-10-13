import { describe, expect, it } from 'vitest'
import { landingData } from './landing-data'

describe('landingData (the real data files)', () => {
  it('gives the four hero twins in the order CSPX, VUAA, CNDX, EQQQ', async () => {
    const { loadData } = await import('./data/load')
    const result = landingData(await loadData())
    expect(result.twins.map((twin) => twin.fundId)).toEqual([
      'cspx',
      'vuaa',
      'cndx',
      'eqqq',
    ])
    expect(result.twins.map((twin) => twin.type)).toEqual([
      'accumulating',
      'accumulating',
      'accumulating',
      'distributing',
    ])
  })

  it('gives the note about the first twin and the American originals', async () => {
    const { loadData } = await import('./data/load')
    const { note } = landingData(await loadData())
    expect(note.fundId).toBe('cspx')
    expect(note.sellers).toEqual(expect.arrayContaining(['DEGIRO']))
    expect(note.originals.tickers).toEqual(['VOO', 'QQQ'])
    // DEGIRO, Trading 212 and XTB are verified as not selling them
    expect(note.originals.mostlyNo).toBe(true)
  })

  it('gives the facts the FAQ needs about the American funds', async () => {
    const { loadData } = await import('./data/load')
    const { faqFacts } = landingData(await loadData())
    expect(faqFacts.tickers).toEqual(['VOO', 'QQQ'])
    expect(faqFacts.total).toBe(5)
    // DEGIRO, IBKR (a notice: no KID for retail clients), Trading 212 and XTB are verified as not selling them
    expect(faqFacts.verifiedNo).toBe(4)
    expect(faqFacts.europeanSold).toBe(true)
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
