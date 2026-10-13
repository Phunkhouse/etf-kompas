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
      'Poplatek*',
      'Typ',
    ])
    // the header row and four funds
    await expect(table.getByRole('row')).toHaveCount(5)
  })

  test('shows Acc for CSPX and Dist for EQQQ @smoke', async ({ page }) => {
    await page.goto('/?v=b')
    const cspx = page.getByRole('row', { name: /iShares CSPX/ })
    await expect(cspx.getByText('Acc')).toBeVisible()
    const eqqq = page.getByRole('row', { name: /Invesco EQQQ/ })
    await expect(eqqq.getByText('Dist')).toBeVisible()
  })

  test('the short line says how many known brokers there are and when it was verified', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    const line = page.getByTestId('hero-note')
    await expect(line).toBeVisible()
    await expect(line).toContainText(/CSPX: 5 známých brokerů/)
    await expect(line).toContainText(/ověřeno k \d+\.\s2026/)
    // the names and the American funds are not in the short line
    await expect(line).not.toContainText(/DEGIRO/)
    await expect(line).not.toContainText(/nekoupíte/)
  })

  test('on a phone the names are in a note after the callout; on desktop that note is hidden', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/?v=a')
    const detail = page.getByTestId('hero-detail')
    await expect(detail).toContainText(
      /Brokeři: DEGIRO, Fio e-Broker, Interactive Brokers, Trading 212, XTB\./,
    )
    await expect(detail).toContainText(/Jen cena a dostupnost, ne výnosy\./)
    if (isMobile) {
      await expect(detail).toBeVisible()
      const callout = await page.getByRole('note').boundingBox()
      const note = await detail.boundingBox()
      expect(note!.y).toBeGreaterThan(callout!.y + callout!.height - 1)
    } else {
      await expect(detail).toBeHidden()
    }
  })

  test('has the callout and no second link under the button', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await expect(page.getByRole('note')).toContainText(
      /Americké fondy \(VOO, QQQ\) u většiny brokerů z Česka nekoupíte/,
    )
    await expect(
      page.getByRole('link', { name: /nebo rovnou srovnání/ }),
    ).toHaveCount(0)
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

  test('on desktop the short line also says "jen cena a dostupnost, ne výnosy"; on a phone that is in the note', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/?v=a')
    const tail = page.getByText(/jen cena a dostupnost, ne výnosy/)
    await expect(tail.first()).toBeAttached()
    if (!isMobile) {
      await expect(page.getByTestId('hero-note')).toContainText(
        /jen cena a dostupnost, ne výnosy/,
      )
      await expect(page.getByTestId('hero-note')).toBeVisible()
    }
  })

  test('variant b shows the setting of its amount once on any screen, never twice', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await expect(
      page.getByText(/Částka v nadpisu/).locator('visible=true'),
    ).toHaveCount(1)
  })

  test('the default variant has the same table and muted line', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.getByRole('table', { name: 'Cena fondů' })).toBeVisible()
    await expect(page.getByTestId('hero-note')).toContainText(
      /CSPX: 5 známých brokerů/,
    )
  })

  test('says nothing like "nejlevnější"', async ({ page }) => {
    await page.goto('/?v=b')
    await expect(page.getByText(/nejlevn/i)).toHaveCount(0)
  })
})
