# Meraki green design — clean static site

Hand-coded static site for **meraki-greendesign.nl** (Marieke Berkhof — tuinontwerp + kantoorbeplanting,
Barneveld/Voorthuizen). No framework, no build step: plain HTML + one shared `style.css` + one shared
`script.js`. This folder **is** the deploy artifact.

## How this site is hosted / deployed
- Git repo: `https://github.com/hvbutselaar/Merakie-greendesign.git` (public), branch `main`
  (note the repo-name typo "Merakie").
- Hosting: **Hostinger**, connected to the repo. **Every `git push` to `main` auto-deploys** to the live
  domain (webhook). Hostinger runs PHP, so `contact-mail.php` actually sends mail.
- So the normal workflow is: edit → preview locally → `git commit` + `git push` → live in ~1 min.

## Folder / URL structure (pretty URLs)
Each page is `<slug>/index.html` so URLs stay clean (`/over-ons/`, `/diensten/tuinontwerp-nieuw/`).
Pages: `index.html` (home), `over-ons/`, `diensten/`, `diensten/tuinontwerp-nieuw/`,
`diensten/kantoorbeplanting/`, `projecten/`, `tuin-voorthuizen/`, `sth/`, `nike/` (= FACN project),
`contact/`, `privacy-policy/`. Shared assets live at the root: `style.css`, `script.js`,
`contact-mail.php`, `img/`, plus SEO files `robots.txt`, `sitemap.xml`, `404.html`, `.htaccess`.

### Relative-path rule (important)
All asset/nav links are **relative, depth-aware**. Use the right prefix for the page's folder depth:
- root (`index.html`): `./style.css`, `./img/…`, `./over-ons/`
- one level deep (`over-ons/`, `diensten/`): `../style.css`, `../img/…`
- two levels deep (`diensten/tuinontwerp-nieuw/`, `diensten/kantoorbeplanting/`): `../../style.css`, `../../img/…`

## Design tokens (see `:root` in style.css)
- Accent coral `--coral #d0886e`, darker `--coral-d #b56a4f`; text `--ink #333`; warm cream bg `#faf7f2`;
  soft panel `--soft #f1ebe0`.
- Fonts (Google Fonts, loaded per page): **Poppins** headings (incl. weight 900), **Raleway** body,
  **Dancing Script** only for the handwritten quote on `over-ons/`.
- Hero = full-bleed `background-image` on `.hero` with white title; nav is centered, logo removed
  (`.nav .brand` is unused/absolutely-positioned, menu is `justify-content:center`).

## Images — WebP policy (since 2026-07-25 SEO pass)
- **All on-page images are WebP**: max 1600px, quality 75 (photos). Pages reference `img/*.webp` in
  `<img src>`, `background-image` and `<link rel="preload">`.
- **`og:image`/`twitter:image`/JSON-LD blijven JPEG** (absolute URLs) — social scrapers zijn daar
  betrouwbaarder mee. Daarom bestaan `.jpg` en `.webp` naast elkaar in `img/`; verwijder de jpg's niet.
- Logo: `meraki-logo-l.webp` (666×700) voor on-page gebruik; `meraki-logo.webp` (512×512) is alleen favicon;
  `meraki-logo.png` alleen nog als schema/og-referentie.
- Convert with **Python + Pillow** (installed: Python 3.14, Pillow 12.3 — the old System.Drawing route is obsolete):
  ```python
  from PIL import Image
  im = Image.open(src)  # nieuw bronbestand
  r = min(1.0, 1600.0 / max(im.size))
  if r < 1.0: im = im.resize((round(im.width*r), round(im.height*r)), Image.LANCZOS)
  im.save('img/new-name.webp', 'WEBP', quality=75, method=6)
  im.save('img/new-name.jpg', quality=80)  # alleen nodig als de foto ook og:image wordt
  ```
- Oversized images once broke deploy (216MB → 23MB) — keep the 1600px cap.
- Filenames are **per-spot and unique** (e.g. `home-tuin.jpg`, `kantoor-cover.jpg`) — don't reuse one file
  across multiple spots, otherwise a future single-photo swap changes several places at once.
- New source photos from Marieke arrive as Obsidian attachments (often in the workspace root, names with
  spaces/parens). Optimize them into `img/` with a clean name, then point the specific reference at it.

### To swap one photo yourself
1. Drop the new photo somewhere and optimize it into `Meraki_clean/img/newname.webp` (recipe above).
2. Find the spot in the page HTML — it's either `style="background-image:url('…/img/OLD.webp')"`
   (heroes, cards, CTA bands) or `<img src="…/img/OLD.webp">` (split sections).
3. Change that one path to your new file. If the photo is also the page's `og:image`, save a `.jpg`
   variant too and point the absolute og/twitter URLs at that. Preview, then `git commit` + `git push`.

## CSS/JS cache-busting (belangrijk bij elke wijziging)
`style.css` wordt 7 dagen client-side gecachet (.htaccess). Pages verwijzen ernaar met `style.css?v=N` —
**bij ELKE css-wijziging het versienummer in alle 16 HTML-pagina's ophogen** (sed over `*.html`), anders zien
terugkerende bezoekers tot een week lang de oude styling (gebeurde 2026-07-25 bij de footer-regiokolommen).
`script.js` heeft nog géén ?v-parameter — voeg die toe zodra script.js wijzigt.

## Local preview
`.claude/launch.json` config **meraki-clean** serves this folder on **port 8101**
(use the `preview_start` tool with name `meraki-clean`). Verify with `preview_snapshot` /
`preview_console_logs` (expect 0 broken images).

## SEO / analytics (already in place)
Per-page JSON-LD (ProfessionalService), absolute `og:image`, `twitter:card`, canonical → non-www apex.
GA4 `G-MZEEB1CT9G` loads **only after** cookie consent (Consent Mode v2; banner + logic in `script.js`).
NAP = Barneveld. Instagram: https://www.instagram.com/merakigreendesign/. `.htaccess` forces HTTPS + www→non-www + 404.
