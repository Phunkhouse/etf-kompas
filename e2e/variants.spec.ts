import { test, expect, type Page } from '@playwright/test'

// Rev. 5 (note 0041): both variants share one layout and differ only in the h1.
// The b headline needs two brokers with verified prices; the real data has one, so
// until then every visitor gets the a headline, and the page says which it showed.
const headlineA = /^Americké indexy z Česka: u koho je koupíte a za kolik\?$/

async function expectOneLayout(page: Page) {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(headlineA)
  await expect(page.getByRole('table', { name: 'Cena fondů' })).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Spočítat, kolik mě to bude stát' }),
  ).toBeVisible()
  await expect(page.getByRole('main')).toHaveAttribute('data-variant', 'a')
}

test.describe('hero variants (?v=a and ?v=b)', () => {
  test('the default is variant a', async ({ page }) => {
    await page.goto('/')
    await expectOneLayout(page)
  })

  test('?v=a shows variant a', async ({ page }) => {
    await page.goto('/?v=a')
    await expectOneLayout(page)
  })

  test('?v=b shows the one layout, and the a headline while b is not allowed @smoke', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await expectOneLayout(page)
  })

  for (const value of ['zzz', 'B', '', 'b%20']) {
    test(`an unknown value (?v=${value}) falls back to variant a`, async ({
      page,
    }) => {
      await page.goto(`/?v=${value}`)
      await expectOneLayout(page)
    })
  }

  test('?v=b keeps the UTM parameters in the address bar', async ({ page }) => {
    await page.goto('/?v=b&utm_source=instagram&fbclid=abc')
    await expectOneLayout(page)
    const url = new URL(page.url())
    expect(url.pathname).toBe('/')
    expect(url.searchParams.get('utm_source')).toBe('instagram')
    expect(url.searchParams.get('fbclid')).toBe('abc')
  })

  test('there is no calculator-first hero any more', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('link', { name: 'Ukázat, kolik mě to bude stát' }),
    ).toHaveCount(0)
    await expect(page.getByText(/Zjistěte to za 20 sekund/)).toHaveCount(0)
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
