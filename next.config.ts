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
  // Hero variants (decision note 0028): `/?v=b` serves the static page /v/b.
  // It has to be a beforeFiles rewrite, because / is an existing page and pages
  // are served before afterFiles rewrites. Any other `v` falls through to `/`.
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
