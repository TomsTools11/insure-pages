import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";

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
