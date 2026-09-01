import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./support/page.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

const head = (p) => {
  const html = page(p);
  return html.slice(0, html.indexOf("</head>"));
};

for (const p of ["index.html", "accessibility/index.html"]) {
  test(`${p} loads the Plausible script in <head>`, () => {
    const h = head(p);
    assert.match(
      h,
      /<script async src="https:\/\/plausible\.io\/js\/pa-lK6M6sRXqqg_n0MS_nKuV\.js"><\/script>/,
    );
    assert.match(h, /plausible\.init\(\)/);
  });
}

test("every demo loads the same Plausible script in <head>, exactly once", () => {
  // The demos are static files outside Base.astro, so each carries the tag
  // by hand. Same site, same script: a demo open shows up next to /templates/
  // in the one property. One tag per demo, or an open would count twice.
  const demosDir = join(dist, "demos");
  const shipped = existsSync(demosDir) ? readdirSync(demosDir) : [];
  assert.ok(shipped.length > 0, "no demos shipped");
  for (const slug of shipped) {
    const h = head(join("demos", slug, "index.html"));
    const tags =
      h.match(
        /<script async src="https:\/\/plausible\.io\/js\/pa-lK6M6sRXqqg_n0MS_nKuV\.js"><\/script>/g,
      ) ?? [];
    assert.equal(tags.length, 1, `${slug} should load Plausible exactly once in <head>`);
    assert.match(h, /plausible\.init\(\)/, `${slug} is missing the init shim`);
  }
});
