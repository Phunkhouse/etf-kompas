import { test, expect } from '@playwright/test'

// The e-mail form (SPEC §3.3). Before Phase 4 nothing is stored or sent, and the
// page says so. It works with and without JavaScript.
const field = { name: 'Váš e-mail' }
const send = { name: 'Poslat mi srovnání' }
const invalidText = 'Zadejte e-mail ve tvaru jmeno@domena.cz.'
const placeholderText =
  'Zkušební provoz: váš e-mail jsme nikam neuložili ani neodeslali.'

test.describe('with JavaScript', () => {
  test('a wrong address shows the error and keeps what was typed', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    const input = page.getByRole('textbox', field)
    await input.fill('jmeno@domena')
    await page.getByRole('button', send).click()
    await expect(page.getByText(invalidText)).toBeVisible()
    await expect(input).toHaveValue('jmeno@domena')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  test('a valid address shows the honest placeholder @smoke', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await page.getByRole('textbox', field).fill('jan@domena.cz')
    await page.getByRole('button', send).click()
    await expect(page.getByText(placeholderText)).toBeVisible()
    await expect(page.getByRole('textbox', field)).toHaveCount(0)
  })

  test('the tips box is unticked by default', async ({ page }) => {
    await page.goto('/?v=b')
    await expect(
      page.getByRole('checkbox', { name: /tip k investování/ }),
    ).not.toBeChecked()
  })

  test('the hero link "nebo rovnou srovnání brokerů" lands on the form', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await page
      .getByRole('link', { name: 'nebo rovnou srovnání brokerů' })
      .click()
    await expect(page).toHaveURL(/#formular$/)
    await expect(page.getByRole('textbox', field)).toBeInViewport()
  })

  test('hero a has the form too', async ({ page }) => {
    await page.goto('/?v=a')
    await expect(page.getByRole('textbox', field)).toBeAttached()
  })
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('a wrong address posts, shows the error and keeps what was typed', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await page.getByRole('textbox', field).fill('jmeno@domena')
    await page.getByRole('button', send).click()
    await expect(page.getByText(invalidText)).toBeVisible()
    await expect(page.getByRole('textbox', field)).toHaveValue('jmeno@domena')
  })

  test('a valid address posts and shows the honest placeholder', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await page.getByRole('textbox', field).fill('jan@domena.cz')
    await page.getByRole('button', send).click()
    await expect(page.getByText(placeholderText)).toBeVisible()
  })
})

test.describe('on desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('the form sits next to the result in the dark band @smoke', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    const band = page.locator('#spocitat')
    await expect(band.locator('#formular')).toBeVisible()
    const result = await band.getByText(/u ověřených brokerů/).boundingBox()
    const form = await page.locator('#formular').boundingBox()
    expect(result && form && form.x > result.x + result.width - 1).toBe(true)
  })
})
