import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

// Header, footer and chat widget for the public site. The admin area (app/admin) has its own layout.
export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      {/* Reads the URL (active nav link), which must not be part of the shared App Shell. */}
      <Suspense>
        <Header />
      </Suspense>
      {children}
      <Suspense>
        <Footer />
      </Suspense>
      <ChatWidget />
    </>
  )
}
