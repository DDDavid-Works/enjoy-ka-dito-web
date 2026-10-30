'use client'

import type { ReactNode } from 'react'
import { detailTotal, formatPeso, inclusionTotal } from '@/lib/quotationTotals'
import type { QuotationDetail, QuotationInclusion, QuotationSubDetail } from '@/types/package'
import RichTextField from '@/components/RichTextField'
import PriceField from './PriceField'
import styles from './PackageForm.module.css'

const NOTES_PLACEHOLDER =
  'e.g. Tour note: complimentary pick-up is available for hotels in Corong-Corong and the town proper.'

type Props = {
  value: QuotationInclusion[]
  onChange: (next: QuotationInclusion[]) => void
  // Free-text notes shown under the inclusions.
  notes: string
  onNotesChange: (next: string) => void
  // Label for the notes field (defaults to "Notes").
  notesLabel?: string
  // Quotations: edit the notes as rich text (HTML) instead of plain text.
  richNotes?: boolean
  // Extra fields shown under the notes.
  children?: ReactNode
  // Drop the top divider when this is the first thing under the tab bar.
  flush?: boolean
  // Quotations: rows with children show a calculated Total instead of an editable price.
  showTotals?: boolean
}

function replaceAt<T>(list: T[], index: number, item: T) {
  return list.map((existing, i) => (i === index ? item : existing))
}

function removeAt<T>(list: T[], index: number) {
  return list.filter((_, i) => i !== index)
}

type PriceInputProps = {
  value?: number
  onChange: (price: number | undefined) => void
}

function PriceInput({ value, onChange }: PriceInputProps) {
  return (
    <PriceField
      className={styles.priceInput}
      ariaLabel="Price (optional)"
      placeholder="Price"
      value={value}
      onChange={onChange}
    />
  )
}

function TotalLabel({ value }: { value?: number }) {
  return (
    <div className={styles.totalLabel} title="Total of the rows below">
      <span className={styles.totalTag}>Total</span>
      <span>{value === undefined ? '—' : formatPeso(value)}</span>
    </div>
  )
}

export default function QuotationInclusionsEditor({
  value,
  onChange,
  notes,
  onNotesChange,
  notesLabel = 'Notes',
  richNotes,
  children,
  flush,
  showTotals,
}: Props) {
  function updateInclusion(index: number, patch: Partial<QuotationInclusion>) {
    onChange(replaceAt(value, index, { ...value[index], ...patch }))
  }

  function updateDetail(index: number, detailIndex: number, patch: Partial<QuotationDetail>) {
    const details = value[index].details
    updateInclusion(index, { details: replaceAt(details, detailIndex, { ...details[detailIndex], ...patch }) })
  }

  function updateSubDetail(index: number, detailIndex: number, subIndex: number, patch: Partial<QuotationSubDetail>) {
    const subDetails = value[index].details[detailIndex].details
    updateDetail(index, detailIndex, { details: replaceAt(subDetails, subIndex, { ...subDetails[subIndex], ...patch }) })
  }

  // With totals on, a priced row that gets its first child hands its price to that child,
  // so the money still counts once the row becomes a total.
  function addDetail(index: number) {
    const item = value[index]
    if (showTotals && !item.details.length && item.price !== undefined) {
      updateInclusion(index, {
        price: undefined,
        details: [{ text: item.text, price: item.price, details: [] }, { text: '', details: [] }],
      })
      return
    }
    updateInclusion(index, { details: [...item.details, { text: '', details: [] }] })
  }

  function addSubDetail(index: number, detailIndex: number) {
    const detail = value[index].details[detailIndex]
    if (showTotals && !detail.details.length && detail.price !== undefined) {
      updateDetail(index, detailIndex, {
        price: undefined,
        details: [{ text: detail.text, price: detail.price }, { text: '' }],
      })
      return
    }
    updateDetail(index, detailIndex, { details: [...detail.details, { text: '' }] })
  }

  return (
    <div className={flush ? `${styles.section} ${styles.sectionFlush}` : styles.section}>
      <div className={styles.sectionTitle}>Package Inclusions</div>
      <p className={styles.hint}>
        {showTotals
          ? 'Prices are per head. A row with details shows a Total (the sum of what is under it) instead of a price.'
          : 'Internal only — used for quotations, not shown on the website. Every level can have an optional price.'}
      </p>

      {value.map((item, index) => (
        <div key={index} className={`${styles.quoteItem} ${styles.quoteCard}`}>
          <div className={styles.listItem}>
            <input
              value={item.text}
              onChange={(e) => updateInclusion(index, { text: e.target.value })}
              placeholder="e.g. Roundtrip Airfare via Clark"
            />
            {showTotals && item.details.length ? (
              <TotalLabel value={inclusionTotal(item)} />
            ) : (
              <PriceInput value={item.price} onChange={(price) => updateInclusion(index, { price })} />
            )}
            <button type="button" className={styles.removeButton} onClick={() => onChange(removeAt(value, index))}>
              Remove
            </button>
          </div>

          <div className={styles.quoteDetails}>
            {item.details.map((detail, detailIndex) => (
              <div key={detailIndex} className={styles.quoteItem}>
                <div className={styles.listItem}>
                  <input
                    value={detail.text}
                    onChange={(e) => updateDetail(index, detailIndex, { text: e.target.value })}
                    placeholder="Detail"
                  />
                  {showTotals && detail.details.length ? (
                    <TotalLabel value={detailTotal(detail)} />
                  ) : (
                    <PriceInput value={detail.price} onChange={(price) => updateDetail(index, detailIndex, { price })} />
                  )}
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => updateInclusion(index, { details: removeAt(item.details, detailIndex) })}
                  >
                    Remove
                  </button>
                </div>

                <div className={styles.quoteDetails}>
                  {detail.details.map((subDetail, subIndex) => (
                    <div key={subIndex} className={styles.listItem}>
                      <input
                        value={subDetail.text}
                        onChange={(e) => updateSubDetail(index, detailIndex, subIndex, { text: e.target.value })}
                        placeholder="Sub-detail"
                      />
                      <PriceInput
                        value={subDetail.price}
                        onChange={(price) => updateSubDetail(index, detailIndex, subIndex, { price })}
                      />
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => updateDetail(index, detailIndex, { details: removeAt(detail.details, subIndex) })}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className={styles.addButton} onClick={() => addSubDetail(index, detailIndex)}>
                    + Add sub-detail
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className={styles.addButton} onClick={() => addDetail(index)}>
              + Add detail
            </button>
          </div>
        </div>
      ))}

      <button type="button" className={styles.addButton} onClick={() => onChange([...value, { text: '', details: [] }])}>
        + Add inclusion
      </button>

      <div className={`${styles.field} ${styles.notesField}`}>
        <label>{notesLabel}</label>
        {richNotes ? (
          <RichTextField
            ariaLabel={notesLabel}
            value={notes}
            onChange={onNotesChange}
            placeholder={NOTES_PLACEHOLDER}
          />
        ) : (
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={NOTES_PLACEHOLDER}
            rows={4}
          />
        )}
      </div>
      {children}
    </div>
  )
}
