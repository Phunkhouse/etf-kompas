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

const kb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`

// What the page's own code adds on top of an empty page (the 404 page has no
// calculator, no table and no client components of ours). This is the part we
// control; the framework's share is measured by the same run.
const OWN_CODE_CEILING = 20 * 1024

test('the page code adds little on top of the framework', async ({
  browser,
}) => {
  const baseline = await scriptBytes(browser, '/_not-found')
  expect(baseline).toBeGreaterThan(0)
  for (const path of ['/', '/?v=b']) {
    const total = await scriptBytes(browser, path)
    console.log(
      `JS ${path}: ${kb(total)} (empty page ${kb(baseline)}, ours ${kb(total - baseline)})`,
    )
    expect(total - baseline).toBeLessThanOrEqual(OWN_CODE_CEILING)
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
