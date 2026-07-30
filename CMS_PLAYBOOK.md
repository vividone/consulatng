# Adding a CMS to a Static Next.js Site — Playbook

A working reference for retrofitting editable content onto a statically
generated Next.js marketing site, the way we scoped it for
**consulatng.net**. Written to be portable — the decision framework in
§1 is the part you actually reuse; §4 onward is the implementation.

> **Verify before reuse.** Every version number and price in this document
> was checked on **2026-07-29**. CMS platforms move fast and Payload in
> particular pins narrow Next.js ranges. Re-check §12 before you quote a
> client.

---

## Contents

- [1. Pick the CMS (decision framework)](#1-pick-the-cms-decision-framework)
- [2. Hosting topology](#2-hosting-topology)
- [3. DNS migration runbook](#3-dns-migration-runbook)
- [4. Headless WordPress — the build](#4-headless-wordpress--the-build)
- [5. Payload — the build](#5-payload--the-build)
- [6. Keystatic — the build](#6-keystatic--the-build)
- [7. SEO wiring](#7-seo-wiring)
- [8. Security hardening (headless WP)](#8-security-hardening-headless-wp)
- [9. Migration order](#9-migration-order)
- [10. Pre-launch checklist](#10-pre-launch-checklist)
- [11. Hard-won lessons](#11-hard-won-lessons)
- [12. Facts to re-verify](#12-facts-to-re-verify)

---

## 1. Pick the CMS (decision framework)

**Do this before writing any code.** The wrong choice here costs weeks.
The answer is driven almost entirely by two things the client already
has: their hosting, and who maintains the site after handoff.

### 1.1 Audit first — five questions

Answer these before you evaluate a single CMS:

| # | Question | How to find out | Why it decides things |
|---|---|---|---|
| 1 | What Next.js version is the site on? | `package.json` | Payload pins narrow ranges; WP and Keystatic don't care |
| 2 | What hosting does the client already pay for? | Ask; check DNS + SPF records | Shared cPanel = free WordPress home, useless for Node |
| 3 | Shared hosting or VPS with root? | `nslookup` the mail host, ask for WHM access | Shared kills self-hosted Node outright |
| 4 | Will editors accept a GitHub account? | Ask the actual editors, not the manager | Hard gate on Keystatic |
| 5 | Who maintains this in two years? | Ask | You → single-codebase (Payload). Client → WordPress |

### 1.2 The comparison

| Concern | Headless WordPress | Payload | Keystatic |
|---|---|---|---|
| Needs a Next.js upgrade | **No** | **Yes** — narrow pinned ranges | No |
| Database | MySQL (cPanel has it) | Postgres/Mongo/SQLite — **no MySQL** | None |
| Added infra cost | £0 if cPanel exists | DB + blob storage | £0 |
| Editor familiarity | **High** | Medium (good UI, new) | Medium |
| Editor accounts | Built-in roles | Built-in roles | **GitHub account + repo write** |
| Per-field permissions | Yes | Yes | **No** |
| Publish latency | Instant + revalidate | Instant + revalidate | **1–3 min (git commit → rebuild)** |
| Type safety | Hand-rolled (Zod) | **Generated** | Generated from config |
| Systems to maintain | **Two (PHP + Node)** | One | One |
| Content in version control | No | No | **Yes** |

### 1.3 Decision tree

```
Client already on shared cPanel/PHP hosting?
├─ Yes → Client's team maintains it long-term?
│        ├─ Yes → HEADLESS WORDPRESS  (§4)
│        └─ No  → still usually WORDPRESS; Payload only if you
│                 can fund the Next upgrade + DB + blob store
└─ No  → Editors are 1–2 people who'll accept GitHub accounts?
         ├─ Yes → KEYSTATIC  (§6)   ← cheapest, no infra
         └─ No  → PAYLOAD    (§5)
```

**The trap to avoid:** picking Payload because it's the nicest developer
experience, then discovering the client's hosting can't run it and their
database is the one flavour it doesn't support. Audit, then choose.

### 1.4 What none of them save you

The bulk of the work is **the same regardless of CMS**: extracting
hardcoded content out of components into a schema, then rewiring the
components to read from it. On consulatng.net that meant ~20 `const`
arrays across `lib/constants.ts`, `lib/faqs.ts`, five bespoke service
pages, and six home-page sections.

Budget the refactor separately from the CMS integration. The CMS choice
changes the *plumbing*, not the extraction.

---

## 2. Hosting topology

### 2.1 Split by role, not by half-the-app-each

Clients say "I already have hosting, can we use it?" The answer is
usually "for some of it." Assign each concern to the platform that's
actually good at it:

| Concern | Where | Notes |
|---|---|---|
| Next.js frontend | **Vercel** | Pro plan required for commercial sites |
| WordPress admin (headless) | **cPanel subdomain** | `cms.example.com`, PHP + MySQL — what cPanel is for |
| Payload admin | **Vercel** | Can't be split from the frontend; it's routes in the same app |
| Postgres (if Payload) | **Neon via Vercel Marketplace** | `vercel install neon` |
| Media | WP library, or Vercel Blob / Cloudflare R2 | R2 has no egress fees |
| Transactional email | **Resend** | Needs its own DNS records — see §3.4 |
| Client mailboxes | **cPanel** ✅ | Real ongoing value. Never migrate this casually |
| DNS + WAF | **Cloudflare** | Free tier is enough |

### 2.2 Shared cPanel cannot run Next.js + a Node CMS

Don't try. cPanel's "Setup Node.js App" runs under Phusion Passenger
with CloudLinux LVE memory caps (commonly 512MB–1GB):

- `next build` with a CMS admin bundle will OOM
- Passenger idles and restarts processes → breaks ISR, unpredictable cold starts
- Node versions lag behind what modern CMSs require

**Identify shared hosting from DNS.** If the mail host resolves into a
known shared-hosting range and SPF includes a reseller domain, it's
shared. Example from consulatng.net:

```
mail.consulatng.net → 192.185.105.197
SPF: "v=spf1 a mx include:websitewelcome.com ~all"
```

`192.185.x` + `websitewelcome.com` = HostGator shared. Settled the
question without asking for credentials.

### 2.3 The VPS exception

If they have **root/WHM on a VPS or dedicated box**, self-hosting the
whole stack becomes viable: Node 20+, local PostgreSQL, PM2 behind
nginx/Apache, certbot for TLS. One platform, no monthly DB bill.

Trade-off: you own security patching, backups, uptime, and restarts —
and you lose preview deployments, edge caching, and CI. **For a client
with no in-house sysadmin, still choose Vercel + managed DB.**

### 2.4 Serverless connection pooling — the silent killer

Every serverless invocation can open its own DB connection. Postgres has
a hard cap. Works perfectly in testing, dies under real traffic.

- **Neon:** use the connection string with `-pooler` in the hostname
- **Supabase:** use the pooler on port `6543`, not `5432`

CMS docs generally don't cover this. It's on you.

### 2.5 Co-locate the database with your functions

Put the DB in the region nearest your **functions**, not your users —
public pages are CDN-cached anyway, but the admin panel makes many
sequential queries and latency compounds.

For West African editors: Vercel `fra1` (Frankfurt) + Neon
`eu-central-1`. Default `iad1` (US East) adds ~60–80ms per query to
every admin interaction. Neon has no African region.

---

## 3. DNS migration runbook

The single highest-risk step. Getting it wrong takes down the client's
**email**, which they will notice faster than any website problem.

### 3.1 Before touching anything

**Export the full DNS zone from cPanel.** Zone Editor → export, or
screenshot every record. You cannot recover what you didn't record.

### 3.2 What to change vs. what to leave

| Record | Action |
|---|---|
| `A` / `CNAME` (apex, `www`) | **Change** → point at Vercel |
| `MX` | **LEAVE** — points at the mail host |
| `TXT` (SPF) | Leave, then amend for new senders (§3.4) |
| DKIM `CNAME`/`TXT` | **LEAVE** |
| `A` for the mail host (`mail.`) | **LEAVE**, and keep it **unproxied** |

**Cloudflare proxy on a mail hostname breaks SMTP.** The proxy only
handles HTTP/HTTPS; orange-clouding `mail.example.com` makes it resolve
to Cloudflare IPs and mail delivery fails. Grey cloud, always.

### 3.3 Verify after cutover

```bash
nslookup -type=NS  example.com          # expect the new nameservers
nslookup -type=MX  example.com          # must be unchanged
nslookup -type=A   mail.example.com     # must be a real origin IP, not Cloudflare
nslookup -type=TXT example.com          # SPF still present
nslookup -type=TXT _dmarc.example.com   # see §3.4
curl -sI https://example.com | head -15
curl -sI https://www.example.com | head -15
```

Reading `curl -sI` output:

- `Server: Vercel` + `X-Vercel-Cache: HIT` → direct to Vercel, unproxied ✅
- `Server: cloudflare` + `cf-cache-status:` → **proxied** (see §3.5)
- `x-vercel-id:` present alongside `Server: cloudflare` → proxied, Vercel origin

### 3.4 Fix the three things nobody sets up

**DMARC is almost always missing.** Start in monitor mode:

```
_dmarc  TXT  "v=DMARC1; p=none; rua=mailto:admin@example.com"
```

Without it the domain is trivially spoofable and Gmail/Outlook
increasingly penalise its absence.

**New senders need SPF + DKIM.** If the contact form sends via Resend
(or Postmark/SendGrid) from `@example.com`, the domain must authorize it
— otherwise every form submission fails SPF and lands in spam. Verify
the domain in the provider dashboard and add its records.

**Stale SPF mechanisms.** A pre-existing `v=spf1 a mx include:host ~all`
uses `a`, which authorizes the *apex A record's* IP. Once the apex points
at Vercel, `a` authorizes Vercel's IPs to send mail — meaningless. Drop
`a`, keep `mx` and the provider `include`.

### 3.5 Proxy or not? It depends on the hostname

| Hostname | Cloudflare proxy | Why |
|---|---|---|
| Apex + `www` (→ Vercel) | **Grey cloud (off)** | See the cache trap below |
| `cms.` (→ WordPress) | **Orange cloud (on)** | You *want* the WAF here (§8) |
| `mail.` | **Grey cloud (off)** | Proxy breaks SMTP |

**The cache trap:** proxying Cloudflare in front of Vercel stacks two
CDNs. Your revalidation hooks purge Vercel's cache but **not**
Cloudflare's, so editors publish and still see stale pages. You will
lose a day debugging "`revalidatePath` doesn't work."

Fix: grey-cloud the Vercel hostnames. If the client insists on the
proxy, set SSL/TLS to **Full (strict)** and add a Cloudflare cache purge
call to your revalidation handler.

Also keep apex and `www` **consistent**. Finding one proxied and the
other not is a common half-finished migration.

---

## 4. Headless WordPress — the build

The default choice when the client is already on PHP hosting.

### 4.1 Custom fields: use Secure Custom Fields, not ACF Pro

ACF gates the fields you actually need behind Pro ($49/yr for 1 site,
$149 for 10): **Repeater, Flexible Content, Options Pages, Gallery**.

**Secure Custom Fields (SCF)** is the WordPress.org fork of ACF and
includes all four **free**. Same field API (`get_field`, `have_rows`), so
ACF tutorials still apply.

| | ACF free | ACF Pro | SCF |
|---|---|---|---|
| Text/Textarea/Select/Image/Group/Post Object | ✅ | ✅ | ✅ |
| Repeater, Flexible Content, Options Page, Gallery | ❌ | ✅ | **✅** |
| Price | Free | $49+/yr | **Free** |

Caveats: SCF **deactivates ACF on install**; smaller ecosystem so fewer
Stack Overflow answers; and see §4.2 — it forces the REST API.

**If you can't use SCF either**, two free fallbacks:

- Plain `string[]` lists (`covers`, `eligibility`) need no repeater at
  all — one Textarea, split on newlines.
- Repeating *objects* become CPTs, linked to their page via ACF free's
  Post Object field, ordered by `menu_order` (drag-drop via the free
  Simple Page Ordering plugin). In a headless setup this is arguably
  better: each item is independently queryable.

### 4.2 REST vs WPGraphQL — SCF forces the choice

**`wpgraphql-acf` supports ACF only, not SCF or any fork.** So:

| | Use |
|---|---|
| SCF (free) | **WP REST API** (`/wp-json/wp/v2/`) |
| ACF free/Pro | Either; WPGraphQL if you want codegen |

REST has a compensating advantage: **Yoast SEO adds `yoast_head_json` to
REST responses automatically**, no bridge plugin. On the GraphQL path
you'd need `wp-graphql-yoast-seo`.

You lose generated types — recover them with **Zod at the fetch
boundary** (§4.5). Most Next marketing sites already have `zod` for form
validation.

### 4.3 What needs no custom fields at all

**The blog.** WP core covers title, excerpt, date, author, featured
image, and body natively. Typical MDX frontmatter maps 1:1 with zero
configuration. Do the blog first — it's the fastest visible win.

### 4.4 Content model — the mapping pattern

| Hardcoded shape | WordPress |
|---|---|
| Site-wide constants (`SITE`, URLs, phone, address) | **SCF Options Page** |
| Array of `{q, a}` (FAQs) | **CPT** — title = question, editor = answer |
| Array of objects (testimonials, team, clients) | **CPT** each |
| MDX blog | **Core posts** |
| Bespoke page copy | **Page** + SCF field group of fixed named fields |

**Keep slugs and nav in code.** Route slugs map to real filesystem paths
under `app/`. If an editor renames one, the route 404s. Let code own
routing; let the CMS own copy, fetched *by* slug.

**Keep layout in JSX.** Give editors named fields, not a block builder.
A block builder means rebuilding every bespoke layout as blocks and hands
editors enough rope to wreck the design. Fixed fields can't break it.

Worked example — one service page:

| SCF field | Type | Replaces |
|---|---|---|
| `hero_subtitle` | Textarea | `<PageHero subtitle>` |
| `intro_paragraphs` | Repeater → Textarea | hardcoded `<p>` block |
| `what_we_handle` | Repeater → title + description | `const ITEMS` |
| `eligibility` | Repeater → text | `const ELIGIBILITY` |
| `cta_heading` / `cta_body` | Text / Textarea | `<ServiceCTA>` props |
| `banner_image` / `cover_image` | Image | hardcoded `/services/*.jpg` |
| `schema_description` | Textarea | JSON-LD `description` |
| SEO title/description | Yoast | `buildMetadata()` args |

### 4.5 The fetch layer — one module, Zod-validated

Everything that talks to WordPress lives in `lib/wp.ts`. Nothing else
imports `WP_API_URL`.

```ts
import { z } from "zod";

const WP = process.env.WP_API_URL!; // https://cms.example.com/wp-json

const ServiceFields = z.object({
  hero_subtitle: z.string(),
  intro_paragraphs: z.array(z.object({ text: z.string() })).default([]),
  what_we_handle: z
    .array(z.object({ title: z.string(), description: z.string() }))
    .default([]),
  eligibility: z.array(z.object({ item: z.string() })).default([]),
});

export async function getServicePage(slug: string) {
  const res = await fetch(`${WP}/wp/v2/pages?slug=${slug}&_embed`, {
    next: { tags: [`service:${slug}`] },
  });
  if (!res.ok) throw new Error(`WP ${res.status} for ${slug}`);
  const [page] = await res.json();
  return ServiceFields.parse(page.acf); // validated + typed
}
```

Two things doing real work here:

- **`.parse()`** turns "editor deleted a field group" into a build-time
  error instead of `undefined` rendering as blank in production.
- **`next: { tags }`** is what makes targeted revalidation possible.
  Without tags you can only revalidate by path.

**Preserve existing function signatures.** If content already comes from
a module like `lib/blog.ts` exporting `getAllPosts` / `getPostBySlug` /
`getAllPostSlugs`, keep those exports identical and swap only the
internals. Pages, `generateStaticParams`, and `sitemap.ts` then need no
changes — the swap touches one file.

### 4.6 MDX → HTML is a real change

WordPress returns rendered HTML, not MDX. `<MDXRemote source={...} />`
becomes sanitized `dangerouslySetInnerHTML`. A Tailwind
`prose prose-lg` wrapper styles it correctly, so it renders fine — but
**you lose React components inside post bodies.** If you need them back,
`html-react-parser` maps HTML nodes to components.

### 4.7 Revalidation

WP hook → Vercel route → `revalidateTag`. Both halves are required;
without this, statically generated pages serve stale content
indefinitely and Google indexes the old copy.

```php
// mu-plugins/headless-revalidate.php
add_action('save_post', function ($post_id) {
  if (wp_is_post_revision($post_id)) return;
  wp_remote_post(REVALIDATE_URL, [
    'blocking' => false,
    'body' => ['secret' => REVALIDATE_SECRET, 'slug' => get_post_field('post_name', $post_id)],
  ]);
});
add_action('acf/save_post', /* same */, 20);
```

Guard the Next route with a shared secret and return 401 otherwise.
Hook **both** `save_post` and `acf/save_post` — field-only edits don't
always fire `save_post`.

### 4.8 Other config

- Add the CMS hostname to `images.remotePatterns` in `next.config.mjs`
- Use an **Application Password** for authenticated draft-preview fetches
- Wire Next.js **draft mode** to preview unpublished posts
- Hide irrelevant admin menus (themes, comments, appearance) — budget an
  afternoon for a clean editor experience

### 4.9 Honest downsides

- **Two systems forever**: WP core, plugins, and PHP updates on top of the Next app
- **Shared hosting downtime breaks builds.** ISR keeps the live site up, so it's an annoyance not an outage — but it will happen
- **No generated types** (mitigated by Zod)
- **Plugin supply chain.** ACF is owned by WP Engine and its wordpress.org distribution was contested in the 2024 Automattic dispute — which is why SCF exists

---

## 5. Payload — the build

Choose when you want one TypeScript codebase with generated types, and
can fund the prerequisites.

### 5.1 Blockers to clear first

**Next.js version.** Payload installs *into* your Next app and pins
narrow ranges — as of 2026-07-29: `15.2.9–15.2.x`, `15.3.9–15.3.x`,
`15.4.11–15.4.x`, or `16.2.6+`. Node 20.9+. Not all releases within a
major are compatible.

Coming from Next 14 this is a **real migration**, not a version bump:
async `params`/`searchParams`, React 18 → 19, caching default changes,
and peer deps across Radix/lucide. **Ship it standalone and verify
before touching Payload.**

**Database.** Official adapters: **MongoDB, Postgres, SQLite**. There is
**no MySQL/MariaDB adapter** — which rules out cPanel's database. SQLite
is not viable on serverless (ephemeral FS).

Even if MySQL were supported, cPanel Remote MySQL needs IP whitelisting
and serverless egress IPs are dynamic — you'd end up whitelisting `%`,
which is an open client database.

**Media.** Serverless filesystems are read-only. Requires
`@payloadcms/storage-vercel-blob` or `@payloadcms/storage-s3`.

**You cannot split admin from frontend.** In Payload 3+ the admin *is*
routes inside your Next app, sharing one config and one database.
"Admin on cPanel, site on Vercel" is not a thing.

### 5.2 Provisioning the database

**Vercel Postgres no longer exists** — discontinued, with existing
databases auto-migrated to Neon in December 2024. Provision through the
Vercel Marketplace instead:

```bash
vercel install neon      # or: vercel install supabase
```

Installs the integration, attaches it to the linked project, **injects
credentials as env vars**, and pulls them into `.env.local`. Bills on the
Vercel invoice — one line item for the client instead of a second
account. Then apply §2.4 (pooling) and §2.5 (region).

### 5.3 Install

```bash
npx create-payload-app@latest --use-npm   # inside the existing repo
npm i @payloadcms/db-postgres @payloadcms/richtext-lexical \
      @payloadcms/plugin-seo @payloadcms/plugin-redirects
```

```js
// next.config.mjs
import { withPayload } from "@payloadcms/next/withPayload";
export default withPayload(nextConfig);
```

Adds `app/(payload)/admin/...` and `payload.config.ts`.

### 5.4 Model it the same way as §4.4

- Blog, FAQs, testimonials, team → **collections**
- Site settings, home, about, each bespoke page → **globals with fixed,
  named fields**

Same reasoning: no block builder, layout stays in JSX. Keep existing
module signatures and swap internals (§4.5).

Add `afterChange` hooks calling `revalidatePath`/`revalidateTag`, and
wire `?draft=true` preview — Payload gives you drafts and versions free.

---

## 6. Keystatic — the build

Cheapest option: no database, no media bucket, no Next upgrade, content
committed to git as MDX/JSON. Works on Next 14 App Router.

```bash
npm i @keystatic/core @keystatic/next @markdoc/markdoc
```

Create `keystatic.config.ts` plus routes at `app/keystatic/[[...params]]`
and `app/api/keystatic/[...params]`. **Collections** for the blog,
**singletons** for one-off pages with fixed fields (same model as §4.4).

**Its killer feature for a git-backed MDX blog:** Keystatic writes the
same files your existing `fs` + `gray-matter` reader already parses.
Point a collection at `content/blog/` with a matching schema and the
reader keeps working untouched.

### 6.1 The hard gate

**Every editor needs a GitHub account with `write` access to the repo.**
No invite-by-email, no separate user table — access control *is* GitHub
collaborator access. Ask the actual editors before proposing it.

Consequences: write access is broad (they *could* touch code, though in
practice they only open `/keystatic`), and there are **no per-person
permissions** — you can't grant "blog only."

### 6.2 Other trade-offs

- **Publishing isn't instant.** Every save is a commit → rebuild.
  1–3 min lag, and it burns build minutes. Twenty copy tweaks = twenty deploys
- The GitHub-mode UI exposes a **branch dropdown**; configure
  commit-to-`main` to keep it simple
- **Pre-1.0** (`0.6.3` as of 2026-07-29) — actively developed, but the
  README still says experimental. Pin versions
- **Images commit into the repo** — fine at small scale; Keystatic Cloud
  if it grows

---

## 7. SEO wiring

Most static Next sites already have decent SEO. The job is usually
**moving control into the CMS**, then filling gaps — not starting over.

### 7.1 Audit what exists

Check for: per-page canonicals, OG/Twitter tags, `metadataBase`, a
`buildMetadata()` helper, `sitemap.ts`, `robots.ts`, and JSON-LD
(`Organization`/`LocalBusiness`, `Service`, `BlogPosting`, `FAQPage`).

### 7.2 Verify the OG image actually exists

```bash
grep -rn "og-image\|ogImage" lib/ app/
find public -maxdepth 1 -type f
```

**A default OG image path that 404s is the most common SEO bug in these
codebases** — every page references it, nothing errors at build, and
every link the client shares renders with no preview. It cost
consulatng.net every social preview sitewide.

Better: generate them per-page with `next/og`'s `ImageResponse` at
`app/blog/[slug]/opengraph-image.tsx`, pulling title from the CMS.

### 7.3 Editor-managed metadata

| CMS | Tool | Gives editors |
|---|---|---|
| WordPress | Yoast (`yoast_head_json` in REST) | SERP preview, char counts, readability |
| Payload | `@payloadcms/plugin-seo` | SERP preview, char counts, `generateTitle`/`Description`/`Image` |

Feed the result into the existing `buildMetadata()` — keep its
signature, pass CMS values in, fall back to current hardcoded strings.
`generateMetadata` becomes `async`.

**Keep `sitemap.ts` and `robots.ts` in Next.** Don't use Yoast's sitemap
— the public site isn't WordPress.

### 7.4 Fix `lastModified`

```ts
// ✗ every URL claims to change on every deploy — Google learns to ignore it
lastModified: new Date()

// ✓ the document's real modified date from the CMS
lastModified: new Date(page.modified)
```

### 7.5 Gaps worth closing

- **Redirects**, editor-managed. Restructuring content in a CMS almost
  always changes URLs, and unmanaged 404s bleed ranking.
  `@payloadcms/plugin-redirects`, or a WP CPT consumed in `middleware.ts`
- **`dateModified`** on `BlogPosting` — freshness is a ranking input and
  `datePublished` alone is the common omission
- **`BreadcrumbList`** on nested pages
- **`noindex` toggle** per page, and `robots: { index: false }` on
  draft/preview routes so previews aren't indexed as duplicates
- **Required `alt` text** on the media collection (`required: true`) —
  image SEO and accessibility in one constraint
- **Revalidation** is an SEO requirement, not just UX: without it Google
  indexes stale copy after the client has published new copy

---

## 8. Security hardening (headless WP)

WordPress is the most-attacked software on the internet and you're
putting it on shared hosting. Manageable, but you must actually do it.

| Control | Why |
|---|---|
| **Proxy `cms.` through Cloudflare** (orange cloud) | WAF, bot protection, rate limiting on `/wp-login.php`. The one place you *want* the proxy |
| **Cloudflare Access on `/wp-admin`** | Zero Trust, free ≤50 users. Email-gated login in front of WP entirely |
| **`X-Robots-Tag: noindex` on the whole install** | Critical and easily forgotten — otherwise `cms.example.com` gets indexed and competes with the real site as duplicate content |
| Disable XML-RPC | Removes a brute-force and amplification vector |
| `define('DISALLOW_FILE_EDIT', true)` | No code editing from the dashboard |
| Auto-updates + enforced 2FA | Baseline |
| Application Password for preview fetches | Never the admin password |

---

## 9. Migration order

Sequenced so each phase ships something verifiable and nothing depends
on unfinished work.

| Phase | Work | Depends on |
|---|---|---|
| **0** | Standalone fixes: missing OG image, DMARC, sender SPF/DKIM, grey-cloud the apex | — |
| **1** | *(Payload only)* Next + React upgrade — ship and verify alone | — |
| **2** | CMS install + hardening (§8) | 1 |
| **3** | Content model: CPTs / collections, field groups, expose to REST | 2 |
| **4** | Fetch layer + Zod schemas; **blog first**, preserving module signatures | 3 |
| **5** | Site settings, FAQs, testimonials, team, clients | 4 |
| **6** | Home + bespoke pages | 5 |
| **7** | Revalidation webhook, draft preview, SEO plugin → `buildMetadata`, real `lastModified` | 6 |

**Phase 0 first, always.** It's independent, it's cheap, and on
consulatng.net the OG image was broken on every page the client shared.

**Blog before pages.** Smallest surface, clean seam, immediate visible
value, and it proves the whole pipeline before you touch bespoke layouts.

---

## 10. Pre-launch checklist

**DNS & mail**
- [ ] `MX` unchanged; test-send to a client mailbox and reply from it
- [ ] `mail.` hostname resolves to a real origin IP, **not** Cloudflare
- [ ] SPF authorizes the transactional sender; DKIM present
- [ ] DMARC published (`p=none` at minimum)
- [ ] Apex and `www` consistent, both resolving to Vercel
- [ ] Stale SPF `a` mechanism removed

**Content & CMS**
- [ ] Every hardcoded `const` extracted or consciously left in code
- [ ] Slugs and nav still owned by code
- [ ] Editor can't break layout — fixed fields only, no block builder
- [ ] Media `alt` text is a required field
- [ ] Admin menus tidied for editors
- [ ] Non-technical editor completes a full publish unaided

**Caching & revalidation**
- [ ] Edit → publish → live page updates within seconds
- [ ] Verified with the Cloudflare proxy in its final state (§3.5)
- [ ] Revalidation route rejects requests without the secret

**SEO**
- [ ] OG image resolves — actually load the URL
- [ ] Social preview checked on one real platform
- [ ] `sitemap.xml` lists every CMS URL with real `lastModified`
- [ ] CMS host returns `noindex`
- [ ] Draft/preview routes return `noindex`
- [ ] `BlogPosting` has `dateModified`
- [ ] Structured data passes Google's Rich Results test

**Infra**
- [ ] Vercel **Pro** (Hobby is non-commercial only)
- [ ] Pooled DB connection string, DB co-located with functions
- [ ] Env vars set for production *and* preview
- [ ] Database backups scheduled and one restore tested

---

## 11. Hard-won lessons

Things that cost time. Don't pay these prices again.

### 11.1 Audit the client's hosting before choosing the CMS

We scoped Payload in full — Next 15 upgrade, Neon, blob storage — then
found the client was on shared cPanel whose only database is MySQL, the
one flavour Payload doesn't support. Meanwhile that same box runs
WordPress natively for free. **Five questions (§1.1) up front would have
saved the entire detour.**

### 11.2 "Vercel Postgres" is gone

Discontinued; existing databases auto-migrated to Neon in December 2024.
Provision via `vercel install neon`. Any tutorial referencing
`@vercel/postgres` as a first-party product predates the change.

### 11.3 Payload pins Next.js ranges, not just majors

`15.2.9–15.2.x`, `15.3.9–15.3.x`, `15.4.11–15.4.x`, `16.2.6+`. "We're on
Next 15" is not sufficient — check the exact range before promising a
timeline.

### 11.4 `wpgraphql-acf` doesn't support SCF

Choosing free custom fields (SCF) forces the REST API. Decide fields and
transport **together**, not in sequence — we recommended WPGraphQL, then
had to walk it back one message later.

### 11.5 Two CDNs means revalidation silently fails

Cloudflare proxying in front of Vercel: your hooks purge Vercel's cache,
Cloudflare keeps serving the old page. Looks exactly like a broken
`revalidatePath`. Grey-cloud Vercel hostnames, or purge both.

### 11.6 Cloudflare proxy on a mail hostname breaks SMTP

The proxy handles HTTP/HTTPS only. Orange-clouding `mail.` resolves it to
Cloudflare IPs and mail stops. Grey cloud, always.

### 11.7 The default OG image usually doesn't exist

Nothing errors at build time and no page renders wrong — it only shows up
when someone shares a link. Check `find public -maxdepth 1 -type f`
against whatever `buildMetadata` defaults to.

### 11.8 `lastModified: new Date()` in `sitemap.ts` is worse than nothing

Every URL claims to change on every deploy. Google learns the signal is
noise. Use the CMS's real `modified` date.

### 11.9 Keystatic's GitHub requirement is a people problem

Technically trivial, frequently a dealbreaker. Ask the actual editors —
not their manager — whether they'll create GitHub accounts, before you
propose it.

### 11.10 Vercel Hobby is non-commercial only

A client site needs Pro ($20/seat/mo). Put it in the budget at scoping,
not at launch.

### 11.11 Preserve module signatures when swapping the data source

If pages import content through one module, keep its exported function
signatures identical and replace only the internals. On consulatng.net
that reduced the entire blog migration — list page, detail page,
`generateStaticParams`, `sitemap.ts` — to a single file change.

---

## 12. Facts to re-verify

Checked **2026-07-29**. Re-check before quoting a client.

| Fact | Value then | Source |
|---|---|---|
| Payload Next.js support | `15.2.9–15.2.x`, `15.3.9–15.3.x`, `15.4.11–15.4.x`, `16.2.6+`; Node 20.9+ | payloadcms.com/docs/getting-started/installation |
| Payload DB adapters | MongoDB, Postgres, SQLite — **no MySQL** | payloadcms.com/docs/database/overview |
| Vercel Postgres | Discontinued; migrated to Neon Dec 2024 | vercel.com/docs/postgres |
| ACF Pro pricing | $49 / $149 / $249 per year | advancedcustomfields.com/pro |
| ACF Pro-only fields | Repeater, Flexible Content, Options Pages, Gallery | advancedcustomfields.com/pro |
| Secure Custom Fields | `6.9.3` (2026-07-28); includes all four free; ~80k installs | wordpress.org/plugins/secure-custom-fields |
| `wpgraphql-acf` + SCF | **Not supported** — ACF only | github.com/wp-graphql/wpgraphql-acf |
| Keystatic | `@keystatic/core` `0.6.3`, pre-1.0, active (commits 2026-07-27); Next 14 App Router | keystatic.com/docs, github.com/Thinkmill/keystatic |
| Vercel Marketplace DBs | `vercel install neon \| upstash \| supabase` | vercel.com/docs/storage |
