'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Tour Packages', to: '/tour-packages' },
  { label: 'Travel Services', to: '/travel-services' },
  { label: 'About Us', to: '/about-us' },
  { label: 'Contact Us', to: '/contact-us' },
]

// Matches react-router's NavLink: exact for '/', prefix match for the rest.
function isActive(pathname: string, to: string) {
  return to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`)
}

export default function Header() {
  const pathname = usePathname()
  // Menu is open only for the path it was opened on, so navigating closes it.
  const [openPath, setOpenPath] = useState<string | null>(null)
  const menuOpen = openPath === pathname
  // The logo badge hangs below the bar at the top of the page and tucks into it once scrolled.
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        <img src="/images/logo-square.png" alt="Enjoy Ka Dito" />
        <span className={styles.logoCompany}>by: MCP Greenery Travel and Tours</span>
      </Link>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            href={link.to}
            className={isActive(pathname, link.to) ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/request-a-quote" className={styles.ctaMobile}>
          Request a Quote
        </Link>
      </nav>

      <Link href="/request-a-quote" className={styles.cta}>
        Request a Quote
      </Link>

      <button
        type="button"
        className={styles.menuToggle}
        onClick={() => setOpenPath(menuOpen ? null : pathname)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        <span className={`${styles.menuIcon} ${menuOpen ? styles.menuIconOpen : ''}`} />
      </button>
    </header>
  )
}
