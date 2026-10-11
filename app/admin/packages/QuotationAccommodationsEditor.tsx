'use client'

import type { Hotel } from '@/types/hotel'
import type { QuotationAccommodation } from '@/types/package'
import HotelCombobox from './HotelCombobox'
import PriceField from './PriceField'
import styles from './PackageForm.module.css'

type Props = {
  value: QuotationAccommodation[]
  hotels: Hotel[]
  onChange: (next: QuotationAccommodation[]) => void
  /** Drop the "Internal only" wording (only the Tour Packages form needs it). */
  hideInternalNote?: boolean
}

export default function QuotationAccommodationsEditor({ value, hotels, onChange, hideInternalNote }: Props) {
  const hotelsById = new Map(hotels.map((h) => [h.id, h]))

  function update(index: number, patch: Partial<QuotationAccommodation>) {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Accommodations</div>
      <p className={styles.hint}>
        {hideInternalNote ? 'Pick from' : 'Internal only — pick from'} your Hotels &amp; Resorts list. Rate per head is optional.
      </p>

      {value.map((item, index) => (
        <AccommodationRow
          key={index}
          item={item}
          hotel={hotelsById.get(item.hotelId)}
          hotels={hotels}
          onChange={(patch) => update(index, patch)}
          onRemove={() => onChange(value.filter((_, i) => i !== index))}
        />
      ))}

      <button
        type="button"
        className={styles.addButton}
        onClick={() => onChange([...value, { hotelId: '', nights: 2 }])}
      >
        + Add accommodation
      </button>
    </div>
  )
}

type RowProps = {
  item: QuotationAccommodation
  hotel?: Hotel
  hotels: Hotel[]
  onChange: (patch: Partial<QuotationAccommodation>) => void
  onRemove: () => void
}

function AccommodationRow({ item, hotel, hotels, onChange, onRemove }: RowProps) {
  return (
    <div className={`${styles.quoteItem} ${styles.quoteCard}`}>
      <div className={styles.accommodationGrid}>
        <div className={styles.field}>
          <label>Hotel</label>
          <HotelCombobox hotels={hotels} selected={hotel} onSelect={(h) => onChange({ hotelId: h.id })} />
          {item.hotelId && !hotel && <p className={styles.hint}>This hotel is no longer in your list. Pick another.</p>}
        </div>

        <div className={styles.field}>
          <label>Nights</label>
          <input
            type="number"
            min={1}
            step={1}
            value={item.nights}
            onChange={(e) => onChange({ nights: Math.max(1, Math.floor(Number(e.target.value)) || 1) })}
          />
        </div>

        <div className={styles.field}>
          <label>Rate per head (optional)</label>
          <PriceField value={item.ratePerHead} onChange={(ratePerHead) => onChange({ ratePerHead })} />
        </div>
      </div>

      <div className={styles.listItem}>
        <input
          value={item.remarks ?? ''}
          onChange={(e) => onChange({ remarks: e.target.value })}
          placeholder="Remarks / notes, e.g. 2x Standard Room with daily breakfast"
        />
        <button type="button" className={styles.removeButton} onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  )
}
