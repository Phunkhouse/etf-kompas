import { test, expect, type Page } from '@playwright/test'

// Both heroes have the rev. 4 headline; they differ by layout (rev. 4): hero a
// has the calculator inputs and a start button, hero b has the table.
const headline = /^Americké indexy z Česka: u koho je koupíte a za kolik\?$/
const startButton = { name: 'Ukázat, kolik mě to bude stát' }

async function expectHeroA(page: Page) {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(headline)
  await expect(page.getByRole('link', startButton)).toHaveCount(1)
  await expect(page.getByRole('table')).toHaveCount(0)
}

async function expectHeroB(page: Page) {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(headline)
  await expect(page.getByRole('table')).toHaveCount(1)
  await expect(page.getByRole('link', startButton)).toHaveCount(0)
}

test.describe('hero variants (?v=a and ?v=b)', () => {
  test('the default is hero a', async ({ page }) => {
    await page.goto('/')
    await expectHeroA(page)
  })

  test('?v=a shows hero a', async ({ page }) => {
    await page.goto('/?v=a')
    await expectHeroA(page)
  })

  test('?v=b shows hero b @smoke', async ({ page }) => {
    await page.goto('/?v=b')
    await expectHeroB(page)
  })

  for (const value of ['zzz', 'B', '', 'b%20']) {
    test(`an unknown value (?v=${value}) falls back to hero a`, async ({
      page,
    }) => {
      await page.goto(`/?v=${value}`)
      await expectHeroA(page)
    })
  }

  test('?v=b keeps the UTM parameters in the address bar', async ({ page }) => {
    await page.goto('/?v=b&utm_source=instagram&fbclid=abc')
    await expectHeroB(page)
    const url = new URL(page.url())
    expect(url.pathname).toBe('/')
    expect(url.searchParams.get('utm_source')).toBe('instagram')
    expect(url.searchParams.get('fbclid')).toBe('abc')
  })

  test('both variants are noindex', async ({ page }) => {
    for (const path of ['/', '/?v=b']) {
      await page.goto(path)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        /noindex/,
      )
    }
  })
})
