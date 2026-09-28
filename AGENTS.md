<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Elite Fleet

Next.js 16 (App Router, Turbopack) + React 19 site for a car rental company, content served from Sanity CMS. Plain JavaScript (no TypeScript), one CSS Module per component, path alias `@/*` → `src/*` (`jsconfig.json`).

## Commands

- `npm run dev` — dev server on :3000. It also rewrites the managed block above if missing; leave it in place.
- `npm run lint` — plain `eslint` against the whole repo (flat config, `eslint-config-next/core-web-vitals`). Passes with 1 pre-existing warning: `no-page-custom-font` in `src/app/layout.js`. The Google Fonts `<link>` is intentional (see README "Notes on fonts") — don't "fix" it with `next/font`.
- `npm run build` / `npm start` — verified working. The build fetches Sanity content, so it needs network plus `.env`.
- **No test or typecheck scripts exist.** Verification is `npm run lint && npm run build`.

## Environment

- `.env` is gitignored (`.env*`), so a fresh clone has none and Sanity reads fail. Recreate it with:
  `NEXT_PUBLIC_SANITY_DATASET="production"` and `NEXT_PUBLIC_SANITY_PROJECT_ID="860smblz"`.
- Sanity API version falls back to a hard-coded date in `src/sanity/env.js`.

## Structure

- `src/app/(site)/` — **all public pages go here**, so they inherit Navbar, Footer, and `BookingProvider` from `(site)/layout.js`. Root `src/app/layout.js` only holds metadata, font links, and the pre-paint theme script.
- Unknown URLs hit the catch-all `src/app/(site)/[...missing]/page.js`, which calls `notFound()` so `not-found.js` still renders inside the site frame.
- Sanity Studio is mounted in-app at `/studio` (`src/app/studio/[[...tool]]/page.jsx`, `force-static`); its config lives at repo root (`sanity.config.js`, `sanity.cli.js`), schemas/structure in `src/sanity/`.
- **Real pages: `/`, `/fleet`, `/legal/[slug]`.** `/fleet/[slug]`, `/booking`, `/chauffeur`, and the 404 page render `src/components/ComingSoon.js` placeholders (fleet slugs are still pre-built at build time). Don't assume they have behavior to extend.
- `/fleet` fetches every car once (`FLEET_QUERY`) and does search / filtering / sorting client-side in `src/components/FleetShowcase.js`, with the slide-over drawer in `FiltersDrawer.js`. Page top padding must clear the fixed 96px navbar; the drawer needs `z-index` above 200 (navbar is 100, mobile menu 200).

## Conventions

- All site links are centralized in `src/lib/links.js` (`LINKS`), including section anchors as `/#fleet` so they work from any page. Update that file instead of hardcoding `href`s.
- All content reads go through `sanityFetch()` in `src/sanity/lib/client.js`: published-only perspective, no CDN, `revalidate = 60`, so Studio edits appear within ~a minute. GROQ queries live in `src/sanity/lib/queries.js` (homepage data is fetched in one `HOME_QUERY`); pages export their own `revalidate = 60`.
- Sanity document types: `car`, `category`, `testimonial`, `legalPage` plus singletons `homePage` and `siteSettings` (see `sanity.config.js` and `src/sanity/schemaTypes/`).
- Shared fleet-filter state lives in `src/context/BookingContext.js` — the Hero's Car Type dropdown and the Navbar category links drive the same filter; keep them in sync through the context.
- Dark/light theming uses `data-theme` on `<html>`, set before first paint by an inline script in the root layout (localStorage → system pref) and toggled by `src/components/ThemeToggle.js`. The `suppressHydrationWarning` on `<html>` is required for this.
- Component pattern: one `Foo.js` + one `Foo.module.css` in `src/components/`; hand-drawn SVG icons in `src/components/icons/Icons.js`.

## Docs

- `README.md` predates the Sanity integration and the route split: it still describes a single-page site at `src/app/page.js` and anchor-only navigation. Trust the code (and this file) over it.
- `CLAUDE.md` is just `@AGENTS.md`.
