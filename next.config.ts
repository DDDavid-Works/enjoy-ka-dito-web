import type { NextConfig } from 'next'
import { optimizedImagePatterns } from './lib/images'
import { LEGACY_PAGE_REDIRECTS } from './lib/legacy-redirects'

// Sends www.<site> to the bare domain set in NEXT_PUBLIC_SITE_URL, keeping the path and query,
// so search engines see one address. Does nothing when the site URL is localhost, an IP or already www.
function wwwRedirects() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) return []
  const { origin, hostname } = new URL(siteUrl)
  if (hostname.startsWith('www.') || !hostname.includes('.') || /^[\d.]+$/.test(hostname)) return []
  return [
    {
      source: '/:path*',
      has: [{ type: 'host' as const, value: `www.${hostname}` }],
      destination: `${origin}/:path*`,
      permanent: true,
    },
  ]
}

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
    return [
      ...wwwRedirects(),
      ...LEGACY_PAGE_REDIRECTS.map(([source, destination]) => ({ source, destination, permanent: true })),
    ]
  },
}

export default nextConfig
