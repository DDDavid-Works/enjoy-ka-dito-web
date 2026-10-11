'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { companyApi, hotelsApi, quotationsApi } from '@/lib/api'
import { detailTotal, formatPeso, inclusionTotal } from '@/lib/quotationTotals'
import type { CompanyDetails } from '@/types/company'
import type { Hotel } from '@/types/hotel'
import type { Quotation } from '@/types/quotation'
import styles from './QuotationPrint.module.css'

type PrintData = { quotation: Quotation; company: CompanyDetails; hotels: Hotel[] }

// "2026-10-05" -> "October 5, 2026" (no time zone shift).
function longDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function Amount({ value }: { value?: number }) {
  return <span className={styles.amount}>{value === undefined ? '' : formatPeso(value)}</span>
}

// The printable quotation sheet. It always shows the saved record. Opening it prints
// (browser "Save as PDF"); the toolbar lets you print again.
export default function QuotationPrint() {
  const { id } = useParams<{ id?: string }>()
  const [data, setData] = useState<PrintData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const printed = useRef(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    Promise.all([quotationsApi.get(id), companyApi.get(), hotelsApi.list().catch(() => [] as Hotel[])])
      .then(([quotation, company, hotels]) => {
        if (!cancelled) setData({ quotation, company, hotels })
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load the quotation.')
      })

    return () => {
      cancelled = true
    }
  }, [id])

  // The page title becomes the suggested PDF file name.
  useEffect(() => {
    if (!data) return
    const { quotation } = data
    const previous = document.title
    const parts = ['Quotation', quotation.customerName || quotation.title, quotation.quoteDate].filter(Boolean)
    document.title = parts.join(' - ')

    return () => {
      document.title = previous
    }
  }, [data])

  // Open the print dialog once, after the content and fonts are ready.
  useEffect(() => {
    if (!data || printed.current) return
    printed.current = true
    document.fonts.ready.then(() => setTimeout(() => window.print(), 300))
  }, [data])

  if (error) return <p className={styles.message}>{error}</p>
  if (!data) return <p className={styles.message}>Preparing quotation…</p>

  const { quotation, company, hotels } = data
  const hotelsById = new Map(hotels.map((h) => [h.id, h]))

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <span>Choose “Save as PDF” as the destination in the print window.</span>
        <div>
          <button type="button" className={styles.primary} onClick={() => window.print()}>
            Print / Save as PDF
          </button>
          <button type="button" onClick={() => window.close()}>
            Close
          </button>
        </div>
      </div>

      <article className={styles.sheet}>
        <header className={styles.header}>
          <img src="/images/logo-square.png" alt="Enjoy Ka Dito" className={styles.logo} />
          <div className={styles.company}>
            {company.email && <p>{company.email}</p>}
            {company.contactNumbers.map((number) => (
              <p key={number}>{number}</p>
            ))}
            {company.address && <p>{company.address}</p>}
          </div>
        </header>

        <h1 className={styles.title}>QUOTATION</h1>

        <dl className={styles.meta}>
          <dt>Quotation</dt>
          <dd>{quotation.title}</dd>
          {quotation.customerName && (
            <>
              <dt>Prepared For</dt>
              <dd>{quotation.customerName}</dd>
            </>
          )}
          {quotation.quoteDate && (
            <>
              <dt>Quote Date</dt>
              <dd>{longDate(quotation.quoteDate)}</dd>
            </>
          )}
        </dl>

        {quotation.remarks.trim() && (
          <section className={styles.section}>
            <h2 className={styles.heading}>Remarks</h2>
            <p className={styles.remarks}>{quotation.remarks}</p>
          </section>
        )}

        {quotation.inclusions.length > 0 && (
          <section className={styles.section}>
            <div className={styles.tableHead}>
              <span>PACKAGE INCLUDES</span>
              <span>PRICE PER HEAD</span>
            </div>

            {quotation.inclusions.map((inclusion, i) => (
              <div key={i} className={styles.group}>
                <div className={`${styles.row} ${styles.level1}`}>
                  <span className={styles.text}>{inclusion.text}</span>
                  <Amount value={inclusionTotal(inclusion)} />
                </div>
                {inclusion.details.map((detail, j) => (
                  <div key={j}>
                    <div className={`${styles.row} ${styles.level2}`}>
                      <span className={styles.text}>{detail.text}</span>
                      <Amount value={detailTotal(detail)} />
                    </div>
                    {detail.details.map((sub, k) => (
                      <div key={k} className={`${styles.row} ${styles.level3}`}>
                        <span className={styles.text}>{sub.text}</span>
                        <Amount value={sub.price} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
            {quotation.inclusionNotes.trim() && (
              <p className={styles.notes}>
                <strong>Notes:</strong> {quotation.inclusionNotes}
              </p>
            )}
          </section>
        )}

        {quotation.accommodations.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.heading}>Choose among the accommodation below:</h2>
            {quotation.accommodations.map((item, i) => {
              const hotel = hotelsById.get(item.hotelId)
              return (
                <div key={i} className={`${styles.row} ${styles.level1} ${styles.accommodation} ${styles.group}`}>
                  <span className={styles.text}>
                    {item.nights} Night{item.nights === 1 ? '' : 's'} stay at{' '}
                    <strong>{hotel ? `${hotel.name} (${hotel.region})` : 'Hotel no longer listed'}</strong>
                    {item.remarks && <em> ({item.remarks})</em>}
                  </span>
                  <span className={styles.amount}>
                    {item.ratePerHead === undefined ? '' : `${formatPeso(item.ratePerHead)} per head`}
                  </span>
                </div>
              )
            })}
          </section>
        )}

        {quotation.exclusions.length > 0 && (
          <section className={styles.section}>
            <h2 className={`${styles.heading} ${styles.excludes}`}>Package Excludes:</h2>
            <ul className={styles.list}>
              {quotation.exclusions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {quotation.optionalTours.length > 0 && (
          <section className={styles.section}>
            <h2 className={`${styles.heading} ${styles.excludes}`}>Optional Tours: (with additional fee)</h2>
            {quotation.optionalTours.map((tour, i) => (
              <div key={i} className={styles.group}>
                <p className={styles.tourTitle}>{tour.text}</p>
                {tour.details.map((detail, j) => (
                  <p key={j} className={styles.tourDetail}>
                    - {detail}
                  </p>
                ))}
              </div>
            ))}
          </section>
        )}
      </article>
    </div>
  )
}
