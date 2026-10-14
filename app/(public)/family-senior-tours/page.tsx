import type { Metadata } from 'next'
import { getCompanyDetails } from '@/lib/company'
import FamilySeniorTours from './FamilySeniorTours'

export const metadata: Metadata = {
  title: 'Family and Senior Tours',
  description:
    'Relaxed, senior-friendly family tours with private transport and door-to-door managed itineraries across the Philippines and Asia.',
  alternates: { canonical: '/family-senior-tours' },
}

export default async function Page() {
  const company = await getCompanyDetails()
  return <FamilySeniorTours company={company} />
}
