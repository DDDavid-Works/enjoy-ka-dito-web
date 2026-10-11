'use client'

import { useLayoutEffect, useRef, useState } from 'react'

type Props = {
  value?: number
  onChange: (price: number | undefined) => void
  className?: string
  placeholder?: string
  ariaLabel?: string
}

// Keep digits and the first decimal point, at most 2 decimal places.
// Also tidies pasted text: "1,800.505" -> "1800.50".
function sanitize(text: string): string {
  const cleaned = text.replace(/[^\d.]/g, '')
  const dot = cleaned.indexOf('.')
  if (dot === -1) return cleaned
  const whole = cleaned.slice(0, dot)
  const decimals = cleaned.slice(dot + 1).replace(/\./g, '').slice(0, 2)
  return `${whole}.${decimals}`
}

// "1234567.8" -> "1,234,567.8" (no decimals are added or removed).
function addCommas(plain: string): string {
  const [whole, decimals] = plain.split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimals === undefined ? grouped : `${grouped}.${decimals}`
}

const COUNTED = /[\d.]/

// A price box that groups thousands with commas as you type and always shows two
// decimals (1800 -> 1,800.00) once you leave it.
export default function PriceField({ value, onChange, className, placeholder = '0.00', ariaLabel }: Props) {
  const [draft, setDraft] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // How many digits/dots sit left of the caret, so it can be put back after commas change the text.
  const pendingCaret = useRef<number | null>(null)

  const formatted =
    value === undefined ? '' : value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  useLayoutEffect(() => {
    const input = inputRef.current
    if (pendingCaret.current === null || !input) return

    let remaining = pendingCaret.current
    let position = 0
    while (remaining > 0 && position < input.value.length) {
      if (COUNTED.test(input.value[position])) remaining -= 1
      position += 1
    }
    input.setSelectionRange(position, position)
    pendingCaret.current = null
  }, [draft])

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      className={className}
      style={{ textAlign: 'right' }}
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={draft ?? formatted}
      onChange={(e) => {
        const raw = e.target.value
        const caret = e.target.selectionStart ?? raw.length
        pendingCaret.current = [...raw.slice(0, caret)].filter((c) => COUNTED.test(c)).length

        const plain = sanitize(raw)
        setDraft(addCommas(plain))
        const parsed = parseFloat(plain)
        onChange(Number.isNaN(parsed) ? undefined : parsed)
      }}
      onBlur={() => setDraft(null)}
    />
  )
}
