# Aman Sharma — Portfolio

Static portfolio site. No build step, no framework, no dependencies — three files (`index.html`, `style.css`, `script.js`) plus assets.

## Stack

- Vanilla HTML / CSS / JavaScript
- Google Fonts (Unbounded, Syne, Instrument Serif)
- [Plausible](https://plausible.io) for analytics (privacy-friendly, no cookies)
- [Formspree](https://formspree.io) for the contact form

## Local development

Open `index.html` in a browser, or serve it with any static server:

```bash
# Python (already present in .venv)
python3 -m http.server 8000

# Or Node
npx serve

# Or VS Code Live Server extension
```

Then visit `http://localhost:8000`.

## Before deploy — replace placeholders

| File | Placeholder | What to set |
|---|---|---|
| `index.html` | `YOUR_DOMAIN` (Plausible `data-domain`) | Your deployed domain, e.g. `amansharma.dev` |
| `index.html` | `YOUR_FORM_ID` (Formspree `action`) | Your Formspree form ID |
| `robots.txt` | `YOUR_DOMAIN` | Your deployed domain |
| `sitemap.xml` | `YOUR_DOMAIN` | Your deployed domain |
| project root | `Aman_Resume.pdf` | Drop the actual PDF in place |

## Deploy

This repo includes config for two zero-config static hosts:

### Netlify
1. Drag the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop) — done.
2. Or `git push` to a connected repo. `_headers` is auto-applied.

### Vercel
1. `npx vercel` from this directory — done.
2. Or connect via the Vercel dashboard. `vercel.json` is auto-applied.

Both hosts gzip/brotli-compress assets automatically and serve over HTTPS.

### GitHub Pages
Push to a `gh-pages` branch or set the source to `main /`. The security headers in `_headers` / `vercel.json` will not apply on GH Pages — consider adding them via a Cloudflare proxy if needed.

## Features

- Light/dark mode with system-preference detection + manual toggle (persisted in `localStorage`)
- `prefers-reduced-motion` and touch-device detection (custom cursor disabled, scroll-reveal skipped)
- Responsive image with AVIF → WebP → PNG fallback chain
- Schema.org `Person` JSON-LD for rich Google results
- 1200×630 OG card for social previews
- Async-loaded Google Fonts (no render block)
- Sitemap, robots.txt, branded 404 page
- Skip-link, ARIA-correct mobile menu, visible focus rings
- CSP + security headers

## Privacy / Cookie consent

Plausible Analytics does not use cookies and does not collect personal data — **no cookie consent banner is required** under GDPR or ePrivacy.

If you switch to Google Analytics 4 (commented block in `index.html`), you **must** add a consent banner — GA4 sets cookies and processes personal data.

## License

Code: MIT. Content (copy, photo, branding): all rights reserved.
