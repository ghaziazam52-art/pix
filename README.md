# Pixel Forge AI — Exhibition Website

A static showcase site for Pixel Forge AI, a student-built AI learning project.
This site is **separate from the Pixel Forge AI application**. It has no backend, no database, no API keys, no analytics, and no third-party dependencies.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and content |
| `styles.css` | Design tokens and all styling |
| `script.js` | Hero graphic, mobile menu, reveal animations, support modal |

## Preview locally

Open `index.html` in a browser, or run a tiny local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish free on GitHub Pages

1. Create a GitHub account (free) and a new **public** repository, for example `pixel-forge-ai-site`.
2. Upload `index.html`, `styles.css`, `script.js` and `README.md` to the repository root (use **Add file → Upload files**), then commit.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose branch **main** and folder **/ (root)**, then **Save**.
5. Wait one to two minutes. GitHub shows the live address at the top of the Pages settings.
6. Your public HTTPS URL will follow this pattern:
   `https://<your-github-username>.github.io/<repository-name>/`
7. Open the URL on a phone and a laptop to confirm it loads. Turn on **Enforce HTTPS** in the same settings page if it is not already on.

Other genuinely free static hosts (Cloudflare Pages, Netlify, Vercel hobby tier) also work: point them at this folder with no build command and no output directory.

## Support / payments

The support modal only **displays** the intended UPI ID and a copy button. Payments are intentionally disabled:

- no QR code, no `upi://` link, and no payment button
- no claim that the UPI ID or recipient name is verified
- no collection of any UPI PIN, OTP, or payment details
- no success screens or donation totals

Do not add active payment features until parent/guardian and school/programme approval has been obtained and the UPI ID and recipient name have been verified.

## Content rules followed

- No claim of a self-trained foundation model, and no launched features
- Technology limited to: web interface/frontend, existing open-source language models, Ollama exploration for local development
- Roadmap labelled as planned work
- Only the five credited names and organisations, with no added logos, awards, or endorsements
