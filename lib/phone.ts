// "+63 917 123 4567" -> "+639171234567" for tel: links.
export function toTelHref(number: string) {
  return `tel:${number.replace(/[^\d+]/g, '')}`
}

// Pulls the phone number out of an entry that may carry a label, e.g. "Mobile: 0961-360-2077" -> "0961-360-2077".
function extractNumber(entry: string) {
  return entry.match(/\+?\d[\d\s().-]{5,}\d/)?.[0] ?? ''
}

// Philippine mobile numbers: 09XX XXX XXXX, +63 9XX XXX XXXX or 9XX XXX XXXX. Landlines don't work on WhatsApp.
function toMobileDigits(entry: string) {
  const digits = extractNumber(entry).replace(/\D/g, '')
  if (/^09\d{9}$/.test(digits)) return `63${digits.slice(1)}`
  if (/^639\d{9}$/.test(digits)) return digits
  if (/^9\d{9}$/.test(digits)) return `63${digits}`
  return undefined
}

// First mobile number in the list as digits with the country code ("639613602077") for wa.me links, or undefined.
export function findWhatsappNumber(entries: string[]) {
  for (const entry of entries) {
    const mobile = toMobileDigits(entry)
    if (mobile) return mobile
  }
  return undefined
}
