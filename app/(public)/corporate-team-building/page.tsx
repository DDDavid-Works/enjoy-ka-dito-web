import type { Metadata } from 'next'
import JsonLd, { breadcrumb, service } from '@/components/JsonLd'
import CorporateTeamBuilding from './CorporateTeamBuilding'

export const metadata: Metadata = {
  title: 'Corporate Team Building Packages',
  description:
    'Corporate team building trips in the Philippines and Asia with full logistics, official receipts and on-site coordinators for any team size. Get a free quote.',
  alternates: { canonical: '/corporate-team-building' },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          service('Corporate Team Building', String(metadata.description), '/corporate-team-building', ['Philippines', 'Asia']),
          breadcrumb('Corporate Team Building', '/corporate-team-building'),
        ]}
      />
      <CorporateTeamBuilding />
    </>
  )
}
