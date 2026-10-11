# Vite -> Next.js migration notes

Source app: `../ui-web` (Vite + react-router). API (`../api`, NestJS) is unchanged.

## Status
- [x] Phase 0: inventory (below)
- [x] Phase 1: scaffold, globals.css, public/, types, Header/Footer/ChatWidget, root layout, company details fetch
- [x] Phase 1b: self-hosted fonts
- [ ] Phase 1c: set up the `nextjs` branch on `enjoy-ka-dito-ui` (needs user OK to push)
- [ ] Phase 2: public pages + SEO (metadata, sitemap, robots, 404, JSON-LD)
- [ ] Phase 3: admin (client components)
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
- **Git hosting (decided 2026-10-11):** `web/` goes on a branch of the existing `enjoy-ka-dito-ui` repo, so the old Vite site on `main` keeps running until cutover. Not done yet: `web/` still has only its own local repo (no remote). Setup (at Phase 5 or earlier, ask before any push): add the `enjoy-ka-dito-ui` remote, push `web/` history to a branch such as `nextjs`, point a new Railway service at that branch, and merge/switch to `main` at cutover.
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
