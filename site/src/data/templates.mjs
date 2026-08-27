// Template gallery data. One entry per template shown on /templates/.
//
// Drop-in contract for adding a template:
//   1. Put a fully self-contained demo at site/public/demos/<slug>/index.html
//      (inline everything, or use same-directory relative paths; never
//      root-absolute paths like /style.css, which would collide with site
//      assets). Give it a real <title>.
//   2. Add an entry below.
//   3. Run `npm run thumbs` to screenshot it, then rebuild.
// The page detects the demo file and thumbnail at build time: a card renders
// its "Preview site" link and local screenshot only when the files exist, so
// a missing demo or thumbnail can never produce a dead link.
//
// Fields:
//   slug     directory name under public/demos/ (kebab-case)
//   name     display name on the card
//   domain   fictional address shown in the card's browser bar
//   tagline  one card-sized sentence about the design's personality
//   tags     2-3 style words
//   accent   one of: red | yellow | green | blue | lavender
//   featured true for the one template the deep-dive section spotlights
//
// There is no layout field. The gallery lays entries out two across in the
// order written, so every screenshot gets the same landscape frame. Add or
// remove entries freely: an even count fills clean pairs, and an odd count
// gives the last card the full width instead of stranding it beside a gap.
// Steps 1 and 3 can lag behind step 2. A template listed here without a demo
// shows a "Demo landing soon" badge instead of a link, and one without a
// screenshot shows a waiting frame at the same proportions, so nothing on the
// page shifts when the real files arrive.

export const templates = [
  {
    slug: "page-insurance",
    name: "Page",
    domain: "pageinsurance.com",
    tagline: "Confident type and a proud family history, front and center.",
    tags: ["Bold", "Heritage"],
    accent: "red",
    featured: true,
  },
  {
    slug: "marsden",
    name: "Marsden",
    domain: "marsdenins.com",
    tagline: "Soft greens and friendly photos that put people at ease.",
    tags: ["Warm", "Friendly"],
    accent: "green",
    featured: false,
  },
  {
    slug: "northgate",
    name: "Northgate",
    domain: "northgategroup.com",
    tagline: "Crisp shapes and plain numbers that earn trust fast.",
    tags: ["Modern", "Precise"],
    accent: "blue",
    featured: false,
  },
  {
    slug: "fernbrook",
    name: "Fernbrook",
    domain: "fernbrookinsurance.com",
    tagline: "Editorial calm in deep green, with a serif voice.",
    tags: ["Editorial", "Classic"],
    accent: "yellow",
    featured: false,
  },
  {
    slug: "keel",
    name: "Keel",
    domain: "keelinsurance.com",
    tagline: "Dark and calm, with gold accents where they count.",
    tags: ["Dark", "Calm"],
    accent: "lavender",
    featured: false,
  },
  {
    slug: "kestrel",
    name: "Kestrel",
    domain: "kestrelcover.co.uk",
    tagline: "Cool grey and cobalt, with a price slider up front.",
    tags: ["Clean", "Direct"],
    accent: "blue",
    featured: false,
  },
];
