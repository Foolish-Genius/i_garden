# i_garden

A Vite + React blog focused on performance, accessibility, and growth.

---

## Overview

This repo contains a small blogging site that uses Vite, React (v19), Tailwind CSS, and Sanity CMS for content and image hosting. The aim is to iterate toward the best possible real-user experience (fast LCP, low TBT, and excellent SEO) while enabling growth (analytics, newsletter, social sharing).

---

## Goals & Priorities ✅

1. Stabilize repeatable production audits (use a detached static preview server built from `dist`).
2. Fix the Largest Contentful Paint (LCP) — make featured images responsive, use AVIF/WebP fallbacks, and only preload genuine LCP images.
3. Shrink vendor JS (split heavy libs, lazy-load when possible, consider replacements for bulky libs).
4. Improve image delivery & caching (Sanity srcset helpers, optimized formats, CDN cache rules).
5. Add Lighthouse CI on merges to `main` (requires `SITE_URL` secret) and use headful audits for stable metrics.

---

## Tech stack

- Vite + React
- Tailwind CSS
- Sanity CMS (images served via Sanity CDN)
- Sentry (error monitoring, optional)
- Google Analytics (GA4 scaffold, optional)
- Lighthouse (local & CI audits)
- Deploy: Vercel (project contains `vercel.json`), or any static host

---

## Quick setup (local)

1. Install dependencies:

   npm install

2. Copy environment template and set values:

   cp .env.example .env.local

   - VITE_GA_ID (optional) — Google Analytics
   - VITE_SENTRY_DSN (optional) — Sentry
   - VITE_SENTRY_ENV (optional)

3. Start dev server:

   npm run dev

   Note: If PowerShell blocks scripts use Git Bash or cmd.

---

## Build & production preview

1. Build production assets:

   npm run build

2. Serve the built `dist` statically for production-like audits:

   node scripts/serve-dist.js  # default port 5173

   - Start it in a detached terminal so it persists between audit runs.

---

## Lighthouse audits (recommended)

- Dev server (quick checks) — contains dev-only artifacts like `@vite/client`; use only for development checks.

  npx lighthouse http://localhost:5173 --output=json --output-path=./reports/lighthouse-local.json --chrome-flags='--headless=false'

- Production preview (accurate metrics) — important: use the static `dist` preview

  npx lighthouse http://localhost:5173 --output=json --output-path=./reports/lighthouse-prod.json --chrome-flags='--headless=false'

Notes:
- Use headful runs (`--headless=false`) for deterministic LCP and filmstrip artifacts.
- If ChromeLauncher reports permission or interstitial errors, re-run after ensuring the preview server is reachable.

---

## Lighthouse CI (automation)

- Add `SITE_URL` as a repository secret and enable the provided workflow (see `.github/workflows/lighthouse.yml`) to run on pushes to `main` and PR merges.

---

## Monitoring & analytics

- Sentry: set `VITE_SENTRY_DSN` for runtime error capture (lazy init is used to avoid startup cost). Add `VITE_COMMIT_SHA` to link releases.
- GA4: set `VITE_GA_ID`; GA events are triggered for page views and newsletter signups.

---

## SEO & Content

- SEO front matter is available in Sanity (`metaTitle`, `metaDescription`, `ogImage`, `canonical`).
- Sitemap & `robots.txt` placeholders are included — update `SITE_URL` and paths if you change routing.

---

## Performance checklist (practical fixes)

- Responsive featured image `srcset` + `sizes` (use `srcSetFor()` helper in `src/lib/sanityImage.js`).
- Ensure LCP candidate images are preloaded only when necessary.
- Add AVIF/WebP fallbacks where supported by Sanity image builder.
- Reduce initial JS: refine `manualChunks` in `vite.config.js`, lazy-load syntax highlighters and heavy libs.
- Replace or inline small icon libs (we already replaced react-icons with inline SVGs in `Footer.jsx`).

---

## Development & contributor guide

- Branches: `main` for production, `feat/*` for features, `fix/*` for fixes.
- Commit messages: use Conventional Commits (e.g., `feat: add newsletter form`, `fix: tidy build output`).
- PR checklist:
  - Lint & format ✅
  - Build succeeds (`npm run build`) ✅
  - If changing public assets, run a production preview + Lighthouse check ✅

---

## Deployment

- We expect to deploy to Vercel (see `vercel.json`). Connect the GitHub repo, set build env vars (`VITE_GA_ID`, `VITE_SENTRY_DSN`, `SITE_URL`) in the Vercel dashboard, and enable protected production deploys.

---

## Next actions (short-term)

1. Stabilize production audits and re-run Lighthouse (I can do this on request).  
2. Implement responsive/optimized LCP image delivery (change `SinglePost.jsx` / `HomePage.jsx`).  
3. Reduce vendor JS (further manualChunks + lazy imports).  
4. Add Lighthouse CI and confirm `SITE_URL` secret.  
5. Review image CDN caching & content-type delivery for AVIF/WebP.

---

## Useful scripts

- npm run dev            # local dev server
- npm run build          # production build
- node scripts/serve-dist.js  # static production preview
- npx lighthouse <url>   # run Lighthouse locally (headful recommended)

---

## License

See repository license 

---