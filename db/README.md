# Operations platform — data model

> **Status: reference, not deployed.** The SQL in `reference-schema/` is the
> worked-through data model, not the migration path. Payload CMS owns the live
> schema (Drizzle, via `@payloadcms/db-postgres`), so these tables are
> expressed as Payload collections in `payload.config.ts` and Payload
> generates the migrations.
>
> It is kept because the thinking in it is the expensive part and translates
> directly: the collection definitions are a transcription of these tables,
> and `tests/` asserts the business rules the collections must preserve.

## Stack

| Layer | Choice |
|---|---|
| App + admin | Next.js on Vercel, Payload admin at `/admin` |
| Database | Railway Postgres |
| Auth | Payload (staff users collection) |
| Documents | Google Shared Drives — `drive_file_id` pointers, no blobs in Postgres |
| Media (CMS uploads) | Blob storage required — Vercel's filesystem is read-only |

## Shape

```
client ─┬─ client_contacts
        ├─ expatriates ──┐
        └─ matters ──────┴─ matter_documents
                         ├─ matter_stage_events   (append-only history)
                         └─ obligations           (expiries + monthly returns)

matter_types ─┬─ matter_type_stages        }  the configurable pipeline:
              ├─ matter_type_documents     }  data, not code
              └─ matter_type_fee_items     }
```

The `matter_type_*` tables are templates. When a matter is opened its
checklist and fee lines are **copied** from the template, so editing a
template never rewrites history on a matter already submitted.

## Rules that must survive the move to Payload

These are enforced in SQL in `reference-schema/` and asserted in `tests/`.
Payload expresses most of them as hooks, which run in application code and
are therefore bypassable by direct database access. The ones marked **keep in
SQL** should stay as check constraints in a custom Payload migration.

| Rule | In Payload |
|---|---|
| Matter reference `EQ-2026-0001`, sequential per prefix per year | `beforeChange` hook; keep a unique index |
| A matter's stage must belong to its matter type | `beforeChange` hook — **keep in SQL** as a constraint too |
| Stage history is append-only | `afterChange` hook writing `matter_stage_events`; no update/delete access |
| A completed matter carries a closing date | **keep in SQL** (`closed_has_date`) |
| Recurring obligations carry an interval, expiries do not | **keep in SQL** (`recurrence_matches_kind`) |
| One primary contact per client | **keep in SQL** (partial unique index) |

## Tests

```bash
npm run test:schema
```

Applies `reference-schema/` to an in-process Postgres (PGlite) and asserts the
rules above. No Docker, runs in seconds. Once Payload owns the schema these
should be re-pointed at Payload's generated migrations so they test what is
actually deployed.

**Not covered: row-level security.** PGlite runs everything as the owner. With
Payload the equivalent is its access-control config, which needs testing a
different way.

## Open issues before Payload goes in

1. **Connection pooling.** Vercel serverless functions each open their own
   connection; Postgres has a hard cap. Neon and Supabase ship poolers —
   **Railway does not.** Either run PgBouncer as a second Railway service, or
   accept the cap and watch it. This breaks under load, not in testing.
2. **Region.** Put the Railway database in `europe-west` and pin Vercel
   functions to `fra1`. The default `iad1` adds ~60–80ms to every admin query,
   and the admin makes many sequential ones.
3. **Media storage.** Payload uploads need `@payloadcms/storage-s3` or Vercel
   Blob, since the Vercel filesystem is read-only.

## Deliberately not modelled yet

| Area | Why it is waiting |
|---|---|
| Invoicing | Needs the fee model confirmed against how Accounts bills today. |
| Telephony callbacks | Shape depends on the Challenge 1 provider chosen at diagnosis. |
| Training sessions & registrations | Gated on payment gateway selection. |
| Client-facing portal | Held until the internal workflow is proven in live use. |

The document checklists in `0002_seed_matter_types.sql` are intentionally
empty and the fee items carry no amounts. Both come out of process mapping
with the operations team. Inventing them would produce something that looked
authoritative and was wrong.
