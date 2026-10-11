# Vite -> Next.js migration notes

Source app: `../ui-web` (Vite + react-router). API (`../api`, NestJS) is unchanged.

## Status
- [x] Phase 0: inventory (below)
- [x] Phase 1: scaffold, globals.css, public/, types, Header/Footer/ChatWidget, root layout, company details fetch
- [ ] Phase 2: public pages + SEO (metadata, sitemap, robots, 404, JSON-LD)
- [ ] Phase 3: admin (client components)
- [ ] Phase 4: revalidation webhook (API -> `revalidateTag`)
- [ ] Phase 5: Railway deploy, custom domain
- [ ] Phase 6: verification

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
- Fonts still load from Fontshare; self-host with `next/font/local` once the font files are added.
- `<img>` kept for logos for now to avoid layout shifts; move to `next/image` in Phase 2.
- Dev server: port 7501 (old app uses 7500).
