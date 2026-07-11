import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";

test("pricing: three tiers, prices, fixed copy, Begin CTAs to #contact", () => {
  const html = page();
  assert.match(html, /id="pricing"/);
  for (const tier of ["Starter", "Gold", "Silver"]) assert.match(html, new RegExp(tier));
  for (const price of ["499", "699", "599"]) assert.match(html, new RegExp(price));
  assert.match(html, /Quarterly strategy review/);
  assert.doesNotMatch(html, /Quarterly&nbsp;/);
  assert.match(html, /Monthly reporting/);
  assert.doesNotMatch(html, /Monthly&nbsp;/);
  const begins = html.match(/href="#contact"[^>]*class="[^"]*btn[^"]*"|class="[^"]*btn[^"]*"[^>]*href="#contact"/g) ?? [];
  assert.ok(begins.length >= 3, `expected ≥3 Begin buttons targeting #contact, got ${begins.length}`);
});

test("contact: FormRobin embed with lazy loader and noscript fallback", () => {
  const html = page();
  assert.match(html, /id="contact"/);
  assert.match(html, /class="formrobin-embed"[^>]*data-path="\/f\/wy85le3"/);
  // embed.js is NOT statically present — the lazy loader injects it
  assert.doesNotMatch(html, /<script[^>]*src="https:\/\/formrobin\.com\/js\/embed\.js"/);
  assert.match(html, /formrobin\.com\/js\/embed\.js/); // referenced inside the loader
  assert.match(html, /<noscript>[\s\S]*?href="https:\/\/formrobin\.com\/f\/wy85le3"[\s\S]*?<\/noscript>/);
  // CTA-band Schedule a call → hosted form
  assert.match(html, /href="https:\/\/formrobin\.com\/f\/wy85le3"[^>]*>[\s\S]{0,40}?Schedule a call →/);
});
