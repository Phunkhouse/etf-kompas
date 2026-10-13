import { test, expect, type Page } from '@playwright/test'

// Rev. 5 (note 0041): both variants share one layout and differ only in the h1.
// Variant b says how much a saver can lose by choosing the wrong broker, and is
// served only when there is a saving to name (two brokers with verified prices);
// the real data has that now. Every other visitor, and every unknown value of v,
// gets the neutral question (variant a). The page says which one it showed.
const headlineA = /^Americké indexy z Česka: u koho je koupíte a za kolik\?$/
const headlineB =
  /^U stejného fondu můžete zbytečně zaplatit až (\d{1,3}(?:\s\d{3})*)\sKč\. Kde\?$/

async function expectLayout(page: Page) {
  await expect(page.getByRole('table', { name: 'Cena fondů' })).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Spočítat, kolik mě to bude stát' }),
  ).toBeVisible()
}

async function expectA(page: Page) {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(headlineA)
  await expect(page.getByRole('main')).toHaveAttribute('data-variant', 'a')
  await expect(page.getByTestId('hero-note')).not.toContainText(
    'Částka v nadpisu',
  )
  await expectLayout(page)
}

test.describe('hero variants (?v=a and ?v=b)', () => {
  test('the default is variant a', async ({ page }) => {
    await page.goto('/')
    await expectA(page)
  })

  test('?v=a shows variant a', async ({ page }) => {
    await page.goto('/?v=a')
    await expectA(page)
  })

  for (const value of ['zzz', 'B', '', 'b%20']) {
    test(`an unknown value (?v=${value}) falls back to variant a`, async ({
      page,
    }) => {
      await page.goto(`/?v=${value}`)
      await expectA(page)
    })
  }

  test('?v=b shows the saving headline, and says the setting it is for @smoke', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toHaveText(headlineB)
    await expect(page.getByRole('main')).toHaveAttribute('data-variant', 'b')
    await expect(page.getByTestId('hero-note')).toContainText(
      /Částka v nadpisu: 3\s000\sKč měsíčně, 10 let, odhad bez českých daní a inflace\./,
    )
    await expectLayout(page)
  })

  test('the amount in the b headline is the amount of the green saving box', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    const headline = (await page
      .getByRole('heading', { level: 1 })
      .textContent())!
    const inHeadline = headline.match(/až (.+?)\. Kde/)![1].replace(/\s/g, ' ')
    const box = (await page.getByText(/ponecháte až/).textContent())!
    expect(box.replace(/\s/g, ' ')).toContain(inHeadline)
  })

  test('?v=b never shows the placeholder "X XXX"', async ({ page }) => {
    await page.goto('/?v=b')
    await expect(page.getByText(/X\sXXX/)).toHaveCount(0)
  })

  test('?v=b keeps the UTM parameters in the address bar', async ({ page }) => {
    await page.goto('/?v=b&utm_source=instagram&fbclid=abc')
    await expect(page.getByRole('main')).toHaveAttribute('data-variant', 'b')
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
