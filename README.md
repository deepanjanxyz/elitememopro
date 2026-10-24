# Elite Memo Pro — Website

The static marketing site for **Elite Memo Pro**, a local-first Android notes app that brings text notes, checklists and
freehand drawing together in one private, offline package.

Built as a small, dependency-free multi-file static site — plain HTML, CSS and a sprinkle of vanilla JavaScript — ready to
deploy on **GitHub Pages**.

> Looking for the app itself? It lives at **[deepanjanxyz/notepad](https://github.com/deepanjanxyz/notepad)**.

---

## Table of contents

- [Pages](#pages)
- [Project structure](#project-structure)
- [Local development](#local-development)
- [Deployment to GitHub Pages](#deployment-to-github-pages)
- [Customising](#customising)
- [Design system](#design-system)
- [Accessibility & performance](#accessibility--performance)
- [License](#license)

---

## Pages

| File | Purpose |
| :--- | :--- |
| `index.html` | Landing page: hero, feature grid, screenshot gallery, privacy summary, documentation, FAQ and download call-to-action. |
| `privacy.html` | The full privacy policy, rendered from the app's `PRIVACY.md`. |
| `conduct.html` | Code of Conduct (Contributor Covenant 2.1) plus the contribution guidelines. |
| `assets/css/style.css` | The whole design system: tokens, components, layout and responsive rules. |
| `assets/js/main.js` | Mobile menu, smooth scrolling, sticky-header state, scroll reveals and active-link highlighting. |

All download buttons point at the app's "latest release" URL, so they always serve the newest signed APK:

```
https://github.com/deepanjanxyz/notepad/releases/latest
```

---

## Project structure

```
.
├── index.html            # landing page
├── privacy.html          # privacy policy
├── conduct.html          # code of conduct + contributing
├── README.md             # this file
└── assets/
    ├── css/
    │   └── style.css     # design system + all page styles
    └── js/
        └── main.js       # progressive-enhancement JavaScript
```

There is no build step, no framework and no package manager. What you see is what ships.

### About the images

Screenshots, the app icon and the feature graphic are loaded directly from the app repository's
`fastlane/metadata/android/en-US/images/` folder via `raw.githubusercontent.com`. That keeps this repository small and means
the visuals always match the current release.

If you would rather keep the images local, copy them into `assets/img/` and swap the `https://raw.githubusercontent.com/...`
URLs in the HTML for relative paths such as `assets/img/icon.png`.

---

## Local development

Because everything is static, any simple file server works. From the project root:

```bash
# Python 3 (built in on most systems)
python3 -m http.server 8080

# …or Node, if you prefer
npx serve .
```

Then open <http://localhost:8080>.

Opening `index.html` directly from the filesystem mostly works too, but a local server is recommended so that relative
paths and the `fetch`-free assets resolve exactly as they will in production.

---

## Deployment to GitHub Pages

### 1. Create the repository

```bash
git init
git add .
git commit -m "feat: initial Elite Memo Pro landing site"
git branch -M main
git remote add origin https://github.com/deepanjanxyz/elitememopro.git
git push -u origin main
```

### 2. Enable Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the **`main`** branch and the **`/ (root)`** folder, then **Save**.

The site is published within a minute or two at:

```
https://deepanjanxyz.github.io/elitememopro/
```

> The site is fully static, so the `/ (root)` option is all you need. If you later move the files into a `docs/` folder,
> select `/docs` instead.

### 3. Custom domain (optional)

Add a `CNAME` file containing your domain, then point a `CNAME` DNS record at `deepanjanxyz.github.io`. Enable
**Enforce HTTPS** once the certificate is issued.

### Before you publish

- Replace the canonical/Open Graph URLs in the `<head>` of each page if your repository name or domain differs.
- Confirm the download link matches your releases (`…/notepad/releases/latest`).

---

## Customising

Everything visual is driven by CSS custom properties at the top of `assets/css/style.css`. Change them once and the whole
site follows:

```css
:root {
  --bg: #070a0f;            /* page background            */
  --surface: rgba(255, 255, 255, 0.045);  /* glass card   */
  --border: rgba(255, 255, 255, 0.09);    /* hairline     */
  --text: #e9eff7;         /* primary text               */
  --text-dim: #a2b1c4;     /* secondary text             */
  --accent: #2dd4bf;       /* teal accent                */
  --gold: #f4c453;         /* premium highlight          */
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
}
```

Common tasks:

| I want to… | Do this |
| :--- | :--- |
| Change the accent colour | Edit `--accent` (and `--accent-soft` / `--accent-line`). |
| Add a feature card | Copy an `<article class="card feature">` block inside `#features`. |
| Add a screenshot | Duplicate a `<figure class="shot">` block inside `.shots__track`. |
| Add a FAQ entry | Copy a `<details class="faq__item">` block inside `.faq`. |
| Change the typefaces | Swap the Google Fonts `<link>` in each page's `<head>` and the `--font-*` tokens. |
| Point downloads elsewhere | Update the `releases/latest` links (and the `Binaries` URL note in the docs). |

---

## Design system

- **Aesthetic** — dark glassmorphism: a near-black base, frosted translucent cards, hairline borders and a restrained
  teal + gold accent palette. No neon gradients, no glowing shadows.
- **Layout** — CSS Grid and Flexbox throughout, with a 1180px content column and fluid `clamp()` spacing.
- **Typography** — *Space Grotesk* for display headings, *Plus Jakarta Sans* for body text, *JetBrains Mono* for labels and
  code. Loaded from Google Fonts with a full system-font fallback stack.
- **Components** — `.card` (glass surface), `.btn` (`--primary` / `--ghost`), `.eyebrow`, `.feature`, `.shot`, `.doc`,
  `.faq__item`, `.prose` (long-form pages) and a `.table-wrap` for responsive tables.
- **Motion** — a single `.reveal` class fades elements up as they enter the viewport; optional `data-reveal-delay="120"`
  staggers siblings.

---

## Accessibility & performance

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and a visible **skip link**.
- The mobile menu manages `aria-expanded` / `aria-label`, closes on **Escape**, on outside click, and when a link is used.
- Keyboard-focus rings are always visible; the FAQ uses native `<details>` / `<summary>`.
- All motion respects `prefers-reduced-motion: reduce`.
- Images are lazy-loaded below the fold, with `width`/`height` set to avoid layout shift.
- No JavaScript is required for content to be readable — it only adds polish.

---

## License

The website source is released under the **MIT License**, matching the app.
Copyright © 2026 Deepanjan Biswas.

