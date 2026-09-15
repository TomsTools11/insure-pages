import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./support/page.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// The one origin the site is allowed to claim. astro.config.mjs sets it as
// `site`, vercel.json redirects the old alias to it, and robots.txt hands it
// to Google. Every URL the build emits has to agree: a page reachable under
// two spellings is a page Google gets to pick a canonical for, and Search
// Console has already reported it picking one we did not declare.
const ORIGIN = "https://www.insurepages.com";

// Every published page in dist, as the file the build wrote and the URL it
// answers on. The demos are excluded deliberately: they are noindexed, and
// templates.test.mjs owns that.
const builtPages = () => {
  const found = [];
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry !== "demos" && entry !== "_astro") walk(full, `${prefix}${entry}/`);
      } else if (entry.endsWith(".html")) {
        found.push({ file: `${prefix}${entry}`, route: `/${prefix}` });
      }
    }
  };
  walk(dist, "");
  return found;
};

const vercelConfig = () => JSON.parse(readFileSync(join(repoRoot, "vercel.json"), "utf-8"));

test("every published page ships as <route>/index.html", () => {
  // build.format stays 'directory'. Switching astro.config.mjs to 'file'
  // would emit /tools.html, a path with no trailing slash, which collides
  // with vercel.json's trailingSlash:true. Assert the shape of the output
  // rather than the config, because the output is what gets served.
  const pages = builtPages();
  assert.ok(pages.length >= 4, `expected the published pages, found ${pages.length}`);
  for (const { file } of pages) {
    assert.ok(
      file === "index.html" || file.endsWith("/index.html"),
      `page written outside the directory format: ${file}`,
    );
  }
});

test("every published page declares itself canonical, with a trailing slash", () => {
  // A self-referential canonical on the trailing-slash URL is the whole
  // signal that tells Google which of a page's spellings to index. It has to
  // be absolute and on ORIGIN: a relative or cross-host canonical is what
  // produced the "Duplicate, Google chose different canonical than user"
  // row after the site moved off insure-pages.vercel.app.
  for (const { file, route } of builtPages()) {
    const html = page(file);
    const head = html.slice(0, html.indexOf("</head>"));
    const canonical = head.match(/<link rel="canonical" href="([^"]+)">/);
    assert.ok(canonical, `${file} has no canonical link`);
    assert.equal(canonical[1], `${ORIGIN}${route}`, `${file} points its canonical elsewhere`);

    // og:url disagreeing with the canonical is a second, contradictory vote.
    const og = head.match(/<meta property="og:url" content="([^"]+)"/);
    assert.ok(og, `${file} has no og:url`);
    assert.equal(og[1], canonical[1], `${file}: og:url and canonical disagree`);
  }
});

test("no published page carries a robots noindex", () => {
  // The demos opt out of search on purpose; the four real pages must never
  // pick that up, whether from a stray meta or a copied component.
  for (const { file } of builtPages()) {
    const html = page(file);
    assert.doesNotMatch(
      html.slice(0, html.indexOf("</head>")),
      /<meta[^>]+name="robots"[^>]*noindex/i,
      `${file} would be excluded from search`,
    );
  }
});

test("the sitemap lists exactly the published pages, each with a trailing slash", () => {
  // A sitemap entry that redirects is precisely what Search Console files
  // under "Page with redirect", so the sitemap must name the URLs that
  // answer 200 — the same ones the pages declare as canonical.
  const locs = [...page("sitemap-0.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = builtPages().map(({ route }) => `${ORIGIN}${route}`);
  assert.deepEqual([...locs].sort(), [...expected].sort());
  for (const loc of locs) {
    assert.ok(loc.startsWith(`${ORIGIN}/`), `sitemap URL is off-origin: ${loc}`);
    assert.ok(loc.endsWith("/"), `sitemap URL would redirect: ${loc}`);
  }

  const index = page("sitemap-index.xml");
  assert.match(
    index,
    new RegExp(`<loc>${ORIGIN.replace(/\./g, "\\.")}/sitemap-0\\.xml</loc>`),
    "the sitemap index does not point at sitemap-0.xml on the canonical host",
  );
});

test("robots.txt stays open and names the sitemap on the canonical host", () => {
  // robots.txt is a static file, so it does not follow astro.config's `site`
  // automatically — a host change would silently leave a stale Sitemap line.
  const robots = page("robots.txt");
  assert.match(robots, /^User-agent: \*$/m, "robots.txt no longer addresses all crawlers");
  assert.match(robots, /^Allow: \/$/m, "robots.txt no longer allows the site");
  assert.doesNotMatch(robots, /^Disallow:\s*\/\s*$/m, "robots.txt blocks the whole site");
  assert.match(
    robots,
    new RegExp(`^Sitemap: ${ORIGIN.replace(/\./g, "\\.")}/sitemap-index\\.xml$`, "m"),
    "robots.txt does not point at the sitemap on the canonical host",
  );
});

test("vercel.json folds every duplicate spelling into the canonical URL", () => {
  // Three rules together leave each page exactly one URL that answers 200:
  //
  //   trailingSlash:true      /tools            -> /tools/
  //   /index.html             /index.html       -> /
  //   /:path+/index.html      /tools/index.html -> /tools/
  //
  // The .html pair is written out rather than delegated to Vercel's
  // `cleanUrls`. cleanUrls compiles to a single route whose Location is
  // "/$1/", and for /index.html the capture group does not participate, so
  // $1 resolves to "" and the homepage is sent to "//" — not a valid URL.
  // Two explicit rules avoid the empty capture entirely.
  const redirects = vercelConfig().redirects ?? [];
  assert.equal(vercelConfig().trailingSlash, true, "vercel.json lost trailingSlash");
  assert.notEqual(
    vercelConfig().cleanUrls,
    true,
    "cleanUrls sends /index.html to '//': use the explicit /index.html rules instead",
  );

  const root = redirects.find((r) => r.source === "/index.html");
  assert.ok(root, "vercel.json lost the /index.html redirect: the homepage has a live .html twin");
  assert.equal(root.destination, "/");
  assert.equal(root.permanent, true, "the /index.html redirect must be permanent");

  const nested = redirects.find((r) => r.source === "/:path+/index.html");
  assert.ok(nested, "vercel.json lost the nested index.html redirect: every subpage has a twin");
  assert.equal(nested.destination, "/:path+/");
  assert.equal(nested.permanent, true, "the nested index.html redirect must be permanent");
});

test("the old vercel.app alias redirects permanently, and still in one hop", () => {
  // The alias rule has to stay ahead of the .html rules. Behind them,
  // insure-pages.vercel.app/index.html would bounce to the alias root before
  // crossing to the canonical host, turning one hop into two.
  const redirects = vercelConfig().redirects ?? [];
  const aliasAt = redirects.findIndex((r) =>
    (r.has ?? []).some((h) => h.type === "host" && h.value === "insure-pages.vercel.app"),
  );
  assert.notEqual(aliasAt, -1, "vercel.json lost the insure-pages.vercel.app redirect");
  assert.ok(
    redirects[aliasAt].destination.startsWith(ORIGIN),
    "the alias no longer lands on the canonical host",
  );
  assert.equal(redirects[aliasAt].permanent, true, "the alias redirect must be permanent");

  const firstHtmlRule = redirects.findIndex((r) => r.source.endsWith("/index.html"));
  assert.ok(
    firstHtmlRule === -1 || aliasAt < firstHtmlRule,
    "the .html redirects sit ahead of the alias rule, adding a hop off the old host",
  );
});
