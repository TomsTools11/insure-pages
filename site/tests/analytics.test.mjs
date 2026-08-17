import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";

const head = (p) => {
  const html = page(p);
  return html.slice(0, html.indexOf("</head>"));
};

for (const p of ["index.html", "accessibility/index.html"]) {
  test(`${p} loads the Plausible script in <head>`, () => {
    const h = head(p);
    assert.match(
      h,
      /<script async src="https:\/\/plausible\.io\/js\/pa-lK6M6sRXqqg_n0MS_nKuV\.js"><\/script>/,
    );
    assert.match(h, /plausible\.init\(\)/);
  });
}
