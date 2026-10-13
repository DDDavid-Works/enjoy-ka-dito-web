# Enjoy Ka Dito: public site and admin (Next.js)

Next.js 16 (Cache Components) front end for the Enjoy Ka Dito site. It talks to the NestJS API in `../api`; there is no
backend here besides `POST /api/revalidate`. The plan and per-phase notes are in [MIGRATION.md](MIGRATION.md).
Read `AGENTS.md` before writing code: this Next.js version differs from older ones.

## Run locally

```bash
cp .env.example .env.local   # then adjust
npm install
npm run dev                  # http://localhost:7501
```

The API (`../api`, port 4000) must be running. `npm run build && npm start` runs the production build (the API
must be reachable at build time, because package pages are prerendered from it).

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | build + runtime | Public URL of the API (not the `*.railway.internal` one: browsers call it for forms and admin). Baked in at build time, so rebuild after changing. |
| `NEXT_PUBLIC_SITE_URL` | build + runtime | Public origin of this site, no trailing slash. Used for canonical URLs, the sitemap and Open Graph. |
| `REVALIDATE_SECRET` | runtime | Shared secret for `POST /api/revalidate`. Must equal the API's `REVALIDATE_SECRET`. Without it the endpoint rejects everything. |

The API side needs `WEB_URL` (public URL of this site) and the same `REVALIDATE_SECRET` so content edits refresh the site immediately.

## Deploy on Railway

1. In the existing Railway project, **New service -> GitHub repo -> `enjoy-ka-dito-web`** (branch `main`). Leave the old `enjoy-ka-dito-ui` service running.
2. Set the variables above on the new service. Build/start commands are the defaults (`npm run build`, `npm start`; Railway provides `PORT`). Node >= 20.9.
3. Generate a public domain for the service, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy (the value is used at build time).
4. On the API service set `WEB_URL` to that URL and `REVALIDATE_SECRET` to the same value. If `CORS_ORIGIN` is ever set on the API, add the new site's URL to it (currently unset = any origin).
5. Check `/`, `/tour-packages`, a package page, `/sitemap.xml`, `/robots.txt`, and an admin login. Cutting over the custom domain comes after the Phase 6 checks.

Redeploying the web service re-fetches packages at build time; later content edits don't need a redeploy.
