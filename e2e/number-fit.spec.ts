import { test, expect } from '@playwright/test'

// The big cost number must fit its column at every width, also with the largest
// numbers the calculator can show (20 000 Kč a month, 20 years). Found on a
// 1068 px screen, where the number ran under the form card.
const WIDTHS = [
  375, 414, 600, 768, 820, 900, 1024, 1068, 1180, 1280, 1440, 1920,
]

for (const width of WIDTHS) {
  test(`the number fits its column at ${width} px, at both ends of the slider`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const band = page.locator('#spocitat')
    await band.scrollIntoViewIfNeeded()

    const measure = () =>
      band.evaluate((section) => {
        const status = section.querySelector('[role="status"]')!
        // the visible number is the element before the screen-reader copy
        const visible = status.previousElementSibling as HTMLElement
        const range = document.createRange()
        range.selectNodeContents(visible)
        const text = range.getBoundingClientRect()
        const box = visible.getBoundingClientRect()
        const form = document
          .getElementById('formular')!
          .getBoundingClientRect()
        return {
          text: visible.textContent,
          textRight: text.right,
          boxRight: box.right,
          formLeft: form.left,
          // the form is beside the number only when it starts to the right of it
          formBeside: form.left > box.left + 40,
          fits: visible.scrollWidth <= visible.clientWidth + 1,
          viewport: document.documentElement.clientWidth,
        }
      })

    for (const setting of [
      { monthly: '3000', years: /^10\s*let/ },
      { monthly: '20000', years: /^20\s*let/ },
    ]) {
      await band.getByRole('slider', { name: /měsíčně/ }).fill(setting.monthly)
      await band.getByRole('button', { name: setting.years }).click()
      // the number swaps in; wait for the animation to finish
      await page.waitForTimeout(400)
      const m = await measure()
      expect(m.fits, `"${m.text}" is wider than its column`).toBe(true)
      expect(
        m.textRight,
        `"${m.text}" runs past the screen`,
      ).toBeLessThanOrEqual(m.viewport)
      if (m.formBeside) {
        expect(
          m.textRight,
          `"${m.text}" runs under the form card`,
        ).toBeLessThanOrEqual(m.formLeft - 4)
      }
    }
  })
}
