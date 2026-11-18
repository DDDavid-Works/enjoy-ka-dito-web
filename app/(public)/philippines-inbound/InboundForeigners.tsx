'use client'

import { useState, type FormEvent } from 'react'
import { inquiriesApi } from '@/lib/api'
import { DESIRED_DESTINATIONS, FLIGHT_STATUSES, GROUP_TYPES, TRIP_DURATIONS } from '@/types/inquiry'
import FormConsent from '@/components/FormConsent'
import Icon, { type IconName } from '@/components/Icon'
import styles from './InboundForeigners.module.css'

const PILLARS = [
  {
    icon: 'speech',
    title: 'English-speaking experts',
    text: 'Every driver, guide, and coordinator assigned to your trip is fully fluent in English to guarantee clear communication.',
  },
  {
    icon: 'plane',
    title: 'Seamless island transfers',
    text: 'The Philippines has over 7,000 islands. We fully manage your domestic flights, private ferries, and point-to-point airport vans.',
  },
  {
    icon: 'shield',
    title: 'Secure, handpicked hotels',
    text: 'We only partner with desirable amenities, highly rated, and strictly secure resorts that meet stringent safety standards.',
  },
  {
    icon: 'card',
    title: 'Foreign-friendly payments',
    text: 'Safe, encrypted international billing options including PayPal, PayWise, credit cards, or international wire.',
  },
] satisfies { icon: IconName; [field: string]: string }[]

const ITINERARIES = [
  {
    icon: 'palm',
    name: 'The Ultimate Palawan Escape',
    subtitle: 'El Nido & Coron',
    highlight:
      'Private lagoons, limestone cliff tours, hidden beaches, premium eco-resorts, and internal flight arrangements.',
  },
  {
    icon: 'beach',
    name: 'Boracay Sun & Relaxation Tour',
    subtitle: 'Aklan',
    highlight:
      'Door-to-door airport transfer (Caticlan to resort), premium beachfront accommodations, private sunset sailing, and watersports.',
  },
  {
    icon: 'hills',
    name: 'Cultural & Heritage Loop',
    subtitle: 'Cebu & Bohol',
    highlight:
      'Chocolate Hills exploration, historical city walks, tarsier sanctuary visits, and whale shark swimming experiences.',
  },
] satisfies { icon: IconName; [field: string]: string }[]

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
        <h1 className={styles.title}>Experience the magic of the Philippines&mdash;without the DIY logistics stress.</h1>
        <p className={styles.subtext}>
          Fully managed island-hopping packages curated for international travelers. From multi-island flights and
          private boat transfers to handpicked hotels, we handle everything.
        </p>
        <a href="#inbound-inquiry-form" className={styles.heroCta}>
          Inquire About Your Philippine Getaway
        </a>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our commitments to international guests</h2>

        <div className={styles.pillarGrid}>
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className={styles.pillarCard}>
              <span className={styles.pillarIcon}><Icon name={pillar.icon} /></span>
              <p className={styles.pillarTitle}>{pillar.title}</p>
              <p className={styles.pillarText}>{pillar.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Signature Philippine itineraries</h2>

        <div className={styles.destinationGrid}>
          {ITINERARIES.map((itinerary) => (
            <div key={itinerary.name} className={styles.destinationCard}>
              <p className={styles.destinationName}>
                <Icon name={itinerary.icon} className={styles.itineraryIcon} /> {itinerary.name}
              </p>
              <span className={styles.itinerarySubtitle}>{itinerary.subtitle}</span>
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
              <h2 className={styles.sectionTitle}>Customize my Philippine itinerary</h2>
              <p className={styles.formIntro}>
                Tell us about your trip and we&rsquo;ll take care of the logistics.
              </p>
              {error && <p className={styles.error}>{error}</p>}
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Full name</span>
                    <input type="text" name="name" required />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Country of residence / nationality</span>
                    <input
                      type="text"
                      name="countryOfResidence"
                      required
                    />
                  </label>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Email address</span>
                    <input type="email" name="email" required />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>WhatsApp / Viber number</span>
                    <input type="tel" name="phone" required />
                  </label>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>How many people are traveling?</span>
                    <select name="groupType" defaultValue="" required>
                      <option value="" disabled>
                        Select one
                      </option>
                      {GROUP_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Any seniors or young children traveling?</span>
                    <select name="travelingWithSeniorsOrChildren" defaultValue="" required>
                      <option value="" disabled>
                        Select one
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Have you booked flights to Manila/Cebu?</span>
                    <select name="flightsBooked" defaultValue="" required>
                      <option value="" disabled>
                        Select one
                      </option>
                      {FLIGHT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Trip duration</span>
                    <select name="tripDuration" defaultValue="" required>
                      <option value="" disabled>
                        Select one
                      </option>
                      {TRIP_DURATIONS.map((duration) => (
                        <option key={duration} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <fieldset className={styles.fieldGroup}>
                  <legend className={styles.fieldGroupLabel}>Desired destinations in the Philippines</legend>
                  <div className={styles.checkboxGroup}>
                    {DESIRED_DESTINATIONS.map((destination) => (
                      <label key={destination} className={styles.checkboxLabel}>
                        <input type="checkbox" name="desiredDestinations" value={destination} />
                        {destination}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <FormConsent />

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
