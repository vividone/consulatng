/**
 * Schema tests — run with `npm run test:schema`.
 *
 * Applies every migration in db/reference-schema/ to a throwaway in-process
 * Postgres (PGlite) and asserts the behaviour that lives in the database
 * rather than in application code: generated references, the constraints, and
 * the triggers. These are the parts that are easy to break in a later
 * migration and hard to notice until production data is wrong.
 *
 * What this does NOT cover: row-level security. PGlite runs everything as the
 * owner, so policies are created but never enforced here. RLS needs a real
 * Supabase instance and a non-superuser role — see db/README.md.
 */

import { PGlite } from "@electric-sql/pglite";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(here, "..", "reference-schema");

const CLIENT = "22222222-2222-2222-2222-222222222222";
const USER = "11111111-1111-1111-1111-111111111111";

let passed = 0;
const failures = [];

async function test(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failures.push({ name, err });
    console.log(`  ✗ ${name}`);
    console.log(`    ${err.message.split("\n")[0]}`);
  }
}

/** Asserts that `fn` throws, and that the message mentions `contains`. */
async function rejects(fn, contains) {
  let threw = false;
  try {
    await fn();
  } catch (err) {
    threw = true;
    if (contains) {
      assert.ok(
        err.message.toLowerCase().includes(contains.toLowerCase()),
        `expected error mentioning "${contains}", got: ${err.message}`,
      );
    }
  }
  assert.ok(threw, "expected the statement to be rejected, but it succeeded");
}

const db = new PGlite();

// Supabase supplies auth.users and auth.uid(). Stub them so the migrations
// apply unmodified.
await db.exec(`
  create schema if not exists auth;
  create table auth.users (id uuid primary key);
  create or replace function auth.uid() returns uuid
    language sql stable as $fn$ select current_setting('test.uid', true)::uuid $fn$;
`);

const migrations = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
console.log(`Applying ${migrations.length} migration(s):`);
for (const file of migrations) {
  await db.exec(fs.readFileSync(path.join(migrationsDir, file), "utf8"));
  console.log(`  ✓ ${file}`);
}

await db.exec(`
  insert into auth.users (id) values ('${USER}');
  insert into profiles (id, full_name, email, role)
    values ('${USER}', 'Test Officer', 'test@example.com', 'officer');
  insert into clients (id, name, status) values ('${CLIENT}', 'Acme Nigeria Ltd', 'active');
`);

const typeId = async (slug) =>
  (await db.query(`select id from matter_types where slug = $1`, [slug])).rows[0].id;
const stageId = async (slug, order) =>
  (
    await db.query(
      `select s.id from matter_type_stages s join matter_types mt on mt.id = s.matter_type_id
        where mt.slug = $1 and s.sort_order = $2`,
      [slug, order],
    )
  ).rows[0].id;

console.log("\nSeed:");

await test("every service line has stages and fee items", async () => {
  const { rows } = await db.query(`
    select mt.slug,
           (select count(*)::int from matter_type_stages s where s.matter_type_id = mt.id) as stages,
           (select count(*)::int from matter_type_fee_items f where f.matter_type_id = mt.id) as fees
      from matter_types mt
  `);
  assert.equal(rows.length, 5, "expected five service lines");
  for (const r of rows) {
    assert.ok(r.stages > 0, `${r.slug} has no stages`);
    assert.ok(r.fees > 0, `${r.slug} has no fee items`);
  }
});

await test("every pipeline ends in at least one terminal stage", async () => {
  const { rows } = await db.query(`
    select mt.slug from matter_types mt
     where not exists (
       select 1 from matter_type_stages s
        where s.matter_type_id = mt.id and s.is_terminal
     )
  `);
  assert.deepEqual(rows, [], "service lines with no terminal stage");
});

console.log("\nMatter references:");

await test("references are sequential per prefix per year", async () => {
  const eq = await typeId("expatriate-quota");
  const ev = await typeId("e-visas");
  await db.query(`insert into matters (client_id, matter_type_id) values ($1, $2)`, [CLIENT, eq]);
  await db.query(`insert into matters (client_id, matter_type_id) values ($1, $2)`, [CLIENT, eq]);
  await db.query(`insert into matters (client_id, matter_type_id) values ($1, $2)`, [CLIENT, ev]);

  const year = new Date().getFullYear();
  const { rows } = await db.query(`select reference from matters order by reference`);
  assert.deepEqual(
    rows.map((r) => r.reference),
    [`EQ-${year}-0001`, `EQ-${year}-0002`, `EV-${year}-0001`],
  );
});

