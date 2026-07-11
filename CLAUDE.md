# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status: marketing site implemented; product platform still undecided

The InsurePages **marketing site** — the site that sells this productized service — is implemented in `site/`: an **Astro ^5** static site. Real commands (run from `site/`):

```bash
cd site
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm test         # build first — tests read dist/, not source
npm run preview  # preview the production build locally
```

`npm test` reads the built HTML in `dist/`, not the source `.astro` files — always `npm run build` before `npm test`, or use `npm run build && npm test`.

Structure:

- `src/components/` — one component per page section (`Header`, `Hero`, `TrustStrip`, `Pillars`, `Method`, `Pricing`, `ContactCta`, `Footer`).
- `src/layouts/Base.astro` — shared page shell; `src/styles/global.css` — design tokens (color, type, spacing).
- `src/pages/index.astro` and `src/pages/accessibility.astro` — the two published pages.
- `tests/*.test.mjs` — 14 `node:test` assertions against the built HTML. The shared `page()` helper lives in `tests/support/page.mjs`, which is imported by every test file. **Test files must never import from each other**: `node --test` globs `tests/*.mjs`, so a test file that imports another test file re-registers that file's tests, silently duplicating them. Keep shared helpers under `tests/support/` (outside the glob) and have each test file import only from there.

Still open, per PRD §17.3: the **product platform** stack — the templated, multi-tenant engine that will generate client agencies' sites — is undecided ("which CMS/stack and hosting; build vs. buy for the template engine and connectors"). If asked to scaffold or implement that platform, surface the stack decision first rather than picking silently; do not assume a framework for it. This is separate from the marketing-site stack above, which is now fixed. Also open: attaching a custom domain, and the final S3 Labs logo asset for the header (`assets/` currently holds exploratory variants, not a confirmed final lockup).

## What this product is

"RapidSite" (working name) is a **productized service that ships modern, conversion-optimized, WCAG 2.1 AA-compliant websites for insurance agencies in under one week** (target: ≤5 business days from intake completion). It is two systems shipping as one product:

- **Client-facing service** — structured intake → design → one consolidated revision round → launch, on a fixed scope and sub-1-week SLA.
- **Internal build platform (the "speed engine")** — a templated, token-themable, accessibility-tested design system + AI-assisted content generation + pre-built insurance integrations + automated QA + provisioning/deploy automation. This is what makes the speed economically viable.

The PRD is the source of truth for scope, personas, the day-by-day delivery workflow (§7), functional requirements (§9), and roadmap phasing (§16). Read it before proposing product or architecture decisions.

## Constraints that shape every technical decision

These are product invariants, not nice-to-haves. Any code or design must hold to them:

- **WCAG 2.1 AA by default** — accessibility is a core selling wedge (de-risking ADA lawsuits), not an add-on. Automated accessibility scans must pass at launch; every site publishes an accessibility statement. Never write code that regresses this, and never promise legal *immunity* — the product reduces risk and conforms to the standard, it does not guarantee against suits (PRD §9.3).
- **Conversion-first** — templates exist to turn paid/organic traffic into quote requests and calls (click-to-call, sticky CTAs, above-the-fold quote forms, trust signals). "Looks good" is insufficient.
- **Core Web Vitals "Good"** at launch is a target metric — performance is a hard requirement, not a polish step.
- **Productized, not bespoke** — fixed scope, token-based brand theming, reusable templates/components. Anything that forces per-client bespoke engineering is explicitly **out of v1 scope** (PRD §9.5, §6.2). Favor configuration/theming over one-off code.
- **AI-generated content always gets mandatory human review** with compliance guardrails (no unverifiable claims, correct disclaimers).

## Domain vocabulary

Insurance-specific terms that recur throughout the product (PRD Appendix A):

- **AMS** — Agency Management System (Applied Epic, AMS360, EZLynx, HawkSoft). Sites integrate via pre-built connectors or an integration-layer fallback.
- **Comparative rater** — multi-carrier quoting tool (e.g., EZLynx); sites hand off / link to these.
- **LOB (Lines of Business)** — insurance product categories (auto, home, life, commercial); each gets a templated, AI-drafted landing page.
- **Care plan** — the recurring monthly subscription (hosting, security, accessibility monitoring, content updates). This MRR is "the real business"; the one-time build is the front door.

## Build platform — the nine required capabilities

When implementation begins, the internal engine (PRD §10) must provide: (1) component/template library, (2) token-based brand theming, (3) AI content generation with human review, (4) a CMS for producer assembly + client light edits, (5) integration connectors (quote forms, analytics, call tracking, CRM/AMS, rater), (6) an automated QA suite (accessibility, Core Web Vitals, mobile, broken links, form submission), (7) provisioning + deploy automation (spin-up, staging preview, prod deploy, DNS/SSL), (8) an intake pipeline that maps form fields directly to template fields, (9) an internal dashboard with per-build SLA countdown.
