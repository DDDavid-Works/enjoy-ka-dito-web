// Checks every URL in the old WordPress sitemaps against a running copy of the new site.
//   node scripts/check-legacy-urls.mjs http://localhost:7502 [pages|posts|all]
// Pages are expected to answer 200 or redirect; anything else is listed so a redirect (or a decision) can be added.
const base = (process.argv[2] ?? 'http://localhost:7501').replace(/\/$/, '')
const scope = process.argv[3] ?? 'pages'
const WP = 'https://enjoykadito.com'
const sitemaps = {
  pages: ['page-sitemap.xml'],
  posts: ['post-sitemap.xml', 'post-sitemap2.xml'],
  all: ['page-sitemap.xml', 'post-sitemap.xml', 'post-sitemap2.xml', 'category-sitemap.xml', 'post_tag-sitemap.xml', 'author-sitemap.xml'],
}[scope]

const paths = []
for (const name of sitemaps) {
  const xml = await (await fetch(`${WP}/${name}`)).text()
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) paths.push(new URL(m[1]).pathname)
}

// Follows redirects by hand (external ones are not followed) and judges the final answer.
async function resolve(path) {
  let url = base + path
  const hops = []
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, { redirect: 'manual' })
    const location = res.headers.get('location')
    if (res.status < 300 || res.status >= 400 || !location) return { status: res.status, hops, final: url }
    const next = new URL(location, url)
    hops.push(next.href)
    if (next.origin !== new URL(base).origin) return { status: 'external', hops, final: next.href }
    url = next.href
  }
  return { status: 'loop', hops, final: url }
}

const results = { ok: [], redirect: [], missing: [] }
for (const path of [...new Set(paths)]) {
  const { status, final, hops } = await resolve(path)
  const target = final.replace(base, '') || '/'
  if (status === 200 && hops.length === 0) results.ok.push(path)
  else if (status === 200 || status === 'external') results.redirect.push(`${path} -> ${target}`)
  else results.missing.push(`${path} -> ${target} (${status})`)
}

console.log(`checked ${paths.length} old URLs against ${base}`)
console.log(`  200 as is: ${results.ok.length}   redirected: ${results.redirect.length}   not handled: ${results.missing.length}`)
if (results.missing.length) console.log('\nNot handled:\n' + results.missing.map((p) => '  ' + p).join('\n'))
process.exitCode = results.missing.length ? 1 : 0
