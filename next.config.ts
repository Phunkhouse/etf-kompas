import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  sassOptions: { loadPaths: ['src'] },
  // Needed to open the dev server from a real phone on the LAN (SPEC §12a).
  // TODO: set to the developer machine's LAN IP.
  allowedDevOrigins: [],
}

export default nextConfig
