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

  // Placement: the badge sits in the Hello column, after "Schedule a call",
  // and outside the <nav> -- it is not one of that nav's links.
  const hello = html.match(/<div class="footer-hello"[^>]*>[\s\S]*?<\/div>\s*<\/div>/)?.[0];
  assert.ok(hello, "footer should render the Hello column wrapper");
  assert.ok(
    hello.indexOf("Schedule a call") < hello.indexOf("footer-badge"),
    "badge should follow the Schedule a call link",
  );
  assert.ok(
    hello.indexOf("</nav>") < hello.indexOf("footer-badge"),
    "badge should sit outside the Get in touch nav",
  );
});

const SOCIAL = [
  ["Twitter", "https://x.com/insurepages"],
  ["LinkedIn", "https://www.linkedin.com/company/insurepages"],
  ["Bluesky", "https://bsky.app/profile/insurepages.bsky.social"],
  ["Instagram", "https://www.instagram.com/insurepages"],
];
const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("footer social row: one icon link per platform, each with an accessible name", () => {
  const html = page();
  const list = html.match(/<ul class="footer-social"[^>]*>[\s\S]*?<\/ul>/)?.[0];
  assert.ok(list, "footer should render the social row");

  for (const [name, href] of SOCIAL) {
    const a = list.match(new RegExp(`<a[^>]*href="${rx(href)}"[^>]*>`))?.[0];
    assert.ok(a, `social row should link to ${name} at ${href}`);
    // Icon-only link: the aria-label is its whole accessible name.
    assert.match(a, new RegExp(`aria-label="InsurePages on ${name}"`));
    assert.match(a, /target="_blank"/);
    assert.match(a, /rel="noopener"/);
  }
  assert.equal((list.match(/<li[\s>]/g) ?? []).length, SOCIAL.length, "one item per platform");
});

test("footer social icons are inline SVG, hidden from the accessibility tree", () => {
  const html = page();
  const list = html.match(/<ul class="footer-social"[^>]*>[\s\S]*?<\/ul>/)?.[0];
  const svgs = list.match(/<svg[^>]*>/g) ?? [];
  assert.equal(svgs.length, SOCIAL.length, "each link should carry its own inline svg");
  for (const svg of svgs) {
    // The anchor's aria-label already names the link; the glyph must not
    // be announced again, and must stay out of the tab order in IE-era engines.
    assert.match(svg, /aria-hidden="true"/);
    assert.match(svg, /focusable="false"/);
  }
  // Twitter keeps the bird, not the X mark: the bird path starts at 23.953 4.57.
  const twitter = list.match(/<a[^>]*x\.com[^>]*>[\s\S]*?<\/a>/)?.[0];
  assert.match(twitter, /d="M23\.953 4\.57/);
  // Icons ship in the markup — no icon font or sprite CDN is fetched for them.
  assert.doesNotMatch(html, /fontawesome|cdn\.simpleicons|<use[^>]*href="http/i);
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
