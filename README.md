# insure-pages

finalized name: **InsurePages** 

A productized service that delivers modern, conversion-optimized, **accessible** websites for insurance agencies — live in **under one week** (target ≤ 5 business days from intake completion).

The product is two systems shipping as one:

- **Client-facing service** — structured intake → design → one consolidated revision round → launch, on a fixed scope and sub-1-week SLA.
- **Internal build platform (the "speed engine")** — a templated, token-themable, accessibility-tested design system + AI-assisted content generation + pre-built insurance integrations + automated QA + provisioning/deploy automation.

The wedge is **speed + conversion + accessibility**, with recurring revenue from a monthly care plan.

## Status

The marketing site is implemented and live (see [Website](#website) below). The stack for the internal build platform — the templated, multi-tenant engine that will generate client agency sites — remains an open, undecided question (PRD §17.3).

## Repository contents

- [Insurance-Agency-Website-Service-PRD.md](Insurance-Agency-Website-Service-PRD.md) — the product requirements document (source of truth for scope, workflow, requirements, and roadmap).
- [CLAUDE.md](CLAUDE.md) — guidance for Claude Code when working in this repository.
- [docs/superpowers/specs/2026-07-11-insurepages-marketing-site-design.md](docs/superpowers/specs/2026-07-11-insurepages-marketing-site-design.md) — the design spec for the marketing site.
- [docs/superpowers/plans/2026-07-11-insurepages-marketing-site.md](docs/superpowers/plans/2026-07-11-insurepages-marketing-site.md) — the implementation plan for the marketing site.
- [design/](design/) — design prototype (`InsurePages.html`), token/asset extraction script (`extract-prototype.py`), and reference material.
- [site/](site/) — the marketing site itself (Astro). See below.

## Website

InsurePages' own marketing site — the site that sells the productized service described in the PRD.

### `site/` layout

- `src/components/` — one component per page section: `Header`, `Hero`, `TrustStrip`, `Pillars`, `Method`, `Pricing`, `ContactCta`, `Footer`, plus `templates/` and `tools/` for the two secondary pages.
- `src/layouts/Base.astro` — shared page shell (head, meta, layout wrapper).
- `src/styles/global.css` — design tokens (color, type, spacing) and global styles.
- `src/pages/` — the four published pages: `index.astro` (home), `templates.astro` (the template gallery), `tools.astro` (the free tools page), and `accessibility.astro` (the published accessibility statement).
- `public/fonts/` — self-hosted Unbounded and Plus Jakarta Sans (latin, variable woff2). `public/images/og.png` — Open Graph image.
- `tests/` — 50 `node:test` assertions that check the built HTML in `dist/`; shared helper at `tests/support/page.mjs`.

### Commands (run from `site/`)

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm test         # build first — tests read dist/, not source
npm run preview  # preview the production build locally
```

### Quality gates (passing)

- 50/50 tests green
- axe: zero violations on all four pages
- Lighthouse on a local production build, all four pages: accessibility **100**, SEO **100**,
  best practices **96**, performance **95 to 100**

Accessibility is built in and scanned automatically before every release. The site does
not advertise a conformance level; see the accessibility statement at
[/accessibility/](https://www.insurepages.com/accessibility/). The internal engineering
standard is recorded in [CLAUDE.md](CLAUDE.md).

### Conversion

The `#contact` band offers two paths side by side: **Get Started Now**, which opens the Kiwiform
form in a popup, and **Schedule a call**, which opens the FormRobin call form in a new tab.

The Kiwiform embed (`data-kiwiform-live`) is configured on Kiwiform's side as a **popup** embed, so
it builds its own trigger button. That host div stays `hidden` and the card's own button forwards
the click to it — the card keeps the site's markup and copy, and its `href` still reaches the hosted
form at https://share.kiwiform.com/to/ofwodo6p when JavaScript is off or the embed is blocked.
`embed.js` is injected only as the band nears the viewport. The vendor modal ships without dialog
semantics, a labelled close control, a titled iframe, Escape-to-close, or focus handling;
`ContactCta.astro` adds those as it appears and unwinds them on close.

The "Schedule a call" CTAs (hero, footer, CTA band, templates gallery) link to the FormRobin form at
https://formrobin.com/f/344no93, as do the campaign emails in `email/`.

### Deployment

Deployed on Vercel, building static output from `site/dist` (production URL: [https://www.insurepages.com](https://www.insurepages.com); the `insure-pages.vercel.app` alias 308-redirects there).
