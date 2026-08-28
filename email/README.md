# Email templates

HTML for campaigns sent through the CRM. One rule governs everything in here:
**email clients are not browsers.** No `<iframe>`, no `<script>`, no external
stylesheet, no CSS background image, no flexbox or grid. Tables for layout,
inline styles for everything else.

## `insurepages-templates-email.html`

The "Start from a template. Finish somewhere yours." campaign, rebuilt from the
Canva design [InsurePages Templates Email](https://www.canva.com/design/DAHTgVuHdrw/12krD8InuxNSC85f2gU7RA/view).

Canva's own embed code wraps the design in an `<iframe>`, which every CRM and
mail client rejects or strips — hence this rebuild. Copy the markup between the
`PASTE-READY FRAGMENT` comments into the CRM's HTML block; the surrounding
`<html>`/`<body>` shell exists only so the file previews in a browser.

The design is reproduced with live text rather than a screenshot, so it stays
legible on a phone, works with images turned off, and keeps the CTA a real
link — the same WCAG 2.1 AA posture the sites ship with.

Two links to retarget per campaign:

| What | Where it points |
| --- | --- |
| Primary button | `https://www.insurepages.com/templates` |
| "Fill out the form" | `https://formrobin.com/f/344no93` |

The only remote asset is the logo, served from the live site at
`https://www.insurepages.com/images/insurepages-logo.png`. Campaigns sent before
the custom domain landed still hot-link `insure-pages.vercel.app` from
recipients' inboxes, so that host has to keep serving: redirecting or retiring it
would break the images in mail already delivered.

## Image-only fallback

`site/public/images/email/insurepages-templates-email.png` is the same email
flattened to one picture, for builders that will not accept hand-written HTML at
all. It is **generated, not hand-edited** — change the HTML and rerun:

```bash
npm i -D playwright && npx playwright install chromium
node email/build-image-fallback.mjs
```

It is served from the marketing site at
`https://www.insurepages.com/images/email/insurepages-templates-email.png`,
so the email references a URL we control rather than a Canva export link (those
are signed and expire within hours).

Prefer the HTML. A single-image email has no live text: it disappears entirely
when a client blocks images, reads as nothing to a screen reader beyond its alt
text, and scores worse with spam filters.
