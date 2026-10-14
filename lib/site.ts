// Public origin of this site, used for canonical URLs, the sitemap and Open Graph tags.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:7501').replace(/\/$/, '')
export const SITE_NAME = 'Enjoy Ka Dito'

// Package images may be stored as site-relative paths ("/images/x.jpg") or full URLs.
export function absoluteUrl(path: string) {
  return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

// Search results cut descriptions at roughly 155-160 characters: trim at a word boundary instead.
export function toMetaDescription(text: string, max = 155) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, '')}…`
}
