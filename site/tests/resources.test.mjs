import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";
import {
  groups,
  categories,
  categoryCount,
  toolCount,
} from "../src/data/resources.mjs";

const html = () => page("resources/index.html");
const rx = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const count = (h, re) => (h.match(re) ?? []).length;

test("resources page builds with title, description, and canonical", () => {
  const h = html();
  assert.match(h, /<title>Tools and resources for insurance agencies \| InsurePages<\/title>/);
  assert.match(h, /<meta name="description" content="Over 300 tools[^"]+"/);
  assert.match(h, /<link rel="canonical" href="https:\/\/www\.insurepages\.com\/resources\/">/);
});

test("the hero's numbers come from the data and the data keeps them true", () => {
  const h = html();
  // "Over 300" is a claim. The floor holds even after a tool is dropped.
  assert.ok(toolCount >= 300, `the hero says over 300 tools; the list has ${toolCount}`);
  assert.match(h, new RegExp(`Over 300 of them, sorted into ${categoryCount} categories`));
  assert.match(h, new RegExp(`>\\s*${toolCount} tools, ${categoryCount} categories\\s*<`));
});

test("one card per category, one entry per tool, all in the data's order", () => {
  const h = html();
  assert.equal(count(h, /<details[^>]*data-res-cat/g), categoryCount, "one card per category");
  assert.equal(count(h, /<li data-res-item/g), toolCount, "one entry per tool");
  // Cards are dealt into two columns (evens left, odds right), so the DOM
  // does not run 01, 02, 03. Each card carries its index in its group as
  // --i, which is what puts them back in sequence when the columns stack.
  for (const g of groups) {
    g.categories.forEach((cat, i) => {
      const card = h.match(new RegExp(`<details[^>]*id="cat-${cat.id}"[^>]*>`))?.[0];
      assert.ok(card, `${cat.name} has no card`);
      assert.match(card, new RegExp(`style="--i:${i}"`), `${cat.name} lost its order index`);
      for (const item of cat.items) {
        assert.match(h, new RegExp(`>\\s*${rx(item.name)}\\s*<`), `${item.name} (${cat.name}) missing`);
      }
    });
  }
  // Every card ships open, so the list reads in full without JavaScript.
  assert.equal(count(h, /<details[^>]*data-res-cat[^>]*\sopen[\s>]/g), categoryCount);
  // Group headings carry the group's tool count.
  for (const g of groups) {
    const n = g.categories.reduce((a, c) => a + c.items.length, 0);
    assert.match(h, new RegExp(`id="part-${g.id}"[\\s\\S]*?>\\s*${n} tools\\s*<`));
  }
});

test("every link is https, opens in a new tab with noopener, and no entry is a dead link", () => {
  const h = html();
  for (const cat of categories) {
    for (const item of cat.items) {
      if (item.url) {
        assert.match(item.url, /^https:\/\//, `${item.name}: ${item.url}`);
        assert.ok(
          h.includes(`href="${item.url}" target="_blank" rel="noopener"`),
          `${item.name} link lost its target or rel`,
        );
      }
    }
  }
  // A tool with no address is listed as plain text, never as an empty href.
  assert.doesNotMatch(h, /href=""/);
  const plain = categories.flatMap((c) => c.items).filter((i) => !i.url).length;
  assert.equal(count(h, /r-item-plain/g), plain, "one plain card per unlinked tool");
});

test("jump nav links every category and the toolbar is labelled, live, and JavaScript-only", () => {
  const h = html();
  for (const cat of categories) {
    assert.ok(h.includes(`href="#cat-${cat.id}"`), `no chip for ${cat.name}`);
  }
  assert.equal(count(h, / data-res-chip="[a-z0-9-]+"/g), categoryCount);
  // The search field has a real label, and the count is a live region.
  assert.match(h, /<label[^>]*for="res-q"[^>]*>Search the resource list<\/label>/);
  assert.match(h, /<input[^>]*id="res-q"[^>]*type="search"/);
  assert.match(h, /role="status"[^>]*data-res-label/);
  // Nothing in the bar works without the script, so it goes away without it.
  assert.match(h, /<noscript><style>\s*\.r-toolbar\s*\{\s*display:\s*none;?\s*\}\s*<\/style><\/noscript>/);
});

test("the page loads nothing from third parties and embeds no frame", () => {
  const h = html();
  assert.doesNotMatch(h, /<iframe/i);
  const scripts = [...h.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(scripts, ["https://plausible.io/js/pa-lK6M6sRXqqg_n0MS_nKuV.js"]);
});

test("the disclosure is on the page and the house voice holds", () => {
  const h = html();
  assert.match(h, /Listings are not endorsements\. We are not paid to include anything here\./);
  assert.doesNotMatch(h, /[–—]/, "em/en dash on the resources page");
  // The bridge sells the site, on the same terms as the rest of the site.
  assert.match(h, /From \$499\. Live in a couple weeks\./);
});

test("the site links to the page from the header and footer, and marks the current page", () => {
  const home = page();
  const here = html();
  assert.match(home, /<a class="sticker nav-link" href="\/resources\/"[^>]*>Resources<\/a>/);
  assert.match(here, /<a class="sticker nav-link" href="\/resources\/"[^>]*aria-current="page"[^>]*>Resources<\/a>/);
  assert.doesNotMatch(home, /aria-current/, "home has no standalone page to mark");
  assert.match(page("tools/index.html"), /href="\/tools\/"[^>]*aria-current="page"/);
  // Footer: the Resources column lists the page, the tools, and the statement.
  const col = home.match(/<nav aria-label="Resources"[^>]*>[\s\S]*?<\/nav>/)?.[0];
  assert.ok(col, "footer Resources column missing");
  for (const href of ["/resources/", "/tools/", "/accessibility/"]) {
    assert.ok(col.includes(`href="${href}"`), `footer Resources column lost ${href}`);
  }
  // llms.txt lists the page with the same category count the hero shows.
  const txt = page("llms.txt");
  assert.match(txt, new RegExp(`\\[Resource list\\]\\(https://www\\.insurepages\\.com/resources/\\): [^\\n]*${categoryCount} categories`));
});
