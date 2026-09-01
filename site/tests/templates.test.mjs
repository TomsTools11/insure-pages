import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./support/page.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const shippedDemos = () => {
  const demosDir = join(dist, "demos");
  return existsSync(demosDir) ? readdirSync(demosDir) : [];
};
const html = () => page("templates/index.html");

// Astro escapes interpolated text, so data strings must be compared in
// their built form (e.g. family's → family&#39;s).
const escapeHtml = (s) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

test("templates page builds with title, description, and its sections", () => {
  assert.ok(
    existsSync(join(dist, "templates", "index.html")),
    "dist/templates/index.html missing - run npm run build",
  );
  const h = html();
  assert.match(h, /<title>Insurance agency website templates \| InsurePages<\/title>/);
  assert.match(h, /<meta name="description" content="[^"]+"/);
  const sections = h.match(/<section/g) ?? [];
  assert.ok(sections.length >= 7, `expected at least 7 sections, saw ${sections.length}`);
  assert.match(h, /id="gallery"/);
});

test("templates page is reachable from header and footer on every page", () => {
  for (const p of ["index.html", "templates/index.html", "accessibility/index.html"]) {
    const h = page(p);
    const links = h.match(/href="\/templates\/"/g) ?? [];
    assert.ok(links.length >= 2, `${p} should link /templates/ in header and footer`);
  }
});

test("every template in the data renders a card", async () => {
  const { templates } = await import("../src/data/templates.mjs");
  assert.ok(templates.length > 0, "template data is empty");
  const h = html();
  for (const t of templates) {
    assert.match(h, new RegExp(`>${t.name}<`), `card for ${t.name} missing`);
    assert.ok(h.includes(escapeHtml(t.tagline)), `tagline for ${t.name} missing`);
  }
});

test("preview links and demo files agree in both directions", () => {
  const h = html();
  const linked = new Set(
    [...h.matchAll(/href="\/demos\/([\w-]+)\/"/g)].map((m) => m[1]),
  );
  // Every linked demo exists in dist.
  for (const slug of linked) {
    assert.ok(
      existsSync(join(dist, "demos", slug, "index.html")),
      `preview link points at missing demo: ${slug}`,
    );
  }
  // Every shipped demo is linked from the gallery (catches a forgotten
  // data entry or a stale build).
  const demosDir = join(dist, "demos");
  const shipped = existsSync(demosDir) ? readdirSync(demosDir) : [];
  for (const slug of shipped) {
    assert.ok(linked.has(slug), `demo ${slug} is shipped but never linked`);
  }
});

test("demos carry real titles, not the bundler placeholder", () => {
  const demosDir = join(dist, "demos");
  const shipped = existsSync(demosDir) ? readdirSync(demosDir) : [];
  for (const slug of shipped) {
    const demo = page(join("demos", slug, "index.html"));
    assert.doesNotMatch(demo, /<title>Bundled Page<\/title>/, `${slug} has placeholder title`);
  }
});

