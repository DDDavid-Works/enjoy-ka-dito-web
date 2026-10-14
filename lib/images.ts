// Remote images Next.js may resize and compress (also listed in next.config.ts):
//  - photos uploaded through the admin, which the API serves at <API>/media/<id>
//  - older package photos on the WordPress site (wp-content), until that site is retired
const WORDPRESS_HOSTS = ['enjoykadito.com', 'www.enjoykadito.com']

function apiHost() {
  try {
    const { hostname } = new URL(process.env.NEXT_PUBLIC_API_URL ?? '')
    // The optimizer refuses to fetch from localhost/private addresses, so local dev serves those as-is.
    return hostname === 'localhost' || hostname === '127.0.0.1' ? null : hostname
  } catch {
    return null
  }
}

export function optimizedImagePatterns() {
  const api = apiHost()
  return [
    ...WORDPRESS_HOSTS.map((hostname) => ({ protocol: 'https' as const, hostname, pathname: '/wp-content/uploads/**' })),
    ...(api ? [{ protocol: 'https' as const, hostname: api, pathname: '/media/**' }] : []),
  ]
}

// Site images and images from the hosts above are optimized. A package photo from any other host is
// still shown, just as-is, so an admin pasting an unusual image URL never breaks the page.
export function canOptimize(src: string) {
  if (src.startsWith('/')) return true
  try {
    const { protocol, hostname, pathname } = new URL(src)
    if (protocol !== 'https:') return false
    if (WORDPRESS_HOSTS.includes(hostname)) return pathname.startsWith('/wp-content/uploads/')
    return hostname === apiHost() && pathname.startsWith('/media/')
  } catch {
    return false
  }
}
