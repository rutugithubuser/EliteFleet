# Elite Fleet — Homepage (Next.js)

Full working, interactive frontend of the Elite Fleet homepage, built from your PDF
screenshots (desktop 1440 / tablet 1024 / mobile 390), responsive at all three
breakpoints.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build for production:

```bash
npm run build
npm run start
```

## What's interactive

- **Booking bar (Hero)**: Pickup Location and Car Type are working click-to-open
  dropdowns. Pickup Date / Drop-off Date are real date pickers (drop-off enforces a
  minimum of the pickup date). "Search Cars" scrolls down to the Fleet section.
- **Navbar**: Home / Fleet / About / Contact scroll-jump to the matching homepage
  section. Luxury / SUV / Sports also set the Fleet grid's filter tab before scrolling
  there. Same behavior in the mobile menu overlay, which also auto-closes on any link
  click. This all runs through one shared filter state (`src/context/BookingContext.js`)
  so the Hero's Car Type field and the Navbar's category links drive the same Fleet
  filter.
- **Fleet grid**: category filter tabs (All / Luxury / Sports / SUV / Exotic / Economy /
  Convertible) actually filter the visible cards.
- **Featured Vehicles**: prev/next arrows and progress bar actually scroll the carousel.
- **Testimonials**: clicking a name switches the quote.
- **Mobile menu**: opens/closes, slides in from the right.

This is a single-page site — "Fleet", "About", "Contact" etc. are anchors (`#fleet`,
`#about`, `#contact`) into sections of this same page, not separate routes. If you later
split it into real pages, swap those `href="#..."` for real paths.

## Structure

- `src/app/layout.js` — root layout, loads Manrope + Playfair Display from Google Fonts
- `src/app/page.js` — assembles the homepage, wrapped in `BookingProvider`
- `src/app/globals.css` — design tokens + `[id] { scroll-margin-top }` so anchored
  sections don't hide under the fixed navbar
- `src/context/BookingContext.js` — shared Car Type / Fleet-filter state
- `src/components/` — one component + one `.module.css` per section:
  `Navbar`, `Hero`, `Trust`, `FleetGrid`, `EliteExperience`, `FeaturedVehicles`,
  `WhyEliteFleet`, `HowItWorks`, `CategoryGrid`, `Testimonials`, `FinalCta`, `Footer`
- `src/components/FieldDropdown.js` — the reusable dropdown used in the booking bar
- `src/components/icons/Icons.js` — hand-built line icons (calendar, car, chevrons,
  menu, close, arrow, quote — used only where no real icon file was supplied)
- `src/components/Logo.js` — your real logo (`public/images/branding/logo.png`)

## Images — all now real except one

- `public/images/hero-phantom.png` — hero
- `public/images/fleet/*.png` — Cullinan, Spectre, BMW M4, Ghost Mansory, Cadillac
  Escalade, GMC Yukon, Lamborghini (Cullinan and Lamborghini are reused in Featured
  Vehicles)
- `public/images/elite-experience-dawn.png` — Rolls-Royce Dawn (caption is baked into
  the photo itself, as supplied)
- `public/images/final-cta-bg.png` — GMC Yukon banner
- `public/images/category/*.png` — Luxury, Sports, Exotic, SUV, Economy tiles
- `public/images/branding/logo.png` — real logo
- `public/icons/*` — 4 trust-badge SVGs, phone/mail/pin/clock PNGs, Instagram/Facebook/
  YouTube PNGs

**Still placeholder**: the third Featured Vehicles card, "Mercedes GLC 200" — the only
file supplied for it was a 64px-wide sliver (a UI-crop artifact, not a usable photo), so
it renders as a styled gradient block. Send a real photo and swap it into
`src/components/FeaturedVehicles.js` (see the `image: null` entry).

## Notes on fonts

Fonts load via a `<link>` tag to Google Fonts in `layout.js` (not `next/font`), since the
build sandbox here had no internet access to fetch them at build time. This works
normally in any environment with internet access — no change needed on your end.
