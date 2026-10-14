'use client'

import { useState, type FormEvent } from 'react'
import ByCompany from '@/components/ByCompany'
import DestinationCombobox from '@/components/DestinationCombobox'
import { inquiriesApi } from '@/lib/api'
import { CORPORATE_BUDGET_BRACKETS } from '@/types/inquiry'
import styles from './CorporateTeamBuilding.module.css'

const PILLARS = [
  {
    icon: '🧾',
    title: '100% Compliant Billing',
    text: 'Full official receipts, transparent corporate itemization, and flexible payment options for hassle-free company liquidation.',
  },
  {
    icon: '🎯',
    title: 'Tailored Program Design',
    text: 'Whether your goal is high-energy team bonding, strategic alignment, or pure relaxation, we customize the activities to match.',
  },
  {
    icon: '🚐',
    title: 'Premium Group Logistics',
    text: 'Dedicated private air-conditioned vans/coasters/buses, vetted team-friendly resorts, and coordinated group dining.',
  },
  {
    icon: '🙋',
    title: 'On-Site Tour Coordinator (Conditional)',
    text: 'A dedicated agency coordinator travels with your group to manage hotel check-ins, timing, and emergencies so you can relax too.',
  },
]

const DESTINATIONS = [
  {
    name: 'Boracay Island',
    bestFor: 'High-energy beach games & nightlife',
    highlight:
      'Flight coordination, beachfront resort block booking, private island hopping, and seafood buffet dinners.',
  },
  {
    name: 'Cebu City',
    bestFor: 'Heritage, adventure, & large groups',
    highlight:
      "Modern convention hotels, Magellan's Cross city tours, dynamic mountain team-building facilities, and private transport.",
  },
  {
    name: 'Hong Kong / Vietnam',
    bestFor: 'Reward trips & premium corporate retreats',
    highlight:
      'International flight booking assist, visa documentation guidance, multi-lingual local guides, and premium city/cultural excursions.',
  },
]


export default function CorporateTeamBuilding() {
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
        name: String(data.get('contactPerson') ?? ''),
        companyName: String(data.get('companyName') ?? ''),
        designation: String(data.get('designation') ?? '') || undefined,
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
        travelerType: 'Corporate Group',
        destination: String(data.get('destination') ?? '') || undefined,
        packageId: String(data.get('packageId') ?? '') || undefined,
        travelerCount: String(data.get('travelerCount') ?? '') || undefined,
        travelDates: String(data.get('travelDates') ?? '') || undefined,
        budgetBracket: String(data.get('budgetBracket') ?? '') || undefined,
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
        <p className={styles.badge}>CORPORATE TEAM BUILDING</p>
        <h1 className={styles.title}>
          Flawless Corporate Team Building Outings&mdash;Fully Managed from Planning to Execution.
        </h1>
        <p className={styles.subtext}>
          We design custom domestic and international itineraries that align with your company goals, boost morale,
          and stay perfectly within budget.
        </p>
        <a href="#corporate-inquiry-form" className={styles.heroCta}>
          Get a Custom Corporate Proposal
        </a>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionBadge}>WHY HR MANAGERS TRUST US</p>
        <h2 className={styles.sectionTitle}>Why HR Managers Trust Enjoy Ka Dito <ByCompany /></h2>

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
        <h2 className={styles.sectionTitle}>Popular Team-Building Destinations</h2>

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

      <section id="corporate-inquiry-form" className={`${styles.section} ${styles.formSection}`}>
        <div className={styles.formCard}>
          {submitted ? (
            <p className={styles.success}>
              Thanks! We&rsquo;ve received your request and will send a proposal within 24&ndash;48 hours.
            </p>
          ) : (
            <>
              <p className={styles.sectionBadge}>REQUEST A GROUP QUOTE</p>
              <h2 className={styles.sectionTitle}>Submit a Request for Proposal</h2>
              <p className={styles.formIntro}>
                Keep it short but specific &mdash; this helps us send a serious, accurate proposal fast.
              </p>
              {error && <p className={styles.error}>{error}</p>}
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                  <input type="text" name="companyName" placeholder="Company name" required />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="text" name="contactPerson" placeholder="Contact person (e.g. Jane Doe)" required />
                  </div>
                  <div className={styles.field}>
                    <input type="text" name="designation" placeholder="Designation (e.g. HR Manager)" />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="email" name="email" placeholder="Work email address" required />
                  </div>
                  <div className={styles.field}>
                    <input type="tel" name="phone" placeholder="Mobile number" required />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="text" name="travelerCount" placeholder="Estimated number of participants (pax)" />
                  </div>
                  <div className={styles.field}>
                    <input type="text" name="travelDates" placeholder="Target month/dates" />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <DestinationCombobox
                      name="destination"
                      placeholder="Preferred destination/Tour Package"
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <select name="budgetBracket" defaultValue="" required>
                      <option value="" disabled>
                        Estimated total budget
                      </option>
                      {CORPORATE_BUDGET_BRACKETS.map((bracket) => (
                        <option key={bracket} value={bracket}>
                          {bracket}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <textarea
                    name="message"
                    placeholder="Special requirements (e.g. needs a conference room, dietary requests, physical restrictions, custom destination)"
                    rows={4}
                  />
                </div>

                <button type="submit" className={styles.submit} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Submit Request & Receive Proposal Within 24–48 Hours'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
