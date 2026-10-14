import type { Metadata } from 'next'
import CoverImage from '@/components/CoverImage'
import styles from './page.module.css'

const ACCREDITATIONS = [
  'Department of Tourism (DOT) accredited organizer',
  'Philippine Airlines (PAL) accredited partner',
  'Pangasinan Provincial Tourism and Cultural Affairs Office partner',
  'Nueva Ecija Association of Travel Operators (NEATOP) member',
  'Association of Local Travel and Tours Operators in Pangasinan (ALTTOP) member',
]

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Enjoy Ka Dito is a DOT-accredited, PAL-partnered Philippine travel agency planning local and international trips with care.',
  alternates: { canonical: '/about-us' },
}

export default function AboutUs() {
  return (
    <main>
      <section className={styles.hero}>
        <CoverImage src="/images/local-tours.jpg" sizes="100vw" preload behind />
        <div className={styles.heroContent}>
          <p className={styles.badge}>OUR STORY</p>
          <h1 className={styles.title}>Every trip starts with people who care.</h1>
          <p className={styles.subtext}>
            A Philippine-based travel team building journeys around what actually matters to you.
          </p>
        </div>
      </section>

      <section className={styles.intro}>
        <p className={styles.introText}>
          We believe travel should feel exciting, not stressful. As an accredited travel agency, we plan trips
          across the Philippines and abroad — beach escapes, mountain treks, island hopping, or a full
          international getaway — and handle the details so you don&rsquo;t have to.
        </p>
      </section>

      <section className={styles.whySection}>
        <p className={styles.sectionBadge}>WHY TRAVEL WITH US</p>
        <div className={styles.whyGrid}>
          <div className={styles.whyBlock}>
            <h2 className={styles.whyTitle}>Trusted &amp; accredited</h2>
            <p className={styles.whyText}>
              We hold accreditations and active memberships with respected tourism organizations, including:
            </p>
            <ul className={styles.list}>
              {ACCREDITATIONS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.whyBlock}>
            <h2 className={styles.whyTitle}>Our advocacy</h2>
            <p className={styles.whyText}>
              Travel is more than a trip — it&rsquo;s a chance to see a place differently. We&rsquo;re committed to
              showcasing the Philippines&rsquo; natural beauty, supporting local communities, and inspiring
              travelers to explore, appreciate, and discover why it&rsquo;s more fun in the Philippines.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.closing}>
        <p className={styles.closingText}>Because wherever you go with us — enjoy ka dito.</p>
      </section>
    </main>
  )
}
