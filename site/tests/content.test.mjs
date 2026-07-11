import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";

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