test("no dead anchors, and one label per CTA intent", () => {
  const h = html();
  assert.doesNotMatch(h, /href="#"[^>]*>/);
  // Preview intent: every demo link is a "Preview site" control, opening a
  // new tab safely.
  for (const [anchor] of h.matchAll(/<a[^>]*href="\/demos\/[\w-]+\/"[^>]*>/g)) {
    assert.match(anchor, /target="_blank"/);
    assert.match(anchor, /rel="[^"]*noopener[^"]*"/);
  }
  const previewCount = (h.match(/Preview site/g) ?? []).length;
  const demoLinks = (h.match(/href="\/demos\/[\w-]+\/"/g) ?? []).length;
  assert.equal(previewCount, demoLinks, "every demo link should be labeled Preview site");
  // Contact intent uses a single label in the page body (the header's
  // "Start now" pill is shared site chrome).
  assert.doesNotMatch(h, />\s*(Get in touch|Contact us today|Let&#39;s talk)\s*</);
});

test("no em or en dashes on the gallery page", () => {
  // U+2013 en dash, U+2014 em dash; escapes keep this file dash-free too.
  assert.doesNotMatch(
    html(),
    /[\u2013\u2014]/,
    "em/en dash found on templates page",
  );
});

test("gallery images are sized, described, and resolvable", () => {
  const h = html();
  const imgs = h.match(/<img[^>]*(?:\/images\/templates\/|picsum\.photos)[^>]*>/g) ?? [];
  assert.ok(imgs.length >= 4, "expected template imagery in the page");
  for (const img of imgs) {
    assert.match(img, /width="\d+"/, `img missing width: ${img.slice(0, 80)}`);
    assert.match(img, /height="\d+"/, `img missing height: ${img.slice(0, 80)}`);
    assert.match(img, /alt="[^"]*"/, `img missing alt attribute: ${img.slice(0, 80)}`);
  }
  for (const [, src] of h.matchAll(/src="(\/images\/templates\/[\w-]+\.png)"/g)) {
    assert.ok(existsSync(join(dist, src)), `missing thumbnail ${src}`);
  }
});

test("the grid re-shapes itself around the number of templates", async () => {
  const { templates } = await import("../src/data/templates.mjs");
  const h = html();
  const cards = (h.match(/class="t-card /g) ?? []).length;
  assert.equal(cards, templates.length, "one card per template entry");
  // Two across: an odd count would leave the last card beside an empty slot,
  // so it spans the row instead.
  const wide = (h.match(/class="t-card [^"]*is-wide/g) ?? []).length;
  assert.equal(wide, templates.length % 2, `${templates.length} templates`);
});

test("every card carries local imagery or a waiting frame", async () => {
  const { templates } = await import("../src/data/templates.mjs");
  const h = html();
  const shots = (h.match(/src="\/images\/templates\/[\w-]+\.png"/g) ?? []).length;
  const waiting = (h.match(/class="t-waiting"/g) ?? []).length;
  assert.ok(
    shots + waiting >= templates.length,
    `${templates.length} templates but ${shots} screenshots and ${waiting} waiting frames`,
  );
  // No template imagery is fetched from another site.
  for (const [, src] of h.matchAll(/<img[^>]*src="(https?:[^"]+)"/g)) {
    assert.fail(`gallery image loaded from off site: ${src}`);
  }
});

test("motion is guarded and never driven by scroll listeners", () => {
  const h = html();
  assert.match(h, /prefers-reduced-motion/);
  assert.doesNotMatch(h, /addEventListener\(["']scroll["']/);
});

test("every demo is kept out of search at both layers, and never blocked", () => {
  // The demos live on the root domain, so two independent signals keep them
  // out of the index: a noindex meta in each file, and the X-Robots-Tag
  // header Vercel adds on the /demos/ prefix. Nothing else asserts either, so
  // a re-exported demo could drop the tag and nothing would notice.
  const shipped = shippedDemos();
  assert.ok(shipped.length > 0, "no demos shipped");
  for (const slug of shipped) {
    const demo = page(join("demos", slug, "index.html"));
    const head = demo.slice(0, demo.indexOf("</head>"));
    assert.match(
      head,
      /<meta name="robots" content="noindex">/,
      `${slug} lost its noindex meta`,
    );
  }
  const vercel = JSON.parse(readFileSync(join(repoRoot, "vercel.json"), "utf-8"));
  const rule = (vercel.headers ?? []).find((h) => /^\/demos\//.test(h.source));
  assert.ok(rule, "vercel.json lost the /demos/ header rule");
  assert.ok(
    rule.headers.some((h) => h.key === "X-Robots-Tag" && /\bnoindex\b/.test(h.value)),
    "the /demos/ rule no longer sends X-Robots-Tag: noindex",
  );
  // Google can only honor a noindex on a page it is allowed to fetch, so the
  // demos stay crawlable and out of the sitemap, never disallowed.
  assert.doesNotMatch(page("robots.txt"), /Disallow:\s*\/demos/i, "robots.txt blocks /demos/");
  assert.doesNotMatch(page("sitemap-0.xml"), /\/demos\//, "a demo reached the sitemap");
});

test("demo contact numbers read as US numbers", () => {
  // The buyer is a US agent, and the phone number is one of the first things
  // they check for "could this be mine". Design-tool exports have shipped
  // with UK and NZ numbers before.
  const shipped = shippedDemos();
  assert.ok(shipped.length > 0, "no demos shipped");
  for (const slug of shipped) {
    const demo = page(join("demos", slug, "index.html"));
    // Every click-to-call link dials a US number in full international form,
    // whichever country the next export comes from. The bundled demos keep
    // their markup inside a JS string with escaped quotes, so match the URI
    // itself rather than the attribute around it.
    const tels = demo.match(/\btel:[^"'\s\\<)]+/g) ?? [];
    for (const href of tels) {
      assert.match(href, /^tel:\+1\d{10}$/, `${slug} has a tel: link that is not a US number: ${href}`);
    }
    // And the visible text uses the US shape, never the UK or NZ shapes seen
    // in earlier exports.
    assert.doesNotMatch(
      demo,
      /\+44 \d{3} \d{3} \d{4}|\b0800 \d{3} \d{3}\b|\b02\d \d{3} \d{4}\b/,
      `${slug} shows a non-US phone number`,
    );
    const shown = demo.match(/\(\d{3}\) \d{3}-\d{4}/g) ?? [];
    assert.ok(shown.length >= 1, `${slug} shows no US-format phone number`);
  }
});
