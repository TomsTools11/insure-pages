# Product Requirements Document — Rapid Website Service for Insurance Agencies

**Working name:** RapidSite *(placeholder — to be finalized; alternates: Launchpad, Velocity, AgencyLaunch)*
**Document owner:** Tom Panos
**Audience:** Founding / cross-functional team (ops, design, engineering, GTM)
**Status:** Draft v0.1 — for review
**Last updated:** June 27, 2026

---

## 1. TL;DR

We are building a **productized service that delivers modern, professionally designed websites for insurance agencies of all sizes — live in under one week.** The product has two halves that ship together: a **client-facing service** (structured intake → design → launch, with a fixed scope and a sub-1-week SLA) and an **internal build platform** (a templated, accessibility-compliant design system plus AI-assisted content and pre-built insurance integrations) that makes the speed economically possible.

The wedge is **speed + conversion + compliance**. Typical agency website builds take 4–12 weeks; we compress that to **5 business days**. Unlike brochureware competitors, every site is built to **convert paid and organic traffic into leads** and ships **WCAG 2.1 AA-compliant by default** to de-risk the accessibility lawsuits now hitting insurance agencies. Recurring revenue comes from a monthly care plan (hosting, security, accessibility monitoring, content updates).

---

## 2. Problem & Opportunity

### 2.1 The agency problem

Most independent insurance agencies run outdated, slow, non-mobile, or non-converting websites — or none at all. When they do try to fix it, they face a bad menu of options:

- **Custom web agencies** are expensive and slow (6–12 weeks), and rarely understand insurance.
- **DIY builders** (Wix, Squarespace, GoDaddy) are cheap but require the agency owner to design, write, and maintain the site themselves — time they don't have.
- **Insurance-specific incumbents** (ITC/Zywave, BrightFire, Forge3, Stratosphere) understand the vertical but often deliver templated, brochure-style sites on multi-week timelines, with conversion and accessibility treated as add-ons.

Meanwhile two forces raise the stakes:

1. **Lead economics.** Agencies increasingly buy paid traffic and leads. A slow, low-converting site wastes that spend. The website is the conversion surface for every marketing dollar.
2. **Legal exposure.** Insurance agency sites are a high-risk target for ADA/web-accessibility lawsuits — quote tools, client portals, and claim forms are common complaint points. **Over 4,000 web accessibility lawsuits were filed in 2024**, and courts treat **WCAG 2.1 AA** as the de facto standard. Most incumbent and DIY sites are not built to that bar.

### 2.2 The opportunity

There is room for a service that wins on **time-to-launch** while bundling **conversion-first design** and **accessibility compliance** as defaults, not upsells. The recurring care plan turns one-time builds into MRR. For our context specifically, agencies running paid lead/traffic campaigns are an ideal, reachable beachhead — they already feel the pain of a leaky conversion surface.

### 2.3 Market landscape (selected incumbents)

| Provider | Position | Notable traits | Typical gap we exploit |
|---|---|---|---|
| **ITC / Zywave (Insurance Website Builder)** | Largest insurance website provider in the US | 75+ templates, SEO management, quote web forms, analytics | Templated feel; multi-week setup; conversion not the focus |
| **BrightFire** | Custom insurance agency sites + digital marketing | No contracts/setup fees, 30-day money-back, ADA/WCAG offering | Slower custom timeline; care priced as suite |
| **Forge3 (Agency Revolution)** | Insurance agency websites with engagement tools | "Spotlight" interactive features | Premium positioning; setup timeline |
| **Stratosphere** | All-in-one site + original SEO content | Expert-written content, ongoing SEO | Content-led timeline; higher touch |
| **DIY (Wix, Squarespace, GoDaddy)** | Self-serve | Cheap, flexible | All work falls on the agency; not insurance-aware |

**Build-time benchmark:** small static sites ~2 weeks; standard sites 4–6 weeks; custom/integrated 8–12+ weeks. **Our sub-1-week promise is a structural differentiator no major incumbent leads with.**

