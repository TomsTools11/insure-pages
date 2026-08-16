---
name: taste-prompt-revisor
description: >-
  Revise the user's rough website request into the exact ready-to-run taste-skill v2 prompt
  format from tasteskill.dev/guide (greenfield template, redesign template, Quick reminders),
  filling the brief only with what the user actually said, leaving placeholders for the rest,
  and adding nothing extra. Use whenever the user asks to "revise this prompt", "format my
  prompt for tasteskill", "make this a taste skill v2 prompt", "turn this into a tasteskill
  prompt", "prep this for the design skill", or hands over any rough idea for a landing page,
  portfolio, marketing site, or site redesign that should be converted into the proper prompt
  before running it, even if they don't name tasteskill explicitly. Do NOT use it to actually
  build or redesign a site; this skill produces a prompt, not a website.
---

# Taste Prompt Revisor

Turn a rough website request into the exact prompt format from tasteskill.dev/guide (taste-skill v2). The output is a prompt the user will paste into another session. It is not a website, a design, or advice.

One rule governs everything: the revised prompt may contain only two kinds of content, the template's own fixed text and material the user actually provided. Nothing invented, nothing embellished, nothing helpfully added. The value of this skill is fidelity in both directions: every requirement the user stated survives, and nothing new sneaks in. A vibe word the user never said, a reference site they never mentioned, or a requirement they never asked for is a defect even if it would make the page better. The user chose this workflow precisely because they are tired of prompts and pages padded with things they did not ask for.

## Workflow

1. Classify the request as a new build or a redesign.
   - Redesign: an existing site, URL, or repo is being changed.
   - New build: a page or site created from scratch.
   - If you cannot tell which one it is, ask one short question before writing anything (use AskUserQuestion if available). A prompt built on the wrong template wastes the user's whole run.
2. Copy the matching template from the next section, character for character.
3. Fill each brief field using only the user's material (rules below).
4. Place requirements that fit no brief field into the step where they apply (rules below).
5. Drop anything that conflicts with the Quick reminders, and note it (rules below).
6. Scrub em-dashes and en-dashes from the entire output.
7. Deliver in the output format at the bottom. Run the self-check first.

## The two templates

These are embedded verbatim from tasteskill.dev/guide. If the user says the guide has changed, fetch https://www.tasteskill.dev/guide and use the page's current templates instead.

### New website (greenfield)

```
I have loaded tasteskill v2 (experimental) as my only source of design rules.

Brief:
- Page kind: <landing / portfolio / marketing>
- Product: <name and one-line description>
- Audience: <who reads this, concrete adjectives>
- Vibe words: <2 to 4 concrete adjectives, e.g. "minimalist, editorial, restrained">
- References: <real URLs or product names that anchor the aesthetic>
- Avoid: <explicit slop patterns the brief should NOT default to>

Step 1. Declare your design read in one sentence and the three dial values with one-line reasoning each. Stop.

Step 2 (after my OK). Ship a single Next.js page with at least 8 sections. Pick the sections that actually fit the product. At least 4 different layout families across the page. Use real images (gen-tool first, then Picsum-seed). Lock one theme for the whole page.

Step 3. Run in writing:
- Em-dash audit (zero em-dashes U+2014 or en-dashes U+2013 anywhere)
- Pre-Flight Check (Section 14, every box marked Pass or Fail with one-line justification)
- Section-Layout-Repetition audit (list each section's layout family)
- Hero discipline audit (headline lines, subtext words, CTA visibility)

Any Fail blocks completion.
```

### Redesign of an existing website

```
I have loaded tasteskill v2 (experimental) as my only source of design rules.

Brief:
- Site: <URL or repo path>
- Mode: <preserve brand / overhaul / unsure>
- Audience: <who reads this>
- What works today: <2 to 3 specifics you want kept>
- What is broken today: <2 to 3 specifics you want fixed>
- SEO constraint: <which routes, headings, or anchors must not change>

Step 1. Run the Section 11 audit (Section 11.B in the skill):
- Brand tokens currently in use (primary, accent, type stack, radii)
- Information architecture (page tree, nav, conversion paths)
- Patterns to preserve (signature interactions, recognisable hero, copy voice)
- Patterns to retire (slop tells, broken layouts, dead links)
- Inferred dial reading of the current site (DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY)
- SEO baseline (ranking pages, titles, anchors)
Post the audit in writing. Stop.

Step 2 (after my OK). Declare the mode (Preserve, Overhaul, or Greenfield-with-content-preserved) and which modernisation levers from Section 11.D you will apply, in priority order. Stop.

Step 3 (after my OK). Implement the changes. Keep URL structure, primary nav labels, form field names, brand logo, and legal copy unchanged unless I explicitly approve a change.

Step 4. Run in writing:
- Em-dash audit
- Pre-Flight Check (Section 14)
- Preservation audit: list every URL, nav label, form field, and anchor changed. Should be empty unless I approved.
- Brand fidelity audit: confirm the existing brand accent color, type stack, and logo treatment survived the redesign.

Any Fail blocks completion.
```

