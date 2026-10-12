import { test, expect } from '@playwright/test'

// Hero a (rev. 4): headline, a line under it, the calculator inputs, and a start
// button that takes the visitor to the result.
const startButton = { name: 'Ukázat, kolik mě to bude stát' }

test.describe('hero a on a phone', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('fits 375x667: headline, inputs and the start button, no scrolling', async ({
    page,
  }) => {
    await page.goto('/?v=a')
    const button = page.getByRole('link', startButton)
    await expect(button).toBeVisible()
    const box = await button.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y + box!.height).toBeLessThanOrEqual(667)
    await expect(page.getByRole('slider', { name: /měsíčně/ })).toBeInViewport()
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    )
    expect(scrollWidth).toBeLessThanOrEqual(375)
  })

  test('the result is below the first screen, and the button takes you to it', async ({
    page,
  }) => {
    await page.goto('/?v=a')
    const result = page.locator('#vysledek')
    await expect(result).not.toBeInViewport()
    await page.getByRole('link', startButton).click()
    await expect(page).toHaveURL(/#vysledek$/)
    await expect(result).toBeInViewport()
    await expect(result.getByRole('status').first()).toHaveText(/Kč/)
  })

  test('the inputs in the hero change the result', async ({ page }) => {
    await page.goto('/?v=a')
    const result = page.locator('#vysledek').getByRole('status').first()
    const before = await result.textContent()
    await page.getByRole('button', { name: /20\s*let/ }).click()
    await expect(result).not.toHaveText(before!)
  })

  test('the heading of the band is hidden but still in the page', async ({
    page,
  }) => {
    await page.goto('/?v=a')
    const heading = page.getByRole('heading', {
      name: 'Kolik vás to bude stát?',
    })
    await expect(heading).toHaveCount(1)
    const box = await heading.boundingBox()
    expect(box === null || box.width <= 1).toBe(true)
  })

  test('says it is an example and carries the risk line', async ({ page }) => {
    await page.goto('/?v=a')
    await expect(
      page.getByText('Příklad výpočtu. Investování nese riziko ztráty.'),
    ).toBeVisible()
    await expect(
      page.getByText('Zjistěte to za 20 sekund. Zdarma, bez registrace.'),
    ).toBeVisible()
  })
})

test.describe('hero a on desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('has no start button: the result is next to the inputs @smoke', async ({
    page,
  }) => {
    await page.goto('/?v=a')
    await expect(page.getByRole('link', startButton)).toBeHidden()
    await expect(page.locator('#vysledek')).toBeInViewport()
  })
})
