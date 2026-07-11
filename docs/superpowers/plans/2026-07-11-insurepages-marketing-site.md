# InsurePages Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the InsurePages by S3 Labs marketing one-pager — an Astro static site built faithfully from the `InsurePages.html` prototype — deployed to Vercel at WCAG 2.1 AA and Lighthouse ≥ 95.

**Architecture:** Componentized single Astro page in `site/` (one component per section), design tokens as CSS custom properties in a global stylesheet, self-hosted variable fonts extracted from the prototype bundle, FormRobin handles all form submissions (site stays fully static — the only client JS is a tiny lazy-loader for the embed).

**Tech Stack:** Astro ^5 (static output), @astrojs/sitemap, vanilla CSS (no framework), Node ≥ 20 (`node --test` for HTML assertions), Vercel hosting.

**Spec:** `docs/superpowers/specs/2026-07-11-insurepages-marketing-site-design.md` (approved 2026-07-11)

## Global Constraints

- Palette (verbatim, never altered): `--ink #1A1A1A` · `--cream #FFF8EB` · `--cream-deep #FBEED2` · `--red #FF5757` · `--yellow #FFE066` · `--green #7BD389` · `--blue #6FB3FF` · `--lavender #C8B6FF` · `--muted #6A655C`
- Fonts: Unbounded (display), Plus Jakarta Sans (body) — self-hosted latin-subset variable woff2 extracted from the prototype; `font-display: swap`
- Brand: **InsurePages by S3 Labs**. The strings "Branded Agency Partners", "brandedagencypartners", and "(000) 000-0000" must not appear anywhere in built output.
- Copy fixes (mandatory): "styled guide" → "style guide"; "color pallet" → "color palette"; `Quarterly&nbsp; strategy` → `Quarterly strategy`; `Monthly&nbsp; reporting` → `Monthly reporting`
- Header "Start now" sticker: label must be visually centered (spec fix 1a)
- CTA link map: "Schedule a call" → `https://formrobin.com/f/wy85le3` (new tab, `rel="noopener"`); "View packages →" → `#pricing`; "Start now" and all "Begin →" → `#contact`
- FormRobin embed snippet (verbatim, lazy-loaded): `<div class="formrobin-embed" data-path="/f/wy85le3"></div>` + `<script src="https://formrobin.com/js/embed.js"></script>`
- Accessibility: WCAG 2.1 AA; axe: 0 critical/serious violations; skip link; `prefers-reduced-motion` respected; decorative SVGs/shapes `aria-hidden="true"`
- Performance: Lighthouse ≥ 95 in all four categories; no client JS except the embed lazy-loader
- Site URL placeholder until domain lands: `https://insure-pages.vercel.app`
- Every commit message ends with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- All commands run from the repo root `/Users/tpanos/TProjects/current-projects/insure-pages` unless a step says otherwise

---

### Task 1: Repo tidy + prototype reference extraction

**Files:**
- Move: `InsurePages.html` → `design/InsurePages.html`
- Create: `design/extract-prototype.py`
- Create (generated): `design/reference/template.html`, `design/reference/main.css`, `design/reference/body.html`, `design/reference/fonts/plus-jakarta-sans-latin.woff2`, `design/reference/fonts/unbounded-latin.woff2`
- Modify: `.gitignore`
- Tidy: `assets/` duplicate logo files

**Interfaces:**
- Produces: `design/reference/fonts/*.woff2` (copied into the Astro site in Task 2); `design/reference/main.css` and `body.html` (the port source all component tasks read from)

