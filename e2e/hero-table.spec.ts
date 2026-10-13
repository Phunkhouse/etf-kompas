import { test, expect } from '@playwright/test'

// Hero b on the real data (wireframe rev. 4): four twins with fee and type, and
// the muted line under the table.
test.describe('hero b table', () => {
  test('has four funds with three columns', async ({ page }) => {
    await page.goto('/?v=b')
    const table = page.getByRole('table', {
      name: 'Cena fondů',
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

  test('has the callout and the link to the form', async ({ page }) => {
    await page.goto('/?v=b')
    await expect(page.getByRole('note')).toContainText(
      /Americké fondy \(VOO, QQQ\) u většiny brokerů z Česka nekoupíte/,
    )
    await expect(
      page.getByRole('link', { name: 'nebo rovnou srovnání brokerů' }),
    ).toHaveAttribute('href', '#formular')
  })

  test('the card header names the source and the top bar says brokers', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/?v=b')
    await expect(
      page.getByText(/Čísla ze stránek fondů a brokerů/),
    ).toBeVisible()
    if (!isMobile) {
      await expect(
        page.getByText(/zdroj: stránky fondů a brokerů/),
      ).toBeVisible()
    }
  })

  test('the muted line ends with "Jen cena a dostupnost, ne výnosy." (variant a; b adds the setting of its amount)', async ({
    page,
  }) => {
    await page.goto('/?v=a')
    await expect(page.getByTestId('hero-note')).toContainText(
      /Jen cena a dostupnost, ne výnosy\.$/,
    )
  })

  test('the default variant has the same table and muted line', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByRole('table', { name: 'Cena fondů' })).toBeVisible()
    await expect(page.getByTestId('hero-note')).toContainText(/CSPX: .*DEGIRO/)
  })

  test('says nothing like "nejlevnější"', async ({ page }) => {
    await page.goto('/?v=b')
    await expect(page.getByText(/nejlevn/i)).toHaveCount(0)
  })
})
