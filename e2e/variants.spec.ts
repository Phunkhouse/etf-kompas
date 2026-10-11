import { test, expect } from '@playwright/test'

const headlineA = /Kolik z vašich peněz sní poplatky fondu\?/
const headlineB = /Americký, nebo evropský fond\? Co vás stojí víc\?/

test.describe('hero variants (?v=a and ?v=b)', () => {
  test('the default is hero a', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(headlineA)
  })

  test('?v=a shows hero a', async ({ page }) => {
    await page.goto('/?v=a')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(headlineA)
  })

  test('?v=b shows hero b @smoke', async ({ page }) => {
    await page.goto('/?v=b')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(headlineB)
  })

  for (const value of ['zzz', 'B', '', 'b%20']) {
    test(`an unknown value (?v=${value}) falls back to hero a`, async ({
      page,
    }) => {
      await page.goto(`/?v=${value}`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        headlineA,
      )
    })
  }

  test('?v=b keeps the UTM parameters in the address bar', async ({ page }) => {
    await page.goto('/?v=b&utm_source=instagram&fbclid=abc')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(headlineB)
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
