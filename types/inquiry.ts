export type InquiryStatus = 'new' | 'contacted' | 'closed'
export type InquiryType = 'quote' | 'general'
export type TravelerType = 'Corporate Group' | 'Family' | 'Senior Group' | 'Solo Foreigner'

export const TRAVELER_TYPES: TravelerType[] = ['Corporate Group', 'Family', 'Senior Group', 'Solo Foreigner']

export const CORPORATE_BUDGET_BRACKETS = ['Under ₱100k', '₱100k–₱300k', '₱300k–₱500k', '₱500k+']

export const GROUP_TYPES = ['Solo', 'Couple', 'Family', 'Group']
export const FLIGHT_STATUSES = ['Yes, dates are locked', 'No, still planning']
export const DESIRED_DESTINATIONS = ['Palawan', 'Boracay', 'Cebu', 'Bohol', 'Manila', 'Open to Suggestions']
export const TRIP_DURATIONS = ['3–5 Days', '1 Week', '2 Weeks', '2 Weeks+']

export type Inquiry = {
  id: string
  name: string
  companyName?: string
  designation?: string
  email: string
  phone?: string
  budgetBracket?: string
  travelerType?: TravelerType
  destination?: string
  travelerCount?: string
  travelDates?: string
  countryOfResidence?: string
  groupType?: string
  travelingWithSeniorsOrChildren?: string
  flightsBooked?: string
  desiredDestinations?: string
  tripDuration?: string
  message?: string
  package?: { id: string; title: string; slug: string } | null
  quotations?: { id: string; title: string }[]
  type: InquiryType
  status: InquiryStatus
  createdAt: string
}

export type InquiryInput = {
  name: string
  companyName?: string
  designation?: string
  email: string
  phone?: string
  budgetBracket?: string
  travelerType?: TravelerType
  destination?: string
  travelerCount?: string
  travelDates?: string
  countryOfResidence?: string
  groupType?: string
  travelingWithSeniorsOrChildren?: string
  flightsBooked?: string
  desiredDestinations?: string
  tripDuration?: string
  message?: string
  packageId?: string
  type?: InquiryType
}
