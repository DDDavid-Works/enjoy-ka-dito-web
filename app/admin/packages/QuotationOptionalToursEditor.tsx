'use client'

import type { QuotationOptionalTour } from '@/types/package'
import styles from './PackageForm.module.css'

type Props = {
  value: QuotationOptionalTour[]
  onChange: (next: QuotationOptionalTour[]) => void
  /** Drop the "Internal only" wording (only the Tour Packages form needs it). */
  hideInternalNote?: boolean
}

function replaceAt<T>(list: T[], index: number, item: T) {
  return list.map((existing, i) => (i === index ? item : existing))
}

function removeAt<T>(list: T[], index: number) {
  return list.filter((_, i) => i !== index)
}

export default function QuotationOptionalToursEditor({ value, onChange, hideInternalNote }: Props) {
  function updateTour(index: number, patch: Partial<QuotationOptionalTour>) {
    onChange(replaceAt(value, index, { ...value[index], ...patch }))
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Optional Tours</div>
      <p className={styles.hint}>
        {hideInternalNote
          ? 'Extra tours offered with an additional fee.'
          : 'Internal only — extra tours offered with an additional fee. Not shown on the website.'}
      </p>

      {value.map((tour, index) => (
        <div key={index} className={`${styles.quoteItem} ${styles.quoteCard}`}>
          <div className={styles.listItem}>
            <input
              value={tour.text}
              onChange={(e) => updateTour(index, { text: e.target.value })}
              placeholder="e.g. Tour B"
            />
            <button type="button" className={styles.removeButton} onClick={() => onChange(removeAt(value, index))}>
              Remove
            </button>
          </div>

          <div className={styles.quoteDetails}>
            {tour.details.map((detail, detailIndex) => (
              <div key={detailIndex} className={styles.listItem}>
                <input
                  value={detail}
                  onChange={(e) => updateTour(index, { details: replaceAt(tour.details, detailIndex, e.target.value) })}
                  placeholder="e.g. Pinagbuyutan Island"
                />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => updateTour(index, { details: removeAt(tour.details, detailIndex) })}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addButton}
              onClick={() => updateTour(index, { details: [...tour.details, ''] })}
            >
              + Add detail
            </button>
          </div>
        </div>
      ))}

      <button type="button" className={styles.addButton} onClick={() => onChange([...value, { text: '', details: [] }])}>
        + Add optional tour
      </button>
    </div>
  )
}
