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
//   size     bento span: wide (2 cols) | tall (2 rows) | std (1x1)
//   featured true for the one template the deep-dive section spotlights

export const templates = [
  {
    slug: "page-insurance",
    name: "Page",
    domain: "pageinsurance.com",
    tagline: "Confident type and a proud family history, front and center.",
    tags: ["Bold", "Heritage"],
    accent: "red",
    size: "wide",
    featured: true,
  },
  {
    slug: "marsden",
    name: "Marsden",
    domain: "marsdenins.com",
    tagline: "Soft greens and friendly photos that put people at ease.",
    tags: ["Warm", "Friendly"],
    accent: "green",
    size: "tall",
    featured: false,
  },
  {
    slug: "northgate",
    name: "Northgate",
    domain: "northgategroup.com",
    tagline: "Crisp shapes and plain numbers that earn trust fast.",
    tags: ["Modern", "Precise"],
    accent: "blue",
    size: "std",
    featured: false,
  },
  {
    slug: "fernbrook",
    name: "Fernbrook",
    domain: "fernbrookinsurance.com",
    tagline: "Editorial calm in deep green, with a serif voice.",
    tags: ["Editorial", "Classic"],
    accent: "yellow",
    size: "std",
    featured: false,
  },
];
