'use client'

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { packagesApi } from '@/lib/api'
import styles from './DestinationCombobox.module.css'

type Props = {
  name: string
  // Name of the hidden field that carries the matched tour's id (empty for free text).
  packageFieldName?: string
  placeholder?: string
  defaultValue?: string
  required?: boolean
}

// Text input that suggests current tour titles but accepts any free value.
export default function DestinationCombobox({ name, packageFieldName = 'packageId', placeholder, defaultValue = '', required }: Props) {
  const [value, setValue] = useState(defaultValue)
  const [tours, setTours] = useState<{ id: string; title: string }[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    let cancelled = false

    packagesApi
      .list()
      .then((packages) => {
        if (cancelled) return
        setTours(
          packages
            .map((p) => ({ id: p.id, title: p.title.trim() }))
            .filter((t) => t.title)
            .sort((a, b) => a.title.localeCompare(b.title)),
        )
      })
      .catch(() => {
        // Suggestions are optional; the field still works as a plain text input.
      })

    return () => {
      cancelled = true
    }
  }, [])

  const options = useMemo(() => [...new Set(tours.map((t) => t.title))], [tours])

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase()
    return query ? options.filter((o) => o.toLowerCase().includes(query)) : options
  }, [options, value])

  // Linked only while the text exactly matches a tour title; free text carries no link.
  const packageId = tours.find((t) => t.title.toLowerCase() === value.trim().toLowerCase())?.id ?? ''

  const showList = open && matches.length > 0

  function choose(option: string) {
    setValue(option)
    setOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((i) => Math.min(i + 1, matches.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (event.key === 'Enter' && showList && activeIndex >= 0) {
      event.preventDefault()
      choose(matches[activeIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className={styles.combobox}>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-autocomplete="list"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          setValue(e.target.value)
          setActiveIndex(-1)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
      />

      <input type="hidden" name={packageFieldName} value={packageId} />

      {showList && (
        <ul className={styles.list} role="listbox">
          {matches.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={index === activeIndex}
              className={index === activeIndex ? `${styles.option} ${styles.optionActive}` : styles.option}
              // mousedown (not click) so it fires before the input's blur closes the list
              onMouseDown={(e) => {
                e.preventDefault()
                choose(option)
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
