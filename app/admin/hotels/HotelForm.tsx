'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { hotelsApi } from '@/lib/api'
import { formatStarRating, STAR_RATING_OPTIONS, type HotelInput } from '@/types/hotel'
import styles from './HotelForm.module.css'

const EMPTY: HotelInput = {
  name: '',
  contactPerson: '',
  contactNumbers: '',
  region: '',
  starRating: 0,
}

export default function HotelForm() {
  const { id } = useParams<{ id?: string }>()
  const isEditing = Boolean(id)
  const router = useRouter()

  const [form, setForm] = useState<HotelInput>(EMPTY)
  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditing || !id) return

    hotelsApi
      .get(id)
      .then((hotel) => {
        const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = hotel
        setForm({
          ...rest,
          contactPerson: rest.contactPerson ?? '',
          contactNumbers: rest.contactNumbers ?? '',
        })
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load hotel.'))
      .finally(() => setLoading(false))
  }, [id, isEditing])

  function updateField<K extends keyof HotelInput>(key: K, value: HotelInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)

    try {
      if (isEditing && id) {
        await hotelsApi.update(id, form)
        setSuccess('Hotel saved successfully.')
      } else {
        await hotelsApi.create(form)
        router.push('/admin/hotels')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save hotel.')
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
        <Link href="/admin/hotels" className={styles.backLink}>
          ← Back to Hotels
        </Link>

        <h1 className={styles.title}>{isEditing ? 'Edit Hotel' : 'New Hotel'}</h1>

        <form className={styles.form} onSubmit={handleSubmit} onChange={() => setSuccess(null)}>
          <div className={styles.field}>
            <label>Hotel Name</label>
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Region/Province</label>
              <input
                value={form.region}
                onChange={(e) => updateField('region', e.target.value)}
                placeholder="e.g. Boracay"
                required
              />
            </div>
            <div className={styles.field}>
              <label>Star Rating</label>
              <select
                value={form.starRating}
                onChange={(e) => updateField('starRating', Number(e.target.value))}
              >
                {STAR_RATING_OPTIONS.map((rating) => (
                  <option key={rating} value={rating}>
                    {formatStarRating(rating)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Contact Person</label>
              <input
                value={form.contactPerson}
                onChange={(e) => updateField('contactPerson', e.target.value)}
                placeholder="e.g. Jane Doe"
              />
            </div>
            <div className={styles.field}>
              <label>Contact Numbers</label>
              <input
                value={form.contactNumbers}
                onChange={(e) => updateField('contactNumbers', e.target.value)}
                placeholder="e.g. +63 900 000 0000"
              />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && (
            <p className={styles.success} role="status">
              {success}
            </p>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={submitting}>
              {submitting ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Hotel'}
            </button>
            <button type="button" className={styles.cancel} onClick={() => router.push('/admin/hotels')}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
