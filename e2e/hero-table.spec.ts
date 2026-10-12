import { test, expect } from '@playwright/test'

// Hero b on the real data (wireframe rev. 4): four twins with fee and type, and
// the muted line under the table.
test.describe('hero b table', () => {
  test('has four funds with three columns', async ({ page }) => {
    await page.goto('/?v=b')
    const table = page.getByRole('table', {
      name: 'Roční poplatek a typ fondu',
    })
    await expect(table.getByRole('columnheader')).toHaveText([
      'Co koupíte',
      'Roční poplatek',
      'Typ',
    ])
    // the header row and four funds
    await expect(table.getByRole('row')).toHaveCount(5)
  })

  test('shows Acc for CSPX and Dist for EQQQ @smoke', async ({ page }) => {
    await page.goto('/?v=b')
    const cspx = page.getByRole('row', { name: /značka CSPX/ })
    await expect(cspx.getByText('Acc')).toBeVisible()
    const eqqq = page.getByRole('row', { name: /značka EQQQ/ })
    await expect(eqqq.getByText('Dist')).toBeVisible()
  })

  test('the muted line names where CSPX is sold and says when it was verified', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    const line = page.getByTestId('hero-note')
    await expect(line).toContainText(/CSPX: .*DEGIRO/)
    await expect(line).toContainText(/ověřeno k \d+\.\s2026/)
    await expect(line).toContainText(/VOO a QQQ u většiny brokerů nekoupíte/)
  })

  test('says nothing like "nejlevnější"', async ({ page }) => {
    await page.goto('/?v=b')
    await expect(page.getByText(/nejlevn/i)).toHaveCount(0)
  })
})
