import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { GONE_PAGE_PATHS } from './lib/legacy-redirects'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

// The old WordPress news posts, archives and feeds have no equivalent here. 410 tells search engines they were
// removed on purpose, so they drop out of the index sooner than with a 404. A rewrite can't carry a 410, so the
// proxy answers with a small page of its own that sends visitors on to the tours.
const GONE_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Page removed | Enjoy Ka Dito</title></head><body style="font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 16px;text-align:center;color:#1f2937"><h1>This page is no longer available.</h1><p>It was part of our old website. Our tours and travel services are on the new site.</p><p><a href="/tour-packages">Browse tour packages</a> · <a href="/">Go to the home page</a></p></body></html>`
const GONE_PREFIXES = ['/category/', '/tag/', '/author/', '/wp-content/', '/wp-admin', '/wp-json', '/feed', '/comments/feed']
const WORDPRESS_POST = /^\/\d{4}\/\d{2}(\/\d{2})?(\/|$)/

function isGone(pathname: string) {
  return (
    WORDPRESS_POST.test(pathname) ||
    GONE_PAGE_PATHS.includes(pathname) ||
    GONE_PREFIXES.some((prefix) => pathname === prefix.replace(/\/$/, '') || pathname.startsWith(prefix))
  )
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/tour-packages/')) {
    return isGone(pathname)
      ? new NextResponse(GONE_PAGE, { status: 410, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
      : NextResponse.next()
  }

  // Package pages for slugs we haven't prerendered start streaming before the page can call notFound(),
  // which would answer a missing tour with HTTP 200. Checking the slug here returns a real 404 instead.
  const slug = pathname.split('/')[2]

  try {
    const response = await fetch(`${API_URL}/packages/${encodeURIComponent(slug)}`, { next: { revalidate: 60, tags: ['packages'] } })
    if (response.status === 404) {
      return NextResponse.rewrite(new URL('/not-found-page', request.url), { status: 404 })
    }
  } catch {
    // If the API is unreachable, let the page render rather than turning every tour into a 404.
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/tour-packages/:slug',
    '/:year(\\d{4})/:rest*',
    '/category/:path*',
    '/tag/:path*',
    '/author/:path*',
    '/wp-content/:path*',
    '/wp-admin/:path*',
    '/wp-json/:path*',
    '/feed/:path*',
    '/comments/feed/:path*',
    '/weather-broadcast',
    '/bulletin',
    '/photo-gallery',
    '/let-us-help-you-how',
    '/more/testimonial',
  ],
}
