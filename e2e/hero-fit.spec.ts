import { test, expect } from '@playwright/test'

// SPEC §22: the hero, including the primary call to action, fits a 375 x 667
// phone screen without scrolling. Checked as geometry, not as a pixel
// screenshot: font rendering differs between macOS and the CI runner.
test.use({ viewport: { width: 375, height: 667 } })

for (const path of ['/', '/?v=a', '/?v=b']) {
  test(`the hero on ${path} fits 375x667 including its button`, async ({
    page,
  }) => {
    await page.goto(path)
    const button = page.getByRole('link', {
      name: /Spočítat, kolik mě to bude stát/,
    })
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
}

// The b headline is longer and has the amount in it. The real data cannot serve it
// yet (it needs two priced brokers), so its text is put into the h1 here.
// The text must be changed only after React has hydrated the page: before that,
// React sees a page that differs from its own and rebuilds it, which puts the
// original text back and detaches the button (this failed in CI, where the page
// hydrates more slowly than on a laptop).
test('the hero still fits with the longer b headline', async ({ page }) => {
  await page.goto('/')
  // the calculator's slider is a client component: it is hydrated once React has
  // attached its props to the element
  await page.waitForFunction(() => {
    const slider = document.querySelector('input[type="range"]')
    return (
      slider !== null &&
      Object.keys(slider).some((key) => key.startsWith('__reactProps'))
    )
  })
  // let React finish its pass (two frames), without a fixed sleep
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  const longer =
    'U stejného fondu můžete zbytečně zaplatit až 3\u00a0210\u00a0Kč. Kde?'
  await page.evaluate((text) => {
    document.querySelector('h1')!.textContent = text
  }, longer)
  // the change must stay: a rebuild would put the original headline back
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    longer.replace(/\u00a0/g, ' '),
  )
  const button = page.getByRole('link', {
    name: /Spočítat, kolik mě to bude stát/,
  })
  await expect(button).toBeVisible()
  const box = await button.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.y + box!.height).toBeLessThanOrEqual(667)
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
