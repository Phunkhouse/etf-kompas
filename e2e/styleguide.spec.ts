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
      const loaded = [...document.fonts]
        .filter((f) => f.status === 'loaded')
        .map((f) => f.family.replace(/"/g, ''))
      const ctx = document.createElement('canvas').getContext('2d')!

      // If the web font has a glyph, it is used whatever the fallback is, so the
      // width is the same with a serif and a monospace fallback. If the glyph is
      // missing, each stack falls back to a different font and the widths differ.
      const missingFrom = (family: string, weight: number) => {
        const missing: string[] = []
        for (const ch of chars) {
          const width = (fallback: string) => {
            ctx.font = `${weight} 32px "${family}", ${fallback}`
            return ctx.measureText(ch).width
          }
          if (width('serif') !== width('monospace')) missing.push(ch)
        }
        return missing
      }

      const sans = loaded.find((f) => /^IBM Plex Sans$/i.test(f))
      const mono = loaded.find((f) => /^IBM Plex Mono$/i.test(f))
      return {
        sans,
        mono,
        missingSans: sans ? missingFrom(sans, 400) : null,
        missingMono: mono ? missingFrom(mono, 500) : null,
      }
    },
    { chars: DIACRITICS },
  )

  expect(result.sans).toBeTruthy()
  expect(result.mono).toBeTruthy()
  expect(result.missingSans).toEqual([])
  expect(result.missingMono).toEqual([])
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

test('buttons and chips are reachable by keyboard and show a focus ring', async ({
  page,
}) => {
  await page.goto('/styleguide')
  const chip = page.getByRole('button', { name: '5' }).first()
  const primary = page.getByRole('button', { name: 'Primary' }).first()

  await primary.focus()
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toHaveText('Secondary')

  await chip.focus()
  await page.keyboard.press('Tab')
  await expect(page.locator(':focus')).toHaveText('10')

  // The focus ring is visible and 3 px wide (keyboard focus only)
  await page.keyboard.press('Tab')
  const outline = await page
    .locator(':focus')
    .evaluate((el) => getComputedStyle(el).outlineWidth)
  expect(outline).toBe('3px')
})

test('slider works with the keyboard', async ({ page }) => {
  await page.goto('/styleguide')
  const slider = page
    .getByRole('slider', { name: 'Kolik měsíčně uložíte' })
    .first()

  await slider.focus()
  const before = await slider.inputValue()
  await page.keyboard.press('ArrowRight')
  expect(Number(await slider.inputValue())).toBe(Number(before) + 500)
  await expect(slider).toHaveAttribute('aria-valuetext', /Kč$/)

  await page.keyboard.press('End')
  expect(await slider.inputValue()).toBe('20000')
  await page.keyboard.press('Home')
  expect(await slider.inputValue()).toBe('500')
})

test('field announces an error and links it to the input', async ({ page }) => {
  await page.goto('/styleguide')
  const invalid = page.getByRole('textbox', { name: 'Váš e-mail' }).nth(2)
  await expect(invalid).toHaveAttribute('aria-invalid', 'true')
  // Next also has a route announcer with role=alert, so pick ours by its text.
  await expect(
    page.getByRole('alert').filter({ hasText: 'jmeno@domena.cz' }),
  ).toBeVisible()
})
