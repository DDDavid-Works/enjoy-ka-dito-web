# Custom-domain cutover checklist

Status 2026-10-14: the new site runs on `https://enjoy-ka-dito-web-production-16e7.up.railway.app` (Railway service
`enjoy-ka-dito-web`). The old Vite site (`enjoy-ka-dito-ui`) is still running. Neither has a custom domain yet.

## Decision (2026-10-14): the new site takes over `enjoykadito.com` and WordPress is retired (option A3 below)

Open items for this path, in order:
1. **Package photos**: only 5 packages / 5 images exist in production (~45 MB of originals). Move them off `wp-content` before WordPress goes away (section 3).
2. **Old URLs**: the 60 WordPress pages are already mapped (`lib/legacy-redirects.ts`, 53 redirect, 1 identical; 6 have no equivalent and will 404). Still undecided: the ~1,425 news posts and the 80 category/tag/author pages (section 4).
3. **DNS and email**: which registrar/DNS provider holds `enjoykadito.com`, and does company email (MX records) live on that domain? Only the web records may change.
4. **Backup**: before retiring WordPress, export its content (WordPress export file + the uploads folder) and keep it.

## 0. Read this first: `enjoykadito.com` is a live WordPress site

Checked on 2026-10-14 (public pages, read-only):

- `enjoykadito.com` serves WordPress (nginx, Yoast + Jetpack sitemaps).
- Its sitemaps list **60 pages and about 1,425 news posts** (2013 onward, e.g. `/2013/11/04/bon-appetit-in-zambales-meet-zambales/`).
  That is an SEO asset; pointing the domain at the new site without redirects turns all of those URLs into 404s.
- **The package photos used by the new site live on that WordPress site** (`enjoykadito.com/wp-content/uploads/...`).
  If WordPress stops answering on that domain, every package image on the new site breaks.

So "switch the domain" needs a decision first.

### Decision A: which address will visitors use?

| | What it means | Pros | Cons |
|---|---|---|---|
| **A1. New site on a new subdomain** (e.g. `tours.enjoykadito.com` or `book.enjoykadito.com`); WordPress stays on `enjoykadito.com` | Nothing at the WordPress address changes. | No SEO risk, no redirects, images keep working, trivial rollback. | Two sites; the new site's SEO value starts from zero on a new host; WordPress keeps ranking for the main pages. |
| **A2. New site on `enjoykadito.com`; WordPress moves to a subdomain** (e.g. `blog.enjoykadito.com`) | The new site becomes the main site. | One brand site. | Needs the WordPress move, redirects for ~1,500 URLs, and a plan for the images (section 3). More work and more SEO risk. |
| **A3. New site on `enjoykadito.com`; WordPress retired** | Old content disappears. | Simplest end state. | Loses the 1,425 posts and their traffic unless redirected or archived. Not recommended without an export. |

Recommendation: **A1 first** (nothing breaks, you can launch and measure), then move to A2 later if you want.
Everything below is written so that either path works; the steps marked **(A2/A3 only)** apply when the new site takes over `enjoykadito.com`.

## 1. Before touching DNS

- [ ] Decide A1 / A2 / A3 and the exact hostname.
- [ ] Do the live webhook test on the Railway URL (admin login, edit the company email or a package title, confirm the public page updates, change it back).
- [ ] **(A2/A3 only)** Plan for the images (section 3).
- [ ] **(A2/A3 only)** Build the redirect map (section 4) and have it reviewed.
- [ ] Lower the DNS TTL of the hostname you will change to 300 s, at least a day before the switch (so a rollback takes minutes).
- [ ] Confirm the old UI service (`enjoy-ka-dito-ui`) and WordPress are untouched: they are the rollback.
- [ ] Optional but sensible before launch: privacy policy / cookie notice, inquiry email notifications and spam protection are still on the roadmap (not blockers for the cutover).

## 2. Cutover steps

1. **Railway: add the custom domain** to the `enjoy-ka-dito-web` service (Settings -> Networking -> Custom Domain). Railway shows a CNAME target (and sometimes a TXT record) to create at your DNS provider. Add the record; Railway issues the TLS certificate automatically once DNS resolves.
2. **Wait until the domain shows as valid in Railway** and `https://<hostname>/` loads the new site with a valid certificate.
3. **Set `NEXT_PUBLIC_SITE_URL`** on the web service to `https://<hostname>` (no trailing slash). It is baked in at build time, so this triggers a redeploy: wait for it to finish.
4. **API service variables:**
   - `WEB_URL` -> `https://<hostname>` (so content edits refresh the right site).
   - `REVALIDATE_SECRET` stays as is.
   - `CORS_ORIGIN` is currently unset (any origin allowed). If you ever set it, include `https://<hostname>`.
5. **Verify on the real hostname** (re-run the same checks used on the Railway URL):
   - `/`, `/tour-packages`, a package page, `/contact-us`, `/admin/login`, `/robots.txt`, `/sitemap.xml` -> 200; unknown URL -> 404.
   - Canonical URLs and sitemap entries use the new hostname.
   - Quote form and contact form submit; admin login works; an admin edit appears on the public page immediately.
   - Lighthouse on mobile (target: performance 85+, SEO 100).
