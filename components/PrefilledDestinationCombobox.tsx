'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DestinationCombobox from './DestinationCombobox'

type Props = { name: string; placeholder?: string }

function FromQueryString(props: Props) {
  const searchParams = useSearchParams()
  return <DestinationCombobox {...props} defaultValue={searchParams.get('destination') ?? ''} />
}

// Pre-fills the destination from ?destination=... (the "Request a Quote" link on package pages).
// Only this field depends on the query string, so the rest of the page stays in the server-rendered HTML.
export default function PrefilledDestinationCombobox(props: Props) {
  return (
    <Suspense fallback={<DestinationCombobox {...props} />}>
      <FromQueryString {...props} />
    </Suspense>
  )
}
