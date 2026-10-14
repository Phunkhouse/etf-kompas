import { test, expect } from '@playwright/test'

// The cookie bar (Phase 5, PR 1). Every test starts with a fresh context, so no
// choice is stored.
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('cookie bar', () => {
  test('shows on the first visit with accept and reject equally available', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(
      page.getByRole('button', { name: 'Přijmout vše' }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Odmítnout vše' }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Nastavit' })).toBeVisible()
  })

  test('a choice hides the bar and is remembered on the next load', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Odmítnout vše' }).click()
    await expect(
      page.getByRole('button', { name: 'Odmítnout vše' }),
    ).toBeHidden()
    await page.reload()
    await expect(
      page.getByRole('button', { name: 'Odmítnout vše' }),
    ).toBeHidden()
    expect((await page.context().cookies()).map((c) => c.name)).toContain(
      'kompas_consent',
    )
  })

  test('the settings keep both optional switches off and save a choice', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Nastavit' }).click()
    const dialog = page.getByRole('dialog', { name: 'Nastavení cookies' })
    await expect(dialog).toBeVisible()
    await expect(
      dialog.getByRole('switch', { name: 'Měření návštěvnosti' }),
    ).not.toBeChecked()
    await expect(
      dialog.getByRole('switch', { name: 'Reklama a remarketing' }),
    ).not.toBeChecked()
    await dialog.getByRole('switch', { name: 'Měření návštěvnosti' }).check()
    await dialog.getByRole('button', { name: 'Uložit výběr' }).click()
    await expect(dialog).toBeHidden()
    const value = (await page.context().cookies()).find(
      (c) => c.name === 'kompas_consent',
    )?.value
    expect(value).toMatch(/^v1-m1-a0-\d+$/)
  })

  test('the footer link "Cookies" reopens the settings', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Přijmout vše' }).click()
    await page
      .getByRole('navigation', { name: 'Patička' })
      .getByRole('link', { name: 'Cookies' })
      .click()
    const dialog = page.getByRole('dialog', { name: 'Nastavení cookies' })
    await expect(dialog).toBeVisible()
    await expect(page).toHaveURL(/\/$/)
    await expect(
      dialog.getByRole('switch', { name: 'Reklama a remarketing' }),
    ).toBeChecked()
  })
})
