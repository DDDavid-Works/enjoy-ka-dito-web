'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { quotationsApi } from '@/lib/api'
import type { Quotation } from '@/types/quotation'
import styles from '../packages/PackagesList.module.css'

// "2026-10-04" -> the viewer's local date format, without a time zone shift.
function formatQuoteDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString()
}

export default function QuotationsList() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    quotationsApi
      .list()
      .then((data) => {
        if (!cancelled) setQuotations(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load quotations.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleDelete(quotation: Quotation) {
    if (!confirm(`Delete "${quotation.title}"? This can't be undone.`)) return

    try {
      await quotationsApi.remove(quotation.id)
      setQuotations((prev) => prev.filter((q) => q.id !== quotation.id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete quotation.')
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <img src="/images/logo-square.png" alt="Enjoy Ka Dito" className={styles.logo} />
      </header>

      <main className={styles.content}>
        <Link href="/admin" className={styles.backLink}>
          ← Back to Dashboard
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Quotations</h1>
          <button type="button" className={styles.newButton} onClick={() => router.push('/admin/quotations/new')}>
            + New Quotation
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {!loading && quotations.length === 0 && !error && (
          <p className={styles.empty}>No quotations yet. Create your first one.</p>
        )}

        {quotations.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Prepared For</th>
                <th>Quote Date</th>
                <th>Based on package</th>
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation) => (
                <tr key={quotation.id}>
                  <td>{quotation.title}</td>
                  <td>{quotation.customerName || '—'}</td>
                  <td>{quotation.quoteDate ? formatQuoteDate(quotation.quoteDate) : '—'}</td>
                  <td>{quotation.package?.title ?? '—'}</td>
                  <td>{new Date(quotation.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actions}>
                      <button type="button" onClick={() => router.push(`/admin/quotations/${quotation.id}/edit`)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        title="Export a PDF of this quotation"
                        onClick={() => window.open(`/admin/quotations/${quotation.id}/print`, '_blank')}
                      >
                        PDF
                      </button>
                      <button type="button" className={styles.delete} onClick={() => handleDelete(quotation)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}
