// Remote hosts whose images Next.js may resize and compress (also listed in next.config.ts).
// Package photos are uploaded to the WordPress site and are often ~10 MB originals.
export const OPTIMIZED_IMAGE_HOSTS = ['enjoykadito.com', 'www.enjoykadito.com']

// Site images and images from the hosts above are optimized. A package photo from any other host is
// still shown, just as-is, so an admin pasting an unusual image URL never breaks the page.
export function canOptimize(src: string) {
  if (src.startsWith('/')) return true
  try {
    return OPTIMIZED_IMAGE_HOSTS.includes(new URL(src).hostname)
  } catch {
    return false
  }
}
