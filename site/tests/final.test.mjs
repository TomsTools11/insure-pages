import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./support/page.mjs";

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