- [ ] **Step 1: Move the prototype into design/**

```bash
mkdir -p design
git mv InsurePages.html design/InsurePages.html
```

- [ ] **Step 2: Write the extraction script**

Create `design/extract-prototype.py`:

```python
#!/usr/bin/env python3
"""Extract the page template, CSS, markup, and latin-subset fonts from the
self-extracting prototype bundle (design/InsurePages.html).

The bundle stores assets in a <script type="__bundler/manifest"> JSON blob
(uuid -> {mime, compressed, data}) and the page in a
<script type="__bundler/template"> JSON string. Font data is plain base64
(wOF2). Run from the repo root: python3 design/extract-prototype.py
"""
import base64
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "reference")
FONTS = {
    # latin-subset variable fonts only (English copy); uuid prefix -> filename
    "b4595f22": "plus-jakarta-sans-latin.woff2",
    "b34f597b": "unbounded-latin.woff2",
}

with open(os.path.join(HERE, "InsurePages.html"), encoding="utf-8") as f:
    bundle = f.read()

manifest = json.loads(
    re.search(r'<script type="__bundler/manifest">(.*?)</script>', bundle, re.DOTALL).group(1)
)
template = json.loads(
    re.search(r'<script type="__bundler/template">(.*?)</script>', bundle, re.DOTALL).group(1)
)

os.makedirs(os.path.join(OUT, "fonts"), exist_ok=True)

with open(os.path.join(OUT, "template.html"), "w", encoding="utf-8") as f:
    f.write(template)

styles = re.findall(r"<style>(.*?)</style>", template, re.DOTALL)
main_css = next(s for s in styles if "@font-face" not in s)
with open(os.path.join(OUT, "main.css"), "w", encoding="utf-8") as f:
    f.write(main_css)

body = template.split("</helmet>", 1)[1]
body = body.replace("</x-dc>", "").replace("</body></html>", "").strip()
with open(os.path.join(OUT, "body.html"), "w", encoding="utf-8") as f:
    f.write(body)

for uuid, asset in manifest.items():
    name = FONTS.get(uuid[:8])
    if not name:
        continue
    raw = base64.b64decode(asset["data"])
    assert raw[:4] == b"wOF2", f"{name}: expected wOF2 magic, got {raw[:4]!r}"
    with open(os.path.join(OUT, "fonts", name), "wb") as f:
        f.write(raw)
    print(f"wrote fonts/{name} ({len(raw)} bytes)")

print("wrote template.html, main.css, body.html")
```

- [ ] **Step 3: Run the extraction (this is the test)**

Run: `python3 design/extract-prototype.py`
Expected output (byte counts may vary slightly):

```
wrote fonts/plus-jakarta-sans-latin.woff2 (27272 bytes)
wrote fonts/unbounded-latin.woff2 (50891 bytes)
wrote template.html, main.css, body.html
```

Verify: `ls design/reference/fonts/` shows both woff2 files; the assert guards the magic bytes.

- [ ] **Step 4: Tidy the duplicate logo assets**

The four `assets/Ip-logo-1-light-bg*.png` files have different byte sizes — view each one (Read tool) before deciding. Keep every visually distinct variant with a sensible name; delete true duplicates. Expected end state (adjust to what inspection shows):

```bash
# example — rename distinct variants, drop duplicates:
git add -A assets/
git status --short   # confirm only intended changes
```

Also stage the previously-deleted `Ip-logo-2/3/4` files (`git add -A assets/` covers the deletions already in the working tree).

- [ ] **Step 5: Extend .gitignore for the Astro site**

Append to `.gitignore`:

```
# Astro site
site/node_modules/
site/dist/
site/.astro/
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Move prototype to design/, add extraction script + reference assets

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Astro scaffold — config, tokens, fonts, base layout

**Files:**
- Create: `site/package.json`, `site/astro.config.mjs`, `site/public/robots.txt`, `site/public/favicon.svg`, `site/src/styles/global.css`, `site/src/layouts/Base.astro`, `site/src/pages/index.astro` (placeholder), `site/tests/build.test.mjs`
- Copy: `design/reference/fonts/*.woff2` → `site/public/fonts/`

**Interfaces:**
- Produces: `Base.astro` layout with slot (all pages wrap in it; props: `title: string`, `description: string`); global CSS classes every component task uses verbatim: `.container`, `.sticker`, `.btn`, `.btn-ink`, `.btn-red`, `.btn-light`, `.btn-yellow`, `.section-head`, `.section-eyebrow`, `.section-title`, `.section-sub`, `.skip-link`; CSS custom properties per Global Constraints
- Test pattern all later tasks reuse: `cd site && npm run build && npm test`

- [ ] **Step 1: Write the failing build test**

Create `site/tests/build.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
export const page = (p = "index.html") => readFileSync(join(dist, p), "utf-8");

test("build produced index.html with the InsurePages title", () => {
  assert.ok(existsSync(join(dist, "index.html")), "dist/index.html missing — run npm run build");
  const html = page();
  assert.match(html, /<title>InsurePages — Websites for independent insurance agents<\/title>/);
});

test("no stale branding or placeholder contact info anywhere", () => {
  const html = page();
  assert.doesNotMatch(html, /Branded Agency Partners/i);
  assert.doesNotMatch(html, /brandedagencypartners/i);
  assert.doesNotMatch(html, /\(000\) 000-0000/);
});

test("fonts are self-hosted and preloaded", () => {
  const html = page();
  assert.match(html, /rel="preload"[^>]*\/fonts\/unbounded-latin\.woff2/);
  assert.ok(existsSync(join(dist, "fonts", "unbounded-latin.woff2")));
  assert.ok(existsSync(join(dist, "fonts", "plus-jakarta-sans-latin.woff2")));
});
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `cd site && node --test tests/`
Expected: FAIL — `dist` does not exist (no site yet).

- [ ] **Step 3: Create package.json and astro config**

`site/package.json`:

```json
{
  "name": "insurepages-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "node --test tests/"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/sitemap": "^3.0.0"
  }
}
```

`site/astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://insure-pages.vercel.app",
  integrations: [sitemap()],
});
```

`site/public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://insure-pages.vercel.app/sitemap-index.xml
```

- [ ] **Step 4: Copy fonts and create the favicon**

```bash
mkdir -p site/public/fonts site/public/images
cp design/reference/fonts/plus-jakarta-sans-latin.woff2 site/public/fonts/
cp design/reference/fonts/unbounded-latin.woff2 site/public/fonts/
```

`site/public/favicon.svg` (red brand pill, white "iP" — placeholder Tom can swap):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="4" y="4" width="56" height="56" rx="14" fill="#FF5757" stroke="#1A1A1A" stroke-width="4"/>
  <text x="32" y="43" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#FFF8EB">iP</text>
</svg>
```

- [ ] **Step 5: Create global.css (tokens + shared primitives)**

`site/src/styles/global.css` — tokens, fonts, reset, shared classes. This is the single source for anything used by more than one component; section-specific CSS lives scoped inside each component.

```css
/* ============ Fonts (self-hosted variable, latin subset) ============ */
@font-face {
  font-family: "Plus Jakarta Sans";
  font-style: normal;
  font-weight: 400 800;
  font-display: swap;
  src: url("/fonts/plus-jakarta-sans-latin.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: "Unbounded";
  font-style: normal;
  font-weight: 400 900;
  font-display: swap;
  src: url("/fonts/unbounded-latin.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}

/* ============ Tokens (verbatim from prototype) ============ */
:root {
  --ink: #1a1a1a;
  --cream: #fff8eb;
  --cream-deep: #fbeed2;
  --red: #ff5757;
  --yellow: #ffe066;
  --green: #7bd389;
  --blue: #6fb3ff;
  --lavender: #c8b6ff;
  --muted: #6a655c;
}

/* ============ Reset & base ============ */
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  color: var(--ink);
  background: var(--cream);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
.container { max-width: 1280px; margin: 0 auto; padding: 0 40px; }

/* ============ Accessibility ============ */
.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 200;
  background: var(--ink);
  color: #fff;
  padding: 12px 20px;
  border-radius: 0 0 12px 0;
  font-weight: 700;
  text-decoration: none;
}
.skip-link:focus { left: 0; }
:focus-visible {
  outline: 3px solid var(--ink);
  outline-offset: 3px;
  border-radius: 4px;
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}

/* ============ Sticker primitives ============ */
.sticker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fff;
  color: var(--ink);
  padding: 10px 18px;
  border: 2px solid var(--ink);
  border-radius: 100px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 3px 3px 0 var(--ink);
  transition: all 0.15s ease;
  white-space: nowrap;
  text-align: center;
}
.sticker:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--ink); }

/* ============ Buttons ============ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 18px 30px;
  border-radius: 100px;
  text-decoration: none;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  font-weight: 700;
  font-size: 15px;
  border: 2px solid var(--ink);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.btn-ink { background: var(--ink); color: #fff; box-shadow: 5px 5px 0 var(--red); }
.btn-red { background: var(--red); color: #fff; box-shadow: 5px 5px 0 var(--ink); }
.btn-light { background: #fff; color: var(--ink); box-shadow: 5px 5px 0 var(--yellow); }
.btn-yellow { background: var(--yellow); color: var(--ink); box-shadow: 5px 5px 0 var(--ink); }
.btn:hover { transform: translate(-2px, -2px); }
.btn-ink:hover { box-shadow: 7px 7px 0 var(--red); }
.btn-red:hover { box-shadow: 7px 7px 0 var(--ink); }
.btn-light:hover { box-shadow: 7px 7px 0 var(--yellow); }
.btn-yellow:hover { box-shadow: 7px 7px 0 var(--ink); }

/* ============ Shared section header ============ */
.section-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 64px;
  text-align: center;
}
.section-eyebrow {
  background: var(--lavender);
  padding: 8px 16px;
  border: 2px solid var(--ink);
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 3px 3px 0 var(--ink);
}
.section-title {
  font-family: "Unbounded", sans-serif;
  font-weight: 700;
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1.05;
  letter-spacing: -0.03em;
  max-width: 900px;
}
.section-sub {
  font-size: 18px;
  color: #3a3a3a;
  max-width: 580px;
  font-weight: 500;
}
```

- [ ] **Step 6: Create Base.astro and the placeholder index page**

`site/src/layouts/Base.astro`:

```astro
---
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
}
const { title, description } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
const ogImage = new URL("/images/og.png", Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <link
      rel="preload"
      href="/fonts/unbounded-latin.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="/fonts/plus-jakarta-sans-latin.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <slot />
  </body>
</html>
```

`site/src/pages/index.astro` (placeholder — replaced in Task 3):

```astro
---
import Base from "../layouts/Base.astro";
---

<Base
  title="InsurePages — Websites for independent insurance agents"
  description="We build independent insurance agents a website that gets found, earns trust on sight, and turns searches into clients."
>
  <main id="main"><h1>InsurePages</h1></main>
</Base>
```

- [ ] **Step 7: Install and build; run tests to verify they pass**

```bash
cd site && npm install && npm run build && npm test
```

Expected: build succeeds; all 3 tests PASS.

- [ ] **Step 8: Commit**

```bash
git add site/ .gitignore
git commit -m "Scaffold Astro site: tokens, fonts, base layout, build tests

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Header and Footer (site chrome)

**Files:**
- Create: `site/src/components/Header.astro`, `site/src/components/Footer.astro`
- Modify: `site/src/pages/index.astro`
- Test: `site/tests/chrome.test.mjs`

**Interfaces:**
- Consumes: `Base.astro`, global classes `.container`, `.sticker`
- Produces: `<Header />` and `<Footer />` (no props) imported by both pages (Task 7 reuses them on `/accessibility`)

- [ ] **Step 1: Write the failing tests**

Create `site/tests/chrome.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./build.test.mjs";

test("header has nav links and a centered Start now sticker", () => {
  const html = page();
  assert.match(html, /href="#build"/);
  assert.match(html, /href="#method"/);
  assert.match(html, /href="#pricing"/);
  assert.match(html, /class="[^"]*nav-cta[^"]*"[^>]*href="#contact"/);
  assert.match(html, /Start now/);
});

test("footer: no dead links, correct brand, accessibility link", () => {
  const html = page();
  assert.doesNotMatch(html, />About</);
  assert.doesNotMatch(html, />Portfolio</);
  assert.doesNotMatch(html, />Journal</);
  assert.doesNotMatch(html, /href="#"[^>]*>/); // no dead anchors anywhere
  assert.match(html, /href="\/accessibility\/?"/);
  assert.match(html, /© 2026 InsurePages/);
  assert.match(html, /by S3 Labs/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd site && npm run build && npm test`
Expected: chrome tests FAIL (placeholder page has no header/footer).

- [ ] **Step 3: Create Header.astro**

The prototype's nav sticker (`Start now ✨`) renders off-center because the emoji + flex `gap` reserve trailing space. Fix: dedicated `.nav-cta` class — emoji in an `aria-hidden` span, `gap: 6px`, explicit centering. Prototype hides the whole nav under 900px; keep the anchor links hidden but leave the Start-now CTA visible (conversion + the spec's keyboard-reachable requirement).

