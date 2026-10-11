# Vite -> Next.js migration notes

Source app: `../ui-web` (Vite + react-router). API (`../api`, NestJS) is unchanged.

## Status
- [x] Phase 0: inventory (below)
- [x] Phase 1: scaffold, globals.css, public/, types, Header/Footer/ChatWidget, root layout, company details fetch
- [x] Phase 1b: self-hosted fonts
- [x] Phase 1c: `web/` pushed to https://github.com/DDDavid-Works/enjoy-ka-dito-web (branch `main`)
- [x] Phase 2: public pages + SEO (metadata, sitemap, robots, 404, JSON-LD). Left over: `next/image` for logos (kept `<img>` to avoid layout shifts)
- [x] Phase 3: admin (client components under `app/admin`, noindex, auth guard). Company-details saves don't refresh the public site's cache yet: Phase 4
- [ ] Phase 4: revalidation webhook (API -> `revalidateTag`)
- [ ] Phase 5: Railway deploy, custom domain
- [ ] Phase 6: verification

## Why (live baseline, checked before the migration)
- The Vite SPA served the same 680-byte shell with status 200 for every URL, including `/robots.txt`, `/sitemap.xml` and unknown URLs. Package records were invisible to crawlers.
- Prod URLs: UI `https://enjoy-ka-dito-ui-production.up.railway.app`, API `https://enjoy-ka-dito-api-production.up.railway.app`. Prod `GET /packages` currently returns `[]` (no real packages yet).
- API returns published packages to anonymous visitors, drafts only to admins. Admin auth is a JWT in localStorage (`ekd-admin-auth`).

## Remaining phases (detail)
- **Phase 2:** port public pages with server-side fetching (packages list + detail via API, `generateStaticParams` + ISR). Add `generateMetadata` per page, `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`, JSON-LD (`TravelAgency`, `TouristTrip`), OG tags, `next/image` for logos. Header currently prefetches unported routes (6 console 404s) - they vanish once pages exist.
- **Phase 3:** admin under `app/admin` as client components with noindex. Port `AuthProvider` and `ProtectedRoute`, guard `window`/`document` in quotation pages, remove the temporary "Admin" link in `components/Footer.tsx`.
- **Phase 4:** API route in Next.js using `revalidateTag`/`revalidatePath`, secret `REVALIDATE_SECRET`; NestJS API calls it on package/company changes.
- **Phase 5:** deploy to Railway as a separate service on a temporary URL (`NEXT_PUBLIC_API_URL`, standalone output), then switch the custom domain.
- **Phase 6:** verify: screenshot comparison, curl the raw HTML, Lighthouse, social previews, submit sitemap to Search Console.

## Decisions made
- **Git hosting (decided 2026-10-11):** `web/` gets its own new GitHub repo (the user is creating it), separate from `enjoy-ka-dito-ui`. Locally `web/` stays a sibling folder of `ui-web/` and `api/`. Railway deploys it as a new, separate service; the old Vite site keeps running from `enjoy-ka-dito-ui` until cutover (then repoint the domain). Done: remote `origin` = https://github.com/DDDavid-Works/enjoy-ka-dito-web.git, local branch `main` tracks `origin/main`.
- **Fonts (decided + done 2026-10-11):** Clash Grotesk (400/500/600) and General Sans (400/500/600) are self-hosted as woff2 in `app/fonts/` via `next/font/local` in `app/layout.tsx`. `globals.css` uses `--font-clash-grotesk` / `--font-general-sans`. No more requests to Fontshare.

## Open decisions
- Adding real packages to production.
- Other roadmap items: custom domain, inquiry email notifications, rate limiting/spam protection, analytics, privacy policy + cookie consent.
- `npm audit`: one high-severity issue in `braces` (dev dependency), untouched.

## Route map
| react-router | Next.js |
|---|---|
| `/` | `app/page.tsx` |
| `/tour-packages`, `/tour-packages/:slug` | `app/tour-packages/page.tsx`, `app/tour-packages/[slug]/page.tsx` |
| `/travel-services`, `/about-us`, `/contact-us`, `/request-a-quote` | same path under `app/` |
| `/corporate-team-building`, `/family-senior-tours`, `/philippines-inbound` | same path under `app/` |
| `/admin/**` | `app/admin/**` (client components, noindex) |