---

## 3. Vision & Strategy

### 3.1 Vision

> Every insurance agency — from a solo producer to a multi-location shop — can have a modern, fast, lead-converting, compliant website live in days, not months, with zero technical effort on their part.

### 3.2 Strategic pillars

1. **Speed as the headline.** Under-1-week launch is the promise we organize the entire operating model around.
2. **Conversion by default.** Every template is engineered to turn traffic into quote requests and calls, not just to look good.
3. **Compliance baked in.** WCAG 2.1 AA, mobile, and performance standards ship on day one — risk reduction is part of the product.
4. **Productized, not bespoke.** Fixed scope, defined revision rounds, and a templated engine keep delivery fast, predictable, and high-margin.
5. **Recurring relationship.** The build is the front door; the monthly care plan is the business.

### 3.3 Positioning statement

*For insurance agencies that need a professional web presence fast, RapidSite is a done-for-you website service that launches a modern, conversion-optimized, ADA-compliant site in under a week — unlike custom agencies (too slow/expensive) or DIY builders (too much work), and unlike incumbent insurance site providers, we lead with speed and conversion, not templates and timelines.*

### 3.4 Why now

- AI-assisted content + a mature component-library approach make sub-1-week delivery feasible at quality.
- Rising accessibility litigation makes "compliant by default" a real, sellable wedge.
- Agencies are shifting budget into paid lead acquisition, increasing the value of a high-converting site.

---

## 4. Goals & Success Metrics

### 4.1 North Star

**Sites launched per month at or under the SLA** — the single number that captures demand, throughput, and operational health.

### 4.2 Target metrics (first 12 months post-launch)

| Category | Metric | Target |
|---|---|---|
| **Speed** | Median time-to-launch (from intake complete) | ≤ 5 business days |
| **Speed** | On-time launch rate (within SLA) | ≥ 90% |
| **Throughput** | Sites launched / month (steady state) | Ramp to a defined run-rate (set in planning) |
| **Quality** | Accessibility: sites passing automated WCAG 2.1 AA scan at launch | 100% |
| **Quality** | Core Web Vitals "Good" at launch | ≥ 95% of sites |
| **Client outcome** | Lead-form + click-to-call conversion rate (median across sites) | Benchmark established, then improve QoQ |
| **Satisfaction** | Post-launch CSAT | ≥ 4.5 / 5 |
| **Revenue** | Care-plan attach rate at launch | ≥ 80% |
| **Revenue** | Care-plan 12-month retention | ≥ 90% |
| **Margin** | Build gross margin (automation-driven) | ≥ 60% |

### 4.3 Guardrail metrics

Revision rounds per build (cap at the SLA-supporting number), support tickets per site/month, refund/chargeback rate, time-to-first-response on care requests.

---

## 5. Target Customers

### 5.1 ICP

US-based insurance agencies — primarily **independent P&C agencies** — that need a professional site fast and care about converting traffic into leads. Compliance-sensitive and time-poor.

### 5.2 Segments

| Segment | Size | Primary need | Notes |
|---|---|---|---|
| **Solo / micro** | 1–2 producers | Credible, modern presence; quote/contact capture | Most price-sensitive; fastest to close |
| **Small** | 3–10 | Conversion + local SEO + light integrations | **Primary beachhead** |
| **Mid-market** | 11–25 | Multi-line pages, AMS/rater integration, brand polish | Higher ACV, care-plan stickiness |
| **Larger / multi-location** | 25+ | Multiple locations, advanced integrations, governance | Custom accents within the productized frame |

**Adjacent / future:** agency networks & clusters (volume deals), captive agents, and partners (AMS/rater vendors, marketing agencies) reselling the service.

### 5.3 Personas