```astro
<header class="site-header">
  <div class="container header-inner">
    <a class="brand-mark" href="/" aria-label="InsurePages home">
      <span class="brand-pill">InsurePages</span>
      <span class="brand-meta-house">by S3 Labs</span>
    </a>
    <nav class="primary-nav" aria-label="Main">
      <a class="sticker nav-link" href="#build">Approach</a>
      <a class="sticker nav-link" href="#method">Method</a>
      <a class="sticker nav-link" href="#pricing">Packages</a>
      <a class="sticker nav-cta" href="#contact">Start now <span aria-hidden="true">✨</span></a>
    </nav>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    background: var(--cream);
    z-index: 100;
    padding: 20px 0;
    border-bottom: 2px solid var(--ink);
  }
  .site-header > .container {
    max-width: 100%;
    padding-left: 24px;
    padding-right: 40px;
  }
  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .brand-mark {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    text-decoration: none;
    color: var(--ink);
  }
  .brand-pill {
    background: var(--red);
    color: #fff;
    padding: 10px 18px;
    border-radius: 14px;
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.02em;
    box-shadow: 4px 4px 0 var(--ink);
    border: 2px solid var(--ink);
    transform: rotate(-2deg);
  }
  .brand-meta-house {
    font-size: 11px;
    font-weight: 600;
    color: var(--muted);
    margin-left: 4px;
  }
  .primary-nav {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .primary-nav a { text-decoration: none; color: var(--ink); }
  /* Spec fix 1a: centered label. Emoji sits in its own span so the text
     block itself stays optically centered inside the pill. */
  .nav-cta {
    background: var(--yellow);
    gap: 6px;
    justify-content: center;
  }
  @media (max-width: 900px) {
    .nav-link { display: none; }
  }
</style>
```

- [ ] **Step 4: Create Footer.astro**

Dead Studio links (About/Portfolio/Journal/Privacy) removed per spec; "Resources" column links the accessibility statement; "Hello" column routes to the two live conversion paths. The prototype's `#2e9df180` (50 %-alpha blue) footer-house text fails contrast on ink — use opaque `#8fc7ff`.

```astro
<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div>
        <span class="footer-brand-pill">InsurePages</span>
        <p class="footer-tag">
          Considered websites and brand work for independent insurance agents.
        </p>
        <div class="footer-house">InsurePages by S3 Labs</div>
      </div>
      <nav aria-label="Site">
        <h2 class="footer-col-title">Site</h2>
        <div class="footer-col-list">
          <a href="#build">Approach</a>
          <a href="#method">Method</a>
          <a href="#pricing">Packages</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
      <nav aria-label="Resources">
        <h2 class="footer-col-title">Resources</h2>
        <div class="footer-col-list">
          <a href="/accessibility/">Accessibility</a>
        </div>
      </nav>
      <nav aria-label="Get in touch">
        <h2 class="footer-col-title">Hello</h2>
        <div class="footer-col-list">
          <a href="#contact">Contact us</a>
          <a href="https://formrobin.com/f/wy85le3" target="_blank" rel="noopener"
            >Schedule a call</a
          >
        </div>
      </nav>
    </div>
    <div class="footer-bar">
      <span>© 2026 InsurePages · by S3 Labs</span>
      <span>Made with care in the studio.</span>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    background: var(--ink);
    color: #fff;
    padding: 80px 0 24px;
  }
  .footer-top {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1fr;
    gap: 56px;
    padding-bottom: 56px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }
  .footer-brand-pill {
    background: var(--red);
    color: #fff;
    padding: 12px 22px;
    border-radius: 16px;
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 28px;
    letter-spacing: -0.02em;
    border: 2px solid #fff;
    box-shadow: 4px 4px 0 var(--yellow);
    transform: rotate(-2deg);
    display: inline-block;
    margin-bottom: 24px;
  }
  .footer-tag {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    max-width: 280px;
    line-height: 1.6;
    margin-bottom: 16px;
  }
  .footer-house {
    font-size: 12px;
    color: #8fc7ff; /* was #2e9df180 in prototype — fails contrast on ink */
    font-weight: 600;
  }
  .footer-col-title {
    font-family: "Unbounded", sans-serif;
    font-size: 13px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--yellow);
    margin-bottom: 20px;
    font-weight: 700;
  }
  .footer-col-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .footer-col-list a {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
  }
  .footer-col-list a:hover { color: var(--yellow); }
  .footer-bar {
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.62);
    font-weight: 500;
  }
  @media (max-width: 900px) {
    .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
  }
</style>
```

- [ ] **Step 5: Wire into index.astro**

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
---

<Base
  title="InsurePages — Websites for independent insurance agents"
  description="We build independent insurance agents a website that gets found, earns trust on sight, and turns searches into clients."
>
  <Header />
  <main id="main"><h1>InsurePages</h1></main>
  <Footer />
</Base>
```

- [ ] **Step 6: Build and run tests to verify they pass**

Run: `cd site && npm run build && npm test`
Expected: all tests PASS (build, chrome).

- [ ] **Step 7: Commit**

```bash
git add site/
git commit -m "Add Header and Footer with centered Start-now CTA and cleaned links

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Hero and TrustStrip sections

**Files:**
- Create: `site/src/components/Hero.astro`, `site/src/components/TrustStrip.astro`
- Modify: `site/src/pages/index.astro`
- Test: `site/tests/hero.test.mjs`

**Interfaces:**
- Consumes: global `.container`, `.btn`, `.btn-ink`, `.btn-light`
- Produces: `<Hero />`, `<TrustStrip />` (no props)

- [ ] **Step 1: Write the failing tests**

Create `site/tests/hero.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./build.test.mjs";

test("hero: headline, lede, and CTA link map", () => {
  const html = page();
  assert.match(html, /If they can't find you, they'll find/);
  assert.match(html, /another agent\./);
  assert.match(html, /href="#pricing"[^>]*>View packages/);
  // Schedule a call goes to the hosted form in a new tab (spec CTA link map)
  assert.match(
    html,
    /href="https:\/\/formrobin\.com\/f\/wy85le3"[^>]*target="_blank"[^>]*>[\s\S]{0,40}?Schedule a call/
  );
});

test("trust strip has all four items", () => {
  const html = page();
  for (const item of [
    "Launch in days",
    "SEO from day one",
    "You own the site",
    "No long-term contracts",
  ]) {
    assert.match(html, new RegExp(item));
  }
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd site && npm run build && npm test`
Expected: hero tests FAIL.

