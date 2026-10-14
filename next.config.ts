import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // Put the page's CSS (about 9 KB) in the HTML instead of three render-blocking
  // files, so the first paint does not wait for them (Lighthouse LCP, note 0042).
  experimental: { inlineCss: true },
  sassOptions: { loadPaths: ['src'] },
  // Lets a phone on the home network open `pnpm dev` via the Mac's IP (dev only, SPEC §12a).
  // Each `*` matches one label of the hostname, so this covers any 192.168.x.y address.
  allowedDevOrigins: ['192.168.*.*'],
  // The PDF route reads the fonts and the logo from disk at request time: tell the
  // build to ship them with it.
  outputFileTracingIncludes: {
    '/srovnani/[token]/pdf': [
      './src/server/pdf/fonts/**/*',
      './public/brand/logo-600w.png',
    ],
  },
  // Hero variants (decision note 0028): `/?v=b` serves the static page /v/b.
  // It has to be a beforeFiles rewrite, because / is an existing page and pages
  // are served before afterFiles rewrites. Any other `v` falls through to `/`.
  // A results link belongs to one person: out of search engines and out of shared
  // caches (SPEC §26).
  async headers() {
    return [
      {
        source: '/srovnani/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      },
      // The links in e-mails belong to one person too (opt-in and unsubscribe).
      ...['/potvrdit/:path*', '/odhlasit/:path*'].map((source) => ({
        source,
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      })),
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'query' as const, key: 'v', value: 'b' }],
          destination: '/v/b',
        },
      ],
    }
  },
}

export default nextConfig
