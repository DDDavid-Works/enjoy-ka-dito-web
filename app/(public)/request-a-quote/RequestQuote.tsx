'use client'

import { useState, type FormEvent } from 'react'
import PrefilledDestinationCombobox from '@/components/PrefilledDestinationCombobox'
import { inquiriesApi } from '@/lib/api'
import { TRAVELER_TYPES } from '@/types/inquiry'
import styles from './RequestQuote.module.css'

export default function RequestQuote() {

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
        companyName: String(data.get('companyName') ?? '') || undefined,
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? '') || undefined,
        travelerType: (String(data.get('travelerType') ?? '') || undefined) as
          | (typeof TRAVELER_TYPES)[number]
          | undefined,
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
        <p className={styles.badge}>START PLANNING</p>
        <h1 className={styles.title}>Let&rsquo;s plan your next adventure.</h1>
        <p className={styles.subtext}>
          Tell us where you want to go and what you have in mind. Our team will put together a quote tailored to
          you.
        </p>
      </section>

      <section className={styles.formSection}>
        <div className={styles.formCard}>
          {submitted ? (
            <p className={styles.success}>
              Thanks! We&rsquo;ve received your quote request and will get back to you within 1&ndash;2 business
              days.
            </p>
          ) : (
            <>
              <p className={styles.formIntro}>
                Share a few details and we&rsquo;ll send you a customized quote within 1&ndash;2 business days.
              </p>
              {error && <p className={styles.error}>{error}</p>}
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="text" name="name" placeholder="Full name" required />
                  </div>
                  <div className={styles.field}>
                    <input type="text" name="companyName" placeholder="Company name (if applicable)" />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="email" name="email" placeholder="Email address" required />
                  </div>
                  <div className={styles.field}>
                    <input type="tel" name="phone" placeholder="Phone / WhatsApp / Viber number" required />
                  </div>
                </div>

                <div className={styles.field}>
                  <select name="travelerType" defaultValue="" required>
                    <option value="" disabled>
                      Who are you traveling with?
                    </option>
                    {TRAVELER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <PrefilledDestinationCombobox
                    name="destination"
                    placeholder="Preferred destination/Tour Package"
                  />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <input type="text" name="travelerCount" placeholder="Number of travelers (pax)" />
                  </div>
                  <div className={styles.field}>
                    <input type="text" name="travelDates" placeholder="Expected travel dates" />
                  </div>
                </div>

                <div className={styles.field}>
                  <textarea name="message" placeholder="Budget, special requirements, or anything else" rows={4} />
                </div>

                <button type="submit" className={styles.submit} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Request a Quote'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
