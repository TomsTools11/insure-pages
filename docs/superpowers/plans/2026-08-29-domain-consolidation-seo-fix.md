# InsurePages Domain Consolidation & SEO Remediation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax for tracking. Tier A is unattended work; Tier B needs one human action (a merge); Tier C is authenticated dashboards only the owner can reach. Do Tier A in order, then stop and report.

**Goal:** Finish consolidating every ranking signal onto `https://www.insurepages.com` so Google stops indexing the `insure-pages.vercel.app` deployment host, and clear the crawlability and structured-data defects that block the traffic-growth work from starting.

**Source of truth:** `SEO audit report: InsurePages` (Manus AI, 2026-08-27). Its §12 prioritization drives this plan. Note the audit predates the 2026-08-29 fix and its §1/§7/§9/§12 describe the canonical state as broken — stale for two of three P1 items.

**Related:** PR #10 (`claude/canonical-url-consolidation-30xmvm`) — the canonical/OG/sitemap/robots fix, live in production since 2026-08-29T02:16Z but **not yet merged**.

## Background: crawlable ≠ consolidated

The domain was never uncrawlable. Verified 2026-08-29: all three www pages return 200 with no `X-Robots-Tag` and no `<meta name="robots">`, `robots.txt` allows them, Lighthouse SEO 100/100. Googlebot has been crawling `www.insurepages.com` throughout.

The defect was that every crawled page *declared* `insure-pages.vercel.app` as its canonical. Google obeyed and folded www into the Vercel host's index entry. Nothing was blocked — the site pointed at the wrong address. A brand search for "insurepages" therefore returns the Vercel URLs (homepage and `/accessibility`) rather than the real domain.

Consequently: nothing needs unblocking. What is needed is a recrawl so Google re-reads the corrected signals (Tier C), plus a redirect so the duplicate host stops being independently indexable (A1).

## State as of 2026-08-29

| Signal | Before | Now (verified live) |
|---|---|---|
| `rel="canonical"` × 3 pages | `insure-pages.vercel.app` | `https://www.insurepages.com/…` |
| `og:url` / `og:image` / `twitter:image` | `insure-pages.vercel.app` | `https://www.insurepages.com/…` |
| `sitemap-0.xml` + `sitemap-index.xml` | Vercel URLs | www URLs |
| `robots.txt` `Sitemap:` | Vercel sitemap | www sitemap |
| `insure-pages.vercel.app` canonical | self-referential | → `https://www.insurepages.com/` |
| `insurepages.com` (apex) | 308 → www | unchanged, correct |

**Standing risk until B1 lands:** production runs from the unmerged branch; `origin/main` still carries `site: "https://insure-pages.vercel.app"`. Any deploy from `main` silently reverts the fix.

**Host inventory** (verified): `www.insurepages.com` 200 · `insurepages.com` 308→www · `insure-pages.vercel.app` 200, public, no noindex · `insure-pages-toms-projects-*` and `insure-pages-git-main-*` behind Vercel SSO, already `x-robots-tag: noindex`.

---

## Tier A — unattended; commits to `claude/canonical-url-consolidation-30xmvm`

### A1. Surgical redirect on the Vercel host — `vercel.json`

Audit §12 item 1, remaining half: *"permanently redirect `insure-pages.vercel.app` to matching www URLs after testing."* A blanket redirect breaks already-delivered campaign email, which hot-links `/images/insurepages-logo.png` and `/images/email/insurepages-templates-email.png` from that host; mail image proxies handle 308s unreliably. So exclude `/images/`.

- [ ] Add to `vercel.json` a `redirects` entry:
  ```json
  {
    "source": "/:path((?!images/).*)",
    "has": [{ "type": "host", "value": "^insure-pages\\.vercel\\.app$" }],
    "destination": "https://www.insurepages.com/:path",
    "permanent": true
  }
  ```
- [ ] Verify the `/` root case matches path-to-regexp; add an explicit rule for `/` if it does not.
- [ ] Confirm the host regex is anchored so it cannot match a longer hostname.

Safe by construction: only the public production alias matches. The SSO-protected aliases and preview deploys have distinct hostnames.

### A2. Fix demo-page index control — `vercel.json` + `site/public/robots.txt`

