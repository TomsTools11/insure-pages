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

test("contact: Kiwiform embed with lazy loader and noscript fallback", () => {
  const html = page();
  assert.match(html, /id="contact"/);
  assert.match(html, /data-kiwiform-live="cmtd4evv70ap0dqpgd3y66f2w"/);
  // embed.js is NOT statically present — the lazy loader injects it
  assert.doesNotMatch(html, /<script[^>]*src="https:\/\/share\.kiwiform\.com/);
  assert.match(html, /"https:\/\/share\.kiwiform\.com"/); // origin held by the loader
  assert.match(html, /"\/embed\.js"/); // …joined on at load time
  // the embed's modal gets dialog semantics bolted on before it is shown
  assert.match(html, /aria-modal/);
  assert.match(
    html,
    /<noscript>[\s\S]*?href="https:\/\/share\.kiwiform\.com\/to\/ofwodo6p"[\s\S]*?<\/noscript>/
  );
  // CTA-band Schedule a call → hosted form
  assert.match(html, /href="https:\/\/formrobin\.com\/f\/344no93"[^>]*>[\s\S]{0,40}?Schedule a call →/);
});
