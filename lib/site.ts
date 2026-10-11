// Public origin of this site, used for canonical URLs, the sitemap and Open Graph tags.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:7501').replace(/\/$/, '')
export const SITE_NAME = 'Enjoy Ka Dito'

// Package images may be stored as site-relative paths ("/images/x.jpg") or full URLs.
export function absoluteUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
