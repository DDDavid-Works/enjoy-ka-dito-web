import type { Metadata } from 'next'
import JsonLd, { breadcrumb, service } from '@/components/JsonLd'
import FamilySeniorTours from './FamilySeniorTours'

export const metadata: Metadata = {
  title: 'Family and Senior Tours',
  description:
    'Relaxed, senior-friendly family tours with private transport and door-to-door managed itineraries across the Philippines and Asia. Request a free quote.',
  alternates: { canonical: '/family-senior-tours' },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          service('Family and Senior Tours', String(metadata.description), '/family-senior-tours', ['Philippines', 'Asia']),
          breadcrumb('Family and Senior Tours', '/family-senior-tours'),
        ]}
      />
      <FamilySeniorTours />
    </>
  )
}
