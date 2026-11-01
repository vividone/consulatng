# Deployment

App on **Vercel**, Postgres and object storage on **Railway**.

```
Vercel (Next.js + Payload admin at /backoffice)
   │
   ├── DATABASE_URI ──────→ Railway: Postgres
   └── S3_* ──────────────→ Railway: S3-compatible bucket (Garage or SILO)
```

---

## 1. Railway — Postgres

Provision Postgres in your Railway project and copy the connection string into
Vercel as `DATABASE_URI`.

**Put the database in `europe-west`.** Vercel defaults functions to `iad1`
(US East); pin them to `fra1` in project settings. The admin makes many
sequential queries per page and the latency compounds — `iad1` against a US
database is fine, `iad1` against a European one adds 60–80ms to every query.

### Connection pooling — read this before going live

Every Vercel serverless invocation opens its own connection. Postgres has a
hard cap. Neon and Supabase ship poolers; **Railway does not.** This works
perfectly in testing and fails under real traffic.

Pick one before launch:

- **PgBouncer as a second Railway service** in front of Postgres, in
  transaction pooling mode. Point `DATABASE_URI` at PgBouncer, not Postgres.
- **Accept the cap** and watch connection count. Defensible for five internal
  users; not once the client portal exists.

---

## 2. Railway — object storage

Payload uploads cannot live on Vercel's read-only filesystem.

Any S3-compatible provider works. **Currently provisioned: Tigris**
(`https://t3.storageapi.dev`), bucket `practical-pouch-fiznqjhsm`.

If you ever move: MinIO's upstream repository was archived in April 2026 with
no further releases, so prefer **Garage** or **SILO** (a MinIO fork maintained
by Pigsty) among self-hosted options.

Set on Vercel:

| Variable | Value |
|---|---|
| `S3_BUCKET` | the bucket name |
| `S3_ENDPOINT` | the provider's S3 endpoint, publicly reachable |
| `S3_ACCESS_KEY_ID` | from the storage provider |
| `S3_SECRET_ACCESS_KEY` | from the storage provider |
| `S3_FORCE_PATH_STYLE` | `true` (default) |

The endpoint must be the **public** domain. Browsers and Vercel's image
optimiser fetch these URLs directly, so an internal-only hostname resolves to
nothing. Its host is read from `S3_ENDPOINT` into `images.remotePatterns` at
build time (see `next.config.mjs`), so `S3_ENDPOINT` must be set on Vercel
*before* the build, not just at runtime.

### The bucket must be publicly readable

`disablePayloadAccessControl: true` means the website hands browsers bucket
URLs directly instead of streaming each file through a serverless function.
That is deliberate — the home page alone shows fifteen logos, and proxying
them would be fifteen invocations competing for Postgres connections.

It also means **a private bucket breaks every image on the site**, with a 403
that appears only in the browser. The config sends `acl: "public-read"` per
object, but Tigris (and most providers) create buckets private and that
bucket-level setting wins. Verify with an anonymous fetch, not a signed one:

```bash
curl -s -o /dev/null -w "%{http_code}\n" "$S3_ENDPOINT/$S3_BUCKET/<some-key>"
```

`200` is correct. `403` means the bucket is still private.

### Keep ops documents in a different bucket

This bucket is world-readable by design: it holds logos, team photos and blog
covers. When the operations platform starts storing client documents —
passports, permits, CERPAC paperwork — those must go to a **separate private
bucket** with access control left on. Do not reuse this one.

---

## 3. Vercel — environment

Everything in `.env.example`, minus the local-only defaults:

```
DATABASE_URI           Railway Postgres (or PgBouncer) connection string
PAYLOAD_SECRET         openssl rand -hex 32 — changing it logs everyone out
RESEND_API_KEY         contact form + Payload password resets
CONTACT_TO             info@consulatng.net
CONTACT_FROM           verified sender on the Resend domain
PAYLOAD_FROM_ADDRESS   no-reply@consulatng.net
S3_*                   as above
```

---

## 4. Build command

Migrations must run before the build, because static generation reads every
page's content from the database:

```
npx payload migrate && npm run build
```

Set that as the Vercel build command. `payload migrate` is a no-op when
everything is already applied, so it is safe on every deploy.

### Schema changes go through migrations, always

`push` is set to **false** in `payload.config.ts`. Payload defaults it to true
in development, which silently syncs the database to match the config — handy,
and a trap: the schema ends up in a state no migration produced, local and
production diverge, and `payload migrate` then refuses with a data-loss
warning because it cannot reconcile the two. We hit exactly that during the
build-out.

