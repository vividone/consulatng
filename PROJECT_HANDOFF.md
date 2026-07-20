# Consulat Website — Project Handoff

> **Before you delete the project folder, move this file somewhere safe.**
> Everything below is what you'd need to rebuild your mental model of the
> site months from now, and to hand it off to another developer without
> starting from scratch.

---

## 1. What this is

Marketing + lead-gen site for **Consulat Ltd.** — an immigration consulting
firm in Lagos, Nigeria. Serves multinationals and expatriates. Live domain:
**consulatng.net**.

- **Repo:** https://github.com/vividone/consulatng
- **Hosting:** Vercel (framework auto-detected as Next.js via [vercel.json](./vercel.json))
- **Primary user actions:** book a consultation (Google Calendar), submit the
  contact form (Resend), read service pages / blog articles.

---

## 2. Tech stack

- **Framework:** Next.js 14 App Router (`next: ^14.2.18`), TypeScript, React 18.
- **Styling:** Tailwind CSS 3 with a custom theme in [tailwind.config.ts](./tailwind.config.ts).
  Primary/accent colours, greys, `ice` for headings on dark, `display` font family.
- **UI primitives:** Radix (accordion, label, select, slot) + custom
  `Button` / `Input` / `Textarea` in `components/ui/`.
- **Forms:** `react-hook-form` + `zod` (`@hookform/resolvers`).
- **Content:** MDX blog posts under `content/blog/`, rendered with
  `next-mdx-remote` + `gray-matter`. Everything else is TypeScript data
  in `lib/`.
- **Icons:** `lucide-react`.
- **Email delivery:** Resend (`resend` SDK), server-side via a Next.js API route.
- **Analytics / third-party:** `@next/third-parties` present but not
  currently wired to a GA tag.
