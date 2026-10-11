import type { QuotationAccommodation, QuotationInclusion, QuotationOptionalTour } from './package'

export type Quotation = {
  id: string
  title: string
  customerName: string
  quoteDate: string | null
  remarks: string
  package?: { id: string; title: string } | null
  inquiry?: { id: string; name: string } | null
  inclusions: QuotationInclusion[]
  inclusionNotes: string
  accommodations: QuotationAccommodation[]
  exclusions: string[]
  optionalTours: QuotationOptionalTour[]
  createdAt: string
  updatedAt: string
}

export type QuotationInput = Omit<Quotation, 'id' | 'package' | 'inquiry' | 'createdAt' | 'updatedAt'> & {
  // Only used on create: the package this quotation was started from.
  packageId?: string
  // Only used on create: the inquiry this quotation is created from.
  inquiryId?: string
}
