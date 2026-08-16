import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./support/page.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const html = () => page("templates/index.html");

test("templates page builds with title, description, and its sections", () => {
  assert.ok(
    existsSync(join(dist, "templates", "index.html")),
    "dist/templates/index.html missing - run npm run build",
  );
  const h = html();
  assert.match(h, /<title>Insurance Agency Website Templates \| InsurePages<\/title>/);
  assert.match(h, /<meta name="description" content="[^"]+"/);
  const sections = h.match(/<section/g) ?? [];
  assert.ok(sections.length >= 8, `expected at least 8 sections, saw ${sections.length}`);
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
    assert.ok(h.includes(t.tagline), `tagline for ${t.name} missing`);
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

test("motion is guarded and never driven by scroll listeners", () => {
  const h = html();
  assert.match(h, /prefers-reduced-motion/);
  assert.doesNotMatch(h, /addEventListener\(["']scroll["']/);
});