- [ ] **Step 3: Create Hero.astro**

```astro
<section class="hero">
  <div class="container">
    <div class="hero-stickers">
      <span class="hero-eyebrow">✦ For Insurance agents</span>
      <span class="hero-from">★ From $699</span>
    </div>
    <h1>
      If they can't find you, they'll find
      <span class="hero-highlight">another agent.</span>
    </h1>
    <p class="hero-lede">
      We build independent insurance agents a website that gets found, earns
      trust on sight, and turns searches into clients.
    </p>
    <div class="hero-cta">
      <a href="#pricing" class="btn btn-ink">View packages →</a>
      <a
        href="https://formrobin.com/f/wy85le3"
        target="_blank"
        rel="noopener"
        class="btn btn-light"
        >Schedule a call</a
      >
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 80px 0 60px;
    text-align: center;
    position: relative;
  }
  .hero-stickers {
    display: flex;
    justify-content: center;
    gap: 18px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }
  .hero-eyebrow {
    background: var(--yellow);
    padding: 16px 26px;
    border: 2px solid var(--ink);
    border-radius: 12px;
    font-weight: 700;
    font-size: 20px;
    box-shadow: 4px 4px 0 var(--ink);
    transform: rotate(-2deg);
  }
  .hero-from {
    background: var(--green);
    padding: 10px 16px;
    border: 2px solid var(--ink);
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
    box-shadow: 3px 3px 0 var(--ink);
    transform: rotate(2deg);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    white-space: nowrap;
  }
  h1 {
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: clamp(48px, 7vw, 96px);
    line-height: 1;
    letter-spacing: -0.03em;
    margin: 0 auto 36px;
    max-width: 1150px;
  }
  .hero-highlight {
    display: inline-block;
    background: var(--red);
    color: #fff;
    padding: 4px 22px;
    border-radius: 20px;
    transform: rotate(-2deg);
    box-shadow: 6px 6px 0 var(--ink);
    border: 3px solid var(--ink);
    margin: 6px 0;
  }
  .hero-lede {
    font-size: 20px;
    line-height: 1.55;
    color: #3a3a3a;
    max-width: 660px;
    margin: 0 auto 44px;
    font-weight: 500;
  }
  .hero-cta {
    display: flex;
    gap: 18px;
    justify-content: center;
    flex-wrap: wrap;
  }
  @media (max-width: 900px) {
    .hero { padding: 48px 0 32px; }
    h1 { font-size: 44px; }
  }
</style>
```

- [ ] **Step 4: Create TrustStrip.astro**

Dots are decorative (`aria-hidden`); the strip is a list semantically.

```astro
<section class="trust-strip" aria-label="Why agents choose us">
  <ul class="container trust-inner">
    <li class="trust-item">
      <span class="trust-dot" style="background: var(--red);" aria-hidden="true"></span>
      Launch in days
    </li>
    <li class="trust-item">
      <span class="trust-dot" style="background: var(--yellow);" aria-hidden="true"></span>
      SEO from day one
    </li>
    <li class="trust-item">
      <span class="trust-dot" style="background: var(--green);" aria-hidden="true"></span>
      You own the site
    </li>
    <li class="trust-item">
      <span class="trust-dot" style="background: var(--blue);" aria-hidden="true"></span>
      No long-term contracts
    </li>
  </ul>
</section>

<style>
  .trust-strip {
    padding: 24px 0;
    border-top: 2px solid var(--ink);
    border-bottom: 2px solid var(--ink);
    background: var(--cream-deep);
    overflow: hidden;
  }
  .trust-inner {
    display: flex;
    gap: 32px;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    list-style: none;
  }
  .trust-item {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 15px;
    color: var(--ink);
  }
  /* dot separators from the prototype are drawn with ::after so the list
     stays clean semantically */
  .trust-item:not(:last-child)::after {
    content: "";
    width: 6px;
    height: 6px;
    background: var(--ink);
    border-radius: 50%;
    margin-left: 22px;
  }
  .trust-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid var(--ink);
  }
</style>
```

- [ ] **Step 5: Wire into index.astro**

Replace the `<main>` block:

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import TrustStrip from "../components/TrustStrip.astro";
import Footer from "../components/Footer.astro";
---

<Base
  title="InsurePages — Websites for independent insurance agents"
  description="We build independent insurance agents a website that gets found, earns trust on sight, and turns searches into clients."
>
  <Header />
  <main id="main">
    <Hero />
    <TrustStrip />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 6: Build and run tests to verify they pass**

Run: `cd site && npm run build && npm test`
Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add site/
git commit -m "Add Hero and TrustStrip sections

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Pillars ("What we build") and Method sections

**Files:**
- Create: `site/src/components/Pillars.astro`, `site/src/components/Method.astro`
- Modify: `site/src/pages/index.astro`
- Test: `site/tests/content.test.mjs`

**Interfaces:**
- Consumes: global `.container`, `.section-head`, `.section-eyebrow`, `.section-title`, `.section-sub`
- Produces: `<Pillars />` (section `id="build"`), `<Method />` (section `id="method"`)

- [ ] **Step 1: Write the failing tests**

Create `site/tests/content.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./build.test.mjs";

test("pillars: three cards with headings", () => {
  const html = page();
  assert.match(html, /id="build"/);
  assert.match(html, /Found on Google\./);
  assert.match(html, /Instant trust\./);
  assert.match(html, /Lead capture\./);
  assert.match(html, /really well\./);
});

test("method: five steps with copy fixes applied", () => {
  const html = page();
  assert.match(html, /id="method"/);
  assert.match(html, /A conversation, first\./);
  assert.match(html, /style guide/);
  assert.doesNotMatch(html, /styled guide/);
  assert.match(html, /color palette/);
  assert.doesNotMatch(html, /color pallet\b/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd site && npm run build && npm test`
Expected: content tests FAIL.

- [ ] **Step 3: Create Pillars.astro**

SVG icons are decorative → `aria-hidden="true" focusable="false"`. The card number chips are presentational; the real order comes from heading text.

