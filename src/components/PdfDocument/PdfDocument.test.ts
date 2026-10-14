import { describe, expect, it } from 'vitest'
import type { ChosenRates } from '@/server/cnb'
import { bundledData } from '@/server/data/bundled'
import { pdfModel } from '@/server/pdf-model'
import { renderPdf } from './render'

// Phase 4, PR 3: the layout draws the model into a real PDF. Written first.
const RATES: ChosenRates = {
  EUR: { rate: 24.365, date: '2026-10-09', source: 'cnb' },
  USD: { rate: 21.745, date: '2026-10-08', source: 'cnb' },
}

describe('renderPdf', () => {
  it('makes a PDF of exactly six pages', async () => {
    const model = pdfModel(
      bundledData,
      RATES,
      { monthly: 3000, years: 10 },
      '[SPRÁVCE]',
    )!
    const bytes = await renderPdf(model)
    const text = Buffer.from(bytes).toString('latin1')
    expect(text.startsWith('%PDF-')).toBe(true)
    expect(text.match(/\/Type\s*\/Page\b(?!s)/g)).toHaveLength(6)
  }, 30_000)

  it('embeds a font with the Czech letters (no standard font fallback)', async () => {
    const model = pdfModel(
      bundledData,
      RATES,
      { monthly: 3000, years: 10 },
      '[SPRÁVCE]',
    )!
    const text = Buffer.from(await renderPdf(model)).toString('latin1')
    expect(text).toMatch(/IBMPlexSans/)
    expect(text).not.toMatch(/\/BaseFont\s*\/Helvetica/)
  }, 30_000)

  it('has a Czech title and language in its metadata and nothing about a person', async () => {
    const model = pdfModel(
      bundledData,
      RATES,
      { monthly: 3000, years: 10 },
      '[SPRÁVCE]',
    )!
    const text = Buffer.from(await renderPdf(model)).toString('latin1')
    expect(text).toMatch(/\/Title/)
    expect(JSON.stringify(model)).not.toMatch(/@/)
  }, 30_000)
})