- **Owner/Principal ("Dana"):** Wants leads and a credible brand; no time or technical skill; fears the project dragging on. Buys on speed + outcome.
- **Office Manager / Marketing Lead ("Marcus"):** Will run intake and supply assets; wants a painless process and easy ongoing edits.
- **Producer:** Wants the site to make the phone ring and quote forms to fill; cares about conversion.

---

## 6. Product Overview — How It Works

The product is **one service powered by two systems**:

### 6.1 The client-facing service

A done-for-you experience: a single structured intake, a fixed scope, a preview link, **one consolidated revision round**, and a launch — all inside a week. The agency does almost nothing except provide assets and approve.

### 6.2 The internal build platform (the speed engine)

The reason we can promise a week:

- A **templated design system** — a library of pre-built, pre-tested, WCAG-compliant page templates and components (hero, lines-of-business pages, about, team, locations, reviews, quote/contact, blog).
- **AI-assisted content generation** for location and lines-of-business pages and SEO copy, with mandatory human review.
- **Pre-built insurance integrations** (quote forms, AMS/CRM write-back, comparative rater links, analytics, click-to-call) that plug in rather than get built per project.
- **Automated QA** for accessibility, performance, mobile, and broken links.
- **Provisioning + deploy automation** (spin up, configure, deploy, DNS cutover).

> Design principle: **the platform absorbs the complexity so the service can stay fast and the margin can stay high.** Anything that would force bespoke engineering per client is out of v1 scope.

---

## 7. The Client Journey — Sub-1-Week Delivery Workflow

The SLA clock starts **when intake is complete** (assets + access received). This gating is essential — see Risks.

| Day | Stage | What happens | Owner |
|---|---|---|---|
| **Day 0** | **Intake & kickoff** | Client completes structured intake form; 30-min kickoff call; collect brand assets, logo, photos, lines of business, carriers, locations, contact details, domain/DNS access, integration targets. | Account / onboarding |
| **Day 1** | **Provision & draft** | Site provisioned from template; brand (colors, logo, fonts) applied; AI drafts page content; sitemap confirmed. | Build platform / producer |
| **Day 2** | **Assemble & integrate** | Content reviewed/edited by human; pages assembled; quote/contact forms, analytics, click-to-call, AMS/rater integrations wired. | Producer |
| **Day 3** | **Internal QA & preview** | Automated + manual QA (accessibility, mobile, performance, links, forms); **client preview link** sent with a guided review checklist. | QA / producer |
| **Day 4** | **Revision round** | Client submits **one consolidated set of edits**; edits applied; re-QA. | Producer |
| **Day 5** | **Launch** | Final QA; accessibility statement published; **DNS cutover / go-live**; handoff + care-plan onboarding. | Producer / account |

**Parallelization** (content drafting while design config runs) and **fixed scope** are what make 5 days realistic. Larger/multi-location builds may use a defined extended track (e.g., 7–10 days) communicated up front.

---

## 8. Packages & Pricing Model

Productized tiers + a recurring care plan. **Prices below are placeholders to validate against willingness-to-pay and competitor benchmarks.**

| | **Launch** | **Growth** *(most popular)* | **Premier** |
|---|---|---|---|
| Best for | Solo / micro | Small agencies | Mid / multi-location |
| Pages | Fixed essential set | Expanded (lines of business, locations) | Custom page count |
| Design | Template + brand | Template + brand + accents | Template + custom accents |
| Quote/contact forms | ✓ | ✓ (advanced, conditional logic) | ✓ |
| Local SEO setup | Basic | ✓ | ✓ (multi-location) |
| Integrations | Analytics, click-to-call | + AMS/CRM, rater link | + advanced/custom |
| Revision rounds | 1 | 1 | 1–2 |
| SLA | ≤ 5 business days | ≤ 5 business days | Extended track |
| **One-time build** | $ (TBD) | $$ (TBD) | $$$ (TBD) |
| **Monthly care plan** | $ (TBD) | $$ (TBD) | $$$ (TBD) |

