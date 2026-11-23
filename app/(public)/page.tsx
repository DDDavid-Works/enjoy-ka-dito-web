import type { Metadata } from 'next'
import Link from 'next/link'
import AgencyJsonLd from '@/components/AgencyJsonLd'
import CoverImage from '@/components/CoverImage'
import Icon, { type IconName } from '@/components/Icon'
import { HERO_PHOTOS } from '@/lib/hero-photos'
import styles from './page.module.css'

const TRUST_BADGES = [
  { icon: 'ticket', label: 'IATA-TIDS' },
  { icon: 'shield', label: 'DOT Accredited' },
  { icon: 'plane', label: 'Airline Accreditations & Partnerships' },
  { icon: 'members', label: 'Member: ALTTAP, NEATOP, PTCAO' },
] satisfies { icon: IconName; [field: string]: string }[]

const GATEWAYS = [
  {
    title: 'Corporate Team Building',
    copy: 'Complete logistics, official invoicing, custom domestic & Asian itineraries, and on-site coordinators for teams of all sizes.',
    button: 'Explore corporate packages',
    image: '/images/corporate-team-building.jpg',
    to: '/corporate-team-building',
  },
  {
    title: 'Family & Senior Tours',
    copy: 'Relaxed pacing, private transport, senior-friendly steps, and hassle-free, door-to-door managed itineraries.',
    button: 'View family tour packages',
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
    button: 'Explore international tours',
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
        <div className={styles.heroMosaic} aria-hidden="true">
          {HERO_PHOTOS.map(({ src }, index) => (
            <div key={src} className={styles.heroTile}>
              <CoverImage src={src} sizes="(max-width: 900px) 50vw, 25vw" preload={index === 0} />
            </div>
          ))}
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Helping you make more memories through travel</h1>
          <p className={styles.heroSubtext}>
            From Philippine getaways to adventures abroad, MCP Greenery Travel and Tours helps you travel with ease,
            discover new places, and create lasting memories.
          </p>
          <div className={styles.heroActions}>
            <Link href="/tour-packages" className={styles.heroLinkAction}>
              Explore tour packages
            </Link>
            <Link href="/request-a-quote" className={styles.heroOutlineAction}>
              Request a quote
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.trustStrip}>
        {TRUST_BADGES.map((badge) => (
          <div key={badge.label} className={styles.trustBadge}>
            <span className={styles.trustIcon}><Icon name={badge.icon} /></span>
            <span>{badge.label}</span>
          </div>
        ))}
      </section>

      <section className={styles.findYourWay}>
        <h2 className={styles.sectionTitle}>Choose your travel experience.</h2>

        <div className={styles.cardGrid}>
          {GATEWAYS.map((item) => (
            <Link
              key={item.title}
              href={item.to}
              className={styles.card}
            >
              <CoverImage src={item.image} alt={item.title} sizes="(max-width: 900px) 100vw, 400px" behind />
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
