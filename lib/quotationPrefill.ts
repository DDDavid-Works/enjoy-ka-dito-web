import type { Inquiry } from '@/types/inquiry'
import type { Package } from '@/types/package'
import type { QuotationInput } from '@/types/quotation'
import { moveParentPricesIntoChildren } from '@/lib/quotationTotals'

type Sections = Pick<QuotationInput, 'inclusions' | 'inclusionNotes' | 'accommodations' | 'exclusions' | 'optionalTours'>

// A package's quotation details as an independent copy for a new quotation.
export function sectionsFromPackage(pkg: Package): Sections {
  return {
    inclusions: moveParentPricesIntoChildren(structuredClone(pkg.quotationInclusions ?? [])),
    inclusionNotes: pkg.quotationInclusionNotes ?? '',
    accommodations: structuredClone(pkg.quotationAccommodations ?? []),
    exclusions: [...(pkg.quotationExclusions ?? [])],
    optionalTours: structuredClone(pkg.quotationOptionalTours ?? []),
  }
}

// What the customer told us, as plain lines for the quotation's Remarks.
function remarksFromInquiry(inquiry: Inquiry): string {
  const details: Array<[string, string | undefined]> = [
    ['Company', inquiry.companyName],
    ['Designation', inquiry.designation],
    ['Traveler type', inquiry.travelerType],
    ['Group type', inquiry.groupType],
    ['Destination', inquiry.destination],
    ['Desired destinations', inquiry.desiredDestinations],
    ['Pax', inquiry.travelerCount],
    ['Travel dates', inquiry.travelDates],
    ['Trip length', inquiry.tripDuration],
    ['Budget', inquiry.budgetBracket],
    ['Country', inquiry.countryOfResidence],
    ['Seniors/children traveling', inquiry.travelingWithSeniorsOrChildren],
    ['Flights booked', inquiry.flightsBooked],
    ['Email', inquiry.email],
    ['Phone', inquiry.phone],
  ]

  const lines = [`From the inquiry received ${new Date(inquiry.createdAt).toLocaleDateString()}`]
  for (const [label, value] of details) {
    if (value?.trim()) lines.push(`${label}: ${value.trim()}`)
  }
  if (inquiry.message?.trim()) lines.push('', `Message: ${inquiry.message.trim()}`)
  return lines.join('\n')
}

// The unsaved quotation details to start from for an inquiry. When the inquiry is linked
// to a package (pass it in), that package's quotation details come along too.
export function buildQuotationFromInquiry(
  inquiry: Inquiry,
  pkg: Package | null,
): Partial<QuotationInput> & { title: string } {
  const title = pkg ? `${pkg.title} Quotation` : `${inquiry.destination?.trim() || inquiry.name} Quotation`

  return {
    title,
    customerName: inquiry.name,
    travelDate: inquiry.travelDates?.trim() ?? '',
    inquiryId: inquiry.id,
    remarks: remarksFromInquiry(inquiry),
    ...(pkg ? { packageId: pkg.id, ...sectionsFromPackage(pkg) } : {}),
  }
}
