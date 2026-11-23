import type { Metadata } from 'next'
import JsonLd, { breadcrumb } from '@/components/JsonLd'
import RequestQuote from './RequestQuote'

export const metadata: Metadata = {
  title: 'Request a Free Tour & Travel Quote',
  description:
    'Tell us where you want to go and get a free, customized travel quote from Enjoy Ka Dito within 1-2 business days. Local, international and group trips.',
  alternates: { canonical: '/request-a-quote' },
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumb('Request a Quote', '/request-a-quote')} />
      <RequestQuote />
    </>
  )
}
