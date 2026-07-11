# InsurePages Marketing Site — Design Spec

**Date:** 2026-07-11
**Status:** Approved by Tom (brainstorming session, 2026-07-11)
**Source design:** `design/InsurePages.html` (self-extracting prototype bundle, added 2026-07-04)

## What we're building

The public marketing site for **InsurePages by S3 Labs** — the productized website
service for independent insurance agents described in the PRD. A one-page,
conversion-focused site built faithfully from the approved `InsurePages.html`
prototype, plus agreed quality fixes. This is the *marketing site for the service*,
not an agency site template and not the internal build platform.

## Decisions (all confirmed with Tom)

| Decision | Choice |
|---|---|
| Scope | One-page marketing site from the prototype |
| Brand | **InsurePages by S3 Labs** — S3 Labs logo image replaces the "by S3 Labs" text under the brand mark; stale "Branded Agency Partners" title/meta/footer replaced everywhere |
| Fidelity | Faithful to the prototype's visual design and copy, plus the quality fixes below |
| Conversion | **FormRobin form embedded** in `#contact` via the official snippet; all CTAs anchor to it |
| Stack | **Astro**, fully static (no backend needed — FormRobin handles submissions) |
| Architecture | Componentized single page (option A): one component per section, tokens as CSS custom properties, `site/` subdirectory |
| Hosting | **Vercel**, linked to `TomsTools11/insure-pages`, root directory `site/`, production branch `main` |
| Domain | Deferred — ship on `*.vercel.app`; canonical/OG URLs updated when the domain lands |

## Prototype inventory (extracted)

- **Design tokens:** `--ink #1A1A1A`, `--cream #FFF8EB`, `--cream-deep #FBEED2`,
  `--red #FF5757`, `--yellow #FFE066`, `--green #7BD389`, `--blue #6FB3FF`,
  `--lavender #C8B6FF`, `--muted #6A655C`
- **Fonts:** Unbounded (display), Plus Jakarta Sans (body) — 9 woff2 files packed
  in the prototype bundle; extract and self-host
- **Sections:** sticky header (anchor nav: Approach/Method/Packages + "Start now"
  sticker) · hero ("If they can't find you, they'll find another agent.") · trust
  strip (Launch in days · SEO from day one · You own the site · No long-term
  contracts) · "Three things, done really well" pillars (Found on Google / Instant
  trust / Lead capture) · 5-step method · packages (Starter $499 one-time · Silver
  $599 + $25/mo · Gold $699 + $75/mo, Gold flagged "BEST VALUE") · CTA band ·
  footer
- **Aesthetic:** neo-brutalist "sticker" style — chunky rounded rectangles, hard
  offset shadows, slight rotations, cream background

## Project structure

```
insure-pages/
├── Insurance-Agency-Website-Service-PRD.md   (unchanged, root)
├── CLAUDE.md / README.md                     (updated with real commands when site lands)
├── design/InsurePages.html                   (prototype moved here, committed as reference)
├── docs/superpowers/specs/                   (this spec; plans alongside)
├── assets/                                   (source logos, incl. s3-labs-logo.png — see Open items)
└── site/                                     (Astro app — Vercel root directory)
    ├── src/
    │   ├── styles/global.css                 (design tokens + base styles)
    │   ├── layouts/Base.astro                (head, meta, fonts, OG)
    │   ├── components/                       (Header, Hero, TrustStrip, Pillars,
    │   │                                      Method, Pricing, ContactCta, Footer)
    │   └── pages/
    │       ├── index.astro                   (assembles the sections)
    │       └── accessibility.astro           (accessibility statement)
    └── public/
        ├── fonts/                            (self-hosted woff2 from the bundle)
        └── images/                           (optimized logos, OG image)
```

## Conversion / FormRobin

- Embed snippet in the `#contact` section:
  `<div class="formrobin-embed" data-path="/f/wy85le3"></div>` +
  `<script src="https://formrobin.com/js/embed.js"></script>`
- The embed script loads lazily (IntersectionObserver as the section approaches
  the viewport) so it costs nothing on first paint.
- CTA link map: "Schedule a call" buttons → `https://formrobin.com/f/wy85le3`
  (the hosted form, opens in a new tab); "View packages →" → `#pricing`;
  "Start now" and all "Begin →" buttons → `#contact` (the embedded form).
- `<noscript>` fallback links directly to `https://formrobin.com/f/wy85le3`.
- No public email/phone in the footer; leads flow only through FormRobin.

## Quality fixes (agreed deltas from the prototype)

1. **Copy:** "styled guide" → "style guide"; "color pallet" → "color palette";
   stray double spaces ("Quarterly  strategy", "Monthly  reporting").
1a. **Header "Start now" button:** center the label — in the prototype the text
   sits off-center in the yellow sticker (flagged by Tom via screenshot).
2. **Metadata:** title + description rewritten for InsurePages (prototype still
   says "Branded Agency Partners"); OG/Twitter cards with a social share image;
   canonical, sitemap, robots.
3. **Dead links:** footer About/Portfolio/Journal links dropped for launch;
   placeholder email (`hello@brandedagencypartners.com`) and phone
   (`(000) 000-0000`) removed.
4. **Accessibility (WCAG 2.1 AA):** semantic landmarks and heading order; visible
   focus states; contrast verified for every sticker-color combination (adjust
   ink/weight, never the palette); keyboard-reachable nav; scroll-reveal
   animations respect `prefers-reduced-motion`; embed iframe titled; skip link.
5. **Accessibility statement page** at `/accessibility` — the product ships one on
   every client site; our own site leads by example.

## Performance

- Static output; zero client JS except the lazy FormRobin embed loader.
- Self-hosted subset woff2, `font-display: swap`, preload the display font.
- Optimized/responsive images.
- Target: Lighthouse ≥ 95 all categories; Core Web Vitals "Good".

## QA / verification (definition of done)

- `npm run build` succeeds; site serves from `dist/`.
- axe-core scan: 0 critical or serious violations on both pages.
- Lighthouse: ≥ 95 performance/accessibility/best-practices/SEO.
- Renders correctly at 375px (mobile) and 1280px (desktop).
- All anchor links resolve; FormRobin embed loads and accepts input.
- Deployed to Vercel with a working production URL.

## Error handling

- FormRobin unavailable/blocked → `<noscript>` + visible fallback link to the
  hosted form URL inside the contact section.
- Font load failure → system font stack fallbacks declared.
- JS disabled → full page still renders (static HTML); only the embed degrades
  to the fallback link.

## Open items (not blocking)

1. **S3 Labs logo file** — Tom to drop the exact square lockup into
   `assets/s3-labs-logo.png`; until then the header keeps the "by S3 Labs" text.
2. **Domain** — undecided; canonical/OG URLs point at the Vercel URL until chosen.
3. **Uncommitted asset churn** — `assets/` has uncommitted logo deletions and
   duplicate copies ("Ip-logo-1-light-bg (2/3/4).png"); tidy during implementation
   (keep one canonical InsurePages logo source, remove numbered duplicates).

## Explicitly out of scope

- About / Portfolio / Journal pages (footer links removed until these exist).
- The internal build platform, agency site templates, intake pipeline (PRD §10).
- CMS integration, blog, analytics tooling (can be added post-launch).
- Domain purchase/DNS.
