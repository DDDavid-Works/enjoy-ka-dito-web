'use client'

import { useState, type FormEvent } from 'react'
import PrefilledDestinationCombobox from '@/components/PrefilledDestinationCombobox'
import { inquiriesApi } from '@/lib/api'
import { toTelHref } from '@/lib/phone'
import type { CompanyDetails } from '@/types/company'
import styles from './FamilySeniorTours.module.css'

const PILLARS = [
  {
    icon: '🚐',
    title: 'Fully Private Transport',
    text: 'No cramped shared vans — senior-friendly, air-conditioned vehicles take you door-to-door.',
  },
  {
    icon: '🧭',
    title: 'Relaxed, Senior-Friendly Pacing',
    text: "Itineraries built around rest stops, not rushing between photo ops. No one gets left behind.",
  },
  {
    icon: '🎟️',
    title: 'Skip-the-Line, Pre-Booked Everything',
    text: 'Entrance tickets and reservations handled in advance, so no one stands around waiting.',
  },
  {
    icon: '🍽️',
    title: 'Curated Meals & a Patient Guide',
    text: 'Meals planned around dietary needs, with a guide who keeps the pace comfortable for everyone.',
  },
]

const DESTINATIONS = [
  {
    name: 'Boracay',
    bestFor: 'Easy beach days & private transfers',
    highlight: 'Door-to-door airport transfers, accessible beachfront resorts, and unhurried island time.',
  },
  {
    name: 'Bohol Countryside',
    bestFor: 'Gentle sightseeing loop',
    highlight: 'Chocolate Hills, tarsiers, and a relaxed river cruise — minimal walking, maximum sightseeing.',
  },
  {
    name: 'Vietnam',
    bestFor: 'Family-friendly city magic',
    highlight: 'Stroller and wheelchair-friendly routes, planned rest breaks, and door-to-door transfers.',
  },
]

export default function FamilySeniorTours({ company }: { company: CompanyDetails }) {

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setSubmitting(true)
    setError(null)

    try {
      await inquiriesApi.create({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
        travelerType: data.get('travelerType') === 'Senior Group' ? 'Senior Group' : 'Family',
        destination: String(data.get('destination') ?? '') || undefined,
        packageId: String(data.get('packageId') ?? '') || undefined,
        travelerCount: String(data.get('travelerCount') ?? '') || undefined,
        travelDates: String(data.get('travelDates') ?? '') || undefined,
        message: String(data.get('message') ?? '') || undefined,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <section className={styles.hero}>
        <p className={styles.badge}>FAMILY &amp; SENIOR TOURS</p>
        <h1 className={styles.title}>Relaxed, Fully Managed Trips for Families and Senior Travelers.</h1>
        <p className={styles.subtext}>
          Private transport, senior-friendly pacing, and every detail handled &mdash; so no one in your group has to
          rush, worry, or walk further than they&rsquo;re comfortable with.
        </p>
        <div className={styles.heroActions}>
          {company.contactNumbers[0] && (
            <a href={toTelHref(company.contactNumbers[0])} className={styles.heroCta}>
              Call Our Family Travel Experts
            </a>
          )}
          <a href="#family-inquiry-form" className={styles.heroCtaOutline}>
            Send us your trip details
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionBadge}>WHY FAMILIES &amp; SENIORS CHOOSE US</p>
        <h2 className={styles.sectionTitle}>Better Than DIY, Built Around Comfort</h2>

        <div className={styles.pillarGrid}>
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className={styles.pillarCard}>
              <span className={styles.pillarIcon}>{pillar.icon}</span>
              <p className={styles.pillarTitle}>{pillar.title}</p>
              <p className={styles.pillarText}>{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionBadge}>WHERE TO GO</p>
        <h2 className={styles.sectionTitle}>Family &amp; Senior-Friendly Destinations</h2>

        <div className={styles.destinationGrid}>
          {DESTINATIONS.map((destination) => (
            <div key={destination.name} className={styles.destinationCard}>
              <p className={styles.destinationName}>{destination.name}</p>
              <span className={styles.destinationFor}>{destination.bestFor}</span>
              <p className={styles.destinationHighlight}>{destination.highlight}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="family-inquiry-form" className={`${styles.section} ${styles.formSection}`}>
        <div className={styles.formCard}>
          {submitted ? (
            <p className={styles.success}>
              Thanks! We&rsquo;ve received your details and will reach out within 1&ndash;2 business days &mdash; or
              call us anytime for a faster answer.
            </p>
          ) : (
            <>
              <p className={styles.sectionBadge}>PREFER TO TYPE IT OUT?</p>
              <h2 className={styles.sectionTitle}>Tell Us About Your Trip</h2>
              <p className={styles.formIntro}>
                Prefer to talk instead? Call us anytime &mdash; or share a few details here and we&rsquo;ll get back
                to you.
              </p>
              {error && <p className={styles.error}>{error}</p>}
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="text" name="name" placeholder="Full name" required />
                  </div>
                  <div className={styles.field}>
                    <input type="tel" name="phone" placeholder="Phone / Viber / WhatsApp number" required />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="email" name="email" placeholder="Email address" required />
                  </div>
                  <div className={styles.field}>
                    <select name="travelerType" defaultValue="" required>
                      <option value="" disabled>
                        Traveling as
                      </option>
                      <option value="Family">Family</option>
                      <option value="Senior Group">Senior Group</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <PrefilledDestinationCombobox
                    name="destination"
                    placeholder="Preferred destination/Tour Package"
                  />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="text" name="travelerCount" placeholder="Number of travelers" />
                  </div>
                  <div className={styles.field}>
                    <input type="text" name="travelDates" placeholder="Preferred travel dates" />
                  </div>
                </div>

                <div className={styles.field}>
                  <textarea
                    name="message"
                    placeholder="Anything we should know? (mobility needs, young children, dietary needs, pacing preferences)"
                    rows={4}
                  />
                </div>

                <button type="submit" className={styles.submit} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Request a Relaxed, Fully Managed Itinerary'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
