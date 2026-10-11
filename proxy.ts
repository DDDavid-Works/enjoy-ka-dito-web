import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

// Package pages for slugs we haven't prerendered start streaming before the page can call notFound(),
// which would answer a missing tour with HTTP 200. Checking the slug here returns a real 404 instead.
export async function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/')[2]

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
  matcher: '/tour-packages/:slug',
}
