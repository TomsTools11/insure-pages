// Free tool data for /tools/. One entry per embedded Keywords Everywhere tool.
//
// How the embed works (verified against https://keywordseverywhere.com/tools/embed/):
//   frame src   https://keywordseverywhere.com/tools/<slug>/?embed=1
//   resizer     https://keywordseverywhere.com/tools/assets/js/embed.js
// The resizer listens for `ke-embed-resize` postMessages and sets the height
// of the matching `iframe[data-ke-embed]`. It re-queries the DOM on every
// message, so frames created after it loads still resize. Two consequences:
//   1. The frame MUST carry the data-ke-embed attribute or it never resizes.
//   2. Never put `min-height` on the frame itself. The resizer writes
//      `style.height` inline, and a CSS min-height would fight it. Reserve
//      space on the .tool-frame wrapper instead, via minHeight below.
//
// Nothing here is fetched until a visitor opens a tool. ToolAccordion.astro
// ships zero frames in the HTML and builds one on the first `toggle`.
//
// Fields:
//   slug       path segment under keywordseverywhere.com/tools/ (kebab-case)
//   name       the <summary> label
//   summary    one sentence on what it answers, in the agent's terms
//   accent     one of: red | yellow | green | blue | lavender
//   minHeight  px reserved for the frame before the first resize message.
//              Omit to take DEFAULT_MIN_HEIGHT. Raise it only for a tool
//              whose first paint is genuinely taller.
//
// Groups render as separate clusters with their own heading. The second
// group earns links from SEOs rather than serving agents directly; it is
// deliberately separable, so cutting it is a one-line change here.

export const DEFAULT_MIN_HEIGHT = 560;

export const toolGroups = [
  {
    id: "your-site",
    heading: "See how your site is doing.",
    blurb:
      "Run your own address, or a competitor's, and read the result together on a call.",
    tools: [
      {
        slug: "seo-analyzer",
        name: "SEO analyzer",
        summary:
          "Scores a page on the things search engines actually check, then lists what to fix first.",
        accent: "red",
      },
      {
        slug: "website-traffic-checker",
        name: "Traffic checker",
        summary:
          "Estimates how many visitors a site gets each month, and which pages bring them in.",
        accent: "blue",
      },
    ],
  },
  {
    id: "crawlers",
    heading: "Check what search engines read first.",
    blurb:
      "Both files are plain text at the root of a site. Both are easy to get wrong and quiet when they are.",
    tools: [
      {
        slug: "robots-txt-tester",
        name: "Robots.txt tester",
        summary:
          "Tells you whether a search engine is allowed to crawl a page, before you wonder why it never ranked.",
        accent: "yellow",
      },
      {
        slug: "llms-txt-generator",
        name: "Llms.txt generator",
        summary:
          "Writes the file that tells AI assistants what your agency does and which pages matter.",
        accent: "green",
      },
    ],
  },
];

export const tools = toolGroups.flatMap((g) => g.tools);

export const toolUrl = (slug) => `https://keywordseverywhere.com/tools/${slug}/`;
export const embedUrl = (slug) => `${toolUrl(slug)}?embed=1`;
export const RESIZER_SRC =
  "https://keywordseverywhere.com/tools/assets/js/embed.js";