**Care plan (recurring) includes:** hosting, SSL, security/uptime monitoring, **ongoing accessibility scanning + remediation**, backups, minor content updates (defined allotment), and performance monitoring. Higher tiers add content/blog publishing and conversion reporting.

**Pricing model decisions to make:** setup-fee + monthly vs. monthly-only; contract length; money-back guarantee (note BrightFire uses no setup fee + 30-day guarantee as a competitive anchor).

---

## 9. Functional Requirements (Scope)

### 9.1 Core website (must-have, every tier)

- Responsive, mobile-first templates; fast-loading.
- Standard page set: Home, About, Lines of Business / Products, Locations, Team, Testimonials/Reviews, Contact, Quote Request, Privacy/Legal, Accessibility Statement.
- Conversion components: prominent click-to-call, sticky CTAs, quote/contact forms above the fold, trust signals (carrier logos, reviews, badges).
- Basic on-page local SEO (titles, meta, schema, NAP consistency, Google Business Profile alignment).
- Editable content (CMS) so agencies can make light edits post-launch.

### 9.2 Insurance-specific features

- **Quote request forms** with conditional logic by line of business (auto, home, life, commercial, etc.).
- **Carrier logo / "markets we represent"** modules.
- **Lines-of-business landing pages** (templated, AI-drafted, human-reviewed).
- **Comparative rater hand-off / quoting link** (e.g., EZLynx and similar) where the agency uses one.
- **Client service center / portal links** (link-out to AMS/portal where applicable).
- Optional **click-to-text** and appointment scheduling.

### 9.3 Compliance & accessibility (non-negotiable)

- Built to **WCAG 2.1 AA** by default; automated scan must pass at launch + manual spot-checks (keyboard nav, contrast, alt text, form labels, focus states).
- **Published accessibility statement** on every site.
- Ongoing accessibility monitoring via the care plan.
- **Responsible-claims note:** we materially reduce accessibility-lawsuit risk and conform to the recognized standard; we **do not provide legal guarantees or immunity**. Marketing and contracts must reflect this, and clients should be advised to consult counsel.

### 9.4 Integrations

- **Analytics & tracking:** GA4 (or equivalent), conversion/event tracking, call tracking, pixel support for paid campaigns.
- **Lead routing / CRM & AMS:** form submissions delivered to email + CRM/AMS; **AMS write-back** to common systems (Applied Epic, AMS360, EZLynx, HawkSoft) where supported, otherwise via integration layer (e.g., Zapier-style).
- **Comparative rater** link/embed where applicable.
- **Reviews** (Google) and **scheduling** integrations.

### 9.5 Explicitly out of scope (v1)

- Fully bespoke/custom-coded designs outside the component system.
- Native client portals or claims systems we build ourselves (we link to existing AMS/portals).
- E-commerce / online policy binding.
- Non-insurance verticals.
- Multilingual sites (candidate for v2).

---

## 10. The Build Platform — Requirements

The internal engine that delivers the speed. Required capabilities:

1. **Component & template library:** reusable, brand-themable, accessibility- and performance-tested page templates and blocks; insurance-specific modules (quote forms, carrier grid, LOB pages).
2. **Brand theming:** apply logo, color palette, and typography across a template in minutes (token-based theming).
3. **AI content generation:** draft LOB/location/SEO copy from intake inputs, with a **mandatory human review/edit step** and brand/compliance guardrails (no unverifiable claims, correct disclaimers).
4. **CMS:** lets producers assemble fast and lets clients make light edits post-launch.
5. **Integration connectors:** pre-built quote-form, analytics, call-tracking, CRM/AMS, and rater connectors.
6. **Automated QA suite:** accessibility (WCAG 2.1 AA), Core Web Vitals/performance, mobile rendering, broken-link and form-submission checks — run before every preview and launch.
7. **Provisioning & deploy automation:** one-click spin-up, staging preview link, production deploy, DNS/SSL handling.
8. **Asset intake pipeline:** structured form that maps directly to template fields to minimize manual transcription.
9. **Internal dashboard:** pipeline view of every build, its stage, SLA countdown, and blockers.

