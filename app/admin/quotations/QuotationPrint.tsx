'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { hotelsApi, quotationsApi } from '@/lib/api'
import DOMPurify from 'dompurify'
import { detailTotal, formatPeso, inclusionTotal } from '@/lib/quotationTotals'
import { isBlankHtml, notesToHtml } from '@/lib/richText'
import type { Hotel } from '@/types/hotel'
import type { Quotation } from '@/types/quotation'
import styles from './QuotationPrint.module.css'

type PrintData = { quotation: Quotation; hotels: Hotel[] }

// The client's A4 letterhead (rendered from Quotation-Package-Format-1.pdf). It is
// printed behind every page; the content sits between its header and footer art.
const LETTERHEAD = '/images/quotation-letterhead.jpg'

// "2026-10-05" -> "October 5, 2026" (no time zone shift).
function longDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// The notes fields are HTML from the rich-text editor (older ones plain text).
// Only the formatting the editor can produce is let through.
function RichText({ value }: { value: string }) {
  const html = DOMPurify.sanitize(notesToHtml(value), {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  })
  return <div className={styles.richText} dangerouslySetInnerHTML={{ __html: html }} />
}

function Amount({ value }: { value?: number }) {
  return <span className={styles.amount}>{value === undefined ? '' : formatPeso(value)}</span>
}

const DEPENDS = '**Depends on the chosen accommodation below'

// The package inclusions as a nested list, with each line's price when showPrices is set.
function InclusionLines({ inclusions, showPrices = false }: { inclusions: Quotation['inclusions']; showPrices?: boolean }) {
  return inclusions.map((inclusion, i) => (
    <div key={i} className={styles.group}>
      <div className={`${styles.row} ${styles.level1}`}>
        <span className={styles.text}>{inclusion.text}</span>
        {showPrices && <Amount value={inclusionTotal(inclusion)} />}
      </div>
      {inclusion.details.map((detail, j) => (
        <div key={j}>
          <div className={`${styles.row} ${styles.level2}`}>
            <span className={styles.text}>{detail.text}</span>
            {showPrices && <Amount value={detailTotal(detail)} />}
          </div>
          {detail.details.map((sub, k) => (
            <div key={k} className={`${styles.row} ${styles.level3}`}>
              <span className={styles.text}>{sub.text}</span>
              {showPrices && <Amount value={sub.price} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  ))
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

    Promise.all([quotationsApi.get(id), hotelsApi.list().catch(() => [] as Hotel[])])
      .then(([quotation, hotels]) => {
        if (!cancelled) setData({ quotation, hotels })
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

  // Open the print dialog once, after the content, fonts and letterhead are ready.
  useEffect(() => {
    if (!data || printed.current) return
    printed.current = true
    const letterhead = new Image()
    letterhead.src = LETTERHEAD
    Promise.all([document.fonts.ready, letterhead.decode().catch(() => undefined)]).then(() =>
      setTimeout(() => window.print(), 300),
    )
  }, [data])

  if (error) return <p className={styles.message}>{error}</p>
  if (!data) return <p className={styles.message}>Preparing quotation…</p>

  const { quotation, hotels } = data
  const hotelsById = new Map(hotels.map((h) => [h.id, h]))
  // With hotels to choose from, the rate depends on the choice and isn't itemised.
  const dependsOnStay = quotation.accommodations.length > 0

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
        <img src={LETTERHEAD} alt="" className={styles.letterhead} />

        {/* The table's head and foot rows repeat on every printed page, keeping the
            content clear of the letterhead's header and footer art. */}
        <table className={styles.layout}>
          <thead>
            <tr>
              <td>
                <div className={styles.headSpace} />
              </td>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td>
                <div className={styles.footSpace} />
              </td>
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <td>
                {/* Page 1's top block, pulled up into the space under the "Travel" script. */}
                <div className={styles.intro}>
                  {quotation.quoteDate && <p className={styles.quoteDate}>{longDate(quotation.quoteDate)}</p>}
                  <h1 className={styles.title}>QUOTATION</h1>
                </div>

                <dl className={styles.meta}>
                  <dt>Quotation</dt>
                  <dd>{quotation.title}</dd>
                  {quotation.customerName && (
                    <>
                      <dt>Prepared For</dt>
                      <dd>{quotation.customerName}</dd>
                    </>
                  )}
                  {quotation.travelDate?.trim() && (
                    <>
                      <dt>Travel Date</dt>
                      <dd>{quotation.travelDate}</dd>
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
                    {dependsOnStay ? (
                      // The price depends on the hotel picked below, so the lines carry no prices.
                      <div className={styles.ratesLayout}>
                        <div className={`${styles.tableHead} ${styles.ratesHead}`}>PACKAGE INCLUDES</div>
                        <div className={`${styles.tableHead} ${styles.ratesHead} ${styles.ratesCol}`}>RATES</div>
                        <div className={`${styles.tableHead} ${styles.ratesHead} ${styles.ratesCol}`}>TOTAL</div>
                        <div>
                          <InclusionLines inclusions={quotation.inclusions} />
                        </div>
                        <div className={styles.dependsCell}>{DEPENDS}</div>
                        <div className={styles.dependsCell}>{DEPENDS}</div>
                        <div className={styles.totalRate}>
                          <strong>Total Rate :</strong> ****Depends on the chosen accommodation below
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={styles.tableHead}>
                          <span>PACKAGE INCLUDES</span>
                          <span>PRICE PER HEAD</span>
                        </div>
                        <InclusionLines inclusions={quotation.inclusions} showPrices />
                      </>
                    )}
                    {!isBlankHtml(quotation.inclusionNotes) && (
                      <div className={styles.notes}>
                        <RichText value={quotation.inclusionNotes} />
                      </div>
                    )}
                  </section>
                )}

                {!isBlankHtml(quotation.paymentNotes) && (
                  <div className={styles.notes}>
                    <RichText value={quotation.paymentNotes} />
                  </div>
                )}

                {quotation.accommodations.length > 0 && (
                  <section className={`${styles.section} ${styles.newPage}`}>
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
                            {item.ratePerHead !== undefined && (
                              <span className={styles.estimate}>~{formatPeso(item.ratePerHead)} per head</span>
                            )}
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

                {!isBlankHtml(quotation.importantNotes) && (
                  <section className={`${styles.section} ${styles.newPage}`}>
                    <h2 className={styles.heading}>Important Notes:</h2>
                    <RichText value={quotation.importantNotes} />
                  </section>
                )}

                {/* The customer's acceptance, kept together at the end. */}
                <section className={styles.closing}>
                  <div className={styles.conforme}>
                    <em>Conforme:</em>
                    <div className={styles.signLine}>Full name with Signature</div>
                  </div>
                  <p>Thank you and God bless.</p>
                  <p>Sincerely yours,</p>
                  <p>MCP Greenery Travel and Tours</p>
                </section>
              </td>
            </tr>
          </tbody>
        </table>
      </article>
    </div>
  )
}
