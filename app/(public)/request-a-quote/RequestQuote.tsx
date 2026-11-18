'use client'

import { useState, type FormEvent } from 'react'
import PrefilledDestinationCombobox from '@/components/PrefilledDestinationCombobox'
import { inquiriesApi } from '@/lib/api'
import { TRAVELER_TYPES } from '@/types/inquiry'
import FormConsent from '@/components/FormConsent'
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
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Full name</span>
                    <input type="text" name="name" required />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Company name (optional)</span>
                    <input type="text" name="companyName" />
                  </label>
                </div>

                <div className={styles.fieldRow}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Email address</span>
                    <input type="email" name="email" required />
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Phone / WhatsApp / Viber number</span>
                    <input type="tel" name="phone" required />
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Who are you traveling with?</span>
                  <select name="travelerType" defaultValue="" required>
                    <option value="" disabled>
                      Select one
                    </option>
                    {TRAVELER_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
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
                    <span className={styles.fieldLabel}>Expected travel dates (optional)</span>
                    <input type="text" name="travelDates" />
                  </label>
                </div>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Anything else we should know? (optional)</span>
                  <textarea name="message" placeholder="Budget, special requirements, or other details" rows={4} />
                </label>

                <FormConsent />

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
