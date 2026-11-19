'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { inquiriesApi } from '@/lib/api'
import type { CompanyDetails } from '@/types/company'
import FormConsent from '@/components/FormConsent'
import { formErrorMessage } from '@/lib/form-errors'
import styles from './ContactUs.module.css'

export default function ContactUs({ company }: { company: CompanyDetails }) {
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
        type: 'general',
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        message: String(data.get('message') ?? ''),
      })
      setSubmitted(true)
    } catch (err) {
      setError(formErrorMessage(err, 'message', true))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <section className={styles.hero}>
        <h1 className={styles.title}>Questions? We&rsquo;re here to help.</h1>
        <p className={styles.subtext}>
          Reach out for anything that isn&rsquo;t a booking &mdash; general questions, partnership inquiries, or
          feedback. Already planning a trip?{' '}
          <Link href="/request-a-quote" className={styles.inlineLink}>
            request a quote
          </Link>{' '}
          instead.
        </p>
      </section>

      <section className={styles.formSection}>
        <div className={styles.infoCard}>
          <h2 className={styles.infoTitle}>Contact details</h2>
          {company.emails.map((email) => (
            <p key={email} className={styles.infoLine}>
              {email}
            </p>
          ))}
          {company.contactNumbers.map((number) => (
            <p key={number} className={styles.infoLine}>
              {number}
            </p>
          ))}
          {company.address && <p className={styles.infoLine}>{company.address}</p>}
          <p className={styles.infoNote}>We typically reply within 1&ndash;2 business days.</p>
        </div>

        <div className={styles.formCard}>
          {submitted ? (
            <p className={styles.success}>Message sent. We&rsquo;ll get back to you soon.</p>
          ) : (
            <>
              <p className={styles.formIntro}>Send us a message and we&rsquo;ll get back to you.</p>
              {error && <p className={styles.error}>{error}</p>}
              <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Full name</span>
                  <input type="text" name="name" required />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Email address</span>
                  <input type="email" name="email" required />
                </label>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>How can we help?</span>
                  <textarea name="message" rows={5} required />
                </label>
                <FormConsent />
                <button type="submit" className={styles.submit} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
