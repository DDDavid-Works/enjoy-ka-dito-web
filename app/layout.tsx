import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

export const metadata: Metadata = {
  title: 'Enjoy Ka Dito',
  description: 'Your Philippine-based travel partner for more meaningful local and international adventures.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <head>
        {/* TODO: self-host these with next/font/local once the font files are added */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@600,500,400&f[]=general-sans@400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        {children}
        <Suspense>
          <Footer />
        </Suspense>
        <ChatWidget />
      </body>
    </html>
  )
}
