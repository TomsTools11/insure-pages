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
- `src/pages/` — the four published pages: `index.astro`, `accessibility.astro`, `templates.astro`, `tools.astro`.
- `tests/*.test.mjs` — 49 `node:test` assertions against the built HTML. The shared `page()` helper lives in `tests/support/page.mjs`, which is imported by every test file. **Test files must never import from each other**: `node --test` globs `tests/*.mjs`, so a test file that imports another test file re-registers that file's tests, silently duplicating them. Keep shared helpers under `tests/support/` (outside the glob) and have each test file import only from there.

Brand mark: the master lockup lives at repo root as `ip-logo.png` (800×350 RGBA,
transparent). Two derived assets are what the site actually serves, both trimmed
to the art's bounding box (655×259) and palette-quantized:

- `site/public/images/insurepages-logo.png` — master art, used in the header on cream.
- `site/public/images/insurepages-logo-dark.png` — on-ink variant for the footer.
  The master's `#1a1a1a` outline/shadow vanishes against `--ink`, and its `#2c5972`
  "by … labs" sits at 2.3:1 there, so those two colors are remapped to `--yellow`
  and `#8fc7ff` (the values this footer already uses on dark).

Both derived files are generated, not hand-edited. If the master changes, rerun
`python3 design/build-logo-assets.py` from the repo root rather than editing them.

Third-party badge: `site/public/images/startup-fame-badge.webp` is Startup Fame's
own artwork (468×148), served from `public/` rather than hot-linked from
startupfa.me so the footer costs no third-party request — the dofollow link back
in `Footer.astro` is what the directory verifies. Re-download it from
`https://startupfa.me/badges/featured-badge.webp` if it changes; don't edit it.

## Free tools page (`/tools/`)

`/tools/` embeds four Keywords Everywhere tools. Data lives in
`src/data/tools.mjs`; the page is `src/pages/tools.astro` with components under
`src/components/tools/`. Three things are load-bearing and easy to break
without noticing:

1. **No frame may reach the built HTML.** `ToolAccordion.astro` ships zero
   frames and builds one in JS on the first `toggle` of a `<details>`. This is
   the page's whole performance and privacy story: nothing is requested from
   keywordseverywhere.com until a visitor opens a tool.
   `grep -c '<iframe' dist/tools/index.html` must return `0`, and a test
   asserts it. Writing the tag as a literal string anywhere in the markup or
   the inline script breaks this even if no frame ever loads.
2. **The frame carries `data-ke-embed`, and never a CSS `min-height`.** The
   resizer at `https://keywordseverywhere.com/tools/assets/js/embed.js` matches
   `iframe[data-ke-embed]` by source window and origin, then writes
   `style.height` inline. Drop the attribute and the frame never resizes; add a
   `min-height` to the frame and it fights the resizer. Reserve space on the
   `.tool-frame` wrapper instead, from `minHeight` in `tools.mjs`. The resizer
   re-queries the DOM on every message, so one shared copy handles frames
   opened later.
3. **The "Powered by Keywords Everywhere" link stays on every tool.** Their
   embed terms are explicit: that credit is the whole price, and they disable
   embedding for sites that strip it. A test counts one attribution per tool.

The page must never imply the tools are unlimited. Keywords Everywhere applies
a free per-visitor daily quota and renders its own quota banner inside the
frame; the hero says so, and a test asserts the disclosure is present.

Known third-party accessibility gap, disclosed in the accessibility statement
and deliberately not patched: six form inputs across the SEO analyzer, traffic
checker and robots.txt tester have no accessible name (no `<label>`,
`aria-label`, or `aria-labelledby`, only a placeholder). That is content we do
not control. Do not try to reach into the frame to fix it, and do not soften
the statement to match.

## Template demos (`/demos/`)

The six preview sites behind the "Preview site" buttons on `/templates/` are
static exports under `site/public/demos/<slug>/`, outside the Astro layout.
Four (`fernbrook`, `marsden`, `northgate`, `page-insurance`) are single-file
bundle exports whose boot script replaces `document.documentElement` at load;
`keel` and `kestrel` are dc-runtime exports rendered by their `support.js`.
The demos sit on the root domain on purpose (a subdomain would move nothing:
they are already invisible to Google, and a preview converts the same on any
hostname), and three conventions hold on every one of them. Tests in
`tests/templates.test.mjs` and `tests/analytics.test.mjs` fail if any is
dropped, which matters because a re-exported demo starts without all three.

1. **Out of search at two layers, and never blocked.** Every demo's outer
   `<head>` carries `<meta name="robots" content="noindex">`, and
   `vercel.json` adds `X-Robots-Tag: noindex` on `/demos/:path(.*)`. Do not
   add `Disallow: /demos/` to `robots.txt` (Google can only honor a noindex on
   a page it is allowed to fetch) and do not add `rel="nofollow"` to the
   preview links (a hint at best, and the target is already noindex). The
   sitemap only ever lists Astro pages, so the demos stay out of it by
   construction.
