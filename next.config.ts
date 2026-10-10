import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  sassOptions: { loadPaths: ['src'] },
  // Lets a phone on the home network open `pnpm dev` via the Mac's IP (dev only, SPEC §12a).
  // Each `*` matches one label of the hostname, so this covers any 192.168.x.y address.
  allowedDevOrigins: ['192.168.*.*'],
}

export default nextConfig