So after changing a collection:

```bash
npm run migrate:create <name>   # generate the SQL
npx payload migrate             # apply it locally
npm run payload:types           # regenerate cms/payload-types.ts (commit it)
```

The migration is then exercised locally before it ever runs on Railway.

---

## 5. Seeding

```
npm run seed
```

Loads the starting content — FAQs, testimonials, team, client logos, blog
posts, site settings — and uploads the images they reference from `public/`.

**Safe to run on every deploy.** It is strictly create-if-missing: it matches
on a natural key per collection and skips anything already there. Verified by
editing a record, re-running, and confirming the edit survived with no
duplicates. A seed that upserted would quietly revert the client's work on the
next deploy, and they would stop trusting the admin.

Run it once after the first deploy. Adding it to the build command also works
if you want new content added to `cms/seed/snapshot.ts` to flow out
automatically.

---

## 6. Content and revalidation

Every public page reads from the CMS through `lib/content.ts` and is
statically generated at build time. Publishing in the back office purges the
affected paths immediately via `cms/revalidate.ts`, so the live site updates
without a redeploy — verified end to end against a production build.

What is CMS-managed:

| | |
|---|---|
| Content | blog posts, FAQs, team members, testimonials, client logos |
| Services | the five service lines and their whole detail page, including SEO and structured data. Adding a sixth is a back-office job |
| Pages | home, about, services index, FAQ and contact — headings, prose, images, statistics and per-page SEO |
| Site Settings | contact details, hours, address, social links, booking URL, and the shared call-to-action banner |

What stays in code, deliberately:

- **`SITE` identity** — name, legal name, domain, URL, tagline. Wired into
  routing, canonical URLs and the logo lockup, where a typo breaks the site
  rather than rewording it.
- **`NAV_LINKS`** — the top-level navigation, which maps to routes that have
  to exist.
- **Privacy and Terms.** Both interpolate the registered name, domain and
  office address from Site Settings. In rich text those values would freeze
  as literal prose and go stale the first time the office moves — editable
  but wrong is worse than not editable. Once counsel's rewrite lands the text
  becomes static and it can move into the CMS.
- **Contact details on the contact page.** They are rendered from Site
  Settings rather than duplicated, so the footer, the contact page and the
  organisation structured data cannot disagree.

## 7. First admin user

Visit `/backoffice` on the deployed site. With no users, Payload shows its
create-first-user screen. Create the account there — not via the seed, so no
credentials ever live in the repo.

Afterwards, add staff in the back office under **Access → Staff**.

A guide for them is built into the admin at **/backoffice/user-guide**, linked
from the bottom of the sidebar. It covers what each area edits, the fact that
saving publishes immediately for everything except blog posts, and what is
deliberately left to a developer. It is a Payload custom view
(`cms/views/UserGuide`), so it sits behind the same login as the rest of the
admin and cannot be read by the public.

Payload resolves custom view components through the import map, so after
editing the guide or its sidebar link, re-run:

```bash
npm run payload:importmap
```

---

## 8. Local development

```bash
npm run db:start     # Postgres 18 from vendored binaries, no Docker (port 54329)
npx payload migrate  # apply migrations
npm run seed         # load content
npm run dev          # site on /, back office on /backoffice
```

`db:start` creates the database as **UTF8 from template0**. On Windows
`initdb` otherwise picks the system codepage (WIN1252 here) and template1
inherits it, which makes inserts of the testimonial flag emoji fail with
*"no equivalent in encoding WIN1252"* — a failure that happens only on a
developer machine and not on Railway, which is the most confusing kind.

---

## Known issues

| Issue | Impact |
|---|---|
| Connection pooling (§1) | Breaks under load, not in testing. Decide before launch. |
| `X-Frame-Options: DENY` in `next.config.mjs` | Will block Payload live preview if enabled, since it iframes the site. Relax to `SAMEORIGIN` at that point. |
| `payload run` and the tsx-wrapped bin exit silently on Windows | Use `npx payload <cmd>` for CLI work; the seed runs through `node --import tsx` for this reason. |
| Three seeded posts reference cover images that do not exist | `public/images/blog/*.jpg` were never committed, so the MDX frontmatter pointed at nothing. The seed warns and carries on; those posts fall back to the brand gradient. Upload covers in the back office to fix. |
| The 404 page has no OG card | It renders outside the `(site)` group so it does not inherit the default. Harmless — a missing page should not have a rich preview. |
| `content/blog/*.mdx` still in the repo | Now only the seed's source for first-run content. Posts are edited in the back office; the files are not read at build time. |
