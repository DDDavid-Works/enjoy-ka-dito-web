import type { Metadata } from 'next'
import InboundForeigners from './InboundForeigners'

export const metadata: Metadata = {
  title: 'Philippines Inbound Packages for Foreign Visitors',
  description:
    'Inbound Philippines packages for foreign visitors with English-speaking guides, vetted hotels and fully handled inter-island flights and transfers.',
  alternates: { canonical: '/philippines-inbound' },
}

export default function Page() {
  return <InboundForeigners />
}