---

## 11. Non-Functional Requirements

- **Performance:** Core Web Vitals "Good"; fast TTFB via modern hosting/CDN.
- **Security:** SSL on all sites; hardened hosting; regular backups; spam protection on forms.
- **Reliability:** target uptime ≥ 99.9%; monitoring + alerting.
- **Scalability:** platform supports many concurrent builds and a growing fleet of hosted sites without linear headcount growth.
- **SEO:** clean semantic markup, schema, sitemaps, fast load, mobile-first.
- **Maintainability:** template/library updates can propagate; documented producer workflows.

---

## 12. Delivery Model & Operating Cadence

- **SLA contract:** "Live in 5 business days from intake completion" with clearly defined scope, one revision round, and a stated extended track for larger builds.
- **Clock-start gating:** SLA begins only when assets + DNS/integration access are received — protects the promise from client-side delays.
- **RACI (high level):** Account/onboarding owns intake, client comms, and launch handoff; Producer owns assembly, integrations, and revisions; QA owns accessibility/performance sign-off; Platform/Eng owns the engine and connectors.
- **Definition of Done:** passes automated + manual QA, accessibility statement published, integrations verified (test submission), client approval logged, DNS live, care-plan onboarding scheduled.

---

## 13. Team & Operating Model (to staff)

- **Onboarding / Account Manager** — intake, client communication, launch & care handoff.
- **Site Producers** — assemble, integrate, revise (the throughput engine; metric = sites/producer/week).
- **QA / Accessibility specialist** — pre-launch sign-off (can be partly automated).
- **Platform / Engineering** — build and maintain templates, connectors, automation.
- **Content/SEO** — guardrails, prompt/template tuning, higher-tier content.
- **GTM / Sales** — pipeline and partnerships.

Staffing model should track **builds-per-producer-per-week** as the core capacity unit.

---

## 14. Go-to-Market

### 14.1 Beachhead

Independent P&C agencies already spending on paid leads/traffic — they feel the leaky-conversion-surface pain most acutely, and a fast, conversion-built site is an obvious complement. Where there's an existing relationship or channel into agencies (e.g., performance-marketing/lead ecosystems), **bundle or partner**: "we drive the traffic; we'll also build the site that converts it."

### 14.2 Channels

1. **Partner / channel:** lead-gen and marketing platforms serving agencies; AMS and rater vendors; agency networks & clusters (volume).
2. **Direct outbound** to agencies with weak/outdated sites (easy to demo the gap, including a free accessibility scan as a hook).
3. **Referrals** from launched clients (incentivized).
4. **Content/SEO + paid** targeting "insurance agency website" intent.

### 14.3 Hooks

- "Modern, compliant, lead-converting site **live in a week**."
- **Free accessibility audit** of their current site (creates urgency given litigation risk).
- Conversion-lift framing for agencies running paid traffic.

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| **SLA breaks under scope creep** | Erodes core promise | Fixed productized scope; one revision round; extended track for big builds; pipeline/SLA dashboard |
| **Client delays (assets/DNS)** | Misses the week through no fault of ours | Clock starts at intake completion; proactive asset collection; clear client checklist |
| **AI content quality / wrong claims** | Brand & compliance risk | Mandatory human review; compliance guardrails; no unverifiable claims; correct disclaimers |
| **Accessibility liability over-promise** | Legal exposure for us and clients | Build to WCAG 2.1 AA; publish statements; **never guarantee immunity**; advise counsel; care-plan monitoring |
| **Differentiation erosion** (incumbents copy speed) | Competitive pressure | Compound advantage via conversion + compliance + integrations + care relationship; keep improving the engine |
| **Thin build margin** | Unit economics | Automation + templating; care-plan MRR as the real business; cap revisions |
| **Integration variability** (many AMS/raters) | Slows builds | Pre-built connectors for the top systems; integration layer fallback; scope rarer ones to higher tiers |
| **Support/maintenance load** as fleet grows | Margin & quality | Automated monitoring; defined care-plan allotments; self-serve light edits via CMS |

