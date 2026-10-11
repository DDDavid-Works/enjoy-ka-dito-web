// "+63 917 123 4567" -> "+639171234567" for tel: links.
export function toTelHref(number: string) {
  return `tel:${number.replace(/[^\d+]/g, '')}`
}
