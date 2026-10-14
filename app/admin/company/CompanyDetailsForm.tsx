'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { companyApi } from '@/lib/api'
import type { CompanyDetails } from '@/types/company'
import styles from '../packages/PackageForm.module.css'

const EMPTY: CompanyDetails = { email: '', address: '', contactNumbers: [] }

export default function CompanyDetailsForm() {
  const [form, setForm] = useState<CompanyDetails>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    companyApi
      .get()
      .then((data) => {
        if (!cancelled) setForm({ email: data.email, address: data.address, contactNumbers: data.contactNumbers })
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load company details.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  function updateNumber(index: number, value: string) {
    setForm((prev) => ({ ...prev, contactNumbers: prev.contactNumbers.map((n, i) => (i === index ? value : n)) }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    const payload: CompanyDetails = {
      email: form.email.trim(),
      address: form.address.trim(),
      contactNumbers: form.contactNumbers.map((n) => n.trim()).filter(Boolean),
    }

    try {
      const saved = await companyApi.update(payload)
      setForm({ email: saved.email, address: saved.address, contactNumbers: saved.contactNumbers })
      setSuccess('Company details saved successfully.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save company details.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <img src="/images/logo-square.png" alt="Enjoy Ka Dito" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <Link href="/admin" className={styles.backLink}>
          ← Back to Dashboard
        </Link>

        <h1 className={styles.title}>Company Details</h1>
        <p className={styles.hint}>
          Shown on the website footer and the Contact Us page. Changes appear on the site as soon as you save.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} onChange={() => setSuccess(null)}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="hello@yourcompany.com"
            />
          </div>

          <div className={styles.field}>
            <label>Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="Street, barangay, city, province"
            />
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Contact numbers</div>
            <p className={styles.hint}>The first number is also used for the WhatsApp chat button on the website.</p>
            {form.contactNumbers.map((number, index) => (
              <div key={index} className={styles.listItem}>
                <input
                  value={number}
                  onChange={(e) => updateNumber(index, e.target.value)}
                  placeholder="e.g. +63 917 123 4567"
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, contactNumbers: prev.contactNumbers.filter((_, i) => i !== index) }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addButton}
              onClick={() => setForm((prev) => ({ ...prev, contactNumbers: [...prev.contactNumbers, ''] }))}
            >
              + Add number
            </button>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && (
            <p className={styles.success} role="status">
              {success}
            </p>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
