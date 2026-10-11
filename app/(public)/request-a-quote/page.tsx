import type { Metadata } from 'next'
import { Suspense } from 'react'
import RequestQuote from './RequestQuote'

export const metadata: Metadata = {
  title: 'Request a Quote',
  description:
    'Tell us where you want to go and receive a customized travel quote from Enjoy Ka Dito within 1-2 business days.',
  alternates: { canonical: '/request-a-quote' },
}

export default function Page() {
  return (
    // The form reads ?destination= on the client, which needs a Suspense boundary.
    <Suspense>
      <RequestQuote />
    </Suspense>
  )
}
