'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { inquiriesApi } from '@/lib/api'
import type { Inquiry, InquiryStatus, InquiryType } from '@/types/inquiry'
import styles from './InquiriesList.module.css'

const STATUS_FILTERS: Array<InquiryStatus | 'all'> = ['all', 'new', 'contacted', 'closed']
const TYPE_FILTERS: Array<{ value: InquiryType | 'all'; label: string }> = [
  { value: 'all', label: 'All Types' },
  { value: 'quote', label: 'Quote Requests' },
  { value: 'general', label: 'General Questions' },
]
const TYPE_LABELS: Record<InquiryType, string> = { quote: 'Quote request', general: 'General question' }

export default function InquiriesList() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<InquiryType | 'all'>('all')

  useEffect(() => {
    let cancelled = false

    inquiriesApi
      .list()
      .then((data) => {
        if (!cancelled) setInquiries(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load inquiries.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function handleStatusChange(inquiry: Inquiry, status: InquiryStatus) {
    const previous = inquiries
    setInquiries((prev) => prev.map((i) => (i.id === inquiry.id ? { ...i, status } : i)))

    try {
      await inquiriesApi.updateStatus(inquiry.id, status)
    } catch (err) {
      setInquiries(previous)
      alert(err instanceof Error ? err.message : 'Failed to update status.')
    }
  }

  const filteredInquiries = useMemo(
    () =>
      inquiries.filter(
        (i) => (filter === 'all' || i.status === filter) && (typeFilter === 'all' || i.type === typeFilter),
      ),
    [inquiries, filter, typeFilter],
  )

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
          <h1 className={styles.title}>Inquiries</h1>
        </div>

        <div className={styles.filters}>
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              className={status === filter ? `${styles.filterPill} ${styles.filterPillActive}` : styles.filterPill}
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All' : status[0].toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.filters}>
          {TYPE_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={
                option.value === typeFilter ? `${styles.filterPill} ${styles.filterPillActive}` : styles.filterPill
              }
              onClick={() => setTypeFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {!loading && filteredInquiries.length === 0 && !error && (
          <p className={styles.empty}>No inquiries here yet.</p>
        )}

        <div className={styles.list}>
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <p className={styles.name}>
                    {inquiry.name}
                    {inquiry.designation ? <span className={styles.company}>, {inquiry.designation}</span> : null}
                    {inquiry.companyName ? <span className={styles.company}> · {inquiry.companyName}</span> : null}
                  </p>
                  <p className={styles.meta}>
                    {new Date(inquiry.createdAt).toLocaleString()}
                    {` · ${TYPE_LABELS[inquiry.type]}`}
                    {inquiry.travelerType ? ` · ${inquiry.travelerType}` : ''}
                    {inquiry.groupType ? ` · ${inquiry.groupType} traveler(s)` : ''}
                  </p>
                </div>

                <select
                  className={`${styles.statusSelect} ${styles[`status_${inquiry.status}`]}`}
                  value={inquiry.status}
                  onChange={(event) => handleStatusChange(inquiry, event.target.value as InquiryStatus)}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className={styles.detailsGrid}>
                <a className={styles.detail} href={`mailto:${inquiry.email}`}>
                  {inquiry.email}
                </a>
                {inquiry.phone && (
                  <a className={styles.detail} href={`tel:${inquiry.phone}`}>
                    {inquiry.phone}
                  </a>
                )}
                {inquiry.package && (
                  <Link className={styles.packageLink} href={`/admin/packages/${inquiry.package.id}/edit`}>
                    Package: {inquiry.package.title}
                  </Link>
                )}
                {inquiry.destination &&
                  inquiry.destination.trim().toLowerCase() !== inquiry.package?.title.trim().toLowerCase() && (
                    <span className={styles.detail}>Destination: {inquiry.destination}</span>
                  )}
                {inquiry.travelerCount && <span className={styles.detail}>Pax: {inquiry.travelerCount}</span>}
                {inquiry.travelDates && <span className={styles.detail}>Dates: {inquiry.travelDates}</span>}
                {inquiry.budgetBracket && <span className={styles.detail}>Budget: {inquiry.budgetBracket}</span>}
                {inquiry.countryOfResidence && (
                  <span className={styles.detail}>Country: {inquiry.countryOfResidence}</span>
                )}
                {inquiry.travelingWithSeniorsOrChildren && (
                  <span className={styles.detail}>
                    Seniors/children traveling: {inquiry.travelingWithSeniorsOrChildren}
                  </span>
                )}
                {inquiry.flightsBooked && <span className={styles.detail}>Flights booked: {inquiry.flightsBooked}</span>}
                {inquiry.desiredDestinations && (
                  <span className={styles.detail}>Wants to visit: {inquiry.desiredDestinations}</span>
                )}
                {inquiry.tripDuration && <span className={styles.detail}>Trip length: {inquiry.tripDuration}</span>}
              </div>

              {inquiry.message && <p className={styles.message}>{inquiry.message}</p>}

              <div className={styles.cardActions}>
                <div className={styles.quotationList}>
                  {inquiry.quotations?.map((quotation) => (
                    <Link
                      key={quotation.id}
                      className={styles.quotationChip}
                      href={`/admin/quotations/${quotation.id}/edit`}
                      title="Open this quotation"
                    >
                      <span className={styles.quotationTag}>Quotation</span>
                      <span>{quotation.title}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
                <Link className={styles.quoteButton} href={`/admin/quotations/new?inquiry=${inquiry.id}`}>
                  {inquiry.quotations?.length ? 'Create Another Quotation' : 'Create Quotation'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