await test("an explicitly supplied reference is respected", async () => {
  const bp = await typeId("business-permit");
  await db.query(
    `insert into matters (client_id, matter_type_id, reference) values ($1, $2, 'LEGACY-001')`,
    [CLIENT, bp],
  );
  const { rows } = await db.query(`select 1 from matters where reference = 'LEGACY-001'`);
  assert.equal(rows.length, 1);
});

console.log("\nStage integrity:");

await test("a stage from another matter type is rejected", async () => {
  const year = new Date().getFullYear();
  const wrong = await stageId("business-permit", 1);
  await rejects(
    () =>
      db.query(`update matters set current_stage_id = $1 where reference = $2`, [
        wrong,
        `EQ-${year}-0001`,
      ]),
    "does not belong",
  );
});

await test("a stage from the same matter type is accepted", async () => {
  const year = new Date().getFullYear();
  const right = await stageId("expatriate-quota", 3);
  await db.query(`update matters set current_stage_id = $1 where reference = $2`, [
    right,
    `EQ-${year}-0001`,
  ]);
  const { rows } = await db.query(
    `select current_stage_id from matters where reference = $1`,
    [`EQ-${year}-0001`],
  );
  assert.equal(rows[0].current_stage_id, right);
});

await test("stage changes are logged automatically", async () => {
  const year = new Date().getFullYear();
  const { rows } = await db.query(
    `select count(*)::int as n from matter_stage_events e
       join matters m on m.id = e.matter_id where m.reference = $1`,
    [`EQ-${year}-0001`],
  );
  assert.equal(rows[0].n, 1, "expected one stage event for the one move made");
});

await test("re-setting the same stage does not log a duplicate event", async () => {
  const year = new Date().getFullYear();
  const same = await stageId("expatriate-quota", 3);
  await db.query(`update matters set current_stage_id = $1 where reference = $2`, [
    same,
    `EQ-${year}-0001`,
  ]);
  const { rows } = await db.query(
    `select count(*)::int as n from matter_stage_events e
       join matters m on m.id = e.matter_id where m.reference = $1`,
    [`EQ-${year}-0001`],
  );
  assert.equal(rows[0].n, 1);
});

console.log("\nConstraints:");

await test("a completed matter must carry a closing date", async () => {
  const year = new Date().getFullYear();
  await rejects(() =>
    db.query(`update matters set status = 'completed' where reference = $1`, [`EV-${year}-0001`]),
  );
  await db.query(
    `update matters set status = 'completed', closed_at = now() where reference = $1`,
    [`EV-${year}-0001`],
  );
});

await test("a recurring obligation must carry an interval", async () => {
  await rejects(() =>
    db.query(
      `insert into obligations (client_id, kind, name, due_on)
       values ($1, 'recurring', 'Monthly returns', '2026-11-30')`,
      [CLIENT],
    ),
  );
});

await test("an expiry obligation must not carry an interval", async () => {
  await rejects(() =>
    db.query(
      `insert into obligations (client_id, kind, name, due_on, recurrence_interval)
       values ($1, 'expiry', 'e-CERPAC expiry', '2027-03-01', '1 month')`,
      [CLIENT],
    ),
  );
});

await test("valid obligations of both kinds insert", async () => {
  await db.query(
    `insert into obligations (client_id, kind, name, due_on, recurrence_interval)
     values ($1, 'recurring', 'Monthly returns', '2026-11-30', '1 month')`,
    [CLIENT],
  );
  await db.query(
    `insert into obligations (client_id, kind, name, due_on)
     values ($1, 'expiry', 'e-CERPAC expiry', '2027-03-01')`,
    [CLIENT],
  );
  const { rows } = await db.query(`select count(*)::int as n from obligations`);
  assert.equal(rows[0].n, 2);
});

await test("a client has at most one primary contact", async () => {
  await db.query(
    `insert into client_contacts (client_id, full_name, is_primary) values ($1, 'Jane HR', true)`,
    [CLIENT],
  );
  await rejects(() =>
    db.query(
      `insert into client_contacts (client_id, full_name, is_primary) values ($1, 'Someone Else', true)`,
      [CLIENT],
    ),
  );
  // ...but any number of non-primary ones.
  await db.query(
    `insert into client_contacts (client_id, full_name, is_primary) values ($1, 'Someone Else', false)`,
    [CLIENT],
  );
});

await test("a matter type's ref_prefix must be 2-5 uppercase letters", async () => {
  await rejects(() =>
    db.query(
      `insert into matter_types (slug, name, ref_prefix) values ('bad', 'Bad', 'lower')`,
    ),
  );
  await rejects(() =>
    db.query(`insert into matter_types (slug, name, ref_prefix) values ('bad2', 'Bad', 'X')`),
  );
});

console.log(
  `\n${failures.length === 0 ? "PASS" : "FAIL"} — ${passed} passed, ${failures.length} failed`,
);
process.exit(failures.length === 0 ? 0 : 1);
