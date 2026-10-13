import { test, expect } from '@playwright/test'

// The calculator band on the landing page uses the real, verified data.
test.describe('landing page calculator', () => {
  test('the hero button jumps to the calculator @smoke', async ({ page }) => {
    await page.goto('/?v=b')
    await page
      .getByRole('link', { name: /Spočítat, kolik mě to bude stát/ })
      .click()
    await expect(page).toHaveURL(/#spocitat$/)
    const section = page.getByRole('region', {
      name: 'Kolik vás to bude stát?',
    })
    await expect(section).toBeInViewport()
  })

  test('both variants have the calculator and its result', async ({ page }) => {
    for (const path of ['/', '/?v=b']) {
      await page.goto(path)
      const section = page.locator('#spocitat')
      await expect(
        section.getByRole('slider', { name: /měsíčně/ }),
      ).toBeVisible()
      await expect(section.getByRole('status').first()).toBeVisible()
    }
  })

  test('changing the years changes the result', async ({ page }) => {
    await page.goto('/?v=b')
    const section = page.locator('#spocitat')
    const result = section.getByRole('status').first()
    await section.scrollIntoViewIfNeeded()
    await expect(result).toHaveText(/\d/)
    const before = await result.textContent()
    await section.getByRole('button', { name: /20\s*let/ }).click()
    await expect(result).not.toHaveText(before!)
  })

  test('says the cost at the dearest verified broker, and shows the saving box now that two have prices', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    const section = page.locator('#spocitat')
    await expect(section.getByText(/u ověřených brokerů/)).toBeVisible()
    await expect(section.getByText(/nejvýš/)).toBeVisible()
    // DEGIRO and Trading 212 are priced, so the hide rule is met
    await expect(section.getByText(/ponecháte až/)).toBeVisible()
    await expect(
      section.getByRole('link', {
        name: 'Ukázat, u kterého brokera to koupím',
      }),
    ).toHaveAttribute('href', '#formular')
    await expect(section.getByText(/nejlevn/i)).toHaveCount(0)
  })

  test('moving the slider with the keyboard changes the result', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    const section = page.locator('#spocitat')
    const result = section.getByRole('status').first()
    await section.scrollIntoViewIfNeeded()
    const before = await result.textContent()
    const slider = section.getByRole('slider', { name: /měsíčně/ })
    await slider.focus()
    await slider.press('End')
    await expect(slider).toHaveValue('20000')
    await expect(result).not.toHaveText(before!)
  })

  test('states the return as an example, not a promise', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.locator('#spocitat').getByText(/Je to příklad, ne slib/),
    ).toBeVisible()
  })
})
