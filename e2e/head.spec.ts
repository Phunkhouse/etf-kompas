import { test, expect } from '@playwright/test'

// Phase 6, PR 3: the site is out of search engines by header AND by tag (SPEC §17.7, §19.5,
// §22 Phase 6), and a shared link shows the title, the description and the share image.
// Written first. `curl -I` on the live site repeats the header check after the deploy.
const PAGES = ['/', '/?v=b', '/zasady', '/styleguide', '/nenalezeno-nic']

test.describe('noindex', () => {
  for (const path of PAGES) {
    test(`${path} has the X-Robots-Tag header and the robots tag`, async ({
      page,
    }) => {
      const response = await page.goto(path)
      expect(response!.headers()['x-robots-tag']).toContain('noindex')
      // the 404 page has two (Next adds its own), so look at the first
      await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
        'content',
        /noindex/,
      )
    })
  }

  test('files and the API carry the header too (it applies to every path)', async ({
    request,
  }) => {
    for (const path of ['/share-image.png', '/icon.svg', '/api/event']) {
      const response = await request.fetch(path)
      expect(response.headers()['x-robots-tag'], path).toContain('noindex')
    }
  })

  test('the results pages keep their own private cache header', async ({
    request,
  }) => {
    const response = await request.get(`/srovnani/${'A'.repeat(43)}`)
    expect(response.headers()['x-robots-tag']).toContain('noindex')
    expect(response.headers()['cache-control']).toContain('private')
  })

  test('robots.txt does not block the pages: the crawler has to read the noindex', async ({
    request,
  }) => {
    const response = await request.get('/robots.txt')
    if (response.ok())
      expect(await response.text()).not.toMatch(/Disallow:\s*\//)
  })
})

test.describe('link preview', () => {
  test('the head has the title, description, language, share image and icons @smoke', async ({
    page,
  }) => {
    await page.goto('/')
    const title = 'ETF Kompas: americké indexy z Česka, u koho je koupíte'
    const description =
      'Srovnání evropských ETF na S&P 500 a Nasdaq 100: poplatky fondů a brokerů v korunách. Česky, na jedné stránce.'
    await expect(page).toHaveTitle(title)
    const meta = (selector: string) =>
      page.locator(selector).getAttribute('content')
    expect(await meta('meta[name="description"]')).toBe(description)
    expect(await meta('meta[property="og:title"]')).toBe(title)
    expect(await meta('meta[property="og:description"]')).toBe(description)
    expect(await meta('meta[property="og:locale"]')).toBe('cs_CZ')
    expect(await meta('meta[property="og:type"]')).toBe('website')
    expect(await meta('meta[property="og:image:width"]')).toBe('1200')
    expect(await meta('meta[property="og:image:height"]')).toBe('630')
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image')
    // chats need an absolute address
    expect(await meta('meta[property="og:image"]')).toMatch(
      /^https?:\/\/.+\/share-image\.png$/,
    )
    await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1)
    await expect(page.locator('link[rel~="icon"]').first()).toBeAttached()
  })

  test('the share image is a 1200 x 630 PNG and the icons are served', async ({
    request,
  }) => {
    const image = await request.get('/share-image.png')
    expect(image.status()).toBe(200)
    expect(image.headers()['content-type']).toBe('image/png')
    const bytes = await image.body()
    expect(bytes.readUInt32BE(16)).toBe(1200)
    expect(bytes.readUInt32BE(20)).toBe(630)
    expect(bytes.length).toBeLessThan(300_000)
    const apple = await request.get('/apple-icon.png')
    expect(apple.status()).toBe(200)
    expect((await apple.body()).readUInt32BE(16)).toBe(180)
  })

  test('the same head on the second hero and on the privacy page', async ({
    page,
  }) => {
    await page.goto('/?v=b')
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
    await page.goto('/zasady')
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
  })
})