---

## 16. Roadmap & Phasing

### Phase 0 — Foundation (MVP engine)
Build the core template library (single design system, essential page set), brand theming, basic intake, AI content draft + human review, automated accessibility/performance QA, provisioning/deploy, and the standard quote/contact form + analytics. **Goal:** launch a real agency site end-to-end in ≤ 5 days, manually orchestrated.

### Phase 1 — V1 productization
Multiple templates, the three pricing tiers, care plan, top AMS/rater connectors, internal pipeline dashboard, and the onboarding workflow. **Goal:** repeatable throughput at target SLA and margin; first cohort of paying clients + care plans.

### Phase 2 — Scale
More templates/verticalized modules, deeper integrations, self-serve elements of intake, conversion-reporting for clients, partner/reseller program, multi-location governance. Candidate adds: multilingual, advanced content/SEO subscriptions.

*(Concrete dates and headcount to be set in planning.)*

---

## 17. Open Questions / Decisions Needed

1. **Final SLA framing:** strict "5 business days" headline vs. "under a week" — and the exact extended track for large/multi-location builds.
2. **Pricing architecture:** setup-fee + monthly vs. monthly-only; contract terms; money-back guarantee?
3. **Tech approach:** which CMS/stack and hosting; build vs. buy for the template engine and connectors.
4. **Accessibility commitment language:** exact, legally reviewed wording for marketing and contracts.
5. **Integration priority list:** which AMS/raters are tier-1 connectors at launch.
6. **Beachhead channel:** lead with partner/bundle motion, direct outbound, or both — and what the bundle looks like.
7. **Brand & name** for the service.
8. **Throughput targets & staffing** for steady state.

---

## 18. Appendix

### A. Glossary
- **AMS** — Agency Management System (e.g., Applied Epic, AMS360, EZLynx, HawkSoft).
- **Comparative rater** — tool that pulls quotes from multiple carriers (e.g., EZLynx).
- **Lines of Business (LOB)** — insurance product categories (auto, home, life, commercial, etc.).
- **WCAG 2.1 AA** — Web Content Accessibility Guidelines; the standard courts reference for ADA web compliance.
- **Care plan** — recurring subscription (hosting, security, accessibility monitoring, content updates).
- **Time-to-launch** — business days from intake completion to go-live.

### B. Sources (market research)
- BrightFire — Insurance agency websites & pricing: https://www.brightfire.com/solutions-for-insurance-agents/insurance-agency-websites/ ; https://www.brightfire.com/pricing/
- BrightFire — ADA/WCAG compliance for insurance sites: https://www.brightfire.com/ada-wcag-compliance-insurance-agency-websites/
- Forge3 / Agency Revolution — insurance agency websites: https://forge3.com/insurance-solutions/insurance-agency-websites/
- Zywave / ITC Insurance Website Builder: https://www.zywave.com/products/zywave-websites/ ; https://www.insurancewebsitebuilder.com/
- Stratosphere — insurance agency website / development timelines: https://www.joinstratosphere.com/insurance-agency-website ; https://www.joinstratosphere.com/blog/insurance-agency-website-development
- TestParty — 2026 guide to ADA website lawsuits (4,000+ in 2024; WCAG 2.1/2.2 AA): https://testparty.ai/blog/the-2026-guide-to-ada-website-lawsuits-what-to-do-when-you-get-sued-and-why-your
- EZLynx — comparative rater / AMS (330+ carriers): https://www.ezlynx.com/
- HawkSoft — partners/integrations: https://www.hawksoft.com/about/partners/

---

*End of PRD v0.1 — draft for team review.*
