import { test, expect } from '@playwright/test'

// The calculator band on the landing page uses the real, verified data.
test.describe('landing page calculator', () => {
  test('the hero button jumps to the calculator @smoke', async ({ page }) => {
    await page.goto('/?v=b')
    await page.getByRole('link', { name: /Spočítat, kolik zaplatím/ }).click()
    await expect(page).toHaveURL(/#spocitat$/)
    const section = page.getByRole('region', { name: 'Kolik to u vás dělá?' })
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

  test('says the American fund is cheaper, and where it cannot be bought', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    const section = page.locator('#spocitat')
    await expect(section.getByText(/zaplatíte méně\so/)).toBeVisible()
    await expect(section.getByText(/Je americký fond levnější/)).toBeVisible()
    await expect(section.getByText(/nekoupíte u 3 z 5 firem/)).toBeVisible()
  })

  test('states the return as an example, not a promise', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.locator('#spocitat').getByText(/Je to příklad, ne slib/),
    ).toBeVisible()
  })
})
