import type { Metadata } from 'next'
import FamilySeniorTours from './FamilySeniorTours'

export const metadata: Metadata = {
  title: 'Family and Senior Tours',
  description:
    'Relaxed, senior-friendly family tours with private transport and door-to-door managed itineraries across the Philippines and Asia.',
  alternates: { canonical: '/family-senior-tours' },
}

export default function Page() {
  return <FamilySeniorTours />
}
