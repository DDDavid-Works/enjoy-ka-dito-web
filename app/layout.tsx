import type { Metadata } from 'next'
import { Suspense } from 'react'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

const clashGrotesk = localFont({
  src: [
    { path: './fonts/ClashGrotesk-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ClashGrotesk-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/ClashGrotesk-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-clash-grotesk',
  display: 'swap',
})

const generalSans = localFont({
  src: [
    { path: './fonts/GeneralSans-400.woff2', weight: '400', style: 'normal' },
    { path: './fonts/GeneralSans-500.woff2', weight: '500', style: 'normal' },
    { path: './fonts/GeneralSans-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-general-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Enjoy Ka Dito',
  description: 'Your Philippine-based travel partner for more meaningful local and international adventures.',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${clashGrotesk.variable} ${generalSans.variable}`}>
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
