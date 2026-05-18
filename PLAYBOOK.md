# Marketing Site Playbook

A working reference for building polished, content-driven marketing sites
the way we built **consulatng.net**. Copy-paste from here when starting a
new project — the patterns and code snippets are deliberately portable.

---

## Contents

- [1. Stack & tooling](#1-stack--tooling)
- [2. One-shot scaffold prompt](#2-one-shot-scaffold-prompt)
- [3. Design system](#3-design-system)
- [4. Reusable building blocks](#4-reusable-building-blocks)
- [5. Animation patterns](#5-animation-patterns)
- [6. Content & image patterns](#6-content--image-patterns)
- [7. SEO & metadata](#7-seo--metadata)
- [8. Mobile responsiveness checklist](#8-mobile-responsiveness-checklist)
- [9. Deployment — Vercel specifics](#9-deployment--vercel-specifics)
- [10. Git workflow](#10-git-workflow)
- [11. Prompt patterns that worked](#11-prompt-patterns-that-worked)
- [12. Hard-won lessons](#12-hard-won-lessons)

---

## 1. Stack & tooling

**Pick stable, not bleeding-edge.** When we hit a new project, the
temptation is to grab the latest version of everything. Resist it for
client work. The combination below is well-trodden, ships fast, and
deploys cleanly to Vercel.

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Mature, SSG by default, great Vercel integration |
| Language | TypeScript (strict) | Catches integration mistakes before runtime |
| Styling | **Tailwind CSS v3** | Don't use v4 beta for client work — config story isn't settled |
| UI primitives | **shadcn-style** (Radix + cva) | Headless behavior, full control over markup |
| Icons | **lucide-react** | Consistent stroke style, tree-shakable |
| Forms | **react-hook-form** + **zod** + **@hookform/resolvers** | Best DX, smallest bundle for a form-heavy page |
| MDX | **next-mdx-remote** ≥ v6 + **gray-matter** | v5 has a security advisory that blocks Vercel deploys |
| Animation | Hand-rolled CSS + IntersectionObserver | No framer-motion needed for the typical marketing-site needs |
| Fonts | `next/font/google` (Inter + display heading) | Self-hosted, zero CLS, automatic preload |
| Deployment | **Vercel** | Auto-detects Next.js, free Image Optimization |

### Minimum `package.json`

```json
{
  "name": "site-name",
  "version": "0.1.0",
  "private": true,
  "engines": { "node": ">=18.17.0" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@next/third-parties": "^14.2.18",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "gray-matter": "^4.0.3",
    "lucide-react": "^0.460.0",
    "next": "^14.2.18",
    "next-mdx-remote": "^6.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.2",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@types/node": "^22.9.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.6.3"
  }
}
```

### Directory shape

```
app/                       App Router pages
  layout.tsx               Navbar, footer, fonts, PageLoader, JSON-LD
  page.tsx                 Homepage
  about/page.tsx
  services/
    page.tsx               Index
    [slug]/page.tsx        (or named subfolders per service)
  blog/
    page.tsx
    [slug]/page.tsx
  sitemap.ts
  robots.ts
  icon.png                 Next.js auto-routes this to /icon.png + favicon
  apple-icon.png

components/
  layout/                  Navbar, Footer, MobileMenu, Logo
  home/                    One file per homepage section
  services/                ServiceStack, ServiceBanner, ServiceNav, etc.
  shared/                  Reveal, PageLoader, PageHero, SectionHeading
  ui/                      shadcn-style primitives (Button, Accordion, Input...)

content/blog/              MDX files with frontmatter

lib/
  constants.ts             SITE info, NAV_LINKS, SERVICES
  metadata.ts              buildMetadata() helper
  utils.ts                 cn() helper
  blog.ts                  MDX read helpers
  bridges.ts               Image folder readers

public/
  brand/                   Logo, icon, world map
  services/                Section images
  about-bridges/           Slider images
  clients/                 Client logos
```

---

## 2. One-shot scaffold prompt

A prompt template that gets a new site from zero to "all routes return 200"
in one Claude session. Use this as your **first message** when starting a
new project — it includes all the decisions we made so you don't have to
re-litigate them.

```
Build a marketing website using:

- Next.js 14 (App Router), TypeScript strict
- Tailwind v3 (NOT v4 — config story isn't settled)
- shadcn-style primitives (Radix + cva, written into components/ui)
- lucide-react for icons
- react-hook-form + zod for forms
- next-mdx-remote ≥ v6 + gray-matter for blog (v5 has a Vercel security block)
- Inter + Plus Jakarta Sans via next/font/google
- Page loader, scroll-reveal, Vercel-ready

Brand:
- Primary: #XXXXXX with derived light/dark
- Accent: #XXXXXX
- Greys: Tailwind defaults (grey-900, grey-700, grey-500, grey-200, grey-100, grey-50)
- Ice (light blue): #DBEAFE for headings on dark backgrounds

Pages:
- Home (hero, trust bar, services overview, why us, how it works, testimonials, CTA banner)
- About (story, mission, values bordered-grid, team, accreditations)
- Services (overview + N detail pages)
- FAQ (Radix accordion)
- Contact (RHF + Zod form, contact info, map embed)
- Blog (MDX, index + [slug])

Patterns I want from day one:
- container-prose utility in globals.css: `mx-auto w-full max-w-7xl px-6 lg:px-8`
- buildMetadata() helper in lib/metadata.ts that takes title/description/path/keywords
- Reveal component (IntersectionObserver, no deps)
- PageLoader (logo splash on initial paint + on pathname change)
- Sticky navbar with logo left, links right, mega-menu for one entry
- Mobile menu via React portal (escape Navbar's backdrop-blur stacking context)
- SEO: per-page generateMetadata, JSON-LD on relevant pages, sitemap.ts, robots.ts

Use the exact copy in <attached content doc>. No Lorem ipsum.
Don't add features or abstractions I didn't ask for.

For the first commit, get every route building and returning 200. We'll
iterate on visual treatments after.
```

Attach your content doc and your brand color sheet. You'll have a working
site at the end of one session.

---

## 3. Design system

### 3.1 Tailwind theme

`tailwind.config.ts` — keep it short, define semantic colours, not
component-specific ones.

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0829A5",
          light:   "#1F49C9",
          dark:    "#04165C",
        },
        accent: {
          DEFAULT: "#3B82F6",
          dark:    "#2563EB",
        },
        grey: {
          50: "#F9FAFB", 100: "#F3F4F6", 200: "#E5E7EB", 300: "#D1D5DB",
          500: "#6B7280", 700: "#374151", 900: "#111827",
        },
        ice: "#DBEAFE", // headings on dark bg
      },
      fontFamily: {
        sans:    ["var(--font-inter)",   "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
```

### 3.2 `globals.css` — base layer + utility patterns

The pattern that bit us hardest: a base layer rule like
`h1, h2, h3 { color: theme(grey.900) }` overrides parent `text-white` on
dark sections because it applies directly to the element, not by
inheritance. **Fix:** use `color: inherit` in the base layer so headings
take their colour from the surrounding section.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-white text-grey-700 antialiased; }

  /* Headings only set the typeface — colour is inherited from the surrounding
     section so they read correctly on both light and dark backgrounds. */
  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
    color: inherit;
  }
}

@layer components {
  .container-prose {
    @apply mx-auto w-full max-w-7xl px-6 lg:px-8;
  }
}
```

### 3.3 Typography rhythm

| Element | Mobile | Tablet (sm) | Desktop (lg) |
|---|---|---|---|
| Hero H1 | `text-[1.75rem]` | `text-5xl` | `text-6xl`–`text-7xl` |
| Page hero H1 | `text-4xl` | `text-5xl` | — |
| Section H2 | `text-3xl` | `text-4xl` | — |
| Subhead body | `text-base` | `text-lg` | `text-xl` |
| Body | `text-[15px]`–`text-base` | — | `text-base` |

### 3.4 Spacing rhythm

| Container | Mobile | Tablet+ |
|---|---|---|
| Section vertical (`<section>`) | `py-14 sm:py-20` (or `py-16 sm:py-24` for hero-y sections) | |
| Card inner | `p-5 sm:p-8` for forms; `p-7`–`p-10` for content cards | |
| Grid gap | `gap-6` for cards; `gap-10 md:gap-12` for column layouts | |

**Watchout:** `py-20`/`py-24` without responsive variants creates
cavernous mobile pages. Always pair with a smaller mobile value.

---

## 4. Reusable building blocks

### 4.1 `buildMetadata` helper

Drives `generateMetadata` on every page. Returns the full Next 14
Metadata object with canonical URL, OG, Twitter, robots.

```ts
// lib/metadata.ts
import type { Metadata } from "next";
import { SITE } from "./constants";

export function buildMetadata({
  title, description, path = "/", keywords, ogImage = "/og-image.png",
}: {
  title: string; description: string; path?: string;
  keywords?: string[]; ogImage?: string;
}): Metadata {
  const url = `${SITE.url}${path}`;
  return {
    title, description, keywords,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE.name,
      type: "website", locale: "en_GB",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: { index: true, follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}
```

### 4.2 `Reveal` — scroll-triggered fade-up

No framer-motion. ~30 lines. Respects `prefers-reduced-motion`.

```tsx
// components/shared/Reveal.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";
const HIDDEN: Record<Direction, string> = {
  up: "translate-y-6", down: "-translate-y-6",
  left: "translate-x-6", right: "-translate-x-6", none: "",
};

export function Reveal({
  children, className, direction = "up", delay = 0, threshold = 0.12, once = true,
}: {
  children: React.ReactNode; className?: string; direction?: Direction;
  delay?: number; threshold?: number; once?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true); return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const id = window.setTimeout(() => setShown(true), delay);
        if (once) obs.disconnect();
        return () => window.clearTimeout(id);
      } else if (!once) setShown(false);
    }, { threshold, rootMargin: "0px 0px -10% 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, threshold, once]);

  return (
    <div ref={ref} className={cn(
      "transition-all duration-700 ease-out motion-reduce:transition-none",
      shown ? "translate-x-0 translate-y-0 opacity-100" : cn("opacity-0", HIDDEN[direction]),
      className,
    )}>{children}</div>
  );
}
```

Usage:

```tsx
<Reveal><SectionHeading title="..." /></Reveal>
<Reveal delay={120}><div>{cards}</div></Reveal>

// stagger:
{items.map((item, i) => <Reveal key={item.id} delay={i * 100}>...</Reveal>)}
```

### 4.3 `PageLoader` — branded splash

Shows on initial mount and on pathname change. Hooks `usePathname()` to
re-trigger. Z-index high enough to sit above everything.

Key idea: the loader is mounted permanently in the root layout. It tracks
pathname; whenever it changes, the component re-shows briefly and fades.

### 4.4 Mobile menu — **use a React portal**

The single most fragile thing in a Navbar. If your sticky navbar uses
`backdrop-blur` (or `transform`, `filter`, `perspective`), it creates a
**stacking context**. Any z-index on a child is local to that context.
Your `fixed inset-0 z-50` drawer will be trapped inside the Navbar's
stacking context and may render below other elements.

**Always render the mobile drawer via `createPortal(drawer, document.body)`.**

```tsx
{mounted && open && createPortal(drawer, document.body)}
```

And as a belt-and-braces guarantee, set an inline `backgroundColor` on
the drawer so even if Tailwind purges `bg-white` (it won't, but…), the
background still renders.

### 4.5 PageHero — interior page header

Dark gradient + world-map silhouette + dotted overlay. Reused on every
non-home page so visual identity stays consistent.

### 4.6 `ServiceStack` — sticky-replace scroll-stack

The one truly cinematic pattern in the site. Each card is `lg:sticky` at
the **same `top` offset**, wrapped in a `lg:min-h-screen lg:pb-16` row.
Result: as the user scrolls into the next row, the new card slides up
to cover the previous one. Cards never overlap mid-stack — each row is a
viewport tall so the user must fully scroll past one card before seeing
the next.

Make it **flag-controllable** with a `sticky?: boolean` prop so the same
component can render as a normal vertical stack on pages where stickiness
would be too much.

### 4.7 Auto-rotating image slider (`BridgeSlider`)

Crossfading slider that **discovers images from a folder at build time**
via `fs.readdirSync`. Drop new files into `public/about-bridges/` and they
get picked up on the next build with zero code changes.

```ts
// lib/bridges.ts
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "about-bridges");

export function getBridgeImages(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort()
    .map((f) => `/about-bridges/${f}`);
}
```

This works because all pages using these helpers are SSG — `fs` runs at
build time only.

### 4.8 Magnifier headline

Dual-layer H1: dim base + bright gradient revealed only inside a circular
mask that auto-roams across the heading. Driven by **`@property`-declared
custom properties** in CSS so the radial-gradient mask centre is
interpolatable. See `app/globals.css` `.magnifier-h1`.

### 4.9 ServiceNav (prev/next pair)

On detail pages, wraps around at the ends so the prev/next pair is always
shown. One-file component, derives prev/next from a constants array.

### 4.10 Flag marquee + client logo marquee

Same underlying CSS: a `flex w-max` row, content duplicated, animated
with `@keyframes scroll-x { from { translateX(0) } to { translateX(-50%) } }`.
For logos, render grayscale + low-opacity by default; full colour on hover.

---

## 5. Animation patterns

All patterns we used are **CSS-only**, respect `prefers-reduced-motion`,
and don't add any JS bundle weight beyond what Reveal already brings.

| Pattern | When to use | File |
|---|---|---|
| Fade-rise on scroll | Any section/card entering viewport | `Reveal` component |
| Staged entrance | Hero copy, CTAs, stats — sequential delays | `hero-rise` class |
| Word-by-word reveal | Strong impact, but often "too much" (we removed ours) | n/a — use sparingly |
| Magnifier mask sweep | Single hero headline | `.magnifier-h1` set |
| Gradient shimmer | Highlighted phrases | `magnifier-shimmer` keyframe |
| Sticky scroll-stack | Multi-card storytelling section | `ServiceStack` |
| Spotlight wash | Once-on-load brightening | `.hero-spotlight` |
| Logo splash loader | Initial paint + route transitions | `PageLoader` |
| Drifting blob orbs | Ambient hero background | `.hero-blob-*` |
| Topographic line flow | Subtle motion under content | `.hero-flow` |
| Floating chips | Decorative props at hero corners | `.hero-chip-*` |
| Marquee scroll | Logo/flag strip | `@keyframes scroll-x` |
| Crossfade slider | Hero image rotation | `BridgeSlider` |

**Stylistic rule:** stack effects sparingly. The hero alone has blobs,
grid, lines, world map, spotlight, magnifier, chips, plus a flag marquee.
That's the dramatic peak. Sections below should be quiet by comparison
or the whole page feels frantic.

---

## 6. Content & image patterns

### 6.1 Where content lives

| Content type | Lives in | Pattern |
|---|---|---|
| Site name, contact info, social URLs | `lib/constants.ts` `SITE` | TypeScript const |
| Navigation | `lib/constants.ts` `NAV_LINKS` | array of `{ href, label, children? }` |
| Service definitions | `lib/constants.ts` `SERVICES` | one object per service with `slug`, `title`, `summary`, `covers` |
| FAQs | `lib/faqs.ts` | array of `{ q, a }` |
| Blog posts | `content/blog/*.mdx` | Frontmatter with `title`, `excerpt`, `date`, `author`, `image` |
| Brand logos | `public/brand/` | `consulat-icon.png`, `consulat-logo.png` |
| Section images | `public/services/`, `public/about-bridges/` | Discovered at build time |
| Client logos | `public/clients/` | Listed in `TrustBar` |

### 6.2 Image handling

- **Always use `next/image`** — get free WebP conversion + responsive `srcset`
- **`priority` only on above-the-fold images** (the hero world map, the
  first service banner). Everything else lazy-loads.
- **Place large source files in `public/`** — they're optimised on demand
  at request time. The hero `world-map.jpg` is 712 KB on disk but Vercel
  serves ~80 KB WebP at 1920w.
- **For folder-discovery patterns**, add a helper in `lib/` that reads
  the folder at build time. New files get picked up on next deploy.

### 6.3 MDX blog

```ts
// lib/blog.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export function getAllPostSlugs(): string[] { /* readdir + filter */ }
export function getPostBySlug(slug: string): BlogPost | null { /* read + matter + readingTime */ }
export function getAllPosts(): BlogPost[] { /* sort by date desc */ }
```

Then in `app/blog/[slug]/page.tsx`:

```tsx
import { MDXRemote } from "next-mdx-remote/rsc"; // v6 — security-cleared

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}
```

---

## 7. SEO & metadata

The baseline that gets you to A+ in Lighthouse SEO and rich-results
eligibility:

- Per-page `export async function generateMetadata()` returning
  `buildMetadata({...})` — gives you `<title>`, `<meta description>`,
  canonical, OG, Twitter cards.
- **JSON-LD Schema** in the body of relevant pages:
  - `LocalBusiness` on the root layout (everywhere)
  - `Service` on each service detail page
  - `FAQPage` on the FAQ
  - `BlogPosting` on each blog post
- **`app/sitemap.ts`** generates `/sitemap.xml` automatically from the
  routes + blog slugs + service slugs.
- **`app/robots.ts`** generates `/robots.txt`.
- **`app/icon.png`** and **`app/apple-icon.png`** at the App Router root
  auto-generate `<link rel="icon">` and `<link rel="apple-touch-icon">`.

Don't use `next/head` in App Router. It's the Pages-Router pattern and
won't run in Server Components.

---

## 8. Mobile responsiveness checklist

Run through these before considering a build done:

- [ ] **No bare `py-20`/`py-24` on sections** — always pair with a smaller
      mobile variant: `py-14 sm:py-20`, `py-16 sm:py-24`
- [ ] **Hero H1 fits in ≤3 lines at 360px viewport** — use
      `text-[1.75rem]` mobile, scale up with breakpoints
- [ ] **`text-wrap: balance`** on hero H1 and subhead so the last line
      isn't an orphan word
- [ ] **All paired form inputs** wrap as `grid sm:grid-cols-2` (single
      column on mobile)
- [ ] **Buttons full-width on mobile** in hero CTA rows:
      `flex-col items-stretch sm:flex-row`
- [ ] **Card padding** uses `p-5 sm:p-8` (less on mobile)
- [ ] **Hero stats `grid-cols-3 gap-3 sm:gap-6`** — three short stats can
      coexist on 360px if you shrink the label to `text-[10px] sm:text-xs`
- [ ] **Marquee gaps** are smaller on mobile: `gap-6 sm:gap-10`
- [ ] **Mobile menu via portal** (see §4.4)
- [ ] **Decorative floating chips/blobs** hidden on mobile if they
      overflow content (`hidden lg:block`)

---

## 9. Deployment — Vercel specifics

### 9.1 Auto-detection

Vercel auto-detects Next.js. `vercel.json` is **not required**, but adding
a minimal one removes one variable when troubleshooting:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "next build",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### 9.2 Pin the Node version

In `package.json`:

```json
"engines": { "node": ">=18.17.0" }
```

Next 14's minimum. Stops Vercel from picking a Node version that breaks
during builds.

### 9.3 Watch out for these blockers

| Symptom | Fix |
|---|---|
| "Vulnerable version of `next-mdx-remote` detected" | Bump to ≥6.0.0 — v5 has a known security CVE that blocks deploys |
| Deploy succeeds but `*.vercel.app/` returns 404 | Production branch on Vercel still points to an old (empty) commit. Push a new commit to your production branch — Vercel won't redeploy unless it sees a new push |
| Production deployment is using SSH push but Vercel can't access | Switch `git remote set-url origin https://...` and run `gh auth setup-git` |
| Build worked locally but fails on Vercel | Likely a `process.env` reference that's `undefined` on Vercel. Check Project → Environment Variables |

### 9.4 What Vercel handles automatically

- Image optimisation (no config needed)
- Static asset CDN
- `sitemap.ts` and `robots.ts` are served at `/sitemap.xml` and `/robots.txt`
- `app/icon.png` and `app/apple-icon.png` get proper `<link rel>` tags
- Preview deployments per branch (URL like `*-git-branch-username.vercel.app`)
- Production deployment automatically aliased when you push to the
  production branch (default: `main`)

---

## 10. Git workflow

### 10.1 Branches

- `main` — production, what Vercel deploys
- `dev` — integration branch where I push from Claude Code sessions
- Open PR `dev → main` to promote

### 10.2 Common fixes

**Force-push `dev`'s tip to `main`** when `main` has a junk initial
commit (e.g. GitHub's "Create test.txt") and the two branches have no
common ancestor:

```bash
git checkout main
git reset --hard origin/dev
git push --force-with-lease origin main
git checkout dev
```

`--force-with-lease` aborts if anyone else pushed to main since your last
fetch. Safer than `--force`.

**Never commit `.claude/`** — Claude Code internals. Add to `.gitignore`:

```
# claude code internals
.claude/
```

---

## 11. Prompt patterns that worked

Patterns I noticed produced great results from Claude during this project.
Adapt them when working on the next site.

### 11.1 The kickoff prompt

Be exhaustive about stack and constraints up front. Don't make Claude
guess. See §2 for the full template.

```
Build [project] using [exact stack] with [exact patterns].
Use the attached content. No Lorem ipsum.
Don't add features I didn't ask for.
For the first commit, get every route building and returning 200.
We'll iterate on visuals after.
```

### 11.2 Iterative visual tweaks

Tight, specific corrections work best.

```
The mobile menu is transparent.
```
```
Remove the numbering and extra icons on the card.
I want the image I will add to fill the entire right side of the card.
```
```
For the services page that lists all services, let's treat it like the
services section on the home page.
```

### 11.3 Direction with metaphors

When you want a feel rather than a spec:

```
For the hero text, I want a colour-over effect like a search or
magnifier glass.
```
```
Let's add some animations to the website for each page. Simple Reveal
as the user scrolls through the page and a loading (maybe an animation
of the company logo).
```

### 11.4 The "this is broken" prompt

Give Claude what you see, not what you think the cause is. Let it
diagnose.

```
The deployment failed because of this:
Vulnerable version of next-mdx-remote detected (5.0.0).
Please update to version 6.0.0 or later.
```
```
Vercel returned 404 NOT_FOUND on consulatng.vercel.app/.
[paste the response headers]
```

### 11.5 The retune prompt

When something works but you want a different feel:

```
I would prefer that the slider on the about us page is automatically rotating.
```
```
Let's remove the sticky header section for the WHAT WE DO area and let
everything just flow with the scroll.
```

### 11.6 The constraint prompt

Limit what Claude is allowed to change so it doesn't drift.

```
I want the texts not to be more than 3 lines.
```
```
The image should fill the entire right side of the card.
```

### 11.7 The git/deploy prompt

Be explicit about destructive ops needing confirmation:

```
Help handle pushing the project to github branch dev.
```
```
Option A. [confirming a destructive operation the assistant proposed]
```

---

## 12. Hard-won lessons

Things that cost time in this project. Don't pay these prices again.

### 12.1 Tailwind v4 is not ready for client work

Tried, fell back to v3.4 immediately. The config story changed too much
between betas. Pick v3 until v4 stable lands and the ecosystem catches up.

### 12.2 Heading colors must `inherit`

The single biggest "wait, why?" moment of the build. Base layer rules on
`h1-h6` override parent `text-white`. Fix: `color: inherit` in the base
layer. Then explicit `text-grey-900` on each heading in light sections.

### 12.3 `backdrop-blur` creates a stacking context

This trapped the mobile menu drawer inside the Navbar. **Mobile drawers
should render via React portal to `document.body`** to escape parent
stacking contexts. Belt-and-braces: inline `backgroundColor` so the
drawer never appears transparent.

### 12.4 `.next` corruption when killing/restarting servers

Symptom: production server boots fine but every page returns 500 with
`Cannot find module './chunks/vendor-chunks/next.js'`. Cause: killing
`next build` mid-flight, or starting `next start` while a previous server
is still releasing its file handles on `.next/`.

Fix:
```bash
pkill -f next; sleep 2
rm -rf .next
npx next build
npx next start
```

### 12.5 `next-mdx-remote` v5 has a security CVE

Vercel will refuse to deploy with it. Use `^6.0.0`. API at
`next-mdx-remote/rsc` is identical between v5 and v6 for normal use.

### 12.6 `prefers-reduced-motion` is non-negotiable

Every animation pattern in this codebase has a media-query guard. Don't
skip this — it's an accessibility requirement and easy to forget.

### 12.7 Don't make Claude push to shared branches without confirmation

Even when authorized for one push, explicit confirmation for each
subsequent push catches surprises. The cost of asking is a few seconds;
the cost of an unwanted force-push is real.

### 12.8 Pick stable image formats

WebP is great. AVIF is fine. Skip exotic formats — Vercel will optimise
JPEG/PNG/WebP, and they render reliably everywhere.

### 12.9 SSG everything if you can

Every page in this site is `export const dynamic = "auto"` (the default,
which becomes static when there are no dynamic data sources). That means:
- Edge-CDN serving by default
- No cold starts
- Image discovery via `fs.readdirSync` works because builds run on the
  whole project tree
- Vercel free tier is enough

Don't reach for `revalidate`, `dynamic = "force-dynamic"`, or server
actions unless you actually need them.

### 12.10 Build the playbook as you go

You're reading it now. Future-you will thank present-you.

---

## Appendix: minimal site init checklist

```
☐ Scaffold: package.json, tsconfig.json, tailwind.config.ts, postcss.config.mjs, next.config.mjs
☐ globals.css with @tailwind layers + container-prose + h1-h6 inherit fix
☐ app/layout.tsx with fonts, JSON-LD, PageLoader, Navbar, Footer, WhatsAppWidget
☐ lib/constants.ts (SITE, NAV_LINKS, SERVICES)
☐ lib/metadata.ts (buildMetadata)
☐ lib/utils.ts (cn)
☐ components/ui primitives (Button, Accordion, Input, Label, Select, Textarea)
☐ components/shared (Reveal, PageLoader, PageHero, SectionHeading, JsonLd)
☐ components/layout (Navbar with portal-based MobileMenu, Footer, Logo)
☐ Pages: /, /about, /services + detail pages, /faq, /contact, /blog, /blog/[slug]
☐ app/sitemap.ts, app/robots.ts, app/icon.png, app/apple-icon.png, app/not-found.tsx
☐ vercel.json (optional, makes config explicit)
☐ Mobile responsive audit (§8 checklist)
☐ JSON-LD on relevant pages
☐ Smoke-test: all routes return 200
☐ Lighthouse: aim for 90+ on Performance and Accessibility
☐ Deploy to Vercel preview, then production
```

---

*Last updated: written during the consulatng.net build. Carry it forward.*
