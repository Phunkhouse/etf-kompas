import { test, expect } from '@playwright/test'

// "Za co platíte, aniž to vidíte" and "Co dostanete e-mailem" (wireframe rev. 4).
for (const path of ['/', '/?v=b']) {
  test.describe(`the explainer sections on ${path}`, () => {
    test('show the three cards, in order', async ({ page }) => {
      await page.goto(path)
      const costs = page.getByRole('region', {
        name: 'Za co platíte, aniž to vidíte',
      })
      await expect(costs.getByRole('heading', { level: 3 })).toHaveText([
        'Roční poplatek fondu',
        'Převod korun',
        'Daň ze zisků',
      ])
      await expect(costs).toContainText('si stáhne zahraničí dřív')
    })

    test('the previews have captions and the button goes to the form', async ({
      page,
    }) => {
      await page.goto(path)
      const preview = page.getByRole('region', {
        name: 'Fondy, brokeři a co z toho koupíte z Česka',
      })
      await expect(preview.getByRole('figure')).toHaveCount(2)
      await expect(preview).toContainText(/Strana 1\s·\sSrovnání/)
      await expect(preview).toContainText(/Strana 4\s·\sDaně/)
      await preview.getByRole('link', { name: 'Poslat mi srovnání' }).click()
      await expect(page).toHaveURL(/#formular$/)
      await expect(
        page.getByRole('textbox', { name: 'Váš e-mail' }),
      ).toBeInViewport()
    })
  })
}

test.describe('on a phone', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('nothing is wider than the screen', async ({ page }) => {
    await page.goto('/?v=b')
    await page
      .getByRole('region', {
        name: 'Fondy, brokeři a co z toho koupíte z Česka',
      })
      .scrollIntoViewIfNeeded()
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    )
    expect(scrollWidth).toBeLessThanOrEqual(375)
  })
})

test('the explainers are on the page without JavaScript @smoke', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/?v=b')
  await expect(
    page.getByRole('region', { name: 'Za co platíte, aniž to vidíte' }),
  ).toBeVisible()
  await context.close()
})
