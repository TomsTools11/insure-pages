// Build-time file checks for the template gallery. Runs in Node during
// `astro build`/`astro dev`; never shipped to the browser.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const publicDir = fileURLToPath(new URL("../../public/", import.meta.url));

// True when the drop-in demo file exists, so cards only link to real pages.
export const demoExists = (slug) =>
  existsSync(`${publicDir}demos/${slug}/index.html`);

// Local screenshot when the thumbnail pipeline has run for this slug,
// otherwise a seeded placeholder photo at the same aspect ratio.
export const THUMB_W = 1280;
export const THUMB_H = 960;
export const thumbSrc = (slug) =>
  existsSync(`${publicDir}images/templates/${slug}.png`)
    ? `/images/templates/${slug}.png`
    : `https://picsum.photos/seed/insurepages-${slug}/${THUMB_W}/${THUMB_H}`;

export const thumbIsLocal = (slug) =>
  existsSync(`${publicDir}images/templates/${slug}.png`);
