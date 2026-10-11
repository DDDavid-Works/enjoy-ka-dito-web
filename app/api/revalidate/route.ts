import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'

// Only tags the site actually caches (see lib/packages.ts and lib/company.ts) can be revalidated.
const TAG_PATTERN = /^(packages|company|package:[a-z0-9-]{1,200})$/

function secretMatches(provided: string | null) {
  const expected = process.env.REVALIDATE_SECRET
  if (!expected || !provided) return false

  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// Called by the NestJS API after a package or the company details change:
//   POST /api/revalidate   header: x-revalidate-secret   body: { "tags": ["packages", "package:my-slug"] }
export async function POST(request: Request) {
  if (!secretMatches(request.headers.get('x-revalidate-secret'))) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const tags: unknown = body?.tags

  if (!Array.isArray(tags) || tags.length === 0 || tags.length > 20 || !tags.every((t) => typeof t === 'string' && TAG_PATTERN.test(t))) {
    return Response.json({ message: 'Expected { tags: string[] } with known tags' }, { status: 400 })
  }

  // expire: 0 drops the cached data right away, so the next visit shows the edit instead of the stale copy.
  for (const tag of new Set(tags as string[])) revalidateTag(tag, { expire: 0 })

  return Response.json({ revalidated: true, tags })
}
