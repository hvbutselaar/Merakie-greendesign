# Meraki green design — static website

Clean, hand-coded static rebuild of [meraki-greendesign.nl](https://meraki-greendesign.nl)
(tuinontwerp & kantoorbeplanting — Marieke Berkhof). No WordPress, Elementor, jQuery or
page-builder: just plain HTML, one `style.css` and one small `script.js`.

## Structure

- `index.html` and per-page folders (`over-ons/`, `diensten/`, `diensten/tuinontwerp-nieuw/`,
  `diensten/kantoorbeplanting/`, `projecten/`, `tuin-voorthuizen/`, `sth/`, `nike/`, `contact/`,
  `privacy-policy/`) — pretty URLs, each an `index.html`.
- `style.css` — design system (Poppins + Raleway, coral accent `#d0886e`, warm cream background).
- `script.js` — typed hero animation, project filter, gallery lightbox, mobile nav, contact form.
- `img/` — all images.
- `contact-mail.php` — mail handler for the contact form (**needs PHP hosting**, see below).

All internal links use relative paths, so the site works from any base path (GitHub Pages
project URL, a custom domain, or a local server).

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080/
```

## Hosting

- **GitHub Pages** (static): works out of the box. Note: the contact form's PHP handler does not
  run on Pages, so form submissions won't send there — the form shows a "bel of mail me" message
  on failure. For a working form on static hosting, wire it to a form service (e.g. Formspree) or
  host on a PHP-capable server.
- **PHP hosting** (domain root): the contact form works via `contact-mail.php` (sends to
  marieke@meraki-greendesign.nl).
