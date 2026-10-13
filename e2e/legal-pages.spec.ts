import { test, expect } from '@playwright/test'

// The footer links, the privacy page (the wireframe's own text with [doplnit]
// gaps) and the 404 page.
test.describe('the footer links', () => {
  test('are four, and go where they say', async ({ page }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    const nav = footer.getByRole('navigation', { name: 'Patička' })
    await expect(nav.getByRole('link')).toHaveText([
      'Jak počítáme',
      'Zásady zpracování',
      'Cookies',
      'Kontakt',
    ])
    await nav.getByRole('link', { name: 'Jak počítáme' }).click()
    await expect(page).toHaveURL(/#jak-pocitame$/)
    await expect(page.locator('#jak-pocitame')).toBeInViewport()
  })

  test('"Zásady zpracování" opens the privacy page @smoke', async ({
    page,
  }) => {
    await page.goto('/')
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Zásady zpracování' })
      .click()
    await expect(page).toHaveURL(/\/zasady$/)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Zásady zpracování osobních údajů',
      }),
    ).toBeVisible()
  })

  test('"Cookies" and "Kontakt" land on their sections of the policy', async ({
    page,
  }) => {
    await page.goto('/')
    const footer = page.getByRole('contentinfo')
    await footer.getByRole('link', { name: 'Cookies' }).click()
    await expect(page).toHaveURL(/\/zasady#cookies$/)
    await expect(page.locator('#cookies')).toBeInViewport()
    await page.goto('/')
    await footer.getByRole('link', { name: 'Kontakt' }).click()
    await expect(page).toHaveURL(/\/zasady#kdo-zpracovava$/)
    await expect(page.locator('#kdo-zpracovava')).toBeInViewport()
  })

  test('the legal line of the form links to the policy', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: 'Zásady zpracování osobních údajů' })
      .click()
    await expect(page).toHaveURL(/\/zasady$/)
  })
})

test.describe('the privacy page /zasady', () => {
  test('has the seven sections and seven gaps, and is not indexed', async ({
    page,
  }) => {
    const response = await page.goto('/zasady')
    expect(response!.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 2 })).toHaveText([
      'Kdo údaje zpracovává',
      'Jaké údaje zpracováváme',
      'Proč a na jakém základě',
      'Jak dlouho',
      'Komu údaje předáváme',
      'Vaše práva',
      'Cookies',
    ])
    await expect(page.locator('[data-placeholder]')).toHaveCount(7)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    )
    await expect(page).toHaveTitle(/Zásady zpracování/)
  })

  test('the contents list jumps to a section', async ({ page }) => {
    await page.goto('/zasady')
    await page
      .getByRole('navigation', { name: 'Obsah' })
      .getByRole('link', { name: 'Vaše práva' })
      .click()
    await expect(page).toHaveURL(/#vase-prava$/)
    await expect(page.locator('#vase-prava')).toBeInViewport()
  })

  test('the header links lead back to the landing page sections', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/zasady')
    await page
      .getByRole('navigation', { name: 'Hlavní nabídka' })
      .getByRole('link', { name: 'Časté dotazy' })
      .click()
    await expect(page).toHaveURL(/\/#caste-dotazy$/)
    await expect(page.locator('#caste-dotazy')).toBeInViewport()
  })

  test('the phone menu works here too, and nothing is wider than the screen', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/zasady')
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    )
    expect(scrollWidth).toBeLessThanOrEqual(375)
    await page.getByRole('button', { name: 'Menu' }).click()
    await page
      .getByRole('dialog')
      .getByRole('link', { name: 'Poslat mi srovnání' })
      .click()
    await expect(page).toHaveURL(/\/#formular$/)
  })

  test('the phone menu legal links open the policy', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page
      .getByRole('dialog')
      .getByRole('link', { name: 'Zásady zpracování' })
      .click()
    await expect(page).toHaveURL(/\/zasady$/)
  })
})

test.describe('the 404 page', () => {
  test('is a real 404 with the drawn text, the button and the link', async ({
    page,
  }) => {
    const response = await page.goto('/tahle-stranka-neexistuje')
    expect(response!.status()).toBe(404)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Tuhle stránku jsme nenašli',
      }),
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Jak počítáme' }).first(),
    ).toBeVisible()
    await page.getByRole('link', { name: 'Zpět na úvod' }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Americké indexy z Česka',
    )
  })
})

test.describe('cookies today', () => {
  test('the landing page and the policy set no cookies at all, which the policy relies on', async ({
    page,
    context,
  }) => {
    await page.goto('/')
    await page.goto('/zasady')
    expect(await context.cookies()).toEqual([])
  })
})
