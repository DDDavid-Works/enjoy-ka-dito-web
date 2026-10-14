import type { NextConfig } from 'next'
import { optimizedImagePatterns } from './lib/images'
import { LEGACY_PAGE_REDIRECTS } from './lib/legacy-redirects'

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: optimizedImagePatterns(),
    // Optimized images are reused for a month instead of the 60 second default.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return LEGACY_PAGE_REDIRECTS.map(([source, destination]) => ({ source, destination, permanent: true }))
  },
}

export default nextConfig
