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

test("footer carries the Startup Fame badge, self-hosted and linked back", () => {
  const html = page();
  const a = html.match(/<a[^>]*class="[^"]*footer-badge[^"]*"[^>]*>/)?.[0];
  assert.ok(a, "footer should render the Startup Fame badge link");
  // The dofollow link back is what the directory verifies -- no rel="nofollow".
  assert.match(a, /href="https:\/\/startupfa\.me\/s\/insurepages\?utm_source=insurepages\.com"/);
  assert.doesNotMatch(a, /nofollow/);

  const img = html.match(/<img[^>]*startup-fame-badge[^>]*>/)?.[0];
  assert.ok(img, "badge should render an image");
  // Served from public/, not hot-linked from startupfa.me.
  assert.match(img, /src="\/images\/startup-fame-badge\.webp"/);
  assert.match(img, /alt="Featured on Startup Fame"/);
  // Intrinsic dimensions reserve the box before decode (no layout shift).
  assert.match(img, /width="468"/);
  assert.match(img, /height="148"/);
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
