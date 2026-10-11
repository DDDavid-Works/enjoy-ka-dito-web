import { cacheLife, cacheTag } from 'next/cache'
import type { CompanyDetails } from '@/types/company'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

// Shown if the API can't be reached, so the site still has sensible contact info.
const FALLBACK: CompanyDetails = {
  email: 'hello@enjoykadito.com',
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
    return await response.json()
  } catch {
    // Don't keep the fallback around: retry on the next request.
    cacheLife('seconds')
    return FALLBACK
  }
}

// "+63 917 123 4567" -> "+639171234567" for tel: links.
export function toTelHref(number: string) {
  return `tel:${number.replace(/[^\d+]/g, '')}`
}