```astro
<section class="build" id="build">
  <div class="container">
    <div class="section-head">
      <span class="section-eyebrow">What we build</span>
      <h2 class="section-title">
        Three things, done <em class="title-highlight">really well.</em>
      </h2>
      <p class="section-sub">
        Every site we build does these three jobs — nothing missing, nothing fluffy.
      </p>
    </div>
    <div class="build-grid">
      <div class="build-card c1">
        <span class="build-num" aria-hidden="true">01</span>
        <div class="build-icon">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            stroke="#FFE066"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="14" cy="14" r="8"></circle>
            <path d="M20 20l6 6"></path>
          </svg>
        </div>
        <h3 class="build-name">Found on Google.</h3>
        <p class="build-desc">
          Search-ready structure and content so the agent who shows up is you —
          not the agency three towns over.
        </p>
      </div>
      <div class="build-card c2">
        <span class="build-num" aria-hidden="true">02</span>
        <div class="build-icon">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            stroke="#7BD389"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M16 4l3.5 7.5L27 13l-5.5 5.5L23 26l-7-4-7 4 1.5-7.5L5 13l7.5-1.5z"
            ></path>
          </svg>
        </div>
        <h3 class="build-name">Instant trust.</h3>
        <p class="build-desc">
          A polished first impression that makes prospects feel they're in good
          hands before they read a single word.
        </p>
      </div>
      <div class="build-card c3">
        <span class="build-num" aria-hidden="true">03</span>
        <div class="build-icon">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            stroke="#6FB3FF"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M6 8c0-1 1-2 2-2h8l2 4h6c1 0 2 1 2 2v12c0 1-1 2-2 2H8c-1 0-2-1-2-2V8z"
            ></path>
            <path d="M12 16l3 3 6-6"></path>
          </svg>
        </div>
        <h3 class="build-name">Lead capture.</h3>
        <p class="build-desc">
          Clear calls to action and quiet, intentional forms that turn passive
          visitors into real conversations.
        </p>
      </div>
    </div>
  </div>
</section>

<style>
  .build { padding: 120px 0; position: relative; }
  .title-highlight {
    font-style: normal;
    background: var(--red);
    color: #fff;
    padding: 0 14px;
    border-radius: 14px;
    box-shadow: 4px 4px 0 var(--ink);
    border: 2px solid var(--ink);
    display: inline-block;
    transform: rotate(-2deg);
  }
  .build-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  .build-card {
    background: #fff;
    border: 2px solid var(--ink);
    border-radius: 24px;
    padding: 32px;
    box-shadow: 6px 6px 0 var(--ink);
    transition: all 0.2s ease;
    position: relative;
  }
  .build-card:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 var(--ink); }
  .build-card.c1 { background: var(--yellow); }
  .build-card.c2 { background: var(--green); }
  .build-card.c3 { background: var(--blue); }
  .build-icon {
    width: 64px;
    height: 64px;
    background: var(--ink);
    border-radius: 16px;
    border: 2px solid var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    box-shadow: 4px 4px 0 #fff, 4px 4px 0 2px var(--ink);
  }
  .build-icon svg { width: 32px; height: 32px; }
  .build-name {
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 28px;
    line-height: 1.1;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }
  .build-desc {
    font-size: 16px;
    line-height: 1.55;
    color: var(--ink);
    font-weight: 500;
  }
  .build-num {
    position: absolute;
    top: -14px;
    right: 20px;
    background: var(--ink);
    color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 14px;
    border: 2px solid var(--ink);
  }
  @media (max-width: 900px) {
    .build { padding: 72px 0; }
    .build-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 4: Create Method.astro**

Steps become an ordered list (`ol`) with real headings (`h3`) — the prototype used bare divs. Copy fixes applied in steps 02 ("style guide", "color palette").

```astro
<section class="method" id="method">
  <div class="container">
    <div class="section-head">
      <span class="section-eyebrow" style="background: var(--green);">The method</span>
      <h2 class="section-title">Our practiced 5-step process.</h2>
      <p class="section-sub">From first call to launch day. No surprises, no mystery.</p>
    </div>
    <ol class="method-list">
      <li class="method-row">
        <div class="method-num" aria-hidden="true">01</div>
        <div>
          <h3 class="method-step">A conversation, first.</h3>
          <p class="method-detail">
            We start by listening — about your practice, your clients, and what
            makes your agency yours.
          </p>
        </div>
      </li>
      <li class="method-row">
        <div class="method-num" aria-hidden="true">02</div>
        <div>
          <h3 class="method-step">Comprehensive style guide.</h3>
          <p class="method-detail">
            A 20+ page detailed style guide that includes website direction,
            color palette, and branding.
          </p>
        </div>
      </li>
      <li class="method-row">
        <div class="method-num" aria-hidden="true">03</div>
        <div>
          <h3 class="method-step">Design &amp; build.</h3>
          <p class="method-detail">
            We design and build the site — measured, considered, and made to
            load fast and rank well from day one.
          </p>
        </div>
      </li>
      <li class="method-row">
        <div class="method-num" aria-hidden="true">04</div>
        <div>
          <h3 class="method-step">Review &amp; refine.</h3>
          <p class="method-detail">
            A working draft to walk through together. We revise until every
            section earns its place.
          </p>
        </div>
      </li>
      <li class="method-row">
        <div class="method-num" aria-hidden="true">05</div>
        <div>
          <h3 class="method-step">Launch — and onward.</h3>
          <p class="method-detail">
            We hand you the keys and stay on hand. The site is yours, always.
          </p>
        </div>
      </li>
    </ol>
  </div>
</section>

