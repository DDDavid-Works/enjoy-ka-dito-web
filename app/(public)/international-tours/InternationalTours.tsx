'use client'

import { useState, type FormEvent } from 'react'
import PrefilledDestinationCombobox from '@/components/PrefilledDestinationCombobox'
import { inquiriesApi } from '@/lib/api'
import FormConsent from '@/components/FormConsent'
import Icon, { type IconName } from '@/components/Icon'
import styles from '../_landing/Landing.module.css'

const PILLARS = [
  {
    icon: 'passport',
    title: 'Visa & documentation help',
    text: 'We guide you through visa requirements, travel documents, and embassy appointments so nothing is missed.',
  },
  {
    icon: 'plane',
    title: 'Flights & hotels handled',
    text: 'Accredited airline and hotel partners mean fair rates, confirmed bookings, and one point of contact.',
  },
  {
    icon: 'compass',
    title: 'Guided, stress-free itineraries',
    text: 'Airport transfers, local guides, and well-paced days, ideal for first-time international travelers.',
  },
  {
    icon: 'shield',
    title: 'Accredited & supported',
    text: 'IATA TIDS and DOT accredited, with our team on hand before and during your trip.',
  },
] satisfies { icon: IconName; [field: string]: string }[]

const DESTINATIONS = [
  {
    name: 'Singapore',
    bestFor: 'Easy first trip abroad',
    highlight: 'Gardens by the Bay, Sentosa, and efficient city transport, with a short flight from Manila.',
  },
  {
    name: 'Thailand',
    bestFor: 'Islands, food & culture',
    highlight: 'Bangkok temples, Phuket island hopping, and street food tours with a friendly pace.',
  },
  {
    name: 'Vietnam',
    bestFor: 'Heritage & scenery',
    highlight: 'Ha Long Bay cruises, Hoi An lantern nights, and Ho Chi Minh City on a value-friendly budget.',
  },
]

export default function InternationalTours() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const note = String(data.get('message') ?? '').trim()

    setSubmitting(true)
    setError(null)

    try {
      await inquiriesApi.create({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
        destination: String(data.get('destination') ?? '') || undefined,
        packageId: String(data.get('packageId') ?? '') || undefined,
        travelerCount: String(data.get('travelerCount') ?? '') || undefined,
        travelDates: String(data.get('travelDates') ?? '') || undefined,
        message: `[International tour inquiry from a Philippine resident]${note ? `\n${note}` : ''}`,
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
        <h1 className={styles.title}>Explore the world, with every detail handled for you.</h1>
        <p className={styles.subtext}>
          Planning your first trip abroad, or your tenth? We take care of visas, flights, hotels, and guided
          itineraries so you can simply enjoy the journey.
        </p>
        <div className={styles.heroActions}>
          <a href="#international-inquiry-form" className={styles.heroCta}>
            Send us your trip details
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Go abroad without the guesswork</h2>

        <div className={styles.pillarGrid}>
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className={styles.pillar}>
              <span className={styles.pillarIcon}><Icon name={pillar.icon} /></span>
              <p className={styles.pillarTitle}>{pillar.title}</p>
              <p className={styles.pillarText}>{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Popular international destinations</h2>

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

      <section id="international-inquiry-form" className={`${styles.section} ${styles.formSection}`}>
        <div className={styles.formCard}>
          {submitted ? (
            <p className={styles.success}>
              Thanks! We&rsquo;ve received your details and will reach out within 1&ndash;2 business days &mdash; or
              call us anytime for a faster answer.
            </p>
          ) : (
            <>
              <h2 className={styles.sectionTitle}>Tell us where you want to go</h2>
              <p className={styles.formIntro}>
                Share a few details and we&rsquo;ll get back to you with options and rates.
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

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Email address</span>
                  <input type="email" name="email" required />
                </label>

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
                    placeholder="Passport or visa status, budget, special requests"
                    rows={4}
                  />
                </label>

                <FormConsent />

                <button type="submit" className={styles.submit} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Request My International Itinerary'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
