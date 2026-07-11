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
  const pages = { "index.html": page(), "accessibility/index.html": page("accessibility/index.html") };
  const index = pages["index.html"];
  for (const [name, html] of Object.entries(pages)) {
    for (const [, frag] of html.matchAll(/href="#([\w-]+)"/g)) {
      assert.match(html, new RegExp(`id="${frag}"`), `#${frag} has no target on ${name}`);
    }
    for (const [, frag] of html.matchAll(/href="\/#([\w-]+)"/g)) {
      assert.match(index, new RegExp(`id="${frag}"`), `/#${frag} has no target on index.html`);
    }
  }
});
