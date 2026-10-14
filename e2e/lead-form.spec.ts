import { test, expect } from '@playwright/test'
import { randomEmail, randomIp } from './lead-helpers'

// The e-mail form (SPEC §3.3). A valid address is stored (in memory in e2e) and the
// page says so. It works with and without JavaScript. Each test is its own visitor
// (its own IP), so the rate limit of one test does not reach another.
const field = { name: 'Váš e-mail' }
const send = { name: 'Poslat mi srovnání' }
const invalidText = 'Zadejte e-mail ve tvaru jmeno@domena.cz.'
const doneText = 'Hotovo. Váš e-mail jsme uložili.'

test.beforeEach(async ({ context }) => {
  await context.setExtraHTTPHeaders({ 'x-forwarded-for': randomIp() })
})

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

  test('a valid address is stored and the page says so @smoke', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await page.getByRole('textbox', field).fill(randomEmail())
    await page.getByRole('button', send).click()
    await expect(page.getByText(doneText)).toBeVisible()
    await expect(page.getByRole('textbox', field)).toHaveCount(0)
  })

  test('the tips box is unticked by default', async ({ page }) => {
    await page.goto('/?v=b')
    await expect(
      page.getByRole('checkbox', { name: /tip k investování/ }),
    ).not.toBeChecked()
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

  test('a valid address posts and the page says it is stored', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await page.getByRole('textbox', field).fill(randomEmail())
    await page.getByRole('button', send).click()
    await expect(page.getByText(doneText)).toBeVisible()
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
