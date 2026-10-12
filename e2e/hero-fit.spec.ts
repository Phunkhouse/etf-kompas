import { test, expect } from '@playwright/test'

// SPEC §22: the hero, including the primary call to action, fits a 375 x 667
// phone screen without scrolling. Checked as geometry, not as a pixel
// screenshot: font rendering differs between macOS and the CI runner.
test.use({ viewport: { width: 375, height: 667 } })

test('hero b fits 375x667 including its button', async ({ page }) => {
  await page.goto('/?v=b')
  const button = page.getByRole('link', { name: /Spočítat, kolik zaplatím/ })
  await expect(button).toBeVisible()

  const box = await button.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y + box!.height).toBeLessThanOrEqual(667)
  // nothing wider than the screen
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  )
  expect(scrollWidth).toBeLessThanOrEqual(375)
})

// Rev. 4 draws the phone headline at 30 px and the desktop one at 54 px
// (note 0039, decision 5). The phone size must still keep the button in view.
test('the hero headline is 30 px on a phone', async ({ page }) => {
  await page.goto('/?v=b')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
    'font-size',
    '30px',
  )
})

test('the hero headline is 54 px on desktop @smoke', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  })
  const page = await context.newPage()
  await page.goto('/?v=b')
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
    'font-size',
    '54px',
  )
  await context.close()
})

test('the table is complete with animations switched off @smoke', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto('/?v=b')
  const rows = page.getByRole('row')
  await expect(rows).toHaveCount(5) // header and four funds
  for (const row of await rows.all()) {
    await expect(row).toHaveCSS('opacity', '1')
  }
  await context.close()
})
