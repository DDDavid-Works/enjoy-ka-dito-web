'use client'

import { useMemo, useState, type KeyboardEvent } from 'react'
import type { Hotel } from '@/types/hotel'
import styles from './PackageForm.module.css'

const MAX_RESULTS = 50

type Props = {
  hotels: Hotel[]
  selected?: Hotel
  onSelect: (hotel: Hotel) => void
}

function hotelLabel(hotel: Hotel) {
  return `${hotel.name} (${hotel.region})`
}

export default function HotelCombobox({ hotels, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const found = q ? hotels.filter((h) => hotelLabel(h).toLowerCase().includes(q)) : hotels
    return found.slice(0, MAX_RESULTS)
  }, [hotels, query])

  function choose(hotel: Hotel) {
    onSelect(hotel)
    setOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter' && open) {
      event.preventDefault()
      if (matches[activeIndex]) choose(matches[activeIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className={styles.combobox}>
      <input
        value={open ? query : selected ? hotelLabel(selected) : ''}
        placeholder="Search your hotels…"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        onFocus={() => {
          setQuery('')
          setActiveIndex(0)
          setOpen(true)
        }}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          setQuery(e.target.value)
          setActiveIndex(0)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
      />

      {open && (
        <ul className={styles.comboList} role="listbox">
          {matches.length === 0 && <li className={styles.comboEmpty}>No hotels match.</li>}
          {matches.map((hotel, index) => (
            <li
              key={hotel.id}
              role="option"
              aria-selected={hotel.id === selected?.id}
              className={index === activeIndex ? `${styles.comboOption} ${styles.comboOptionActive}` : styles.comboOption}
              // mousedown (not click) so it fires before the input's blur closes the list
              onMouseDown={(e) => {
                e.preventDefault()
                choose(hotel)
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {hotelLabel(hotel)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
