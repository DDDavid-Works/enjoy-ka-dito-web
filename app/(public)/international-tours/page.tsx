import type { Metadata } from 'next'
import InternationalTours from './InternationalTours'

export const metadata: Metadata = {
  title: 'International Tours for Filipino Travelers',
  description:
    'Fully managed international tour packages for Filipino travelers: visa assistance, flights, hotels and guided itineraries to Asia and beyond.',
  alternates: { canonical: '/international-tours' },
}

export default function Page() {
  return <InternationalTours />
}
