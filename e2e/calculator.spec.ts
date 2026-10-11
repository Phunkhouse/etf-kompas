import { test, expect } from '@playwright/test'

// The demos on /styleguide use invented fund numbers.
test.describe('calculator', () => {
  test('keyboard changes the result', async ({ page }) => {
    await page.goto('/styleguide')
    const calculator = page
      .locator('[data-tone="dark"]')
      .filter({ has: page.getByRole('slider', { name: /měsíčně/ }) })
      .first()
    const slider = calculator.getByRole('slider', { name: /měsíčně/ }).first()
    const result = calculator.getByRole('status').first()
    await slider.scrollIntoViewIfNeeded()

    const before = await result.textContent()
    await slider.focus()
    await page.keyboard.press('End')
    await expect(slider).toHaveValue('20000')
    await expect(result).not.toHaveText(before!)

    const atMax = await result.textContent()
    await page.keyboard.press('Home')
    await expect(slider).toHaveValue('500')
    await expect(result).not.toHaveText(atMax!)
  })

  test('horizon chips change the result and are reachable by Tab', async ({
    page,
  }) => {
    await page.goto('/styleguide')
    const calculator = page
      .locator('[data-tone="dark"]')
      .filter({ has: page.getByRole('slider', { name: /měsíčně/ }) })
      .first()
    const slider = calculator.getByRole('slider', { name: /měsíčně/ }).first()
    const result = calculator.getByRole('status').first()
    await slider.scrollIntoViewIfNeeded()

    const five = calculator.getByRole('button', { name: /5\s*let/ }).first()
    const twenty = calculator.getByRole('button', { name: /20\s*let/ }).first()
    await expect(
      calculator.getByRole('button', { name: /10\s*let/ }).first(),
    ).toHaveAttribute('aria-pressed', 'true')

    const before = await result.textContent()
    await slider.focus()
    await page.keyboard.press('Tab')
    await expect(five).toBeFocused()
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await expect(twenty).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(twenty).toHaveAttribute('aria-pressed', 'true')
    await expect(result).not.toHaveText(before!)
    await expect(calculator.getByText(/Za 20\s*let/).first()).toBeVisible()
  })

  test('the result is a status region and the page does not scroll sideways', async ({
    page,
  }) => {
    await page.goto('/styleguide')
    await expect(page.getByRole('status').first()).toBeAttached()
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })
})
