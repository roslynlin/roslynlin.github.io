# Roslyn Lin · Portfolio v3.7

> Static personal portfolio site for 林镕 Roslyn Lin — 科技品牌公关与传播专家.
> Built as a single-page editorial magazine with custom cursor, scroll reveals, and number counters. No build tooling, no dependencies — open `index.html` and you're done.

## File map

```
portfolio-v3.7/
├── index.html     32 KB    Page structure & content
├── styles.css     49 KB    Design tokens, layout, animations
├── main.js        9.2 KB   Cursor, reveals, counters, parallax, smooth scroll
└── README.md      this
```

Total uncompressed: ~90 KB.

## How to preview

Any static server works:

```bash
# Python 3
python3 -m http.server 8765

# Node
npx serve .
```

Then open `http://localhost:8765`.

## Tech stack (vanilla, no framework)

- **HTML** semantics: `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- **CSS** custom properties for theme tokens, `clamp()` for fluid type/spacing, `grid` + `flexbox` for layout, `aspect-ratio` for posters, `requestAnimationFrame` targets via `will-change`
- **JS** uses IntersectionObserver for reveal + number counter, custom lerp cursor with GPU transform, no libraries

External fonts (loaded via `<link>` in `index.html`):

- Fraunces (serif · Latin display)
- DM Sans (sans · Latin body)
- Noto Serif SC (中文衬线)
- Noto Sans SC (中文无衬线)

## Design system

### Palette — warm, no black/white/gray

| Role            | Token              | Hex       |
|-----------------|--------------------|-----------|
| paper (light)   | `--bg`, `--paper`  | `#F4E8D6`, `#FAF1E0` |
| ink (dark)      | `--ink`, `--ink-2` | `#2B1810`, `#5A3D28` |
| persimmon       | `--c-orange`       | `#C24A1E` |
| jade            | `--c-green`        | `#1F5D3A` |
| mustard         | `--c-yellow`       | `#D9A521` |
| wine            | `--c-red`          | `#A83246` |
| plum            | `--c-plum`         | `#6B3A6B` |
| ink-blue        | `--c-blue`         | `#2E6B8F` |

Each `<section>` sets its own `--theme` accent that drives headlines, dividers, and callouts.

### Typography

- Display headings: `"Noto Serif SC", Fraunces, serif` (weight 400–700)
- Body: `"DM Sans", "Noto Sans SC", sans` (weight 400–500)
- Italics used for editorial emphasis (`<em>`)
- No `Inter`. No purple-blue gradients. No pure greys. No em-dashes (—).

### Page sections (10)

1. **Topbar** — brand mark, nav (关于/能力/作品/平台/联系), location meta
2. **Hero** — 4-line slogan「把硬核科研讲成故事。把品牌心智传到远方。」with yellow / orange / yellow-green highlight blocks, PORTFOLIO 2026 sticker
3. **Marquee** — angled deck of brand strategy / media relations / content craft / sci-comm keywords
4. **About** — display paragraph + field key/value list + 服务领域 / 核心专长 aside
5. **Stats** — 3 rows with different column counts (1 / 3 / 2) to break vertical stacking
6. **Competencies** — 12-col asymmetric grid, 6 cards each with a different visual treatment
7. **Selected Works** — 2 featured projects (1fr/1fr layout) + 16 small project rows
8. **Media Matrix** — uniform 2x2 grid, 4 platforms (微信/B站/视频号/微博) distinguished by accent color and chip tags
9. **Trajectory** — zig-zag timeline with central line, items alternate left/right, 6 milestones ending in 2026 →
10. **More Craft** — 视觉 / 视频 as a small 2-col bonus
11. **Contact** — quiet outro: kicker pill, single-line title with italic emphasis, 3 inline category chips, 2 channels (Email + WeChat), footer

### Interactions

- Custom orange cursor with lerp 0.5 + GPU `translate3d`, snaps instantly when distance > 180px
- Hero title chars stagger in with rotate + translate
- Reveal on scroll via IntersectionObserver (rotate-up for cards, fade-up for text)
- Number counter animates 0 → data-count on scroll into view
- Magnetic effect on `.ghost-cta` (hero) and `.fp-link` (project titles)
- Poster parallax on `.fp-visual` wrap (no more rotation since v3.6)
- Smooth-scroll with -60px offset for sticky topbar
- Sticker (`PORTFOLIO 2026`) has scroll parallax

### Responsive

Three breakpoints:

- `≤ 1100px` — competencies 6-col, smaller work-row columns, hide work notes
- `≤ 860px` — single-column flow, timeline becomes left-aligned vertical list, hero font shrinks
- `≤ 540px` — extras grid 1-col, base font sized for mobile

## Customization

Most site-wide tuning lives at the top of `styles.css`:

```css
:root {
  --bg:        #F4E8D6;
  --ink:       #2B1810;
  --c-orange:  #C24A1E;
  /* ... more tokens ... */
  section.about          { --theme: var(--c-orange); }
  section.stats          { --theme: var(--c-orange); --theme-2: var(--c-yellow); }
  section.competencies   { --theme: var(--c-green);  --theme-2: var(--c-green-2); }
  /* ... per-section accents ... */
}
```

Change a palette token here and the whole site updates.

Content lives in `index.html` — every block is well-commented for easy edits.

## License & credits

Design and code by request. Content © Roslyn Lin.
Built with reference to Leonxlnx/taste-skill (anti-slop frontend principles) and pbakaus/impeccable (24 design commands).
</content>
</invoke>