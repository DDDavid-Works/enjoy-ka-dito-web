import CookieConsent from './CookieConsent'

// Google Analytics 4. Renders nothing until NEXT_PUBLIC_GA_ID (e.g. "G-XXXXXXXXXX") is set at build time.
// With an ID set, GA only loads after the visitor accepts analytics cookies in the consent banner.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID
export const analyticsEnabled = !!GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID)

export default function Analytics() {
  if (!analyticsEnabled) return null
  return <CookieConsent gaId={GA_ID!} />
}
