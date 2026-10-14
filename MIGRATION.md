# Vite -> Next.js migration notes

Source app: `../ui-web` (Vite + react-router). API (`../api`, NestJS) is unchanged.

## Status
- [x] Phase 0: inventory (below)
- [x] Phase 1: scaffold, globals.css, public/, types, Header/Footer/ChatWidget, root layout, company details fetch
- [x] Phase 1b: self-hosted fonts
- [x] Phase 1c: `web/` pushed to https://github.com/DDDavid-Works/enjoy-ka-dito-web (branch `main`)
- [x] Phase 2: public pages + SEO (metadata, sitemap, robots, 404, JSON-LD). Left over: `next/image` for logos (kept `<img>` to avoid layout shifts)
- [x] Phase 3: admin (client components under `app/admin`, noindex, auth guard). Company-details cache refresh was added in Phase 4
- [x] Phase 4: revalidation webhook (API -> `revalidateTag`)
- [x] Phase 5: Railway deploy on a temporary URL (done 2026-10-14). Custom domain cutover waits for Phase 6
- [ ] Phase 6: verification (audit, Lighthouse, visual comparison done; webhook test, social previews, Search Console and the domain cutover remain: see CUTOVER.md)

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
- `invalidateCompanyDetails()` is gone; the public site now refreshes via the Phase 4 webhook.
- Verified locally: login, dashboard, packages/quotations/inquiries lists, package + quotation edit routes, no console errors; unauthenticated `/admin` redirects to login; print route returns 200.

