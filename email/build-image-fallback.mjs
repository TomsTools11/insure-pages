// Renders the email template to the single flat PNG used by the
// image-only version of this campaign.
//
//   npm i -D playwright && npx playwright install chromium
//   node email/build-image-fallback.mjs
//
// Output: site/public/images/email/insurepages-templates-email.png
// (served at https://www.insurepages.com/images/email/insurepages-templates-email.png)
//
// The HTML is the source of truth. Never hand-edit the PNG — change the
// template and rerun this.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.join(here, "..");
const template = path.join(here, "insurepages-templates-email.html");
const logo = path.join(repo, "site/public/images/insurepages-logo.png");
const out = path.join(
  repo,
  "site/public/images/email/insurepages-templates-email.png",
);

// 600px column + 16px of body padding either side.
const VIEWPORT = 632;
// Retina, so the image still looks sharp when a client scales it up.
const SCALE = 2;
// Cream breathing room around the column in the flattened image.
const PAD = 20;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: VIEWPORT, height: 200 },
  deviceScaleFactor: SCALE,
});

// The template points at the logo on the live site, which is what real
// recipients fetch. For the render, serve the same bytes from disk so the
// build does not depend on the deployment being up.
await page.route("**/images/insurepages-logo.png", (route) =>
  route.fulfill({ contentType: "image/png", body: fs.readFileSync(logo) }),
);

await page.goto(`file://${template}`, { waitUntil: "networkidle" });

// nth(1) is the 600px content column; nth(0) is the full-bleed cream wrapper.
const column = page.locator("table").nth(1);
const box = await column.boundingBox();
fs.mkdirSync(path.dirname(out), { recursive: true });
await page.screenshot({
  path: out,
  fullPage: true,
  clip: {
    x: box.x - PAD,
    y: box.y - PAD,
    width: box.width + PAD * 2,
    height: box.height + PAD * 2,
  },
});
await browser.close();

console.log(
  `wrote ${path.relative(repo, out)} (${Math.round(box.width)}x${Math.round(box.height)} css px @${SCALE}x)`,
);
