import type { QuotationAccommodation, QuotationInclusion, QuotationOptionalTour } from '@/types/package'

// Tidy the quotation sections before saving: trim text and drop blank rows.
// Shared by the package form's Quotation tab and the Quotations module.

// With dropParentPrices (Quotations), a row that has children keeps no price of its own,
// because its Total is calculated from those children.
export function cleanInclusions(
  items: QuotationInclusion[],
  options: { dropParentPrices?: boolean } = {},
): QuotationInclusion[] {
  const { dropParentPrices } = options
  return items
    .map((item) => {
      const details = item.details
        .map((d) => {
          const subDetails = d.details
            .map((sub) => ({ text: sub.text.trim(), price: sub.price }))
            .filter((sub) => sub.text || sub.price !== undefined)
          return {
            text: d.text.trim(),
            price: dropParentPrices && subDetails.length ? undefined : d.price,
            details: subDetails,
          }
        })
        .filter((d) => d.text || d.price !== undefined || d.details.length)
      return {
        text: item.text.trim(),
        price: dropParentPrices && details.length ? undefined : item.price,
        details,
      }
    })
    .filter((item) => item.text || item.price !== undefined || item.details.length)
}

export function cleanAccommodations(items: QuotationAccommodation[]): QuotationAccommodation[] {
  return items.filter((a) => a.hotelId).map((a) => ({ ...a, remarks: a.remarks?.trim() || undefined }))
}

export function cleanExclusions(items: string[]): string[] {
  return items.map((e) => e.trim()).filter(Boolean)
}

export function cleanOptionalTours(items: QuotationOptionalTour[]): QuotationOptionalTour[] {
  return items
    .map((tour) => ({ text: tour.text.trim(), details: tour.details.map((d) => d.trim()).filter(Boolean) }))
    .filter((tour) => tour.text || tour.details.length)
}
