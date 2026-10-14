import { cacheLife, cacheTag } from 'next/cache'
import { FAILURE_LIFE } from './cache'
import type { CompanyDetails } from '@/types/company'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

// Shown if the API can't be reached, so the site still has sensible contact info.
const FALLBACK: CompanyDetails = {
  emails: ['hello@enjoykadito.com'],
  address: '',
  contactNumbers: ['+63 900 000 0000'],
}

// Cached on the server; call revalidateTag('company') after the admin saves to refresh it sooner.
export async function getCompanyDetails(): Promise<CompanyDetails> {
  'use cache'
  cacheTag('company')
  cacheLife('minutes')

  try {
    const response = await fetch(`${API_URL}/company-details`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const data = await response.json()
    // An API that predates several emails only sends `email`.
    return { ...data, emails: data.emails ?? (data.email ? [data.email] : []) }
  } catch {
    // Don't keep the fallback around: retry on the next request.
    cacheLife(FAILURE_LIFE)
    return FALLBACK
  }
}
