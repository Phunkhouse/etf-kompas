import { test, expect, type Browser } from '@playwright/test'

// Route JavaScript (SPEC §22, decision note 0034). Measured as the
// bytes the browser downloads for scripts (compressed size from the request
// sizes), cold, with no shared cache.
async function scriptBytes(browser: Browser, path: string): Promise<number> {
  const context = await browser.newContext()
  const page = await context.newPage()
  const sizes: number[] = []
  page.on('requestfinished', async (request) => {
    if (request.resourceType() !== 'script') return
    sizes.push((await request.sizes()).responseBodySize)
  })
  await page.goto(path, { waitUntil: 'networkidle' })
  await context.close()
  return sizes.reduce((sum, size) => sum + size, 0)
}

const kb = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`

// What the page's own code adds on top of an empty page. This is the part we
// control. The empty page is a fixed size, measured on 2026-10-11 with Next's own
// 404 page (Next 16.4): it cannot be measured any more, because our 404 page has
// the header with the menu in it. Measure it again when Next is upgraded.
const EMPTY_PAGE = 132.5 * 1024
const OWN_CODE_CEILING = 20 * 1024

test('the page code adds little on top of the framework', async ({
  browser,
}) => {
  for (const path of ['/', '/?v=b']) {
    const total = await scriptBytes(browser, path)
    console.log(
      `JS ${path}: ${kb(total)} (empty page ${kb(EMPTY_PAGE)}, ours ${kb(total - EMPTY_PAGE)})`,
    )
    expect(total - EMPTY_PAGE).toBeLessThanOrEqual(OWN_CODE_CEILING)
  }
})

// The whole route (SPEC §22, decision note 0034). Today it is about 142 KB.
const ROUTE_CEILING = 150 * 1024

for (const path of ['/', '/?v=b']) {
  test(`route JavaScript for ${path} is at most 150 KB gzipped`, async ({
    browser,
  }) => {
    const total = await scriptBytes(browser, path)
    console.log(`JS ${path}: ${kb(total)} of ${kb(ROUTE_CEILING)}`)
    expect(total).toBeLessThanOrEqual(ROUTE_CEILING)
  })
}
