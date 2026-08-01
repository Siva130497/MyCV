# Vithurushan Meeneswaran — Portfolio

Single-page portfolio built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **GSAP** and **Lenis**.

## Run it

```bash
npm install
npm run dev
```

Opens on http://localhost:3000. `npm run build` prerenders the whole page as static content — there are no server routes or environment variables.

## Editing content

**Everything on the site comes from [`src/data/site.ts`](src/data/site.ts).** Change that one file and the whole page follows — no component edits needed.

| What                              | Export        |
| --------------------------------- | ------------- |
| Name, role, email, phone, address | `person`      |
| LinkedIn / GitHub links           | `socials`     |
| About copy and lead statement     | `about`       |
| The four number tiles             | `stats`       |
| Job history                       | `experience`   |
| Degrees and diplomas              | `education`    |
| Spoken languages                  | `languages`    |
| Skill chips (9 groups)            | `skillGroups`  |
| Scrolling word strip              | `marquee`      |
| Projects                          | `projects`     |
| The compact "Also built" list     | `sideProjects` |
| Service list                      | `services`     |
| SEO title / description           | `siteMeta`     |

Two roles in `experience` carry `concurrent: true` — Prodigit and DigiFront ran at the same time, both remote, in different countries. The flag renders a badge so the overlapping dates read as deliberate rather than as a mistake.

Comments marked `REVIEW:` flag content that was inferred from the old portfolio or read off project screenshots — check those before publishing.

Years of experience derive from `CAREER_START_YEAR`, so the site ages itself and never needs a manual bump.

### Adding a project

Push an entry onto `projects` and drop any screenshots in `public/img/projects/`:

```ts
{
  slug: "my-project",
  name: "My Project",
  year: "2026",
  category: "Web app",
  summary: "One line, shown large on the featured layout.",
  description: "A paragraph for the detail column.",
  role: "Full-stack development",
  stack: ["Next.js", "Postgres"],
  images: ["/img/projects/my-project.jpg"], // a 2nd image renders as an inset card
  href: "https://example.com",              // optional — shows the "Visit live site" button
  notes: ["An engineering decision worth calling out."],
}
```

The section picks one of three layouts per entry, so nothing ever renders as a
missing-image placeholder:

| Entry has                    | Layout                                                              |
| ---------------------------- | ------------------------------------------------------------------- |
| `featured: true`             | Full width, architecture diagram, engineering-notes grid            |
| `images: [...]`              | Alternating screenshot block, second image as an inset card         |
| `images: []`                 | Spec panel — type, year, role, stack, plus the first `notes` entry   |

Featured entries also take an `architecture` array of `{ label, nodes }` layers,
rendered by `components/sections/ArchitectureDiagram.tsx` as a topology with a
pulse tracing the request path. Non-featured blocks alternate left/right
automatically by index.

## Structure

```
src/
├── app/
│   ├── layout.tsx           metadata, fonts, JSON-LD, chrome (nav/footer/cursor/grain)
│   ├── page.tsx             section order
│   ├── globals.css          design tokens, both themes, custom utilities
│   ├── icon.tsx             generated favicon
│   ├── opengraph-image.tsx  generated link-preview card
│   ├── robots.ts, sitemap.ts
├── components/
│   ├── providers/SmoothScroll.tsx   Lenis, wired into the GSAP ticker
│   ├── providers/ThemeToggle.tsx    light/dark switch, reads data-theme
│   ├── layout/     Nav (hide-on-scroll, scroll-spy, mobile overlay), Footer
│   ├── sections/   Hero, About, Experience, Skills, Projects, Services, Contact
│   └── ui/         Preloader, Cursor, Magnetic, Reveal, SectionHeader
├── data/site.ts    ← all content
└── lib/
    ├── gsap.ts     plugin registration + shared constants
    └── theme.ts    the pre-paint theme script
```

## Deploying to Netlify

Every route prerenders static (`next build` reports `○` for all six), so there are no serverless functions to warm and no runtime cost.

1. **New site → Import an existing project**, and pick this repo.
2. Netlify reads `netlify.toml`, so leave the build settings alone: command `npm run build`, publish `.next`, Node 22.
3. The Next.js adapter installs itself on first build — nothing to add to `package.json`. It's deliberately unpinned so it tracks Next.js releases.
4. **Set `NEXT_PUBLIC_SITE_URL`** to the final origin, no trailing slash (e.g. `https://vithurushan.netlify.app`). It drives `metadataBase`, the OG tags, `sitemap.xml` and `robots.txt`. Without it the build falls back to the hardcoded default in `site.ts`, and the canonical URLs will point at the wrong host.

`netlify.toml` also sets cache headers (immutable for `/_next/static`, a week for `/img`) and baseline security headers. There's no CSP: the theme script is inline and GSAP writes inline styles, so a strict policy needs a nonce pass — worth doing deliberately rather than shipping one that breaks the page.

## Design tokens & theming

Colours, fonts and easings live in the `@theme` block of `src/app/globals.css`. The dark palette is the default; `:root[data-theme="light"]` re-declares the same custom properties at higher specificity, so every `bg-ink` / `text-muted` / `border-line` utility follows the theme with no `dark:` variants anywhere in the markup.

Anything a component would otherwise hardcode — nav backdrop, hero glow, card shadow, cursor ring, grain opacity, image scrim — is a named variable next to the palette (`--nav-bg`, `--glow`, `--card-shadow`, …). **This matters for the GSAP work:** a tween to a literal colour can't follow a runtime theme change, so components toggle a class (`.is-scrolled`, `.is-active`) and CSS owns the colour. If you add a themed component, follow that split.

How the theme resolves:

1. `THEME_INIT_SCRIPT` (`src/lib/theme.ts`) runs blocking in `<head>` — reads `localStorage`, falls back to `prefers-color-scheme`, and stamps `data-theme` on `<html>` before first paint. No flash.
2. Because the script always writes an explicit value, the CSS never needs a `prefers-color-scheme` fallback.
3. `ThemeToggle` subscribes to that attribute with `useSyncExternalStore` and a `MutationObserver`. The DOM attribute is the source of truth, not React state — the two can't disagree on first paint.
4. Toggling adds `.theme-transition` to `<html>` for 450ms so the page cross-fades, then removes it rather than leaving a transition on every element forever.
5. With no stored choice, the toggle keeps following the OS if it changes mid-session.

The favicon and OG card hardcode the same hex values in their own files — update those two if you change the palette.

## Motion

- **Lenis** drives inertial scrolling, stepped by `gsap.ticker` so scrubbed animations stay on the same frame as the scroll position.
- **ScrollTrigger** handles reveals, parallax and the pinned horizontal experience track.
- **SplitText** powers the masked line/word/char reveals in `<Reveal>` — splitting waits on `document.fonts.ready` so line breaks are measured against the real typeface, not the fallback.

`prefers-reduced-motion: reduce` is honoured throughout: Lenis doesn't initialise, the preloader is skipped, every reveal renders as static text, and the pinned horizontal track collapses to a vertical stack.

## Deploying

Static output, so anything works. To keep the current Netlify setup, add `@netlify/plugin-nextjs` and a `netlify.toml` pointing at `npm run build`. Vercel needs no configuration — import the repo and it builds as-is.

Before going live, set `siteMeta.url` in `src/data/site.ts` to the final domain — it's the base for canonical URLs, the sitemap and the OG tags.
