import type { Metadata } from 'next'
import Link from 'next/link'
import AgencyJsonLd from '@/components/AgencyJsonLd'
import CoverImage from '@/components/CoverImage'
import styles from './page.module.css'

const TRUST_BADGES = [
  { icon: '🎫', label: 'IATA-TIDS' },
  { icon: '🛡️', label: 'DOT Accredited' },
  { icon: '✈️', label: 'Airline Accreditations & Partnerships' },
  { icon: '🤝', label: 'Member: ALTTAP, NEATOP, PTCAO' },
]

const GATEWAYS = [
  {
    title: 'Corporate Team Building',
    copy: 'Complete logistics, official invoicing, custom domestic & Asian itineraries, and on-site coordinators for teams of all sizes.',
    button: 'Explore Corporate Packages',
    image: '/images/corporate-team-building.jpg',
    to: '/corporate-team-building',
  },
  {
    title: 'Family & Senior Tours',
    copy: 'Relaxed pacing, private transport, senior-friendly steps, and hassle-free, door-to-door managed itineraries.',
    button: 'View Family Tour Packages',
    image: '/images/family-senior-tours.jpg',
    to: '/family-senior-tours',
  },
  {
    title: 'Inbound Foreigner Packages',
    copy: 'Experience the best of the Philippines with English-speaking guides, vetted hotels, and fully handled inter-island flights & transfers.',
    button: 'Discover the Philippines',
    image: '/images/local-tours.jpg',
    to: '/philippines-inbound',
  },
  {
    title: 'International Tours',
    copy: 'Visa assistance, flights, hotels, and guided itineraries for Filipino travelers heading to Asia and beyond.',
    button: 'Explore International Tours',
    image: '/images/international-tours.jpg',
    to: '/international-tours',
  },
]

export const metadata: Metadata = {
  title: { absolute: 'Enjoy Ka Dito | Philippine Tours and Travel Agency' },
  description:
    'From Philippine getaways to adventures abroad, MCP Greenery Travel and Tours helps you travel with ease, discover new places, and create lasting memories.',
  alternates: { canonical: '/' },
}

export default function Home() {
  return (
    <main>
      <AgencyJsonLd />
      <section className={styles.hero}>
        <CoverImage src="/images/hero-islands.jpg" sizes="100vw" preload behind />
        <div className={styles.heroContent}>
          <p className={styles.badge}>CURATED JOURNEYS · PHILIPPINES &amp; BEYOND</p>
          <h1 className={styles.heroTitle}>Helping You Make More Memories Through Travel</h1>
          <p className={styles.heroSubtext}>
            From Philippine getaways to adventures abroad, MCP Greenery Travel and Tours helps you travel with ease,
            discover new places, and create lasting memories.
          </p>
          <div className={styles.heroActions}>
            <Link href="/tour-packages" className={styles.heroLinkAction}>
              Explore Tour Packages
            </Link>
            <Link href="/request-a-quote" className={styles.heroOutlineAction}>
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.trustStrip}>
        {TRUST_BADGES.map((badge) => (
          <div key={badge.label} className={styles.trustBadge}>
            <span className={styles.trustIcon}>{badge.icon}</span>
            <span>{badge.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.findYourWay}>
        <p className={styles.sectionBadge}>FIND YOUR WAY</p>
        <h2 className={styles.sectionTitle}>Choose your travel experience.</h2>

        <div className={styles.cardGrid}>
          {GATEWAYS.map((item) => (
            <Link
              key={item.title}
              href={item.to}
              className={styles.card}
            >
              <CoverImage src={item.image} sizes="(max-width: 900px) 100vw, 400px" behind />
              <p className={styles.cardTitle}>{item.title}</p>
              <p className={styles.cardCopy}>{item.copy}</p>
              <span className={styles.cardButton}>{item.button}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
