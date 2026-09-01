import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";
import { tools, toolGroups } from "../src/data/tools.mjs";

const html = () => page("tools/index.html");

test("tools page builds with title, description, and canonical", () => {
  const h = html();
  assert.match(h, /<title>Free SEO tools for insurance agents \| InsurePages<\/title>/);
  assert.match(h, /<meta name="description" content="Four free tools[^"]+"/);
  assert.match(h, /<link rel="canonical" href="https:\/\/www\.insurepages\.com\/tools\/">/);
});

test("no frame is present in the shipped HTML", () => {
  // The whole performance and privacy story: nothing is embedded until a
  // visitor opens a tool, so the markup must carry zero frames.
  assert.doesNotMatch(html(), /<iframe/i, "a frame reached the built HTML");
});

test("nothing is requested from keywordseverywhere.com on load", () => {
  const h = html();
  // No script, style, image or preconnect may point at the embed host.
  const eager =
    h.match(/<(?:script|link|img)[^>]*keywordseverywhere\.com[^>]*>/gi) ?? [];
  assert.deepEqual(eager, [], `eager request to the embed host: ${eager[0]}`);
});

test("every tool ships a row, an embed URL, and a reserved height", () => {
  const h = html();
  assert.equal(tools.length, 4);
  for (const t of tools) {
    assert.match(h, new RegExp(`id="tool-${t.slug}"`), `${t.slug} row missing`);
    assert.match(
      h,
      new RegExp(`data-src="https://keywordseverywhere\\.com/tools/${t.slug}/\\?embed=1"`),
      `${t.slug} embed URL missing`,
    );
    assert.match(h, new RegExp(`data-min-height="\\d+"`), `${t.slug} height missing`);
  }
});

test("space is reserved on the wrapper, never on the frame", () => {
  const h = html();
  // The resizer writes style.height on the frame; a min-height there would
  // fight it. The reservation belongs to .tool-frame.
  assert.match(h, /class="tool-frame"[^>]*style="min-height:\d+px"/);
});

test("the accordion is exclusive and native", () => {
  const h = html();
  const opens = (h.match(/<details[^>]*name="tool"/g) ?? []).length;
  assert.equal(opens, tools.length, "every row should share the details name");
  assert.doesNotMatch(h, /<details[^>]*\sopen[\s>]/, "no row ships open");
});

test("every tool keeps the Keywords Everywhere attribution", () => {
  const h = html();
  const credits = (h.match(/Powered by/g) ?? []).length;
  assert.equal(credits, tools.length, "attribution must appear on every tool");
  const links = (h.match(/href="https:\/\/keywordseverywhere\.com\/"/g) ?? []).length;
  assert.ok(links >= tools.length, "each attribution needs its link");
});

test("every tool has a no-JS way out", () => {
  const h = html();
  const blocks = (h.match(/<noscript>/g) ?? []).length;
  assert.equal(blocks, tools.length, "each tool needs a noscript fallback");
  for (const t of tools) {
    assert.match(
      h,
      new RegExp(`href="https://keywordseverywhere\\.com/tools/${t.slug}/"`),
      `${t.slug} has no link out`,
    );
  }
});

test("hero chips point at rows that exist", () => {
  const h = html();
  const chips = [...h.matchAll(/data-tool-chip[^>]*>|href="#(tool-[\w-]+)"/g)];
  for (const t of tools) {
    assert.match(h, new RegExp(`href="#tool-${t.slug}"`), `${t.slug} chip missing`);
    assert.match(h, new RegExp(`id="tool-${t.slug}"`), `${t.slug} target missing`);
  }
  assert.ok(chips.length > 0);
});

test("the page never promises unlimited use", () => {
  const h = html();
  assert.match(h, /daily limit/, "the per-visitor quota must be disclosed");
  assert.doesNotMatch(h, /\bunlimited\b/i);
  assert.doesNotMatch(h, /as (?:many|much) as you (?:want|like)/i);
});

test("house voice holds on the tools page", () => {
  const h = html();
  // U+2013 en dash, U+2014 em dash; escapes keep this file dash-free too.
  const body = h.slice(h.indexOf("<main"), h.indexOf("</main>"));
  assert.doesNotMatch(body, /[–—]/, "em/en dash on the tools page");
  for (const word of ["crafted", "elevate", "seamless", "unlock", "transform"]) {
    assert.doesNotMatch(body, new RegExp(word, "i"), `banned word: ${word}`);
  }
  // Groups are the cut points, so each must carry a real heading.
  for (const g of toolGroups) assert.match(h, new RegExp(`id="group-${g.id}"`));
});
