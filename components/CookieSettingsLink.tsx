'use client'

import { OPEN_COOKIE_SETTINGS } from './CookieConsent'

// Reopens the cookie consent banner so visitors can change their choice.
export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS))}>
      Cookie Settings
    </button>
  )
}
