import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

// Header, footer and chat widget for the public site. The admin area (app/admin) has its own layout.
export default function PublicLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
      <Suspense>
        <Footer />
      </Suspense>
      <ChatWidget />
    </>
  )
}
