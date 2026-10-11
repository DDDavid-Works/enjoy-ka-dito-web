import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { SITE_NAME, SITE_URL } from '@/lib/site'

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
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: 'Your Philippine-based travel partner for more meaningful local and international adventures.',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_PH',
    images: [{ url: '/images/hero-islands.jpg' }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${clashGrotesk.variable} ${generalSans.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
