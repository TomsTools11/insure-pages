import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";

test("header has nav links and a centered Start now sticker", () => {
  const html = page();
  assert.match(html, /href="\/#build"/);
  assert.match(html, /href="\/#method"/);
  assert.match(html, /href="\/#pricing"/);
  assert.match(html, /class="[^"]*nav-cta[^"]*"[^>]*href="\/#contact"/);
  assert.match(html, /Start now/);
});

test("header brand is the logo image, decorative, with intrinsic dimensions", () => {
  const html = page();
  const img = html.match(/<img[^>]*class="[^"]*brand-logo[^"]*"[^>]*>/)?.[0];
  assert.ok(img, "header should render the brand-logo image");
  assert.match(img, /src="\/images\/insurepages-logo\.png"/);
  // The anchor's aria-label is the accessible name; the img must not double it.
  assert.match(img, /alt=""/);
  // Intrinsic width/height reserve the box before decode (no layout shift).
  assert.match(img, /width="655"/);
  assert.match(img, /height="259"/);
});

test("footer brand uses the on-dark logo variant", () => {
  const html = page();
  const img = html.match(/<img[^>]*class="[^"]*footer-logo[^"]*"[^>]*>/)?.[0];
  assert.ok(img, "footer should render the footer-logo image");
  // The master art's ink outline and #2c5972 attribution are invisible on the
  // ink footer -- the footer must point at the recolored variant, not the master.
  assert.match(img, /src="\/images\/insurepages-logo-dark\.png"/);
  assert.match(img, /alt="InsurePages"/);
  assert.match(img, /loading="lazy"/);
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
