import { test, expect } from '@playwright/test'

// The trust block, the FAQ and the header anchors (wireframe rev. 5).
test.describe('on desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  for (const [link, id] of [
    ['Jak počítáme', 'jak-pocitame'],
    ['Odkud máme čísla', 'odkud-mame-cisla'],
    ['Časté dotazy', 'caste-dotazy'],
  ] as const) {
    test(`the header link "${link}" lands on its section @smoke`, async ({
      page,
    }) => {
      await page.goto('/')
      await page
        .getByRole('navigation', { name: 'Hlavní nabídka' })
        .getByRole('link', { name: link })
        .click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(page.locator(`#${id}`)).toBeInViewport()
    })
  }

  test('the header button lands on the e-mail form', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('banner')
      .getByRole('link', { name: 'Poslat mi srovnání' })
      .click()
    await expect(page).toHaveURL(/#formular$/)
    await expect(
      page.getByRole('textbox', { name: 'Váš e-mail' }),
    ).toBeInViewport()
  })
})

test.describe('the FAQ', () => {
  test('opens and closes a question', async ({ page }) => {
    await page.goto('/')
    const question = page.getByText('Je to zdarma?')
    const answer = page.getByText(/Nedostáváme provize a nic vám neprodáváme/)
    await expect(answer).toBeHidden()
    await question.click()
    await expect(answer).toBeVisible()
    await question.click()
    await expect(answer).toBeHidden()
  })

  test('works without JavaScript @smoke', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false })
    const page = await context.newPage()
    await page.goto('/')
    await page.getByText('Radíte mi, co koupit?').click()
    await expect(page.getByText(/Rozhodnutí je na vás/)).toBeVisible()
    await context.close()
  })

  test('the answer about the American funds comes from the data', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByText('Můžu si americký fond koupit z Česka?').click()
    await expect(
      page.getByText(/máme ověřeno, že VOO a QQQ nenabízí/),
    ).toBeVisible()
    await expect(
      page.getByText('Stejné indexy koupíte v evropské verzi.'),
    ).toBeVisible()
  })
})

test('the trust block lists what is counted and what is not', async ({
  page,
}) => {
  await page.goto('/')
  const item = page.locator('#jak-pocitame')
  await expect(item).toContainText(
    'Počítáme poplatek fondu, převod korun a poplatky brokera.',
  )
  await expect(item).toContainText('Nepočítáme české daně, inflaci')
})

test('nothing is wider than a 375 px screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.locator('#caste-dotazy').scrollIntoViewIfNeeded()
  const scrollWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  )
  expect(scrollWidth).toBeLessThanOrEqual(375)
})
