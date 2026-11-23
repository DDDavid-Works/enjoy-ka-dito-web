import type { Metadata } from 'next'
import JsonLd, { breadcrumb, service } from '@/components/JsonLd'
import InboundForeigners from './InboundForeigners'

export const metadata: Metadata = {
  title: 'Philippines Inbound Packages for Foreign Visitors',
  description:
    'Philippines packages for foreign visitors with English-speaking guides, vetted hotels and handled inter-island flights and transfers. Request a free quote.',
  alternates: { canonical: '/philippines-inbound' },
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          service('Philippines Inbound Tours', String(metadata.description), '/philippines-inbound', ['Philippines']),
          breadcrumb('Philippines Inbound Tours', '/philippines-inbound'),
        ]}
      />
      <InboundForeigners />
    </>
  )
}
