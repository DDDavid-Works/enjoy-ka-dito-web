// "+63 917 123 4567" -> "+639171234567" for tel: links.
export function toTelHref(number: string) {
  return `tel:${number.replace(/[^\d+]/g, '')}`
}

// "+63 917 123 4567" or "0917 123 4567" -> "639171234567" for wa.me links (digits only, with country code).
export function toWhatsappNumber(number: string) {
  const digits = number.replace(/\D/g, '')
  return digits.startsWith('0') ? `63${digits.slice(1)}` : digits
}
