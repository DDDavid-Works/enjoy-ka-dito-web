'use client'

import { useState, type FormEvent } from 'react'
import PrefilledDestinationCombobox from '@/components/PrefilledDestinationCombobox'
import { inquiriesApi } from '@/lib/api'
import FormConsent from '@/components/FormConsent'
import Icon, { type IconName } from '@/components/Icon'
import styles from '../_landing/Landing.module.css'

const PILLARS = [
  {
    icon: 'van',
    title: 'Fully private transport',
    text: 'No cramped shared vans — senior-friendly, air-conditioned vehicles take you door-to-door.',
    note: '(conditional - based on package)',
  },
  {
    icon: 'compass',
    title: 'Relaxed, senior-friendly pacing',
    text: "Itineraries built around rest stops, not rushing between photo ops. No one gets left behind.",
  },
  {
    icon: 'ticket',
    title: 'Skip-the-line, pre-booked everything',
    text: 'Entrance tickets and reservations handled in advance, so no one stands around waiting.',
  },
  {
    icon: 'dining',
    title: 'Curated meals & a patient guide',
    text: 'Meals planned around dietary needs, with a guide who keeps the pace comfortable for everyone.',
  },
] satisfies { icon: IconName; [field: string]: string }[]

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

export default function FamilySeniorTours() {

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
        <h1 className={styles.title}>Relaxed, fully managed trips for families and senior travelers.</h1>
        <p className={styles.subtext}>
          Private transport, senior-friendly pacing, and every detail handled &mdash; so no one in your group has to
          rush, worry, or walk further than they&rsquo;re comfortable with.
        </p>
        <div className={styles.heroActions}>
          <a href="#family-inquiry-form" className={styles.heroCta}>
            Send us your trip details
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Better than DIY, built around comfort</h2>

        <div className={styles.pillarGrid}>
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className={styles.pillar}>
              <span className={styles.pillarIcon}><Icon name={pillar.icon} /></span>
              <p className={styles.pillarTitle}>{pillar.title}</p>
              <p className={styles.pillarText}>
                {pillar.text}
                {pillar.note && <em> {pillar.note}</em>}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Family &amp; senior-friendly destinations</h2>

        <ul className={styles.readableList}>
          {DESTINATIONS.map((destination) => (
            <li key={destination.name} className={styles.readableItem}>
              <div>
                <p className={styles.destinationName}>
                  <Icon name="pin" className={styles.pin} />
                  {destination.name}
                </p>
                <p className={styles.destinationFor}>{destination.bestFor}</p>
              </div>
              <p className={styles.destinationHighlight}>{destination.highlight}</p>
            </li>
          ))}
        </ul>
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
              <h2 className={styles.sectionTitle}>Tell us about your trip</h2>
              <p className={styles.formIntro}>
                Prefer to talk instead? Call us anytime &mdash; or share a few details here and we&rsquo;ll get back
                to you.
              </p>
              {error && <p className={styles.error}>{error}</p>}
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Full name</span>
                    <input type="text" name="name" required />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Phone / Viber / WhatsApp number</span>
                    <input type="tel" name="phone" required />
                  </label>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Email address</span>
                    <input type="email" name="email" required />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Traveling as</span>
                    <select name="travelerType" defaultValue="" required>
                      <option value="" disabled>
                        Select one
                      </option>
                      <option value="Family">Family</option>
                      <option value="Senior Group">Senior Group</option>
                    </select>
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Preferred destination or tour package (optional)</span>
                  <PrefilledDestinationCombobox
                    name="destination"
                    placeholder="Type to search, or enter your own"
                  />
                </label>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Number of travelers (optional)</span>
                    <input type="text" name="travelerCount" />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Preferred travel dates (optional)</span>
                    <input type="text" name="travelDates" />
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Anything we should know? (optional)</span>
                  <textarea
                    name="message"
                    placeholder="Mobility needs, young children, dietary needs, pacing preferences"
                    rows={4}
                  />
                </label>

                <FormConsent />

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
