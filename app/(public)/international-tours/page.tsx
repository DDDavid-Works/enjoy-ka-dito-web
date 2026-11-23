import type { Metadata } from 'next'
import JsonLd, { breadcrumb, service } from '@/components/JsonLd'
import InternationalTours from './InternationalTours'

export const metadata: Metadata = {
  title: 'International Tours for Filipino Travelers',
  description:
    'Fully managed international tours for Filipino travelers: visa assistance, flights, hotels and guided itineraries to Asia and beyond. Request a free quote.',
  alternates: { canonical: '/international-tours' },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          service('International Tours', String(metadata.description), '/international-tours', ['Asia', 'Worldwide']),
          breadcrumb('International Tours', '/international-tours'),
        ]}
      />
      <InternationalTours />
    </>
  )
}