## Phase 4 notes (done 2026-10-11)
- Web: `app/api/revalidate/route.ts`. `POST` with header `x-revalidate-secret` (= `REVALIDATE_SECRET`, timing-safe compare) and body `{ "tags": [...] }`. Only `packages`, `company` and `package:<slug>` are accepted. Calls `revalidateTag(tag, { expire: 0 })`, so the next visit gets fresh data instead of a stale copy.
- API (separate repo, `api/`): `src/revalidation/` (global `RevalidationService`). Called fire-and-forget from `PackagesService` create/update/remove (tags `packages` + `package:<slug>`, old and new slug on update) and `CompanyService.update` (`company`). It does nothing unless `WEB_URL` and `REVALIDATE_SECRET` are set, times out after 5s, and only logs a warning on failure (it never fails the admin's save).
- `proxy.ts` fetch is tagged `packages`, so a slug cached as 404 is cleared when it gets created/published.
- Fix found while testing: after an entry is dropped, the dynamic package route must be re-rendered on demand, which needs `params` read inside `<Suspense>` and the public `<Header>` (uses `usePathname`) inside `<Suspense>`. Both done; real 404s still come from `proxy.ts`.
- Env to set in Railway: web `REVALIDATE_SECRET`; API `WEB_URL` (public URL of the web service) and the same `REVALIDATE_SECRET`.
- Verified locally (API + `next start`): company edit shows on `/contact-us` immediately; package title edit shows on the detail page and list; a newly created slug goes 404 -> 200 and appears in the sitemap; delete goes back to 404 and leaves the sitemap. Wrong/missing secret -> 401, unknown tag -> 400.
- Not covered: hotels (not shown publicly) and direct database edits (no webhook fires; pages refresh within ~1 minute anyway).

## Phase 5 notes (started 2026-10-13)
- Deploy steps and the env var table are in `README.md`. The service itself (Railway dashboard, env vars, domain) is created by the user.
- Decision: no `output: 'standalone'`. Railway's default `npm run build` + `npm start` works as is, and standalone would need extra copying of `.next/static` and `public`. Revisit only if image size/startup becomes a problem. Added `engines.node >= 20.9`.
- Verified locally with `NEXT_PUBLIC_API_URL` pointing at the production API: `next build` prerenders the real packages (Hundred Island, Puerto Princesa, ...), and `next start` serves `/`, list, detail, sitemap with the configured site URL, robots, contact, admin login (all 200) and an unknown slug as 404. `POST /api/revalidate` returns 401 when `REVALIDATE_SECRET` is unset.
- Production API CORS currently answers `*` (CORS_ORIGIN unset), so the new origin needs no API change.
- Production now has real packages (earlier notes saying `[]` are out of date).
- **Deployed 2026-10-14:** service `enjoy-ka-dito-web` at https://enjoy-ka-dito-web-production-16e7.up.railway.app (temporary URL). Vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL` (= that URL; baked in at build), `REVALIDATE_SECRET`. API service got `WEB_URL` + the same `REVALIDATE_SECRET`.
- Verified from outside: `/`, list, a package page, contact, admin login, robots, sitemap all 200; unknown slug 404; canonicals, sitemap and robots use the live URL; package og:image is an absolute URL; `/api/revalidate` rejects a wrong secret (401) and accepts the shared one.
- Not yet tested on live data: the end-to-end webhook (edit in admin -> public page updates). Needs a production admin login. Do that in Phase 6.
- Changing `NEXT_PUBLIC_SITE_URL` (e.g. at the custom-domain cutover) needs a redeploy.

## Phase 6 notes (started 2026-10-14)
- **Raw-HTML audit** (curl, live new site vs the old one): every public page returns its own title, meta description, canonical, Open Graph tags and an `<h1>`; package pages carry `TouristTrip` JSON-LD and the home page `TravelAgency`; `/admin/login` is `noindex, nofollow`; unknown URLs are a real 404 with `noindex`. The old site returns the same 680-byte shell with status 200 for every URL.
- **Found and fixed:** `request-a-quote` and `family-senior-tours` had no `<h1>` in the initial HTML, because `useSearchParams` at page level made the whole page render client-side. Now only the destination field reads the query (`components/PrefilledDestinationCombobox.tsx`). Package meta descriptions were ~450 chars; now trimmed to ~155 (`toMetaDescription`). Home title shortened.
- **Visual comparison** (old UI service vs new site, 1280x800): tour list, package detail and Family & Senior pages look identical.
- **Still to do:** Lighthouse, social share previews, the live webhook test with the admin login, Search Console, then the custom-domain cutover.
- **Lighthouse (mobile, 2026-10-14):** before: perf 72-73, LCP 10-54 s, 2.5-47 MB per page (package photos are ~10 MB originals hosted on enjoykadito.com/wp-content). SEO 100, a11y 95-96, best-practices 96. Fix: `next/image` for every photo/logo (`components/CoverImage.tsx`, `lib/images.ts`, `images.remotePatterns` for enjoykadito.com, 30-day `minimumCacheTTL`); photos from other hosts still display, unoptimized. Also: `app/icon.png` (favicon 404), contrast fixes (footer copyright, price note). After (local prod build vs the live API): perf 89-94, LCP 3.1-3.8 s, a11y 100, best-practices 100, SEO 100, 0.4-0.8 MB per page.
- Remaining LCP time is mostly the first optimizer fetch of a ~10 MB original; shrinking the originals in the WordPress media library would help further.
- **Lighthouse on the live new site, after the image fix (2026-10-14):** mobile home 87 / package 94 / list 92, desktop home 99 / package 98. Accessibility, best-practices and SEO are 100 on all of them. Mobile LCP 2.9-3.5 s (was 10-54 s), CLS 0, TBT 20-30 ms, page weight 0.4-0.8 MB. Measured after warming the image cache; the very first visitor of an uncached image still waits for the optimizer to fetch the original.
- **Phase 6 still open:** social-preview check, live webhook test (admin login), Search Console, custom-domain cutover.
- **Cutover:** see `CUTOVER.md`. Key finding: `enjoykadito.com` is a live WordPress site (60 pages + ~1,425 posts in its sitemaps) that also hosts the package photos, so pointing that domain at the new site needs a decision, redirects and an image plan.
- **Cutover path chosen 2026-10-14:** new site takes over `enjoykadito.com`, WordPress retired. Page redirects done (`lib/legacy-redirects.ts`, `scripts/check-legacy-urls.mjs`); photos, posts and DNS still open (see `CUTOVER.md`).
- **Image uploader (2026-10-14):** admin package form uploads Main image / Poster to the API (`POST /media`, stored in Postgres, served at `/media/:id`, resized by sharp); web optimizes `<API>/media/**` via `lib/images.ts`. Replaces pasting WordPress URLs.
- **Upload limits (small hosting):** the admin form shrinks photos in the browser (max 2000 px, JPEG, usually under 500 KB) before uploading; the API refuses files over 6 MB and images over 25 megapixels, processes one image at a time with one sharp thread and no pixel cache, and uses plain (not mozjpeg) JPEG encoding.
