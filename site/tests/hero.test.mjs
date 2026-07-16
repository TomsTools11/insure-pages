import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";

test("hero: headline, lede, and CTA link map", () => {
  const html = page();
  assert.match(html, /If they can't find you, they'll find/);
  assert.match(html, /another agent\./);
  assert.match(html, /href="#pricing"[^>]*>View packages/);
  // Schedule a call goes to the hosted form in a new tab (spec CTA link map)
  assert.match(
    html,
    /href="https:\/\/formrobin\.com\/f\/344no93"[^>]*target="_blank"[^>]*>[\s\S]{0,40}?Schedule a call/
  );
});

test("trust strip has all four items", () => {
  const html = page();
  for (const item of [
    "Launch in days",
    "SEO from day one",
    "You own the site",
    "No long-term contracts",
  ]) {
    assert.match(html, new RegExp(item));
  }
});
