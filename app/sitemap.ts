import type { MetadataRoute } from 'next'
import { getPackages } from '@/lib/packages'
import { SITE_URL } from '@/lib/site'

const STATIC_PATHS = [
  '/',
  '/tour-packages',
  '/travel-services',
  '/about-us',
  '/contact-us',
  '/request-a-quote',
  '/corporate-team-building',
  '/family-senior-tours',
  '/philippines-inbound',
  '/international-tours',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const packages = await getPackages()

  return [
    ...STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path === '/' ? '' : path}` })),
    ...packages.map((pkg) => ({
      url: `${SITE_URL}/tour-packages/${pkg.slug}`,
      lastModified: pkg.updatedAt,
    })),
  ]
}