- **Unused but installed:** `cobe` (was used by the old `Globe.tsx` on the
  home page; the component still exists but isn't imported anywhere).

---

## 3. Local setup

Requires Node ≥ 18.17.0 (see `package.json` `engines`).

```bash
git clone https://github.com/vividone/consulatng.git
cd consulatng
npm install
cp .env.example .env.local   # then fill in the env vars — see §4
npm run dev                  # http://localhost:3000
```

Scripts (`package.json`):

| Command          | What it does                          |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Next.js dev server, hot reload        |
| `npm run build`  | Production build                      |
| `npm run start`  | Serve the production build            |
| `npm run lint`   | `next lint`                           |
| `npm run typecheck` | `tsc --noEmit`                     |

---

## 4. Environment variables

Documented in [.env.example](./.env.example). Only relevant to the contact
form. Without these, the contact form's `/api/contact` route returns 500
but the rest of the site works.

| Var              | Required | Purpose                                                              |
| ---------------- | -------- | -------------------------------------------------------------------- |
| `RESEND_API_KEY` | Yes      | Resend API key. Get one at https://resend.com/api-keys.              |
| `CONTACT_TO`     | No       | Where submissions arrive. Defaults to `SITE.email` (`info@consulatng.net`). |
| `CONTACT_FROM`   | No       | The "From" address. Defaults to Resend's sandbox `onboarding@resend.dev`, which can only deliver to the email that registered the account. **For production, verify `consulatng.net` in Resend and set** `CONTACT_FROM="Consulat Website <no-reply@consulatng.net>"`. |

On Vercel: add all three under **Project → Settings → Environment Variables**
for the Production environment (and Preview if you want previews to send too).

---

## 5. Directory map

```
app/                            # Next.js App Router — pages + API
├── layout.tsx                  # Site-wide layout, fonts, org JSON-LD
├── page.tsx                    # Home
├── about/page.tsx              # About + team grid
├── contact/page.tsx            # Contact info + form + map iframe
├── faq/page.tsx                # FAQ accordion
├── blog/                       # Blog index + [slug] MDX renderer
├── services/
│   ├── page.tsx                # Overview (uses ServiceStack)
│   ├── business-permit/page.tsx
│   ├── expatriate-quota/page.tsx
│   ├── e-cerpac/page.tsx
│   ├── e-visas/page.tsx
│   └── training/page.tsx       # Only service with a bespoke layout
├── api/
│   └── contact/route.ts        # POST → Resend
├── sitemap.ts                  # /sitemap.xml
├── robots.ts                   # /robots.txt
└── globals.css                 # Tailwind + hero animation keyframes

components/
├── home/                       # Hero, ServicesOverview, WhyConsulat, HowItWorks,
│                               #   Testimonials, WelcomeSection, CTABanner,
│                               #   FlagMarquee, CountUpStat, TrustBar, Globe (unused)
├── services/                   # ServiceStack (home + /services), ServiceBanner,
│                               #   ServiceItem, ServiceCoverGrid, ServiceCTA,
│                               #   ServiceNav
├── shared/                     # PageHero, SectionHeading, Reveal, TeamGrid,
│                               #   ContactForm, JsonLd, WorldMap, BridgeSlider,
│                               #   PageLoader, WhatsAppWidget
├── layout/                     # Navbar, Footer, MobileMenu, Logo
└── ui/                         # Button, Input, Label, Textarea, Select, Accordion

lib/
├── constants.ts                # SITE, NAV_LINKS, SERVICES, CALENDAR_URL
├── faqs.ts                     # FAQ Q&A list
├── metadata.ts                 # buildMetadata() helper (title, OG, canonical)
├── blog.ts                     # MDX loader (getAllPosts, getPost, formatDate)
├── bridges.ts                  # Bridge-image loader for About page slider
└── utils.ts                    # cn() = clsx + tailwind-merge

content/
└── blog/*.mdx                  # 3 posts: e-cerpac, visa-categories, expat-quota

public/
├── brand/                      # welcome.png, consulat-logo.png, consulat-icon.png, world-map.jpg
├── team/                       # 5 headshots keyed to lib/about
├── services/                   # {slug}.jpg (banner) + {slug}-cover.jpg (in-page)
├── about-bridges/              # slider photos for the About hero bridge section
├── clients/                    # placeholder client logos
├── images/blog/                # blog cover photos
└── downloads/                  # visa-requirements.pdf goes here (NOT YET SUPPLIED)
```

---

## 6. Where to change things

### 6.1 Site-wide identity (name, phone, email, hours, socials)

**[lib/constants.ts](./lib/constants.ts)** → `SITE` object. Address, both
phone numbers (`phone` + `phone2`), WhatsApp, hours, social links live here.
Almost every other file just reads from `SITE`.

### 6.2 Navigation

**[lib/constants.ts](./lib/constants.ts)** → `NAV_LINKS`. Services dropdown
is generated from the `children` array. Nav is rendered by
`components/layout/Navbar.tsx` (desktop) and `MobileMenu.tsx` (mobile portal).

### 6.3 Services

**[lib/constants.ts](./lib/constants.ts)** → `SERVICES` array. Each entry:
`slug`, `title`, `shortTitle`, `summary`, `covers[]`.

- The `SERVICES` list drives the **home services stack**, the **/services
  overview page**, and the **prev/next nav** at the bottom of each service
  page.
- Each service also has a **dedicated page** at `app/services/{slug}/page.tsx`
  where item-level content lives (the detailed description for each
  "What We Cover" card, plus SEO metadata).

**Order matters** — the "Training" service was added last so it appears last
in nav + prev/next loop.

### 6.4 Blog posts

Drop a new `.mdx` file into `content/blog/` with frontmatter:

```mdx
---
title: "Headline"
excerpt: "One-sentence blurb for the index card."
date: "2026-07-20"
author: "Consulat Team"
image: "/images/blog/some-cover.jpg"
---

Body in markdown / MDX.
```

The file's filename (minus `.mdx`) becomes the URL slug. The blog index
(`app/blog/page.tsx`) picks it up automatically via `lib/blog.ts`.

### 6.5 FAQs

**[lib/faqs.ts](./lib/faqs.ts)** — `FAQS` array of `{ q, a }`. Renders as
Radix accordion. Also emits FAQPage JSON-LD (`app/faq/page.tsx`).

### 6.6 Team members

**[app/about/page.tsx](./app/about/page.tsx)** → `TEAM` array of
`TeamMember`. Photos live in `public/team/`. Bios can be a string or a
string[] (paragraphs). The `TeamGrid` component handles the click-to-reveal
drawer with the full bio.

### 6.7 Testimonials

**[components/home/Testimonials.tsx](./components/home/Testimonials.tsx)** →
`TESTIMONIALS` array. Add more entries and the left/right arrows activate
themselves once the row starts overflowing.

### 6.8 Hero copy + entrance timing

**[components/home/Hero.tsx](./components/home/Hero.tsx)**:

- `HERO_TITLE` constant near the top drives the animated H1.
- `HERO_BREAK_AFTER = 3` forces a `<br>` after the 4th word (currently splits
  "Your trusted partner for" / "immigration & work permits in Nigeria").
- `TITLE_BASE_DELAY_MS`, `TITLE_STAGGER_MS`, etc. control entrance timing.
- Word gradient + shimmer CSS lives in `app/globals.css` under
  `.hero-title` / `.hero-word` / `@keyframes hero-title-shimmer` etc.

### 6.9 Contact form

**Form UI:** [components/shared/ContactForm.tsx](./components/shared/ContactForm.tsx).
Zod schema at top of file. Fields, validation, dial-code list, submit handler.

**Delivery:** [app/api/contact/route.ts](./app/api/contact/route.ts). Same zod
schema (server-side re-validation), Resend send, plain-text + HTML bodies,
`replyTo` = submitter so replies go to them.

### 6.10 "Book a Consultation" CTA

Every button labelled "Book a Consultation" (Navbar, MobileMenu, Hero,
CTABanner, ServiceCTA, and the contact page's "Book a Call →" card) opens
**[CALENDAR_URL](./lib/constants.ts) in a new tab**. Change that one
constant to update every CTA sitewide.

### 6.11 Design tokens

**[tailwind.config.ts](./tailwind.config.ts)**:

- `primary` #0829A5, `primary-light` #1F49C9, `primary-dark` #04165C
- `accent` #3B82F6, `accent-dark` #2563EB
- `ice` #DBEAFE (used for headings on primary-dark backgrounds)
- Custom greys (50, 100, 200, 300, 500, 700, 900)
- Fonts: `Inter` (`--font-inter`, body) + `Plus Jakarta Sans` (`--font-jakarta`, display)
- `container-prose` utility = centered container with 1.5rem padding

Site-specific animations (blobs, spotlight, dot-grid drift, word rise,
gradient shimmer, count-up) live in `app/globals.css`.

---

## 7. Third-party services

| Service         | Used for                          | Where wired               |
| --------------- | --------------------------------- | ------------------------- |
| Resend          | Contact form → email              | `app/api/contact/route.ts`, `.env.local` |
| Google Calendar | "Book a Consultation" CTA         | `CALENDAR_URL` in `lib/constants.ts` — https://calendar.app.google/SpQcgjw5VWJTxdqo9 |
| Google Maps     | Contact page map iframe           | Auto-geocodes the `SITE.address` string; no API key needed |
| Vercel          | Hosting + CI                      | `vercel.json` declares framework |
| GitHub          | Source                            | `vividone/consulatng`    |
| WhatsApp        | Chat CTA                          | `SITE.whatsappHref`, floating widget = `components/shared/WhatsAppWidget.tsx` |

---

## 8. Placeholder assets to replace

These files exist but are placeholders / duplicates. Replace with real
files at the same paths and they auto-update site-wide.

| File                                      | What it is                              | Status                                    |
| ----------------------------------------- | --------------------------------------- | ----------------------------------------- |
| `public/services/business-permit-cover.jpg` | Additional in-page image, BP service   | Currently a copy of the banner            |
| `public/services/expatriate-quota-cover.jpg` | Additional in-page image, Quota service | Currently a copy of the banner            |
| `public/services/e-cerpac-cover.jpg`      | Additional in-page image, e-CERPAC     | Client supplied CERPAC card photo; save here |
| `public/services/e-visas-cover.jpg`       | Additional in-page image, e-Visas      | Currently a copy of the banner            |
| `public/services/training-cover.jpg`      | Additional in-page image, Training     | Client supplied classroom photo; save here |
| `public/brand/welcome.png`                | Home welcome-section illustration       | Client supplied reception photo; save here |
| `public/downloads/visa-requirements.pdf`  | Download-requirements PDF link         | NOT SUPPLIED — button currently commented out in `WelcomeSection.tsx` |
| `public/clients/*`                        | Client accreditation logos             | Placeholder dashed boxes on the About page — client to supply |

Aspect ratios currently used in service pages: `aspect-[4/3]` (landscape)
in `ServiceCoverGrid` and the training-intro image slot.

---

## 9. Deployment

Vercel auto-detects Next.js from `vercel.json`. To ship:

1. Push to `main` (Vercel deploys via GitHub integration).
2. Ensure `RESEND_API_KEY` (+ optional `CONTACT_TO` / `CONTACT_FROM`) are
   set for **Production** in Project Settings → Environment Variables.
3. For sending from `@consulatng.net`, verify the domain in Resend
   (Resend → Domains → Add). This requires adding DNS records at whoever
   controls consulatng.net. Once verified, set `CONTACT_FROM` to a
   consulatng.net address; until then it falls back to Resend's sandbox
   which can only deliver to the account owner.
4. Custom domain: point `consulatng.net` at Vercel per Vercel's DNS docs.

Local prod smoke test: `npm run build && npm run start`.

---

## 10. Feature / decision history

Chronological summary of client-driven changes. Useful when you're trying
to remember why a specific thing looks the way it does.

### Round 1 — Team page (May 2026)

- Added 4 new team members (Lynn Odibeli, Fezi Eniekebi, Emmanuella Edoho,
  Faith Bassey) alongside Michael Odibeli.
- Rebuilt the team grid as `TeamGrid` client component: **smaller cards,
  click to open a bio drawer** (bottom sheet on mobile, right side-drawer
  on desktop, ESC + backdrop click to close, body scroll locked while open).
- Because there were exactly 5 members, grid uses explicit column-placement:
  top row of 3, bottom row of 2 centered (see `placementFor` in
  [TeamGrid.tsx](./components/shared/TeamGrid.tsx)).
- Michael's bio was later shortened per client copy.

### Round 2 — Client feedback pass (May 2026)

Applied client's tracked-changes .docx files from `consulat-team/` and
`feedback/`:

- Shortened Michael's bio; added specific project references (NLNG, EGINA,
  LADOL, Bonny Island…).
- Contact page subtitle gained "for an ongoing or future project".
- **e-CERPAC blog** rewritten: "e-CERPAC" terminology, January-2026
  Embassy-based biometrics, in/out-country renewal split, QR-coded card
  replacing physical cards.
- **Visa Categories blog** trimmed: removed Tourist Visa, Visa-on-Arrival,
  "How to Choose" table and "Documentation" section. Kept Business Visa /
  TWP / STR only. Fixed TWP: "without possible extensions".
- Services text (`lib/constants.ts` + individual service pages):
  - Business Permit page subtitle → "You can own a Nigerian Business 100%…"
  - Expat Quota → new summary + expanded Monthly Returns + full Deletion
    Returns paragraph mentioning the Comptroller General.
  - e-CERPAC → new summary + intro paragraph about QR-coded card + new
    **"Benefits of Nigerian Residency"** section (6 bullets).
- Added a fifth service: **Training** (dedicated page with 3-pillar
  "What makes it different?" section, Ear / Sparkles / HeartHandshake icons).

### Round 3 — FAQ + "e-" prefix sweep

- FAQ CERPAC definition rewritten to include "mandatory", NIS issuance,
  proof of lawful residence, presented on demand, and QR-coded machine-readable
  e-CERPAC.
- Site-wide `CERPAC` → `e-CERPAC` — kept `(CERPAC)` in parenthetical
  acronym expansions (matches the source doc), but every product reference
  in prose, keywords, testimonials, hero chip label, and blog headings uses
  `e-CERPAC`. Blog file also normalised from `E-CERPAC` (uppercase E) to
  `e-CERPAC` (lowercase e) for site consistency.

### Round 4 — Hero animation rework

- Removed the **magnifier lens** (`.magnifier-h1/base/bright/lens` +
  `@keyframes magnifier-roam/shimmer`) — replaced with **word-by-word
  stagger reveal + continuous gradient shimmer**. Each word is an
  `inline-block` with the gradient applied to it (not the parent — CSS
  `background-clip: text` doesn't paint through inline-block descendants,
  so each word owns its clip).
- Removed the SVG topographic-line accent at the bottom of the hero.
- Hero title forced to 2 lines via `HERO_BREAK_AFTER = 3` constant.
- Line-height and `pb-2` tweaks to prevent gradient text clipping
  descenders (`g`, `p`, `y`).

### Round 5 — Home page polish

- Welcome section image now `w-full h-auto` (was capped at `max-w-sm` +
  `aspect-square`, which cropped the illustration into a small square).
- Testimonials became a snap-scrolling client component with left/right
  arrows — arrows hide themselves when everything fits (currently shows 3
  cards on desktop, so arrows only appear once ≥ 4 testimonials).

### Round 6 — Structural additions

- **Additional image** slot on service pages (`ServiceCoverGrid` — items
  in a 2-col grid + sticky image column on lg+, stacks on mobile).
  Currently uses `aspect-[4/3]` landscape frames.
- **"Book a Consultation" → Google Calendar** sitewide — every occurrence
  now opens `CALENDAR_URL` in a new tab. One constant, six touch points.
- **Contact form actually sends email** via Resend
  ([app/api/contact/route.ts](./app/api/contact/route.ts)). Zod-validated
  on both client and server. Errors surface as a red alert above the
  submit button.
- **Google Maps** iframe on contact page replaced the wide OpenStreetMap
  bbox — now auto-geocodes `SITE.address` and drops a pin.
- Added second phone number (`phone2: +2348026442090`) — shown as a
  second `tel:` link under the Phone entry on the contact page. Footer and
  CTABanner still show the primary only to keep them tight.

---

## 11. Known gotchas / non-obvious things

1. **`background-clip: text` + `inline-block` descendants** — the parent
   element's background does NOT paint through inline-block children. That's
   why `.hero-word` (not `.hero-title`) carries the gradient. Same rule
   applies if you ever add per-word effects elsewhere.
2. **`animation` shorthand + `animationDelay`** — the hero words set a
   single `animationDelay` inline, but the `animation` shorthand runs BOTH
   `hero-word-rise` (one-shot) and `hero-title-shimmer` (loop). The delay
   applies to both, which produces the pleasant staggered-shimmer effect —
   don't "fix" that by splitting the animations.
3. **Non-breaking spaces (` `) in source** — some earlier edits left
   NBSP characters where an ASCII space was expected. If a `sed`-style
   Edit fails with "String not found", check byte-for-byte for NBSP.
4. **Resend sandbox limitation** — with `CONTACT_FROM` unset, Resend uses
   `onboarding@resend.dev` which **only delivers to the address that
   registered the Resend account**. Test emails to anywhere else silently
   drop. Fix by verifying `consulatng.net` in Resend and setting `CONTACT_FROM`.
5. **Overflow-hidden on the hero section** clips anything that extends
   past the section's bounds. Descenders on the last line of the H1 were
   clipping until `pb-2 sm:pb-3` was added — retain that padding if you
   restyle the title.
6. **Service page image aspect ratio.** `ServiceCoverGrid` uses
   `aspect-[4/3]` because the client's supplied cover images are landscape.
   If you swap in portrait photos, change to `aspect-[4/5]` (or per-page).
7. **The `Globe.tsx` component in `components/home/` is unused.** The
   `cobe` dependency remains only because that component still lives in
   the tree. Safe to delete both if you're pruning.
8. **Download-requirements button on the home page is commented out**
   ([components/home/WelcomeSection.tsx](./components/home/WelcomeSection.tsx))
   because the PDF hasn't been supplied. The `Download` icon import is
   still present so it's easy to re-enable once the PDF exists.

---

## 12. Content sources (raw)

Not in git — kept locally in `consulat-team/` and `feedback/`:

- `consulat-team/` — DOCX bios and JPG photos for the 5 team members
  (extracted with macOS `textutil -convert txt`). Source of truth for
  team bios currently living in `app/about/page.tsx`.
- `feedback/` — Three amendment DOCX files from the client:
  1. `Consulat Service Amendment 1.docx` — Business Permit tagline, Expat
     Quota Deletion Returns text, e-CERPAC Benefits of Nigerian Residency.
  2. `Understanding e-cerpac.docx` — tracked-changes version of the blog
     post.
  3. `Visa Categories for Entering Nigeria.docx` — tracked-changes version
     of the visa blog (with strikethrough deletions).

**If you delete these local folders**, the current site copy still reflects
their edits — but future amendments will lose the source context. Consider
zipping and archiving `consulat-team/` and `feedback/` separately.

---

## 13. Outstanding items

Ordered by "will hurt if forgotten":

1. **Set up Resend production sender.** Verify `consulatng.net` in Resend,
   add the DNS records, set `CONTACT_FROM` on Vercel. Until this is done,
   the sandbox sender can't reach the client's inbox.
2. **Supply `visa-requirements.pdf`** at `public/downloads/` and uncomment
   the download button in `WelcomeSection.tsx`.
3. **Replace placeholder `-cover.jpg` files** for business-permit,
   expatriate-quota, and e-visas services with distinct in-page photos
   (currently duplicates of their banners).
4. **Verify Google Maps pin.** Contact page geocodes the address text
   directly. Check the pin lands on Garwood Court, not the nearest main
   road. If it drifts, swap to a coordinate-based OSM iframe or an
   embed URL from a Google Maps share link.
5. **Client accreditation logos** on the About page — currently 4 dashed
   placeholder boxes.
6. **Counter targets** on the hero stats (`Permits issued: 500+`,
   `Visas processed: 1200+`, `Countries served: 30+`) — marked
   TODO(client) in [Hero.tsx](./components/home/Hero.tsx), still awaiting
   confirmed real numbers.

---

## 14. If you want to prune before archiving

Safe deletions that shrink the folder:

- `node_modules/` — reproducible with `npm install`.
- `.next/` — build output, regenerated.
- `tsconfig.tsbuildinfo` — incremental build cache.
- `consulat-team/`, `feedback/` — source artefacts; zip separately if
  you want to keep them.
- `components/home/Globe.tsx` + `cobe` dep — unused (see gotcha 7).
- `PLAYBOOK.md`, `guide.md`, `content.md` — earlier working notes, not
  referenced by code.

Do NOT delete: `content/blog/`, `public/`, `lib/`, `app/`, `components/`,
`package.json`, `package-lock.json`, `tailwind.config.ts`, `next.config.mjs`,
`tsconfig.json`, `postcss.config.mjs`, `vercel.json`, `.env.example`.

---

**End of handoff.** Move this file out of the project folder before you
delete anything else — a copy on your Desktop or in Google Drive will save
you a lot of head-scratching next time the site needs a change.