## Filling the brief

Use the user's own words. Condense to fit the one-line field format, but do not upgrade their vocabulary, add adjectives, or round their idea up into something grander.

A field the user said nothing about keeps its full angle-bracket hint exactly as the template shows it. Never fill a field by guessing, even when a guess feels obvious. The hint is useful to the user: it tells them what the field wants when they fill it in themselves. An empty field the user completes is worth more than a plausible field they never chose.

Mapping is allowed; invention is not. "Keep my brand colors and logo" maps to Mode: preserve brand, because the user said it in different words. "A scheduling tool for contractors" does not map to Audience: contractors, unless the user said who reads the page, because a product having users is not the user telling you the audience.

If the user gave more than a field's suggested count (six vibe words where the hint says 2 to 4), keep everything they gave. Their content outranks the hint.

## Requirements that fit no brief field

Some requirements are real but not brief material: a dark theme, a specific framework, a section they insist on. These must still survive. Append each one, in the user's own terms and in as few words as possible, to the step where it applies. Most land at the end of Step 2 (new build) or Step 3 (redesign).

If a requirement contradicts a template default, the user wins: the user wants Astro, the template says Next.js, so edit exactly that phrase and nothing else. The template supplies the format, but the prompt is still the user's.

## Conflicts with the Quick reminders

The guide's Quick reminders are hard rules of the taste-skill workflow:

- Zero em-dashes anywhere. Hyphen only.
- Hero headline max 2 lines. Subtext max 20 words. CTA visible without scroll.
- Navigation max 80 pixels tall, one line at desktop.
- Bento grid: N items equals N cells. No empty cells.
- One theme for the whole page (no light/dark flips mid-page).
- Real images, no div-based fake screenshots, no hand-rolled SVG illustrations.
- No section-numbering eyebrows, no version labels in hero, no scroll cues, no locale strips, no decorative status dots.
- If MOTION_INTENSITY is greater than 4, the page actually animates. Otherwise drop the dial.

If the rough prompt asks for something these rules ban (a scroll-down cue, a light hero over a dark features section, a hand-drawn SVG illustration), do not carry it into the revised prompt. The audits inside the prompt would fail it anyway, so including it sets the run up to stall. Drop it and say so in the note line, so the user gets to decide, not you.

## Dashes

The revised prompt must contain zero em-dashes (U+2014) and zero en-dashes (U+2013), including inside text carried over from the user. Replace each with a hyphen, a comma, or a small restructure, whichever changes the user's wording least.

## Output format

Deliver exactly this and nothing else:

1. The revised prompt in one fenced code block, ready to copy in a single action.
2. Under the block, at most two short lines:
   - `Fill before running: <field names>` if any placeholders remain.
   - `Dropped (conflicts with Quick reminders): <items>` if anything was dropped.

Omit either line when it does not apply. If neither applies, the code block stands alone. No preamble, no explanation of the template, no design advice, no suggestions for improving the idea. The user asked for a formatted prompt, not a consultation.

## Self-check before sending

- Every substantive requirement in the rough prompt now appears in the revised prompt, or is listed as dropped.
- Nothing in the revised prompt is neither template text nor traceable to the user's words.
- Untouched fields still show their angle-bracket hints.
- Zero U+2014 and U+2013 characters anywhere in the output, notes included.
- Template sentences are intact except where a user requirement forced a specific edit.

## Example

Rough prompt from the user:

> revise for tasteskill: landing page for Brightline — a scheduling tool for home service contractors. should feel fast and no-nonsense, like Linear. use astro not nextjs. add a scroll hint arrow after the hero

Revised output, in full:

````
```
I have loaded tasteskill v2 (experimental) as my only source of design rules.

Brief:
- Page kind: landing
- Product: Brightline, a scheduling tool for home service contractors
- Audience: <who reads this, concrete adjectives>
- Vibe words: fast, no-nonsense
- References: Linear
- Avoid: <explicit slop patterns the brief should NOT default to>

Step 1. Declare your design read in one sentence and the three dial values with one-line reasoning each. Stop.

Step 2 (after my OK). Ship a single Astro page with at least 8 sections. Pick the sections that actually fit the product. At least 4 different layout families across the page. Use real images (gen-tool first, then Picsum-seed). Lock one theme for the whole page.

Step 3. Run in writing:
- Em-dash audit (zero em-dashes U+2014 or en-dashes U+2013 anywhere)
- Pre-Flight Check (Section 14, every box marked Pass or Fail with one-line justification)
- Section-Layout-Repetition audit (list each section's layout family)
- Hero discipline audit (headline lines, subtext words, CTA visibility)

Any Fail blocks completion.
```
Fill before running: Audience, Avoid
Dropped (conflicts with Quick reminders): scroll hint arrow (no scroll cues)
````

Note what happened: the em-dash in the user's text became a comma, Astro replaced Next.js in exactly one phrase, the scroll arrow was dropped and noted rather than silently kept or silently deleted, and the two fields the user never addressed kept their hints. Nothing else changed and nothing was added.
