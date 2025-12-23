# i_garden

A Vite + React site.

## Local setup & env

- Copy `.env.example` to `.env.local` and set `VITE_GA_ID` (GA4) and optionally `VITE_SENTRY_DSN` to enable analytics and monitoring.

## Running Lighthouse locally

1. Start the dev server: `npm run dev` (use Git Bash if PowerShell blocks scripts).
2. Run Lighthouse via CLI: `npx lighthouse http://localhost:5173 --output=json --output-path=./reports/lighthouse-local.json --chrome-flags='--headless=false'`

## CI Lighthouse

- Add your site URL to the repo secret `SITE_URL` and the workflow `Lighthouse CI` will run on pushes to `main`.

## Monitoring

- To enable Sentry, set `VITE_SENTRY_DSN` and optionally `VITE_COMMIT_SHA` in `.env.local`.