'use client'

import { useState, type FormEvent } from 'react'
import { inquiriesApi } from '@/lib/api'
import { DESIRED_DESTINATIONS, FLIGHT_STATUSES, GROUP_TYPES, TRIP_DURATIONS } from '@/types/inquiry'
import styles from './InboundForeigners.module.css'

const PILLARS = [
  {
    icon: '🗣️',
    title: 'English-Speaking Experts',
    text: 'Every driver, guide, and coordinator assigned to your trip is fully fluent in English to guarantee clear communication.',
  },
  {
    icon: '✈️',
    title: 'Seamless Island Transfers',
    text: 'The Philippines has over 7,000 islands. We fully manage your domestic flights, private ferries, and point-to-point airport vans.',
  },
  {
    icon: '🛡️',
    title: 'Secure, Handpicked Hotels',
    text: 'We only partner with western-amenity, highly rated, and strictly secure resorts that meet stringent safety standards.',
  },
  {
    icon: '💳',
    title: 'Foreign-Friendly Payments',
    text: 'Safe, encrypted international billing options including PayPal, Stripe, credit cards, or international wire.',
  },
]

const ITINERARIES = [
  {
    icon: '🌴',
    name: 'The Ultimate Palawan Escape',
    subtitle: 'El Nido & Coron',
    highlight:
      'Private lagoons, limestone cliff tours, hidden beaches, premium eco-resorts, and internal flight arrangements.',
  },
  {
    icon: '🏖️',
    name: 'Boracay Sun & Relaxation Tour',
    subtitle: 'Aklan',
    highlight:
      'Door-to-door airport transfer (Caticlan to resort), premium beachfront accommodations, private sunset sailing, and watersports.',
  },
  {
    icon: '🌋',
    name: 'Cultural & Heritage Loop',
    subtitle: 'Cebu & Bohol',
    highlight:
      'Chocolate Hills exploration, historical city walks, tarsier sanctuary visits, and whale shark swimming experiences.',
  },
]

export default function InboundForeigners() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const desiredDestinations = data.getAll('desiredDestinations').join(', ')

    setSubmitting(true)
    setError(null)

    try {
      await inquiriesApi.create({
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
        countryOfResidence: String(data.get('countryOfResidence') ?? ''),
        groupType: String(data.get('groupType') ?? '') || undefined,
        travelingWithSeniorsOrChildren: String(data.get('travelingWithSeniorsOrChildren') ?? '') || undefined,
        flightsBooked: String(data.get('flightsBooked') ?? '') || undefined,
        desiredDestinations: desiredDestinations || undefined,
        tripDuration: String(data.get('tripDuration') ?? '') || undefined,
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
        <p className={styles.badge}>PHILIPPINES INBOUND</p>
        <h1 className={styles.title}>Experience the Magic of the Philippines&mdash;Without the DIY Logistics Stress.</h1>
        <p className={styles.subtext}>
          Fully managed island-hopping packages curated for international travelers. From multi-island flights and
          private boat transfers to handpicked hotels, we handle everything.
        </p>
        <a href="#inbound-inquiry-form" className={styles.heroCta}>
          Inquire About Your Philippine Getaway
        </a>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionBadge}>OUR COMMITMENTS TO YOU</p>
        <h2 className={styles.sectionTitle}>The Core Commitments to International Guests</h2>

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
        <h2 className={styles.sectionTitle}>Signature Philippine Itineraries</h2>

        <div className={styles.destinationGrid}>
          {ITINERARIES.map((itinerary) => (
            <div key={itinerary.name} className={styles.destinationCard}>
              <p className={styles.destinationName}>
                {itinerary.icon} {itinerary.name}
              </p>
              <span className={styles.sectionBadge}>{itinerary.subtitle}</span>
              <p className={styles.destinationHighlight}>{itinerary.highlight}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="inbound-inquiry-form" className={`${styles.section} ${styles.formSection}`}>
        <div className={styles.formCard}>
          {submitted ? (
            <p className={styles.success}>
              Thanks! We&rsquo;ve received your details and will help you customize your Philippine itinerary soon.
            </p>
          ) : (
            <>
              <p className={styles.sectionBadge}>INTERNATIONAL INQUIRY FORM</p>
              <h2 className={styles.sectionTitle}>Customize My Philippine Itinerary</h2>
              <p className={styles.formIntro}>
                Tell us about your trip and we&rsquo;ll take care of the logistics.
              </p>
              {error && <p className={styles.error}>{error}</p>}
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="text" name="name" placeholder="Full name" required />
                  </div>
                  <div className={styles.field}>
                    <input
                      type="text"
                      name="countryOfResidence"
                      placeholder="Country of residence / nationality"
                      required
                    />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="email" name="email" placeholder="Email address" required />
                  </div>
                  <div className={styles.field}>
                    <input type="tel" name="phone" placeholder="WhatsApp / Viber number" required />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <select name="groupType" defaultValue="" required>
                      <option value="" disabled>
                        How many people are traveling?
                      </option>
                      {GROUP_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <select name="travelingWithSeniorsOrChildren" defaultValue="" required>
                      <option value="" disabled>
                        Any seniors or young children traveling?
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <select name="flightsBooked" defaultValue="" required>
                      <option value="" disabled>
                        Have you booked flights to Manila/Cebu?
                      </option>
                      {FLIGHT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.field}>
                    <select name="tripDuration" defaultValue="" required>
                      <option value="" disabled>
                        Trip duration
                      </option>
                      {TRIP_DURATIONS.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <p className={styles.fieldGroupLabel}>Desired destinations in the Philippines</p>
                  <div className={styles.checkboxGroup}>
                    {DESIRED_DESTINATIONS.map((destination) => (
                      <label key={destination} className={styles.checkboxLabel}>
                        <input type="checkbox" name="desiredDestinations" value={destination} />
                        {destination}
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit" className={styles.submit} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Customize My Philippine Itinerary'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
