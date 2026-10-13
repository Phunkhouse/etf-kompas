import { test, expect } from '@playwright/test'

// Design review of 2026-10-13: the built page follows the drawings for the header,
// the "Za co platíte" cards, the green saving box and the footer logo. Checked as
// geometry and computed style, not as pixels (fonts differ between machines).

test.describe('header', () => {
  test('has a thin line under it and a logo about 100 px wide @smoke', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByRole('banner')).toHaveCSS(
      'border-bottom-width',
      '1px',
    )
    const box = await page
      .getByRole('banner')
      .getByRole('img', { name: 'ETF Kompas' })
      .boundingBox()
    expect(box!.width).toBeGreaterThan(90)
    expect(box!.width).toBeLessThanOrEqual(115)
  })
})

test.describe('"Za co platíte, aniž to vidíte" cards', () => {
  test('on a phone the title sits to the right of the number and the card is flat', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'phone layout')
    await page.goto('/')
    const card = page
      .getByRole('region', { name: 'Za co platíte, aniž to vidíte' })
      .getByRole('listitem')
      .nth(1)
    const cardBox = (await card.boundingBox())!
    const titleBox = (await card
      .getByRole('heading', { level: 3 })
      .boundingBox())!
    expect(titleBox.x - cardBox.x).toBeGreaterThan(40)
    expect(cardBox.height).toBeLessThanOrEqual(120)
  })
})

test.describe('green saving box', () => {
  test('has the label in capitals, and only the amount in green', async ({
    page,
  }) => {
    await page.goto('/')
    const label = page.getByText('Při vašem nastavení')
    await expect(label).toBeVisible()
    await expect(label).toHaveCSS('text-transform', 'uppercase')
    const heading = page.getByText(/ponecháte až/)
    const amount = heading.locator('strong')
    await expect(amount).toBeVisible()
    const colours = await Promise.all([
      heading.evaluate((e) => getComputedStyle(e).color),
      amount.evaluate((e) => getComputedStyle(e).color),
    ])
    expect(colours[0]).not.toBe(colours[1])
  })
})

test.describe('footer', () => {
  test('starts with the logo @smoke', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('contentinfo').getByRole('img', { name: 'ETF Kompas' }),
    ).toBeVisible()
  })
})

test.describe('hero table', () => {
  test('has no second link under the button on any variant', async ({
    page,
  }) => {
    for (const path of ['/', '/?v=a', '/?v=b']) {
      await page.goto(path)
      await expect(
        page.getByRole('link', { name: /nebo rovnou srovnání/ }),
      ).toHaveCount(0)
    }
  })
})
