export type Hotel = {
  id: string
  name: string
  contactPerson?: string
  contactNumbers?: string
  region: string
  starRating: number
  createdAt: string
  updatedAt: string
}

export type HotelInput = Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>

export const STAR_RATING_OPTIONS = [0, 1, 2, 3, 4, 5]

export function formatStarRating(rating: number): string {
  return rating === 0 ? 'Unrated' : `${rating} Star${rating > 1 ? 's' : ''}`
}