<style>
  .method {
    padding: 120px 0;
    background: var(--cream-deep);
    border-top: 2px solid var(--ink);
    border-bottom: 2px solid var(--ink);
  }
  .method-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
    list-style: none;
  }
  .method-row {
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 32px;
    align-items: center;
    background: #fff;
    border: 2px solid var(--ink);
    border-radius: 20px;
    padding: 24px 32px;
    box-shadow: 5px 5px 0 var(--ink);
    transition: all 0.15s ease;
  }
  .method-row:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 var(--ink); }
  .method-num {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    border: 2px solid var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 28px;
    color: var(--ink);
  }
  .method-row:nth-child(1) .method-num { background: var(--red); color: #fff; }
  .method-row:nth-child(2) .method-num { background: var(--yellow); }
  .method-row:nth-child(3) .method-num { background: var(--green); }
  .method-row:nth-child(4) .method-num { background: var(--blue); }
  .method-row:nth-child(5) .method-num { background: var(--lavender); }
  .method-step {
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.02em;
    margin-bottom: 6px;
  }
  .method-detail {
    font-size: 15px;
    color: #3a3a3a;
    font-weight: 500;
    line-height: 1.55;
  }
  @media (max-width: 900px) {
    .method { padding: 72px 0; }
    .method-row { grid-template-columns: 1fr; gap: 12px; text-align: left; }
  }
</style>
```

- [ ] **Step 5: Wire into index.astro**

Add imports and place between `<TrustStrip />` and `<Footer />`:

```astro
import Pillars from "../components/Pillars.astro";
import Method from "../components/Method.astro";
```

```astro
    <Hero />
    <TrustStrip />
    <Pillars />
    <Method />
```

- [ ] **Step 6: Build and run tests to verify they pass**

Run: `cd site && npm run build && npm test`
Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add site/
git commit -m "Add Pillars and Method sections with copy fixes

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: Pricing and ContactCta (FormRobin embed)

**Files:**
- Create: `site/src/components/Pricing.astro`, `site/src/components/ContactCta.astro`
- Modify: `site/src/pages/index.astro`
- Test: `site/tests/conversion.test.mjs`

**Interfaces:**
- Consumes: global `.container`, `.section-head` family, `.btn` family
- Produces: `<Pricing />` (section `id="pricing"`), `<ContactCta />` (section `id="contact"` — the anchor every "Begin →"/"Start now" CTA targets)

- [ ] **Step 1: Write the failing tests**

Create `site/tests/conversion.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./build.test.mjs";

test("pricing: three tiers, prices, fixed copy, Begin CTAs to #contact", () => {
  const html = page();
  assert.match(html, /id="pricing"/);
  for (const tier of ["Starter", "Gold", "Silver"]) assert.match(html, new RegExp(tier));
  for (const price of ["499", "699", "599"]) assert.match(html, new RegExp(price));
  assert.match(html, /Quarterly strategy review/);
  assert.doesNotMatch(html, /Quarterly&nbsp;/);
  assert.match(html, /Monthly reporting/);
  assert.doesNotMatch(html, /Monthly&nbsp;/);
  const begins = html.match(/href="#contact"[^>]*class="[^"]*btn[^"]*"|class="[^"]*btn[^"]*"[^>]*href="#contact"/g) ?? [];
  assert.ok(begins.length >= 3, `expected ≥3 Begin buttons targeting #contact, got ${begins.length}`);
});

test("contact: FormRobin embed with lazy loader and noscript fallback", () => {
  const html = page();
  assert.match(html, /id="contact"/);
  assert.match(html, /class="formrobin-embed"[^>]*data-path="\/f\/wy85le3"/);
  // embed.js is NOT statically present — the lazy loader injects it
  assert.doesNotMatch(html, /<script[^>]*src="https:\/\/formrobin\.com\/js\/embed\.js"/);
  assert.match(html, /formrobin\.com\/js\/embed\.js/); // referenced inside the loader
  assert.match(html, /<noscript>[\s\S]*?href="https:\/\/formrobin\.com\/f\/wy85le3"[\s\S]*?<\/noscript>/);
  // CTA-band Schedule a call → hosted form
  assert.match(html, /href="https:\/\/formrobin\.com\/f\/wy85le3"[^>]*>[\s\S]{0,40}?Schedule a call →/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd site && npm run build && npm test`
Expected: conversion tests FAIL.

- [ ] **Step 3: Create Pricing.astro**

Card order preserved from the prototype: Starter · Gold (featured, elevated) · Silver. Tier names become `h3`. `&nbsp;` doubles fixed.

```astro
<section class="pricing" id="pricing">
  <div class="container">
    <div class="section-head">
      <span class="section-eyebrow" style="background: var(--blue);">Packages</span>
      <h2 class="section-title">Three levels of support.</h2>
      <p class="section-sub">Pick what fits. No fine print, no contracts, no upsells.</p>
    </div>
    <div class="pricing-grid">
      <div class="price-card">
        <h3 class="price-tier">Starter</h3>
        <p class="price-amount">
          <span class="price-amount-currency" aria-hidden="true">$</span>499
          <span class="sr-only">dollars</span>
        </p>
        <p class="price-cadence">One-time payment</p>
        <ul class="price-features">
          <li>Five to seven essential pages</li>
          <li>Custom design to your brand</li>
          <li>Mobile responsive throughout</li>
          <li>Foundational SEO setup</li>
          <li>Contact form &amp; integrations</li>
        </ul>
        <a href="#contact" class="btn btn-light price-btn">Begin →</a>
      </div>
      <div class="price-card featured">
        <span class="price-badge">★ Best value</span>
        <h3 class="price-tier">Gold</h3>
        <p class="price-amount">
          <span class="price-amount-currency" aria-hidden="true">$</span>699
          <span class="sr-only">dollars</span>
        </p>
        <p class="price-cadence">Setup · $75/mo</p>
        <ul class="price-features">
          <li>Everything in Starter</li>
          <li>Monthly SEO-focused content</li>
          <li>Quarterly strategy review</li>
          <li>Monthly reporting</li>
          <li>Priority support, always</li>
        </ul>
        <a href="#contact" class="btn btn-yellow price-btn">Begin →</a>
      </div>
      <div class="price-card">
        <h3 class="price-tier">Silver</h3>
        <p class="price-amount">
          <span class="price-amount-currency" aria-hidden="true">$</span>599
          <span class="sr-only">dollars</span>
        </p>
        <p class="price-cadence">Setup · $25/mo</p>
        <ul class="price-features">
          <li>Everything in Starter</li>
          <li>Advanced SEO setup</li>
          <li>Hosting &amp; maintenance</li>
          <li>Monthly edits included</li>
          <li>Email support</li>
        </ul>
        <a href="#contact" class="btn btn-light price-btn">Begin →</a>
      </div>
    </div>
  </div>
</section>

<style>
  .pricing { padding: 120px 0; }
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    align-items: stretch;
  }
  .price-card {
    background: #fff;
    border: 2px solid var(--ink);
    border-radius: 24px;
    padding: 36px 32px 32px;
    box-shadow: 6px 6px 0 var(--ink);
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 0.2s ease;
  }
  .price-card:hover { transform: translate(-3px, -3px); box-shadow: 9px 9px 0 var(--ink); }
  .price-card.featured {
    background: var(--ink);
    color: #fff;
    box-shadow: 6px 6px 0 var(--red);
    transform: translateY(-12px);
  }
  .price-card.featured:hover {
    box-shadow: 9px 9px 0 var(--red);
    transform: translate(-3px, -15px);
  }
  .price-card.featured .price-features li,
  .price-card.featured .price-cadence { color: rgba(255, 255, 255, 0.85); }
  .price-badge {
    position: absolute;
    top: -16px;
    left: 24px;
    background: var(--yellow);
    color: var(--ink);
    padding: 6px 14px;
    border: 2px solid var(--ink);
    border-radius: 8px;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    box-shadow: 3px 3px 0 var(--ink);
    transform: rotate(-3deg);
  }
  .price-tier {
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 18px;
    letter-spacing: -0.01em;
    margin-bottom: 16px;
  }
  .price-amount {
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 64px;
    line-height: 1;
    letter-spacing: -0.04em;
    display: flex;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 8px;
  }
  .price-amount-currency {
    font-size: 28px;
    margin-top: 10px;
    color: var(--red);
  }
  .price-card.featured .price-amount-currency { color: var(--yellow); }
  .price-cadence {
    font-weight: 600;
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 28px;
  }
  .price-features {
    list-style: none;
    flex-grow: 1;
    margin-bottom: 28px;
  }
  .price-features li {
    padding: 10px 0;
    font-size: 15px;
    font-weight: 500;
    color: var(--ink);
    display: flex;
    align-items: start;
    gap: 10px;
    border-bottom: 1px dashed rgba(26, 26, 26, 0.15);
  }
  .price-card.featured .price-features li { border-bottom-color: rgba(255, 255, 255, 0.15); }
  .price-features li:last-child { border-bottom: none; }
  .price-features li::before {
    content: "✓";
    color: var(--red);
    font-weight: 700;
    flex-shrink: 0;
  }
  .price-card.featured .price-features li::before { color: var(--yellow); }
  .price-btn { width: 100%; justify-content: center; }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
    border: 0;
  }
  @media (max-width: 900px) {
    .pricing { padding: 72px 0; }
    .pricing-grid { grid-template-columns: 1fr; }
    .price-card.featured { transform: none; }
  }
</style>
```

- [ ] **Step 4: Create ContactCta.astro**

The CTA band keeps the prototype look and gains the embedded FormRobin form below the headline. The embed script loads only when the section nears the viewport (IntersectionObserver, 600px margin, load-once). `is:inline` keeps Astro from bundling/hoisting it. Contrast fix: the band paragraph is `#fff` at weight 700 (white-on-red passes AA only as large/bold text).

```astro
<section class="cta-band" id="contact">
  <span class="cta-deco cta-deco-1" aria-hidden="true">Free consult ✦</span>
  <span class="cta-deco cta-deco-2" aria-hidden="true">No contracts ★</span>
  <span class="cta-deco cta-deco-3" aria-hidden="true"></span>
  <span class="cta-deco cta-deco-4" aria-hidden="true"></span>
  <div class="container">
    <h2>Ready to look as good as you are?</h2>
    <p>A conversation costs nothing. Let's see what your site could do.</p>
    <div class="cta-actions">
      <a
        href="https://formrobin.com/f/wy85le3"
        target="_blank"
        rel="noopener"
        class="btn btn-yellow cta-btn"
        >Schedule a call →</a
      >
    </div>
    <div class="form-shell">
      <h3 class="form-title">Or tell us about your project</h3>
      <div class="formrobin-embed" data-path="/f/wy85le3"></div>
      <noscript>
        <p class="form-fallback">
          Our contact form needs JavaScript. You can also reach us directly at
          <a href="https://formrobin.com/f/wy85le3">formrobin.com/f/wy85le3</a>.
        </p>
      </noscript>
    </div>
  </div>
</section>

<script is:inline>
  (function () {
    var loaded = false;
    function loadEmbed() {
      if (loaded) return;
      loaded = true;
      var s = document.createElement("script");
      s.src = "https://formrobin.com/js/embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
    var target = document.getElementById("contact");
    if (!target || !("IntersectionObserver" in window)) {
      loadEmbed();
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          loadEmbed();
          io.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    io.observe(target);
  })();
</script>

<style>
  .cta-band {
    padding: 140px 0;
    background: var(--red);
    border-top: 2px solid var(--ink);
    border-bottom: 2px solid var(--ink);
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-deco { position: absolute; pointer-events: none; }
  .cta-deco-1 {
    top: 40px; left: 80px;
    background: var(--yellow);
    border: 2px solid var(--ink);
    padding: 14px 20px;
    border-radius: 10px;
    font-weight: 700;
    transform: rotate(-12deg);
    box-shadow: 4px 4px 0 var(--ink);
  }
  .cta-deco-2 {
    bottom: 60px; right: 100px;
    background: var(--blue);
    border: 2px solid var(--ink);
    padding: 14px 20px;
    border-radius: 10px;
    font-weight: 700;
    transform: rotate(8deg);
    box-shadow: 4px 4px 0 var(--ink);
  }
  .cta-deco-3 {
    top: 80px; right: 140px;
    width: 72px; height: 72px;
    background: var(--green);
    border: 2px solid var(--ink);
    border-radius: 50%;
    box-shadow: 4px 4px 0 var(--ink);
    transform: rotate(-15deg);
  }
  .cta-deco-4 {
    bottom: 80px; left: 120px;
    width: 80px; height: 80px;
    background: var(--lavender);
    border: 2px solid var(--ink);
    border-radius: 16px;
    box-shadow: 4px 4px 0 var(--ink);
    transform: rotate(18deg);
  }
  h2 {
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: clamp(40px, 6vw, 80px);
    line-height: 1.02;
    letter-spacing: -0.03em;
    color: #fff;
    max-width: 980px;
    margin: 0 auto 28px;
    position: relative;
  }
  p {
    font-size: 19px;
    color: #fff;
    font-weight: 700; /* bold => AA large-text threshold on red */
    max-width: 540px;
    margin: 0 auto 44px;
    position: relative;
  }
  .cta-actions { position: relative; margin-bottom: 56px; }
  .cta-btn { font-size: 17px; padding: 22px 36px; }
  .form-shell {
    position: relative;
    max-width: 720px;
    margin: 0 auto;
    background: var(--cream);
    border: 2px solid var(--ink);
    border-radius: 24px;
    box-shadow: 6px 6px 0 var(--ink);
    padding: 32px;
    text-align: left;
  }
  .form-title {
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 16px;
  }
  .form-fallback { color: var(--ink); font-weight: 600; }
  .form-fallback a { color: var(--ink); }
  @media (max-width: 900px) {
    .cta-band { padding: 72px 0; }
    .cta-deco { display: none; }
  }
</style>
```

- [ ] **Step 5: Wire into index.astro**

Add imports and place after `<Method />`:

```astro
import Pricing from "../components/Pricing.astro";
import ContactCta from "../components/ContactCta.astro";
```

```astro
    <Method />
    <Pricing />
    <ContactCta />
```

- [ ] **Step 6: Build and run tests to verify they pass**

Run: `cd site && npm run build && npm test`
Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add site/
git commit -m "Add Pricing and ContactCta with lazy FormRobin embed

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 7: Accessibility statement page

**Files:**
- Create: `site/src/pages/accessibility.astro`
- Test: `site/tests/accessibility-page.test.mjs`

**Interfaces:**
- Consumes: `Base.astro`, `<Header />`, `<Footer />` (from Tasks 2–3)
- Produces: `/accessibility/` route (already linked from the footer in Task 3)

- [ ] **Step 1: Write the failing test**

Create `site/tests/accessibility-page.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./build.test.mjs";

test("accessibility statement page exists with required content", () => {
  const html = page("accessibility/index.html");
  assert.match(html, /<title>Accessibility statement — InsurePages<\/title>/);
  assert.match(html, /WCAG(?:\s|&#(?:32|160);|&nbsp;)*2\.1(?:\s|&#(?:32|160);|&nbsp;)*(?:level\s*)?AA/i);
  assert.match(html, /formrobin\.com\/f\/wy85le3/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd site && npm run build && npm test`
Expected: FAIL — `dist/accessibility/index.html` missing.

- [ ] **Step 3: Create accessibility.astro**

```astro
---
import Base from "../layouts/Base.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
---

<Base
  title="Accessibility statement — InsurePages"
  description="InsurePages is committed to an accessible web. Our site targets WCAG 2.1 level AA, and every site we build for clients ships to the same standard."
>
  <Header />
  <main id="main" class="statement">
    <div class="container">
      <h1>Accessibility statement</h1>
      <p class="updated">Last updated: July 11, 2026</p>

      <h2>Our commitment</h2>
      <p>
        InsurePages by S3 Labs builds websites for independent insurance
        agents, and we believe those websites should work for everyone. This
        site — and every site we build for clients — targets
        <strong>WCAG 2.1 level AA</strong>, the standard broadly referenced for
        web accessibility under the Americans with Disabilities Act.
      </p>

      <h2>Measures we take</h2>
      <ul>
        <li>Semantic HTML landmarks, headings, and lists throughout.</li>
        <li>Color contrast checked against WCAG 2.1 AA for text and interactive elements.</li>
        <li>Full keyboard operability with visible focus indicators and a skip link.</li>
        <li>Motion and transitions respect the <code>prefers-reduced-motion</code> setting.</li>
        <li>Automated accessibility scans (axe) run before every release.</li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        Our contact form is provided by FormRobin, a third-party service. If
        you have difficulty using the embedded form, the same form is available
        directly at
        <a href="https://formrobin.com/f/wy85le3">formrobin.com/f/wy85le3</a>.
      </p>

      <h2>Feedback</h2>
      <p>
        If you encounter an accessibility barrier anywhere on this site, please
        tell us through
        <a href="https://formrobin.com/f/wy85le3">our contact form</a> — include
        the page and a short description of the problem. We aim to respond
        within two business days and to fix verified issues promptly.
      </p>

      <h2>A note on standards</h2>
      <p>
        Conformance targets reduce risk and improve real-world usability; no
        statement of conformance is a legal guarantee. We continuously test and
        improve this site as guidelines and assistive technologies evolve.
      </p>
    </div>
  </main>
  <Footer />
</Base>

<style>
  .statement { padding: 80px 0 120px; }
  .statement .container { max-width: 760px; }
  h1 {
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: clamp(36px, 5vw, 56px);
    letter-spacing: -0.03em;
    margin-bottom: 8px;
  }
  .updated {
    color: var(--muted);
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 40px;
  }
  h2 {
    font-family: "Unbounded", sans-serif;
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.02em;
    margin: 40px 0 12px;
  }
  p, li { font-size: 16px; font-weight: 500; color: #3a3a3a; }
  ul { padding-left: 22px; display: grid; gap: 8px; }
  a { color: var(--ink); font-weight: 700; }
</style>
```

- [ ] **Step 4: Build and run tests to verify they pass**

Run: `cd site && npm run build && npm test`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add site/
git commit -m "Add accessibility statement page

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: Visual + accessibility verification pass (browser)

**Files:**
- Modify: whatever the findings require (component CSS, copy) — no new files expected

**Interfaces:**
- Consumes: the full built site from Tasks 2–7
- Produces: a visually-verified, axe-clean site ready for the QA gate

- [ ] **Step 1: Serve the built site**

```bash
cd site && npm run build && npm run preview   # serves dist/ at http://localhost:4321
```

- [ ] **Step 2: Desktop visual sweep against the prototype**

Open `http://localhost:4321` in the browser pane at 1280px. Compare side-by-side against `design/InsurePages.html` (serve the repo root with the existing `static-preview` launch config, `http://localhost:4173/design/InsurePages.html`). Every section must match the prototype's look: header, hero, trust strip, pillars, method, pricing, CTA band, footer. **Specifically verify the header "Start now" label is optically centered in its yellow pill (spec fix 1a) — zoom in on it.**

- [ ] **Step 3: Mobile sweep**

Resize the browser pane to 375×812. Verify: no horizontal scrolling; nav collapses to brand + Start-now sticker; pricing/pillars stack; featured card is not offset; CTA decorations hidden.

- [ ] **Step 4: Keyboard + reduced-motion checks**

- Tab from the top: first stop is the skip link; activating it jumps to `#main`. Every nav link, CTA, and footer link is reachable with a visible focus ring.
- Set the pane's `prefers-reduced-motion` (or emulate via devtools) and confirm smooth-scroll and hover transforms are suppressed.

- [ ] **Step 5: axe scan (both pages)**

In the browser pane on `http://localhost:4321`, inject and run axe from the JS console (javascript_tool):

```js
// load axe from node_modules copy served locally — inject the source text:
// fetch is CSP-safe same-origin; simplest is to paste axe.min.js source, or run:
var s = document.createElement("script");
s.src = "https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js";
s.onload = () => axe.run().then((r) => {
  const bad = r.violations.filter((v) => ["critical", "serious"].includes(v.impact));
  console.log("AXE critical/serious:", JSON.stringify(bad.map((v) => v.id + ": " + v.help)));
});
document.head.appendChild(s);
```

Expected: `AXE critical/serious: []` on `/` and `/accessibility/`. Fix any findings and re-run until clean.

Known likely finding: FormRobin's `embed.js` injects an iframe at runtime — if it arrives untitled (axe `frame-title`), extend the loader in `ContactCta.astro` to title it after load:

```js
// inside loadEmbed(), after appendChild(s):
s.onload = function () {
  var t = setInterval(function () {
    var f = document.querySelector(".formrobin-embed iframe");
    if (f) { f.title = "InsurePages contact form"; clearInterval(t); }
  }, 200);
  setTimeout(function () { clearInterval(t); }, 10000);
};
```

- [ ] **Step 6: Commit any fixes**

```bash
git add site/
git commit -m "Visual and accessibility verification fixes

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

(Skip the commit if the sweep produced zero changes.)

---

### Task 9: OG image, Lighthouse gate, link check

**Files:**
- Create: `site/public/images/og.png` (1200×630 capture of the hero)
- Test: `site/tests/final.test.mjs`

**Interfaces:**
- Consumes: built site; `Base.astro` already references `/images/og.png`
- Produces: release-ready `dist/`

- [ ] **Step 1: Write the failing test**

Create `site/tests/final.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./build.test.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

test("og image exists and sitemap generated", () => {
  assert.ok(existsSync(join(dist, "images", "og.png")), "og.png missing");
  assert.ok(existsSync(join(dist, "sitemap-index.xml")), "sitemap missing");
});

test("all internal anchors have matching ids", () => {
  const html = page();
  const anchors = [...html.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1]);
  for (const a of anchors) {
    assert.match(html, new RegExp(`id="${a}"`), `#${a} has no target`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd site && npm run build && npm test`
Expected: FAIL — `og.png` missing.

- [ ] **Step 3: Capture the OG image**

```bash
cd site && npm run preview &   # keep dist served at :4321
npx --yes playwright install chromium  # first run only
npx --yes playwright screenshot --viewport-size=1200,630 \
  http://localhost:4321 public/images/og.png
```

Verify the capture (Read the png) — it should show the hero headline and stickers, no cropping artifacts. Then rebuild so it lands in `dist/`: `npm run build`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd site && npm test`
Expected: all tests PASS.

- [ ] **Step 5: Lighthouse gate**

With the preview still serving:

```bash
npx --yes lighthouse http://localhost:4321 \
  --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new" --output=json --output-path=/tmp/lh.json --quiet
node -e "const r=require('/tmp/lh.json');for(const[c,v]of Object.entries(r.categories))console.log(c,Math.round(v.score*100))"
```

Expected: every category ≥ 95. If a category misses, fix the reported audit and re-run (common culprits: image sizing on og/logo assets, unpreloaded fonts, missing meta).

- [ ] **Step 6: Commit**

```bash
git add site/
git commit -m "Add OG image and pass Lighthouse/link-check gates

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 10: Deploy to Vercel + docs update

**Files:**
- Modify: `README.md`, `CLAUDE.md`, `site/astro.config.mjs` + `site/public/robots.txt` (if the production URL differs from the placeholder)

**Interfaces:**
- Consumes: release-ready `site/`
- Produces: live production URL; docs that match reality

- [ ] **Step 1: Deploy**

Use the Vercel MCP tool `deploy_to_vercel` with the `site/` directory as the project root (framework preset: Astro). If MCP deploy is unavailable, fall back to `cd site && npx vercel deploy --prod` (requires `vercel login` by Tom).

- [ ] **Step 2: Verify production**

Open the returned production URL in the browser pane:
- Page renders identically to local preview.
- FormRobin embed loads when scrolling to `#contact`; type a character into the First-Name field to confirm it accepts input (do **not** submit).
- `/accessibility/` renders. `robots.txt` and `sitemap-index.xml` respond 200.

- [ ] **Step 3: Sync the real URL**

If the production URL differs from `https://insure-pages.vercel.app`, update `site` in `site/astro.config.mjs` and the Sitemap line in `site/public/robots.txt`, rebuild, redeploy, re-verify.

- [ ] **Step 4: Update README.md and CLAUDE.md**

README: add a "Website" section — production URL, `site/` layout, and the three commands (`npm install`, `npm run dev`, `npm run build && npm test` from `site/`).

CLAUDE.md: replace the "Repository status: pre-implementation" section with the real state: Astro site in `site/`, commands (`cd site && npm run dev / build / test`), structure (components per section, global.css tokens, tests are node:test HTML assertions against `dist/`), and the still-open questions (domain, S3 Labs logo asset, product-platform stack — PRD §17.3 remains undecided for the *platform*, the marketing site stack is now fixed).

- [ ] **Step 5: Final commit and push**

```bash
git add -A
git commit -m "Deploy marketing site to Vercel; update project docs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
git push origin main
```

---

## Deferred / follow-ups (not in this plan)

- **S3 Labs logo image in the header** — blocked on Tom providing the exact square lockup file (`assets/s3-labs-logo.png`). When it lands: optimize, place in `site/public/images/`, swap the `.brand-meta-house` text in `Header.astro` for an `<img>` with proper `alt="S3 Labs"`, re-run Task 8's visual + axe checks.
- **Custom domain** — attach in Vercel, then update `site/astro.config.mjs`, `robots.txt`, and redeploy.
- **Vercel↔GitHub auto-deploy linking** — if MCP deploy was used, connect the Git integration from the Vercel dashboard so pushes to `main` deploy automatically.
