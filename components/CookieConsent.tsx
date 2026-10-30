'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import styles from './CookieConsent.module.css'

type Choice = 'granted' | 'denied'

const STORAGE_KEY = 'cookie-consent'
const CHOICE_CHANGED = 'cookie-consent-change'
// Fired by the footer's "Cookie Settings" link to show the banner again.
export const OPEN_COOKIE_SETTINGS = 'open-cookie-settings'

// Fallback for this page view when storage is blocked, so the banner still closes.
let memoryChoice: Choice | null = null

function readChoice(): Choice | 'unset' {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'granted' || value === 'denied') return value
  } catch {
    // Storage blocked: use the in-memory choice below.
  }
  return memoryChoice ?? 'unset'
}

function saveChoice(choice: Choice) {
  memoryChoice = choice
  try {
    localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // Private mode or blocked storage: the choice just won't be remembered after this page.
  }
  window.dispatchEvent(new Event(CHOICE_CHANGED))
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CHOICE_CHANGED, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CHOICE_CHANGED, onChange)
  }
}

// Removes the _ga cookies GA set while consent was given, on this host and the parent domain.
function clearAnalyticsCookies() {
  const domains = ['', location.hostname, `.${location.hostname.split('.').slice(-2).join('.')}`]
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim()
    if (!name.startsWith('_ga')) continue
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
    }
  }
}

// Asks before loading Google Analytics, and loads it only once the visitor accepts.
export default function CookieConsent({ gaId }: { gaId: string }) {
  // 'pending' on the server and during hydration, so nothing shows until the stored choice is known.
  const choice = useSyncExternalStore(subscribe, readChoice, () => 'pending' as const)
  const [reopened, setReopened] = useState(false)

  useEffect(() => {
    const reopen = () => setReopened(true)
    window.addEventListener(OPEN_COOKIE_SETTINGS, reopen)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, reopen)
  }, [])

  // GA can rewrite its session cookie while the page unloads after a decline, so clear again on each load.
  useEffect(() => {
    if (choice === 'denied') clearAnalyticsCookies()
  }, [choice])

  function decide(next: Choice) {
    const wasGranted = choice === 'granted'
    saveChoice(next)
    setReopened(false)
    if (next === 'denied' && wasGranted) {
      // GA is already running on this page; clear its cookies and reload so it stops.
      clearAnalyticsCookies()
      location.reload()
    }
  }

  const open = choice === 'unset' || reopened

  return (
    <>
      {choice === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}

      {open && (
        <div className={styles.banner} role="dialog" aria-label="Cookie settings" aria-live="polite">
          <p className={styles.text}>
            We&rsquo;d like to use analytics cookies to understand how visitors use this site. They&rsquo;re only set
            if you accept. <Link href="/privacy-policy#cookies">Learn more</Link>
          </p>
          <div className={styles.buttons}>
            <button type="button" className={styles.decline} onClick={() => decide('denied')}>
              Decline
            </button>
            <button type="button" className={styles.accept} onClick={() => decide('granted')}>
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  )
}
