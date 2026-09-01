import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";

test("pillars: three cards with headings", () => {
  const html = page();
  assert.match(html, /id="build"/);
  assert.match(html, /Found on Google\./);
  assert.match(html, /Looks like a real agency\./);
  assert.match(html, /Your phone rings\./);
  assert.match(html, /three jobs\./);
});

test("method: five steps with copy fixes applied", () => {
  const html = page();
  assert.match(html, /id="method"/);
  assert.match(html, /A conversation, first\./);
  assert.match(html, /style guide/);
  assert.doesNotMatch(html, /styled guide/);
  assert.match(html, /your colors, your type/);
  assert.doesNotMatch(html, /color pallet\b/);
});
