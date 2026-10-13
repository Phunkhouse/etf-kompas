import { test, expect } from '@playwright/test'

test('home page renders the brand and is not indexable @smoke', async ({
  page,
}) => {
  await page.goto('/')
  await expect(
    page.getByRole('banner').getByRole('img', { name: 'ETF Kompas' }),
  ).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  )
})
