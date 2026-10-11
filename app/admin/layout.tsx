import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthProvider } from '@/context/AuthContext'
import AdminGuard from '@/components/AdminGuard'

// Keep the CMS out of search results (robots.txt also disallows /admin).
export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <AuthProvider>
      {/* Client pages read route params and the query string, which need a Suspense boundary. */}
      <Suspense>
        <AdminGuard>{children}</AdminGuard>
      </Suspense>
    </AuthProvider>
  )
}
