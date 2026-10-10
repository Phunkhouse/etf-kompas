import { test, expect } from '@playwright/test'

// Czech diacritics, lower and upper case.
const DIACRITICS = 'ěščřžýáíéůúňťďĚŠČŘŽÝÁÍÉŮÚŇŤĎ'

test('styleguide is not indexable', async ({ page }) => {
  await page.goto('/styleguide')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  )
})

test('self-hosted fonts load and cover Czech diacritics', async ({ page }) => {
  await page.goto('/styleguide')
  await page.evaluate(() => document.fonts.ready)

  const result = await page.evaluate(
    async ({ chars }) => {
      const family = getComputedStyle(document.body).fontFamily
      const loaded = [...document.fonts]
        .filter((f) => f.status === 'loaded')
        .map((f) => f.family)

      // A glyph missing from the web font falls back to another font and gets
      // that font's width. Compare with a pure fallback to catch missing glyphs.
      const ctx = document.createElement('canvas').getContext('2d')!
      const missing: string[] = []
      for (const ch of chars) {
        ctx.font = `32px ${family}`
        const withFont = ctx.measureText(ch).width
        ctx.font = '32px serif'
        const fallback = ctx.measureText(ch).width
        if (withFont === fallback) missing.push(ch)
      }
      return { family, loaded, missing }
    },
    { chars: DIACRITICS },
  )

  expect(result.loaded.some((f) => /plex sans/i.test(f))).toBe(true)
  expect(result.loaded.some((f) => /plex mono/i.test(f))).toBe(true)
  expect(result.missing).toEqual([])
})

test('Kč amounts use tabular figures', async ({ page }) => {
  await page.goto('/styleguide')
  const widths = await page.evaluate(() => {
    const width = (id: string) =>
      document
        .querySelector<HTMLElement>(`[data-testid="${id}"]`)!
        .getBoundingClientRect().width
    return { ones: width('digits-ones'), zeros: width('digits-zeros') }
  })
  expect(widths.ones).toBeCloseTo(widths.zeros, 1)
})

test('styleguide does not scroll sideways on a phone', async ({ page }) => {
  await page.goto('/styleguide')
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
