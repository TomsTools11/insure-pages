# insure-pages

finalized name: **InsurePages** 

A productized service that delivers modern, conversion-optimized, **WCAG 2.1 AA-compliant** websites for insurance agencies — live in **under one week** (target ≤ 5 business days from intake completion).

The product is two systems shipping as one:

- **Client-facing service** — structured intake → design → one consolidated revision round → launch, on a fixed scope and sub-1-week SLA.
- **Internal build platform (the "speed engine")** — a templated, token-themable, accessibility-tested design system + AI-assisted content generation + pre-built insurance integrations + automated QA + provisioning/deploy automation.

The wedge is **speed + conversion + compliance**, with recurring revenue from a monthly care plan.

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

- `src/components/` — one component per page section: `Header`, `Hero`, `TrustStrip`, `Pillars`, `Method`, `Pricing`, `ContactCta`, `Footer`.
- `src/layouts/Base.astro` — shared page shell (head, meta, layout wrapper).
- `src/styles/global.css` — design tokens (color, type, spacing) and global styles.
- `src/pages/index.astro` — the home page; `src/pages/accessibility.astro` — the published accessibility statement.
- `public/fonts/` — self-hosted Unbounded and Plus Jakarta Sans (latin, variable woff2). `public/images/og.png` — Open Graph image.
- `tests/` — 14 `node:test` assertions that check the built HTML in `dist/`; shared helper at `tests/support/page.mjs`.

### Commands (run from `site/`)

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm test         # build first — tests read dist/, not source
npm run preview  # preview the production build locally
```

### Quality gates (passing)

- 14/14 tests green
- Lighthouse: 100 across all four categories, both pages
- axe: clean on both pages
- WCAG 2.1 AA conformance

### Conversion

A lazy-loaded Kiwiform embed sits in the `#contact` section. It is configured on Kiwiform's side as a
**popup** embed, so it renders a trigger button that opens the form in a modal; `ContactCta.astro`
restyles that button into the site's button system and adds the dialog semantics, Escape-to-close,
and focus handling the vendor modal ships without. The same form is hosted at
https://share.kiwiform.com/to/ofwodo6p, which the `<noscript>` fallback links to.

The "Schedule a call" CTAs (hero, footer, CTA band, templates gallery) still link to the older
FormRobin form at https://formrobin.com/f/344no93, as do the campaign emails in `email/`.

### Deployment

Deployed on Vercel, building static output from `site/dist` (production URL: see Vercel project).
