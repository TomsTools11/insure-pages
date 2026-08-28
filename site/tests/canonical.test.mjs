import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./support/page.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

// The only host that actually serves the site: insurepages.com 308s to www, and
// the vercel.app deployment URL serves a full duplicate. Canonical, og:url and
// every sitemap entry must name this origin so Google consolidates signals here
// instead of splitting them across the deployment URL.
//
// Hardcoded on purpose. Reading the value back from astro.config.mjs would make
// this file agree with whatever the config happens to say -- which is exactly
// the regression it exists to catch.
const ORIGIN = "https://www.insurepages.com";

// Every built page, discovered from dist, so a page added later is audited
// without anyone remembering to list it here. /demos/ is third-party template
// markup that is Disallow-ed in robots.txt and carries no InsurePages metadata.
const pages = (() => {
  const found = [];
  const walk = (dir, prefix) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (prefix === "" && (entry.name === "demos" || entry.name === "_astro")) continue;
        walk(join(dir, entry.name), `${prefix}${entry.name}/`);
      } else if (entry.name === "index.html") {
        found.push(`${prefix}index.html`);
      }
    }
  };
  walk(dist, "");
  return found.sort();
})();

// "index.html" -> "/", "accessibility/index.html" -> "/accessibility/"
const pathOf = (p) => (p === "index.html" ? "/" : `/${p.slice(0, -"index.html".length)}`);

const attr = (tag, name) => tag?.match(new RegExp(`${name}="([^"]*)"`))?.[1];

// Read every built file once per needle. Buffers, not utf-8 strings, so fonts
// and images are scanned too without decoding noise.
const scan = (needle) => {
  const hits = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (readFileSync(full).includes(needle)) hits.push(relative(dist, full));
    }
  };
  walk(dist);
  return hits.sort();
};

test("the build produced pages to audit", () => {
  assert.ok(
    pages.length >= 3,
    `expected at least 3 built pages, saw ${pages.length} -- run npm run build`,
  );
});

for (const p of pages) {
  test(`${p}: canonical is self-referential on ${ORIGIN}`, () => {
    const html = page(p);
    const tags = html.match(/<link[^>]+rel="canonical"[^>]*>/g) ?? [];
    assert.equal(tags.length, 1, `expected exactly one canonical link, saw ${tags.length}`);
    assert.equal(
      attr(tags[0], "href"),
      `${ORIGIN}${pathOf(p)}`,
      "canonical must name the host that serves 200, not the deployment URL",
    );
  });

  test(`${p}: og:url, og:image and twitter:image use the canonical origin`, () => {
    const html = page(p);
    const meta = (key) =>
      attr(html.match(new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]*>`))?.[0], "content");

    assert.equal(meta("og:url"), `${ORIGIN}${pathOf(p)}`, "og:url must equal the canonical URL");
    for (const key of ["og:image", "twitter:image"]) {
      assert.equal(
        meta(key),
        `${ORIGIN}/images/og.png`,
        `${key} must be an absolute URL on the canonical origin`,
      );
    }
  });
}

test("every sitemap <loc> is on the canonical origin", () => {
  assert.ok(
    existsSync(join(dist, "sitemap-index.xml")),
    "dist/sitemap-index.xml missing -- run npm run build",
  );
  const locs = [];
  for (const file of readdirSync(dist).filter((f) => /^sitemap.*\.xml$/.test(f))) {
    for (const [, loc] of readFileSync(join(dist, file), "utf-8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
      locs.push([file, loc]);
    }
  }
  assert.ok(
    locs.length > pages.length,
    `expected a <loc> per page plus the index, saw ${locs.length}`,
  );
  for (const [file, loc] of locs) {
    assert.ok(loc.startsWith(`${ORIGIN}/`), `${file}: <loc>${loc}</loc> is not on ${ORIGIN}`);
  }
});

test("robots.txt points crawlers at the sitemap on the canonical origin", () => {
  // robots.txt is copied verbatim from public/ -- it is NOT derived from
  // Astro.site, so it needs its own edit whenever the origin changes.
  const file = join(dist, "robots.txt");
  assert.ok(existsSync(file), "dist/robots.txt missing -- run npm run build");
  const lines = readFileSync(file, "utf-8")
    .split(/\r?\n/)
    .filter((l) => /^\s*Sitemap:/i.test(l));
  assert.equal(lines.length, 1, `expected exactly one Sitemap: line, saw ${lines.length}`);
  assert.equal(lines[0].trim(), `Sitemap: ${ORIGIN}/sitemap-index.xml`);
});

test("no built file names the vercel.app deployment host", () => {
  assert.deepEqual(
    scan("vercel.app"),
    [],
    "the deployment URL must never ship -- it duplicates the site and splits ranking signals",
  );
});

test("no built file links the redirecting apex instead of www", () => {
  // https://insurepages.com/ 308s to www; linking it wastes a hop and, in a
  // canonical or <loc>, points Google at a URL that never returns 200.
  assert.deepEqual(scan("https://insurepages.com"), []);
});
