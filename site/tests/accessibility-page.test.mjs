import { test } from "node:test";
import assert from "node:assert/strict";
import { page } from "./support/page.mjs";

test("accessibility statement page exists with required content", () => {
  const html = page("accessibility/index.html");
  assert.match(html, /<title>Accessibility statement — InsurePages<\/title>/);
  assert.match(html, /WCAG(?:\s|&#(?:32|160);|&nbsp;)*2\.1(?:\s|&#(?:32|160);|&nbsp;)*(?:level\s*)?AA/i);
  assert.match(html, /formrobin\.com\/f\/wy85le3/);
});