6. **(A2/A3 only)** Turn on the redirects (section 4) and re-check the top URLs by hand.
7. **Search Console:**
   - Add a property for the hostname (Domain property is best: verified with a DNS TXT record).
   - Submit `https://<hostname>/sitemap.xml`.
   - Use URL Inspection -> "Request indexing" for the home page, `/tour-packages` and the main package pages.
   - **(A2/A3 only)** If the host changed, also use the "Change of address" tool in the old property.
8. **Social previews:** paste a package URL into Facebook's Sharing Debugger and refresh the scrape. Check title, description and image.

## 3. Images (A2/A3 only)

Package photos are stored as URLs like `https://enjoykadito.com/wp-content/uploads/2026/10/Hundred-Island-Package.jpg`.
While WordPress is reachable at that address they keep working (and `lib/images.ts` / `next.config.ts` allow-list that host).
If WordPress moves to a subdomain, choose one:

- Keep WordPress (and its `wp-content`) reachable on the new subdomain and update the stored image URLs in the packages (admin edit, or a one-off script/SQL update on the API database), and add the subdomain to `OPTIMIZED_IMAGE_HOSTS` in `lib/images.ts`; **or**
- Move the photos to storage you control (the site's own `public/images`, or object storage), then update the package image URLs.

Do this *before* the switch, and keep `enjoykadito.com` in the allow-list until no package still points at it.

## 4. Redirects (A2/A3 only)

Add permanent (301) redirects in `next.config.ts` (`redirects()`), one rule per old path, to the closest new page, so rankings carry over.
Draft mapping from the WordPress page sitemap (review each one):

| Old WordPress path | New path |
|---|---|
| `/` | `/` |
| `/about/` | `/about-us` |
| `/contact/` | `/contact-us` |
| `/book-now/` | `/request-a-quote` |
| `/services/`, `/visa-assistance/`, `/travel-insurance/`, `/passport-appointment/`, `/hotel-reservation/`, `/booking-and-ticketing/`, `/land-arrangement/` | `/travel-services` |
| `/domestic-and-international-tour-packages/`, `/rates-and-packages/` | `/tour-packages` |
| `/*-team-building-package/` (cebu, coron, puerto-princesa, hundred-islands, hundred-islands-bolinao) | `/corporate-team-building` |
| Tour pages (`/puerto-princesa-tour-package/`, `/enjoy-ka-dito-hundred-islands-tour-package/`, `/south-cebu-tour-package/`, `/japan-tour-package/`, ...) | the matching `/tour-packages/<slug>` if one exists, otherwise `/tour-packages` |
| `/weather-broadcast/`, `/bulletin/`, `/shella-viray-and-teams-testimonial-...`, `/facebook/`, `/more/`, `/let-us-help-you-how/` | decide: keep on the blog subdomain, or redirect to `/` |
| News posts `/YYYY/MM/DD/slug/` (~1,425) | if WordPress moves to `blog.<domain>`: one pattern rule `/:year(\\d{4})/:month/:day/:slug` -> `https://blog.<domain>/:year/:month/:day/:slug` |
| Old sitemaps (`/sitemap.xml` index, `/sitemap_index.xml`, `/post-sitemap.xml`, ...) | only `/sitemap.xml` stays (the new one); the others can 404 once Search Console has the new sitemap |

Page redirects are implemented in `lib/legacy-redirects.ts` (wired into `next.config.ts`). Check them against a running copy with `node scripts/check-legacy-urls.mjs <base-url> pages` (also accepts `posts` or `all`); it reads the live WordPress sitemaps and lists every old URL that does not resolve.

Pages with no equivalent (404 unless a decision is made): `/weather-broadcast`, `/bulletin`, `/photo-gallery`, `/let-us-help-you-how`, `/more/testimonial`, the Shella Viray testimonial page.

News posts (retiring WordPress): redirecting ~1,425 old news posts to an unrelated page is treated by Google as soft 404s, so the honest options are (a) let them return 404/410, or (b) keep a static archive of the posts somewhere. Decide with the client.

## 5. Rollback

- Point the DNS record back to the previous target (WordPress, or the old UI service). With the TTL lowered to 300 s this takes minutes.
- `NEXT_PUBLIC_SITE_URL` / `WEB_URL` can stay as they are while rolled back; they only affect the new site.

## 6. After the cutover

- [ ] Watch Search Console (Pages, Sitemaps, Crawl stats) and the Railway logs for 404s and 5xx for the first two weeks.
- [ ] Fix any 404 on a URL that used to rank by adding a redirect.
- [ ] Keep the old `enjoy-ka-dito-ui` service for 2-4 weeks as a safety net, then remove it and its GitHub deploy hook.
- [ ] Re-run Lighthouse and the HTML audit on the real hostname and record the results in `MIGRATION.md`.
- [ ] Mark Phase 6 done in `MIGRATION.md`.
