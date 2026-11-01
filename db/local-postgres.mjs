/**
 * Local Postgres for development, without Docker.
 *
 * `npm run db:start` boots a real PostgreSQL server from binaries vendored by
 * the embedded-postgres package into db/.pgdata (gitignored). This exists so
 * Payload can run migrations and serve its admin locally before the Railway
 * database is provisioned — the connection string is the only thing that
 * changes when it is.
 *
 * Dev dependency only. Nothing here ships.
 */

import EmbeddedPostgres from "embedded-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const DB_NAME = "consulat";
export const PORT = 54329; // Deliberately not 5432, so it cannot collide
export const USER = "postgres"; //   with a Postgres the developer already runs.
export const PASSWORD = "postgres";
export const CONNECTION_STRING = `postgresql://${USER}:${PASSWORD}@127.0.0.1:${PORT}/${DB_NAME}`;

export function createServer() {
  return new EmbeddedPostgres({
    databaseDir: path.join(here, ".pgdata"),
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
    createPostgresUser: false,
  });
}

const isMain = process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]));

if (isMain) {
  const pg = createServer();
  const fresh = !(await import("node:fs")).existsSync(path.join(here, ".pgdata", "PG_VERSION"));

  if (fresh) {
    console.log("Initialising a new cluster in db/.pgdata ...");
    await pg.initialise();
  }

  await pg.start();

  /*
   * Create the database explicitly as UTF8 from template0.
   *
   * On Windows initdb picks the system codepage, which here is WIN1252, and
   * template1 inherits it. Any database cloned from template1 then rejects
   * characters outside Latin-1 — the testimonial flag emoji fail to insert
   * with "no equivalent in encoding WIN1252". Railway's Postgres is UTF8, so
   * without this the local database silently accepts less than production
   * does and the seed appears broken only on a developer machine.
   *
   * template0 has no locale baked in, so it can be cloned at any encoding.
   */
  const client = new (await import("pg")).default.Client({
    connectionString: `postgresql://${USER}:${PASSWORD}@127.0.0.1:${PORT}/postgres`,
  });
  await client.connect();
  const { rows } = await client.query(
    "select 1 from pg_database where datname = $1",
    [DB_NAME],
  );
  if (rows.length === 0) {
    await client.query(
      `create database ${DB_NAME} with encoding 'UTF8' template template0 lc_collate 'C' lc_ctype 'C'`,
    );
    console.log(`Created database "${DB_NAME}" (UTF8).`);
  } else {
    const enc = await client.query(
      "select pg_encoding_to_char(encoding) as enc from pg_database where datname = $1",
      [DB_NAME],
    );
    const actual = enc.rows[0].enc;
    console.log(`Database "${DB_NAME}" already exists (encoding: ${actual}).`);
    if (actual !== "UTF8") {
      console.warn(
        `\n  WARNING: expected UTF8. Emoji and other non-Latin-1 characters\n` +
          `  will fail to insert. Delete db/.pgdata and start again.\n`,
      );
    }
  }
  await client.end();

  console.log(`\nPostgres is up.\n  ${CONNECTION_STRING}\n`);
  console.log("Leave this running. Ctrl+C to stop.");

  const stop = async () => {
    console.log("\nStopping Postgres ...");
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);

  // Hold the process open.
  await new Promise(() => {});
}
