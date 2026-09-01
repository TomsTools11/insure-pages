import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./support/page.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

test("accessibility statement page exists with required content", () => {
  const html = page("accessibility/index.html");
  assert.match(html, /<title>Accessibility statement \| InsurePages<\/title>/);
  // The statement keeps its substance: what we do, and how to report a barrier.
  assert.match(html, /Measures we take/);
  assert.match(html, /keyboard/i);
  assert.match(html, /screen reader/i);
  assert.match(html, /share\.kiwiform\.com\/to\/ofwodo6p/);
  // It must still refuse to promise legal immunity.
  assert.match(html, /No statement like this one is a legal guarantee/i);
});

test("the site claims no formal conformance level", () => {
  // Deliberate: the public WCAG 2.1 AA claim was removed from the site. The
  // engineering practice did not change (axe still runs, the markup is still
  // built to be keyboard and screen-reader operable), but no page advertises
  // a conformance level. Re-adding one is a decision, not an edit, so this
  // guard fails loudly if the claim creeps back.
  const pages = [];
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) {
        if (e !== "demos") walk(p);
      } else if (e.endsWith(".html")) pages.push(p);
    }
  };
  walk(dist);
  assert.ok(pages.length >= 4, `expected the built pages, found ${pages.length}`);
  for (const p of pages) {
    const rel = p.slice(dist.length + 1);
    const html = page(rel);
    assert.doesNotMatch(html, /WCAG/i, `conformance claim back on ${rel}`);
    assert.doesNotMatch(html, /level\s*AA\b/i, `conformance claim back on ${rel}`);
  }
});
