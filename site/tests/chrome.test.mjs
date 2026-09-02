import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./support/page.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

// One row per startup directory the site is listed in, mirroring the badges
// array in Footer.astro: the name and the directory's embed snippet, byte for
// byte. The page must carry each snippet exactly, since that is what the
// directory's checker looks for; artwork is self-hosted only where the
// directory has confirmed it counts (Startup Fame).
const BADGES = [
  [
    "Startup Fame",
    '<a href="https://startupfa.me/s/insurepages?utm_source=insurepages.com" target="_blank" rel="noopener"><img src="/images/startup-fame-badge.webp" alt="Featured on Startup Fame" width="468" height="148" loading="lazy" decoding="async"></a>',
  ],
  [
    "Maidensail",
    '<a href="https://maidensail.com/startup/insurepages" rel="dofollow"><img src="https://maidensail.com/badge/insurepages.svg" alt="Featured on Maidensail" height="44"></a>',
  ],
  [
    "SitePatent",
    '<a href="https://sitepatent.com/?utm_source=insurepages.com&utm_medium=badge" target="_blank" rel="nofollow noopener noreferrer">\n  <img src="https://sitepatent.com/api/badge?style=classic" alt="Found on SitePatent" height="54" />\n</a>',
  ],
];
const srcOf = (embed) => embed.match(/<img[^>]*src="([^"]+)"/)[1];

const brandColumn = (html) =>
  html.match(/<div class="footer-brand"[^>]*>[\s\S]*?<\/div>\s*<nav/)?.[0];
const footerTop = (html) =>
  html.match(/<div class="footer-top"[^>]*>[\s\S]*?<div class="footer-bar"/)?.[0];

test("footer carries every directory badge, each embed byte for byte", () => {
  const html = page();
  const top = footerTop(html);
  assert.ok(top, "footer should render its top grid");
  const list = top.match(/<ul class="footer-badges"[^>]*>[\s\S]*?<\/ul>/)?.[0];
  assert.ok(list, "footer should render the badge grid");
  // A listing is not site navigation: the grid comes after the last <nav>,
  // in its own row under the columns.
  assert.ok(top.lastIndexOf("</nav>") < top.indexOf('class="footer-badges"'), "badge grid follows the nav columns");

  for (const [name, embed] of BADGES) {
    // Exactly the snippet, so a checker that string-matches it finds it, and
    // one that parses it finds the same attributes the directory issued.
    assert.ok(list.includes(embed), `${name} embed should appear verbatim in the badge grid`);
    // Astro must not have touched it: no scoped-style attribute inside it.
    const item = list.slice(list.indexOf(embed), list.indexOf(embed) + embed.length);
    assert.doesNotMatch(item, /data-astro-cid/);
    const src = srcOf(embed);
    if (src.startsWith("/")) {
      assert.ok(existsSync(join(dist, src)), `${src} is missing from dist`);
    } else {
      // A hot-linked embed is what that directory's checker looks for, so it
      // must load eagerly: lazy would keep the request from firing for a
      // visitor who never scrolls to the footer.
      assert.doesNotMatch(embed, /loading="lazy"/, `${name} embed should not be lazy`);
    }
  }
  assert.equal((list.match(/<li[\s>]/g) ?? []).length, BADGES.length, "one item per directory");
  // Only the directories that need their own embed are hot-linked.
  const hotlinked = [...html.matchAll(/<img[^>]*src="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  const allowed = BADGES.map(([, embed]) => srcOf(embed)).filter((s) => !s.startsWith("/"));
  assert.deepEqual(hotlinked, allowed, "no image is hot-linked beyond the listed embeds");
});

test("footer brand column is the mark and the social row, nothing else", () => {
  const html = page();
  const brand = brandColumn(html);
  assert.ok(brand, "footer should render the brand column");
  // The tagline and the house line are gone, and the badges moved to their
  // own row under the nav columns.
  assert.doesNotMatch(html, /class="footer-tag"/);
  assert.doesNotMatch(html, /class="footer-house"/);
  assert.doesNotMatch(brand, /footer-badges/, "badges should not sit in the brand column");
  assert.ok(brand.indexOf("footer-logo") > -1, "brand column should carry the mark");
  assert.ok(brand.indexOf("footer-logo") < brand.indexOf("footer-social"), "social row follows the mark");
});

const SOCIAL = [
  ["Twitter", "https://x.com/insurepages"],
  ["LinkedIn", "https://www.linkedin.com/company/insurepages"],
  ["Bluesky", "https://bsky.app/profile/insurepages.bsky.social"],
  ["Instagram", "https://www.instagram.com/insurepages"],
];
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