2. **Plausible on every demo, exactly once.** The demos are outside
   `Base.astro`, so each carries the same script tag by hand in its outer
   `<head>`: same site, same property, so a demo open shows up next to
   `/templates/`. One tag per demo, or an open counts twice. In the bundled
   demos the swap detaches that `<head>`, but a detached async script still
   executes when its fetch completes; `npm run check:demos` proves it in a
   real browser by stubbing the script, delaying it past the swap, and
   counting exactly one run per demo. Plausible ignores `localhost` and
   `file:` origins, so local previews and `npm run thumbs` never reach the
   numbers.
3. **US phone numbers only.** Design-tool exports have shipped with a UK
   landline and a New Zealand mobile. Every `tel:` href in a demo dials
   `+1` plus ten digits, and visible numbers use the `(XXX) XXX-XXXX` shape,
   one contact number per demo (a form field may still carry a
   `(555) 000-0000` format hint). For new numbers use `(XXX) 555-01XX`, the
   fictional range. Card domains in `src/data/templates.mjs` follow the same
   rule (no `.co.uk`). Only the numbers were localized: Keel still labels its
   quote field "Postcode" and cites a New Zealand regulator, and Kestrel's
   estimator prices in pounds. Localizing the rest is a content decision, not
   a copy edit.

The four bundled demos are large (Marsden is 3 MB of inline script) and only
the bundles are in the repo, not their source. Rebuilding them as static
pages is a separate decision, to be made on demo bounce data once Plausible
has a couple of weeks of it.

`site/public/llms.txt` is served at `/llms.txt`. It restates the page list,
the packages and prices, and the contact paths, in the llmstxt.org shape
(prose and the package list above the first H2, link lists only below it, no
demo links since the bundled demos have no readable text without JavaScript
and are noindexed). `tests/llms.test.mjs` pins it to the built pages, so a
price or contact change fails there until llms.txt is updated too.

Campaign email lives in `email/` (see `email/README.md`), outside the Astro
build. Email clients are not browsers: tables for layout, inline styles only,
and never an `<iframe>`, `<script>`, external stylesheet, CSS background image,
flexbox or grid — a Canva embed pasted straight into a CRM fails on exactly
that. `site/public/images/email/*.png` are flat renders of those templates,
generated by `node email/build-image-fallback.mjs`; edit the HTML, not the PNG.

Still open, per PRD §17.3: the **product platform** stack — the templated, multi-tenant engine that will generate client agencies' sites — is undecided ("which CMS/stack and hosting; build vs. buy for the template engine and connectors"). If asked to scaffold or implement that platform, surface the stack decision first rather than picking silently; do not assume a framework for it. This is separate from the marketing-site stack above, which is now fixed. Neither the custom domain nor the header logo is still open: the site is live
at `https://www.insurepages.com` (apex redirects to www; the old
`insure-pages.vercel.app` alias 308-redirects there via `vercel.json`), and the
finalized lockup is in place — see "Brand mark" above.

## What this product is

**InsurePages** (finalized name; the PRD's "RapidSite" is the old working name) is a **productized service that ships modern, conversion-optimized, WCAG 2.1 AA-compliant websites for insurance agencies in under one week** (target: ≤5 business days from intake completion). It is two systems shipping as one product:

- **Client-facing service** — structured intake → design → one consolidated revision round → launch, on a fixed scope and sub-1-week SLA.
- **Internal build platform (the "speed engine")** — a templated, token-themable, accessibility-tested design system + AI-assisted content generation + pre-built insurance integrations + automated QA + provisioning/deploy automation. This is what makes the speed economically viable.

The PRD is the source of truth for scope, personas, the day-by-day delivery workflow (§7), functional requirements (§9), and roadmap phasing (§16). Read it before proposing product or architecture decisions.

## Constraints that shape every technical decision

These are product invariants, not nice-to-haves. Any code or design must hold to them:

- **WCAG 2.1 AA by default** — accessibility is a core selling wedge (de-risking ADA lawsuits), not an add-on. Automated accessibility scans must pass at launch; every site publishes an accessibility statement. Never write code that regresses this, and never promise legal *immunity* — the product reduces risk and conforms to the standard, it does not guarantee against suits (PRD §9.3).
  **Marketing-site exception, decided 2026-09-01:** the marketing site in
  `site/` no longer advertises a conformance level. The public "WCAG 2.1 AA"
  claim was removed from `/templates/` (`IncludedSpec.astro`), `/tools/`
  (`ToolsBridge.astro`), and the accessibility statement, at the owner's
  direction. This changed the **public claim only, not the engineering
  standard above**: keep building to WCAG 2.1 AA, keep the axe scans, keep
  publishing the statement. `tests/accessibility-page.test.mjs` asserts no
  built page carries the claim, so re-adding it is a decision to make with
  the owner, not a copy edit. `README.md` was brought in line on the same
  date and now names no conformance level either. The PRD still describes the
  service as WCAG 2.1 AA-compliant and was deliberately left as-is; so does
  the GitHub repository description. Both are separate calls.
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
