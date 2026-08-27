// Build-time file checks for the template gallery. Runs in Node during
// `astro build`/`astro dev`; never shipped to the browser.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const publicDir = fileURLToPath(new URL("../../public/", import.meta.url));

// True when the drop-in demo file exists, so cards only link to real pages.
export const demoExists = (slug) =>
  existsSync(`${publicDir}demos/${slug}/index.html`);

// Screenshots are produced by `npm run thumbs`. A template can be listed
// before its demo and screenshot land: thumbSrc returns null until the file
// exists, and the card draws a waiting frame at the same proportions rather
// than reaching for a stand in image from another site.
export const THUMB_W = 1280;
export const THUMB_H = 960;

export const thumbIsLocal = (slug) =>
  existsSync(`${publicDir}images/templates/${slug}.png`);

export const thumbSrc = (slug) =>
  thumbIsLocal(slug) ? `/images/templates/${slug}.png` : null;
