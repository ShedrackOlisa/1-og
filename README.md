# OlitechGames redesigned template

Every page now shares one stylesheet and one script instead of carrying its
own copy. All content, images, links, meta tags, JSON-LD, Analytics and
AdSense code are unchanged.

## What's in here

```
assets/olitech.css     the entire site design (edit this to restyle everything)
assets/olitech.js      mobile menu, download countdown, reading progress
*.html                 115 pages, now ~42% smaller
```

## Uploading

Upload the whole folder, keeping `assets/` at the site root
(`olitechgames.com/assets/olitech.css`). Nothing else moves.

Pages link the assets with a relative path (`assets/…`, and `../assets/…`
inside `author/`). That works with your current URLs, which have no trailing
slash — `olitechgames.com/gta-6-review`. **If your server ever redirects to a
trailing slash** (`/gta-6-review/`), change the links to start with a slash
(`/assets/olitech.css`) or the styles will 404.

## Changing the look

Open `assets/olitech.css`. The top block sets everything:

```css
--paper   page background        --blue  links and navigation
--ink     text and borders       --red   scores, downloads, brand accent
```

Change `--red` and the accent shifts across all 115 pages at once. The old
variable names (`--primary`, `--text-muted`, `--font-heading`, …) still exist
as aliases underneath, so the inline `style="…"` attributes left in your
markup keep working.

Want a dark site? Swap `--paper` to `#12141A`, `--ink` to `#EDEEF0`,
`--white` to `#1B1E27` and `--card` to `#22262F`.

## The download countdown

The timer logic now lives in `olitech.js`. Each game page only carries its own
data, on the module itself:

```html
<div class="download-module" id="downloadModule"
     data-game="Dream League Soccer 2026"
     data-packaging="10" data-ready="10" data-countdown="10">
```

The three numbers are seconds, 30 in total, same as before. To shorten the
wait everywhere, change the defaults in `initDownload()` in `olitech.js`. To
change one page, edit that page's attributes.

The actual download links sit in a hidden `.download-ready` block in the HTML
rather than inside a JavaScript string, so you can edit a URL by hand without
touching any code.

### Adding a new game page

Copy an existing game page, change the content, and update:

1. `data-game` on the module
2. the links inside `.download-ready`

No `<style>` or `<script>` block needed.

## Accessibility notes

Added while rebuilding: a skip link, `aria-expanded` on the menu button,
focus returned to the button when the drawer closes, Escape to close, visible
focus outlines, and `prefers-reduced-motion` handling on every animation.
