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

## Images
- Keep images web-sized: **max 1800px, JPEG quality 80**. Oversized images once broke deploy (216MB → 23MB).
- No ffmpeg/imagemagick/pip on this machine. Optimize with **PowerShell + System.Drawing**. Example:
  ```powershell
  Add-Type -AssemblyName System.Drawing
  $src="C:\path\to\original.jpg"; $dst="img\new-name.jpg"; $max=1800; $q=80
  $img=[System.Drawing.Image]::FromFile($src)
  # NB: gebruik 1.0 (niet 1), anders kiest [Math]::Min de (int,int)-overload en wordt de ratio 0 -> 0x0 bitmap
  $r=[Math]::Min(1.0,[Math]::Min([double]$max/$img.Width,[double]$max/$img.Height))
  $w=[int]($img.Width*$r); $h=[int]($img.Height*$r)
  $bmp=New-Object System.Drawing.Bitmap $w,$h
  $g=[System.Drawing.Graphics]::FromImage($bmp); $g.InterpolationMode='HighQualityBicubic'
  $g.DrawImage($img,0,0,$w,$h)
  $enc=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()|?{$_.MimeType-eq'image/jpeg'}
  $p=New-Object System.Drawing.Imaging.EncoderParameters 1
  $p.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality),$q
  $bmp.Save($dst,$enc,$p); $g.Dispose();$bmp.Dispose();$img.Dispose()
  ```
- Filenames are **per-spot and unique** (e.g. `home-tuin.jpg`, `kantoor-cover.jpg`) — don't reuse one file
  across multiple spots, otherwise a future single-photo swap changes several places at once.
- New source photos from Marieke arrive as Obsidian attachments (often in the workspace root, names with
  spaces/parens). Optimize them into `img/` with a clean name, then point the specific reference at it.

### To swap one photo yourself
1. Drop the new photo somewhere and optimize it into `Meraki_clean/img/newname.jpg` (recipe above).
2. Find the spot in the page HTML — it's either `style="background-image:url('…/img/OLD.jpg')"`
   (heroes, cards, CTA bands) or `<img src="…/img/OLD.jpg">` (split sections).
3. Change that one path to your new file. Preview, then `git commit` + `git push`.

## Local preview
`.claude/launch.json` config **meraki-clean** serves this folder on **port 8101**
(use the `preview_start` tool with name `meraki-clean`). Verify with `preview_snapshot` /
`preview_console_logs` (expect 0 broken images).

## SEO / analytics (already in place)
Per-page JSON-LD (ProfessionalService), absolute `og:image`, `twitter:card`, canonical → non-www apex.
GA4 `G-MZEEB1CT9G` loads **only after** cookie consent (Consent Mode v2; banner + logic in `script.js`).
NAP = Barneveld. Instagram: https://www.instagram.com/merakigreendesign/. `.htaccess` forces HTTPS + www→non-www + 404.
