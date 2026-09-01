// Does the Plausible tag in each demo's <head> still run once the demo has
// finished booting? Four of the demos are bundle exports that replace
// document.documentElement at DOMContentLoaded, which detaches everything in
// the original <head>, including an async script that may not have arrived
// yet. Per spec a detached script still executes when its fetch completes,
// and this check proves it in a real browser rather than trusting the spec:
// it serves public/ locally, stubs the Plausible script (nothing leaves the
// machine), delays it past the swap, and counts how many times the stub ran.
// Expected: exactly once per demo. (Whether the real script then sends one
// pageview is Plausible's contract, not something a stub can observe.)
//
// Run with `npm run check:demos` after adding or re-exporting a demo.
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const PLAUSIBLE_SCRIPT = /^https:\/\/plausible\.io\/js\/.+\.js$/;
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  const direct = `${base}/chromium`;
  if (existsSync(direct)) return direct;
  if (existsSync(base)) {
    for (const entry of readdirSync(base)) {
      for (const rel of ["chrome-linux/chrome", "chrome-linux/headless_shell", "chrome-linux64/chrome"]) {
        const candidate = `${base}/${entry}/${rel}`;
        if (existsSync(candidate)) return candidate;
      }
    }
  }
  return null;
}

// A static server for public/ so the demos load over http, the way Vercel
// serves them. (file:// would also make Plausible ignore the page.)
const server = createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = join(publicDir, path);
  if (!file.startsWith(publicDir) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

const slugs = readdirSync(join(publicDir, "demos")).filter((s) =>
  existsSync(join(publicDir, "demos", s, "index.html")),
);
const executablePath = findChromium();
const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  args: ["--no-sandbox"],
});
const rows = [];
try {
  for (const slug of slugs) {
    // Twice: once with the script arriving immediately, once arriving well
    // after the bundle has swapped the document.
    for (const delayMs of [0, 2500]) {
      const page = await browser.newPage();
      await page.route("https://plausible.io/**", async (route) => {
        if (PLAUSIBLE_SCRIPT.test(route.request().url())) {
          await new Promise((r) => setTimeout(r, delayMs));
          return route.fulfill({
            contentType: "application/javascript",
            body: "window.__paRuns = (window.__paRuns || 0) + 1;",
          });
        }
        return route.fulfill({ status: 202, body: "ok" });
      });
      await page.goto(`${origin}/demos/${slug}/`, { waitUntil: "load" });
      await page
        .waitForFunction(() => document.body && document.body.scrollHeight > 1500, { timeout: 20000 })
        .catch(() => {});
      await page.waitForTimeout(delayMs + 1500);
      const runs = await page.evaluate(() => window.__paRuns || 0);
      rows.push({ slug, delayMs, runs });
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}
console.table(rows);
const bad = rows.filter((r) => r.runs !== 1);
if (bad.length) {
  console.error(`FAIL: ${bad.length} case(s) did not run the tag exactly once`);
  process.exit(1);
}
console.log(`PASS: every demo ran the Plausible tag exactly once (${rows.length} cases)`);