Audit §9 P2. The six `/demos/*` pages return 200, are linked from `/templates/`, and are `Disallow`ed — but carry no `X-Robots-Tag`. Per Google (audit ref [8]) a `robots.txt`-blocked URL **cannot** expose a `noindex`, so blocking alone does not keep them out of search. The audit's own remedy: allow crawling, add `noindex`.

- [ ] Add a `headers` entry setting `X-Robots-Tag: noindex` on `/demos/(.*)`.
- [ ] Remove `Disallow: /demos/` from `site/public/robots.txt` so Googlebot can read that header.

Header-based rather than editing the six demo HTML files, which are third-party template markup. Reversible in one commit.

### A3. Structured data — `site/src/layouts/Base.astro`

Audit §9 P2: zero JSON-LD on any page.

- [ ] Add `Organization` and `WebSite` JSON-LD sitewide.
- [ ] Do **not** add `Service` / `FAQPage` / `BreadcrumbList` — audit §9 is explicit these go only where visible content qualifies, and it does not yet.

### A4. Image alt coverage

Audit §9 P3: one flagged image each on `/` and `/accessibility/`, four on `/templates/`.

- [ ] Review each flagged image; keep empty `alt` only where genuinely decorative, add descriptions to informational/portfolio imagery.

### A5. Tests + docs

- [ ] Extend `site/tests/canonical.test.mjs` to cover the JSON-LD blocks and the `robots.txt` change. Its blanket "no built file contains `vercel.app`" assertion already guards the origin.
- [ ] Update `CLAUDE.md` — it currently records the vercel.app redirect as deliberately deferred behind campaign email aging out. A1 supersedes that rationale.
- [ ] Keep the house rule: test files must never import each other; shared helpers live in `tests/support/`.

### A6. Validate and push

- [ ] `cd site && npm run build && npm test` — must pass before pushing (tests read `dist/`, so build first).
- [ ] Push to `claude/canonical-url-consolidation-30xmvm`.

---

## Tier B — one human action, then automated verification

- [ ] **B1. Merge PR #10.** Green and `mergeable_state: clean`; needs the draft flag cleared and the merge button. Closes the production-ahead-of-`main` risk above.
- [ ] **B2. Verify the deploy** once Vercel rebuilds:
  - [ ] All three www pages: self-referential canonical, 200, no noindex
  - [ ] `insure-pages.vercel.app/` and `/templates/` → 308 to matching www URL
  - [ ] Both hot-linked email images on the Vercel host → still 200
  - [ ] `/demos/*` → 200 with `X-Robots-Tag: noindex`, crawlable in `robots.txt`
  - [ ] `origin/main` carries `site: "https://www.insurepages.com"`

---

## Tier C — owner-only (Search Console and third-party dashboards)

The code fix will not move what Google has already consolidated; a recrawl must be prompted. Search Console is already verified for the domain.

- [ ] **C1.** Submit `https://www.insurepages.com/sitemap-index.xml`; remove any sitemap entry pointing at the Vercel host.
- [ ] **C2.** URL Inspection → Request Indexing on `/`, `/templates/`, `/accessibility/`.
- [ ] **C3.** Record the before-state (audit §11 Days 1–5 deliverable): the current *Google-selected* canonical per URL. Expect `Duplicate, Google chose different canonical than user` today; that flipping to a self-referential www canonical is the success signal.
- [ ] **C4.** Inspect the six `/demos/*` URLs to confirm the new noindex is seen.
- [ ] **C5.** Do **not** use the URL removal tool on the Vercel URLs — it hides results ~6 months without transferring signal and masks whether consolidation worked.
- [ ] **C6.** Third parties: rename the domain in place in Plausible (do not recreate — that resets history); update the startupfa.me listing URL; re-scrape social cards (LinkedIn Post Inspector, Facebook Sharing Debugger, X card validator) since `og:image` changed host.

**Expect one to three weeks** for the SERP to swap. Watch the Google-selected canonical in Search Console, not the SERP.

---

## Out of scope (follow-on, do not fold into this work)

The audit's traffic-growth roadmap — the eight-page commercial content set (§6), the GA4 measurement baseline (§11 Week 2), and proof-led link acquisition (§8) — is growth work, not consolidation. It belongs in its own pass once the canonical swap is confirmed in Search Console.

Also noted separately: the repo has **no CI** (`.github/workflows/` does not exist), so `npm test` — including the canonical regression tests — runs only when someone runs it locally.
