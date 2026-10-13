import { test, expect } from '@playwright/test'

// The mobile menu and the sticky bar (wireframe rev. 5). Phones only.
test.describe('on a phone (375 x 667)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('the menu opens, shows the links and the button, and closes', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByRole('dialog')).toBeHidden()
    await page.getByRole('button', { name: 'Menu' }).click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog).toBeVisible()
    await expect(
      dialog.getByRole('navigation', { name: 'Stránky' }).getByRole('link'),
    ).toHaveText(['Jak počítáme', 'Odkud máme čísla', 'Časté dotazy'])
    await expect(
      dialog.getByRole('link', { name: 'Poslat mi srovnání' }),
    ).toBeVisible()
    await dialog.getByRole('button', { name: 'Zavřít' }).click()
    await expect(dialog).toBeHidden()
  })

  test('the logo and the button stay where they are when the menu opens and closes', async ({
    page,
  }) => {
    await page.goto('/')
    const centre = async (locator: ReturnType<typeof page.locator>) => {
      const box = await locator.boundingBox()
      return box && { x: box.x, y: box.y + box.height / 2 }
    }
    const logo = page
      .getByRole('banner')
      .getByRole('img', { name: 'ETF Kompas' })
    const menuButton = page.getByRole('button', { name: 'Menu' })
    const logoBefore = await centre(logo)
    const buttonBefore = await centre(menuButton)

    await menuButton.click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    const logoOpen = await centre(
      dialog.getByRole('img', { name: 'ETF Kompas' }),
    )
    const buttonOpen = await centre(
      dialog.getByRole('button', { name: 'Zavřít' }),
    )
    // the logo is on the same line and at the same left edge, the button on the same line
    expect(Math.abs(logoOpen!.y - logoBefore!.y)).toBeLessThanOrEqual(1.5)
    expect(Math.abs(logoOpen!.x - logoBefore!.x)).toBeLessThanOrEqual(1.5)
    expect(Math.abs(buttonOpen!.y - buttonBefore!.y)).toBeLessThanOrEqual(1.5)

    await dialog.getByRole('button', { name: 'Zavřít' }).click()
    expect(await centre(logo)).toEqual(logoBefore)
    expect(await centre(menuButton)).toEqual(buttonBefore)
  })

  test('the source bar above the header is not covered: the panel starts below it', async ({
    page,
  }) => {
    await page.goto('/')
    const bar = page.getByText(/Čísla ze stránek fondů a brokerů/)
    const barBox = await bar.boundingBox()
    await page.getByRole('button', { name: 'Menu' }).click()
    const dialog = page.getByRole('dialog', { name: 'Menu' })
    await expect(dialog).toBeVisible()
    const panel = await dialog.boundingBox()
    // the bar did not move, and the panel begins at or below the bottom of the bar
    expect(await bar.boundingBox()).toEqual(barBox)
    expect(panel!.y).toBeGreaterThanOrEqual(barBox!.y + barBox!.height - 8)
    expect(panel!.y).toBeGreaterThan(0)
  })

  test('the page behind does not scroll while the menu is open', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.mouse.wheel(0, 600)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('opening and closing the menu keeps the scroll position of the page', async ({
    page,
  }) => {
    await page.goto('/')
    // the header is not sticky: the Menu button can be reached only near the top, so
    // scroll a little and click where the button is (a click by element would scroll
    // the page to the button first and hide what is tested)
    await page.evaluate(() => window.scrollTo(0, 20))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(20)
    const box = await page.getByRole('button', { name: 'Menu' }).boundingBox()
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible()
    expect(await page.evaluate(() => window.scrollY)).toBe(20)
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    expect(await page.evaluate(() => window.scrollY)).toBe(20)
  })

  test('a link in the menu closes it and lands on its section', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page
      .getByRole('dialog')
      .getByRole('link', { name: 'Časté dotazy' })
      .click()
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page).toHaveURL(/#caste-dotazy$/)
    await expect(page.locator('#caste-dotazy')).toBeInViewport()
  })

  test('Esc closes the menu', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Menu' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('the sticky bar is not there at the top, so it cannot cover the hero button', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('[data-sticky-bar]')).toBeHidden()
  })

  test('the sticky bar shows once the hero button is gone, and goes to the form', async ({
    page,
  }) => {
    await page.goto('/')
    // The hero button ends at about 690 px and the form starts at about 1620 px:
    // at 900 px the button is gone and the form is not yet in view.
    await page.evaluate(() => window.scrollTo(0, 900))
    const bar = page.locator('[data-sticky-bar]').getByRole('link', {
      name: 'Poslat mi srovnání',
    })
    await expect(bar).toBeVisible()
    const box = await bar.boundingBox()
    expect(box && box.y + box.height).toBeGreaterThan(600)
    await bar.click()
    await expect(page).toHaveURL(/#formular$/)
  })

  test('the sticky bar goes away while the form is in view', async ({
    page,
  }) => {
    await page.goto('/')
    await page.locator('#formular').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-sticky-bar]')).toBeHidden()
  })
})

test.describe('on desktop (1280 x 800)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('there is no menu button and no sticky bar; the links are in the header @smoke', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden()
    await expect(
      page
        .getByRole('navigation', { name: 'Hlavní nabídka' })
        .getByRole('link'),
    ).toHaveCount(3)
    await page.locator('#caste-dotazy').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-sticky-bar]')).toBeHidden()
  })
})
