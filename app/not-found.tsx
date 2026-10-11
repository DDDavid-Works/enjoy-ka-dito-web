import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <main style={{ padding: '160px 24px 120px', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-primary-light)', letterSpacing: '0.12em', fontSize: 13, margin: 0 }}>404</p>
      <h1 style={{ margin: '12px 0', color: 'var(--color-primary)' }}>We couldn&rsquo;t find that page.</h1>
      <p>The link may be old or the tour may no longer be available.</p>
      <p>
        <Link href="/tour-packages" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Browse tour packages
        </Link>
        {' · '}
        <Link href="/" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
          Back to home
        </Link>
      </p>
    </main>
  )
}
