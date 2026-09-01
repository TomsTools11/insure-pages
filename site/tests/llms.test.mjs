import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { page } from "./support/page.mjs";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const txt = () => page("llms.txt");

test("llms.txt ships in the spec's shape and links only to pages that exist", () => {
  assert.ok(existsSync(join(dist, "llms.txt")), "dist/llms.txt missing");
  const t = txt();
  const lines = t.split("\n");
  // One H1, then a blockquote summary, per llmstxt.org.
  assert.equal(lines[0], "# InsurePages");
  assert.equal((t.match(/^# /gm) ?? []).length, 1, "exactly one H1");
  assert.match(lines[2], /^> \S/, "line 3 should be the blockquote summary");
  // Below the first H2 every list item is a link with a description, and no
  // bare prose sits inside a section.
  const firstH2 = t.indexOf("\n## ");
  assert.ok(firstH2 > 0, "no H2 sections");
  for (const line of t.slice(firstH2).split("\n")) {
    if (!line.trim() || line.startsWith("## ")) continue;
    assert.match(line, /^- \[[^\]]+\]\(https?:\/\/[^)]+\): \S/, `not a link-list item: ${line}`);
  }
  // Every own-site URL resolves to a built page, and nothing noindexed is listed.
  for (const [, path] of t.matchAll(/https:\/\/www\.insurepages\.com(\/[^)\s]*)/g)) {
    assert.doesNotMatch(path, /^\/demos\//, `noindexed demo listed: ${path}`);
    assert.ok(existsSync(join(dist, path, "index.html")), `llms.txt links a page that does not exist: ${path}`);
  }
  // House voice.
  assert.doesNotMatch(t, /[\u2013\u2014]/, "em/en dash in llms.txt");
});

test("llms.txt stays in step with the site's prices and contact paths", () => {
  const t = txt();
  const home = page();
  for (const price of ["$499", "$599", "$699", "$25 a month", "$75 a month"]) {
    assert.ok(t.includes(price), `llms.txt lost ${price}`);
  }
  // The same prices the home page shows, so a pricing change fails here too.
  for (const price of ["499", "599", "699"]) {
    assert.match(home, new RegExp(`>\\s*${price}\\s*<`), `home page no longer shows ${price}`);
  }
  for (const url of ["https://share.kiwiform.com/to/ofwodo6p", "https://formrobin.com/f/344no93"]) {
    assert.ok(t.includes(url), `llms.txt lost ${url}`);
    assert.ok(home.includes(url), `home page no longer links ${url}`);
  }
  assert.match(t, /a couple weeks/, "turnaround claim drifted from the site");
});
