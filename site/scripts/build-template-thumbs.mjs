// Screenshot every template demo into public/images/templates/<slug>.png.
// Generated assets: rerun this (npm run thumbs) instead of editing the PNGs.
//
// The demo files are self-unpacking bundle exports: they render their real
// content via an inline boot script after load, so the script waits for the
// page to grow past its loading placeholder before shooting.
import { chromium } from "playwright-core";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { templates } from "../src/data/templates.mjs";
import { THUMB_W, THUMB_H } from "../src/data/template-assets.mjs";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const outDir = `${publicDir}images/templates`;

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || "/opt/pw-browsers";
  const direct = `${base}/chromium`;
  if (existsSync(direct)) return direct;
  if (existsSync(base)) {
    for (const entry of readdirSync(base)) {
      for (const rel of [
        "chrome-linux/chrome",
        "chrome-linux/headless_shell",
        "chrome-linux64/chrome",
      ]) {
        const candidate = `${base}/${entry}/${rel}`;
        if (existsSync(candidate)) return candidate;
      }
    }
  }
  return null; // let playwright-core try its own resolution
}

const jobs = templates.filter((t) => {
  const ok = existsSync(`${publicDir}demos/${t.slug}/index.html`);
  if (!ok) console.log(`skip ${t.slug}: no demo at public/demos/${t.slug}/index.html`);
  return ok;
});

if (jobs.length === 0) {
  console.log("No demos to screenshot; nothing to do.");
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const executablePath = findChromium();
const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  args: ["--no-sandbox", "--force-prefers-reduced-motion"],
});

try {
  for (const t of jobs) {
    const page = await browser.newPage({
      viewport: { width: THUMB_W, height: THUMB_H },
      reducedMotion: "reduce",
    });
    const url = pathToFileURL(`${publicDir}demos/${t.slug}/index.html`).href;
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
    // Wait for the bundle boot script to replace the loading placeholder.
    await page
      .waitForFunction(
        () => document.body && document.body.scrollHeight > 1500,
        { timeout: 20000 },
      )
      .catch(() => console.log(`  ${t.slug}: settle wait timed out, shooting anyway`));
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${outDir}/${t.slug}.png` });
    console.log(`wrote images/templates/${t.slug}.png`);
    await page.close();
  }
} finally {
  await browser.close();
}
