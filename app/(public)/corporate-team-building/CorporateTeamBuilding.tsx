'use client'

import { useState, type FormEvent } from 'react'
import ByCompany from '@/components/ByCompany'
import DestinationCombobox from '@/components/DestinationCombobox'
import { inquiriesApi } from '@/lib/api'
import { CORPORATE_BUDGET_BRACKETS } from '@/types/inquiry'
import FormConsent from '@/components/FormConsent'
import { formErrorMessage } from '@/lib/form-errors'
import Icon, { type IconName } from '@/components/Icon'
import styles from '../_landing/Landing.module.css'

const PILLARS = [
  {
    icon: 'receipt',
    title: '100% compliant billing',
    text: 'Full official receipts, transparent corporate itemization, and flexible payment options for hassle-free company liquidation.',
  },
  {
    icon: 'target',
    title: 'Tailored program design',
    text: 'Whether your goal is high-energy team bonding, strategic alignment, or pure relaxation, we customize the activities to match.',
  },
  {
    icon: 'van',
    title: 'Premium group logistics',
    text: 'Dedicated private air-conditioned vans/coasters/buses, vetted team-friendly resorts, and coordinated group dining.',
  },
  {
    icon: 'guide',
    title: 'On-site tour coordinator (conditional)',
    text: 'A dedicated agency coordinator travels with your group to manage hotel check-ins, timing, and emergencies so you can relax too.',
  },
] satisfies { icon: IconName; [field: string]: string }[]

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
      setError(formErrorMessage(err, 'proposal request'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <section className={styles.hero}>
        <h1 className={styles.title}>
          Flawless corporate team building outings&mdash;fully managed from planning to execution.
        </h1>
        <p className={styles.subtext}>
          We design custom domestic and international itineraries that align with your company goals, boost morale,
          and stay perfectly within budget.
        </p>
        <div className={styles.heroActions}>
          <a href="#corporate-inquiry-form" className={styles.heroCta}>
            Request a corporate proposal
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why HR managers trust Enjoy Ka Dito <ByCompany /></h2>

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
        <h2 className={styles.sectionTitle}>Popular team-building destinations</h2>

        <table className={styles.compareTable}>
          <thead>
            <tr>
              <th scope="col">Destination</th>
              <th scope="col">Best for</th>
              <th scope="col">What we arrange</th>
            </tr>
          </thead>
          <tbody>
            {DESTINATIONS.map((destination) => (
              <tr key={destination.name}>
                <th scope="row">
                  <Icon name="pin" className={styles.pin} />
                  {destination.name}
                </th>
                <td className={styles.compareFor}>{destination.bestFor}</td>
                <td>{destination.highlight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="corporate-inquiry-form" className={`${styles.section} ${styles.formSection}`}>
        <div className={styles.formCard}>
          {submitted ? (
            <p className={styles.success}>
              Proposal request sent. We&rsquo;ll send your proposal within 24&ndash;48 hours.
            </p>
          ) : (
            <>
              <h2 className={styles.sectionTitle}>Request a corporate proposal</h2>
              <p className={styles.formIntro}>
                We&rsquo;ll send your proposal within 24&ndash;48 hours.
              </p>
              {error && <p className={styles.error}>{error}</p>}
              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Company name</span>
                  <input type="text" name="companyName" required />
                </label>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Contact person</span>
                    <input type="text" name="contactPerson" placeholder="e.g. Jane Doe" required />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Designation (optional)</span>
                    <input type="text" name="designation" placeholder="e.g. HR Manager" />
                  </label>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Work email</span>
                    <input type="email" name="email" required />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Mobile number</span>
                    <input type="tel" name="phone" required />
                  </label>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Estimated number of participants (optional)</span>
                    <input type="text" name="travelerCount" />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Target month or dates (optional)</span>
                    <input type="text" name="travelDates" />
                  </label>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Preferred destination or tour package</span>
                    <DestinationCombobox
                      name="destination"
                      placeholder="Type to search, or enter your own"
                      required
                    />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Estimated total budget</span>
                    <select name="budgetBracket" defaultValue="" required>
                      <option value="" disabled>
                        Select one
                      </option>
                      {CORPORATE_BUDGET_BRACKETS.map((bracket) => (
                        <option key={bracket} value={bracket}>
                          {bracket}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Special requirements (optional)</span>
                  <textarea
                    name="message"
                    placeholder="e.g. conference room, dietary requests, physical restrictions, custom destination"
                    rows={4}
                  />
                </label>

                <FormConsent />

                <button type="submit" className={styles.submit} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Request proposal'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
