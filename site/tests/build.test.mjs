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
