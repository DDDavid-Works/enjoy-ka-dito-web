import type { Metadata } from 'next'
import CorporateTeamBuilding from './CorporateTeamBuilding'

export const metadata: Metadata = {
  title: 'Corporate Team Building Packages',
  description:
    'Corporate team building trips in the Philippines and Asia with complete logistics, official receipts and on-site coordinators for teams of all sizes.',
  alternates: { canonical: '/corporate-team-building' },
}

export default function Page() {
  return <CorporateTeamBuilding />
}