## Browser-only code to guard when porting
- `components/Header.tsx`: window scroll listener (already a client component)
- `ScrollToTop.tsx`: not needed, Next handles scroll
- `context/AuthContext.tsx`, `lib/api.ts`: localStorage token (api.ts already skips it on the server)
- `QuotationForm`, `QuotationsList`: `window.open`; `QuotationPrint`: `document.title`, `document.fonts`, `window.print/close`
- `lib/useCompanyDetails.ts`: replaced by server-side `lib/company.ts` (`getCompanyDetails`, tag `company`)

## Notes
- This Next.js version enables Cache Components: uncached fetches must sit inside `<Suspense>` or use `'use cache'`. See `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`.
- Env: `NEXT_PUBLIC_API_URL` replaces `VITE_API_URL` (baked in at build time).
- Fonts are self-hosted (`app/fonts/`, `next/font/local`).
- `<img>` kept for logos for now to avoid layout shifts; move to `next/image` in Phase 2.
- Dev server: port 7501 (old app uses 7500).

## Phase 2 notes (done 2026-10-11)
- Data: `lib/packages.ts` (`getPackages`, `getPackage`; `'use cache'`, tags `packages` and `package:<slug>`). `lib/cache.ts` `FAILURE_LIFE` is used for API-down fallbacks, because the built-in `seconds` profile counts as request-time data and breaks prerendering (so the API must be reachable at build time, or fallbacks get baked in for ~30s).
- Pages: static pages are server components with `metadata`; form pages (`contact-us`, `request-a-quote`, `corporate-team-building`, `family-senior-tours`, `philippines-inbound`) keep the old component as a client component (still server-rendered HTML) behind a server `page.tsx`. `tour-packages` passes server-fetched packages to a client filter component.
- `tour-packages/[slug]`: `generateStaticParams` returns published slugs, or a `_` placeholder when there are none (Cache Components rejects an empty list). New slugs render on first visit and are cached.
- Real 404s: `proxy.ts` checks the slug against the API and rewrites missing ones to a 404. Without it, unprerendered slugs stream with HTTP 200 (+ `noindex`). The check costs one API call per request to a package URL.
- SEO: `metadataBase` + title template in the root layout, per-page canonical/OG, `TouristTrip` JSON-LD on package pages, `TravelAgency` JSON-LD on the home page, `app/robots.ts` (disallows `/admin`), `app/sitemap.ts` (static pages + published packages).
- New env: `NEXT_PUBLIC_SITE_URL` (public origin for canonical URLs/sitemap; set it in Railway). Defaults to `http://localhost:7501`.
- Footer year now comes from a cached helper (`new Date()` isn't allowed in a prerendered component).
- Verified with `next build` + `next start` against the local API: package pages, list, robots, sitemap serve the content in raw HTML; unknown slug and unknown URL return 404.

## Phase 3 notes (done 2026-10-11)
- Layout split with a route group: public pages live in `app/(public)/` (layout = Header/Footer/ChatWidget); `app/admin/` has its own layout (no public chrome). Root layout only has `<html>`/`<body>`/fonts. A `usePathname()` switch in the root layout was tried and fails to prerender on dynamic routes. `app/not-found.tsx` renders the public layout itself.
- Admin pages are the old components copied under `app/admin/**` with `'use client'`; each route has a tiny `page.tsx`. The forms are shared between `new` and `[id]/edit`. react-router -> `next/link`, `useRouter`, `useParams`, `useSearchParams`.
- Auth: `context/AuthContext.tsx` reads localStorage after mount (not during render, to avoid hydration mismatch). `components/AdminGuard.tsx` replaces `ProtectedRoute` (login redirect + module check by URL section). The guard is client-side only; the API still enforces permissions.
- `app/admin/layout.tsx`: `robots: noindex, nofollow`, and a `<Suspense>` around children (client hooks that read params/query need it).
- Removed the temporary "Admin" link from the footer. Admin is reached at `/admin/login`.
- `invalidateCompanyDetails()` is gone; saving company details in admin needs `revalidateTag('company')` on the Next.js side: Phase 4.
- Verified locally: login, dashboard, packages/quotations/inquiries lists, package + quotation edit routes, no console errors; unauthenticated `/admin` redirects to login; print route returns 200.
