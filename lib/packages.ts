import { cacheLife, cacheTag } from 'next/cache'
import { FAILURE_LIFE } from './cache'
import type { Package } from '@/types/package'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

// The API returns only published packages to anonymous requests, which is what these server fetches are.
// Call revalidateTag('packages') after the admin changes any package (Phase 4 webhook).
export async function getPackages(): Promise<Package[]> {
  'use cache'
  cacheTag('packages')
  cacheLife('minutes')

  try {
    const response = await fetch(`${API_URL}/packages`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch {
    // An API outage shouldn't be cached as "no packages": retry on the next request.
    cacheLife(FAILURE_LIFE)
    return []
  }
}

// Returns null only when the API says the package doesn't exist; other failures throw so they aren't cached.
export async function getPackage(slug: string): Promise<Package | null> {
  'use cache'
  cacheTag('packages', `package:${slug}`)
  cacheLife('minutes')

  const response = await fetch(`${API_URL}/packages/${encodeURIComponent(slug)}`)
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`Failed to load package (HTTP ${response.status})`)
  return response.json()
}
