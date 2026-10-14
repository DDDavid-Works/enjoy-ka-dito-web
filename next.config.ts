import type { NextConfig } from 'next'
import { OPTIMIZED_IMAGE_HOSTS } from './lib/images'

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: OPTIMIZED_IMAGE_HOSTS.map((hostname) => ({ protocol: 'https' as const, hostname, pathname: '/wp-content/uploads/**' })),
    // Optimized images are reused for a month instead of the 60 second default.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
}

export default nextConfig
