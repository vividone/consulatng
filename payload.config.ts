import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { ClientLogos } from "./cms/collections/ClientLogos";
import { Faqs } from "./cms/collections/Faqs";
import { Media } from "./cms/collections/Media";
import { Posts } from "./cms/collections/Posts";
import { Staff } from "./cms/collections/Staff";
import { TeamMembers } from "./cms/collections/TeamMembers";
import { Testimonials } from "./cms/collections/Testimonials";
import { SiteSettings } from "./cms/globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The base URL browsers use to fetch media, without a trailing slash.
 *
 * This is deliberately separate from S3_ENDPOINT, which is the *API* endpoint
 * the server authenticates against. They are frequently not the same host, and
 * on some providers the difference decides whether anonymous reads work at all:
 *
 *   - Tigris serves public objects only at bucket.t3.storageapi.dev/<key>
 *     (virtual-host style). The path-style URL endpoint/bucket/<key> requires
 *     a signature and returns 403 to a browser, which looks exactly like a
 *     misconfigured ACL and is not.
 *   - Putting a CDN in front of the bucket changes the read host and nothing
 *     else.
 *
 * The storage plugin always builds endpoint/bucket/<key>, ignoring
 * forcePathStyle, so a provider needing virtual-host URLs must override it.
 * Set S3_PUBLIC_URL to do that. Left unset, we fall back to the plugin's own
 * path-style shape, which is right for AWS, Garage and most self-hosted
 * servers.
 */
const publicMediaBase = (
  process.env.S3_PUBLIC_URL?.trim() ||
  `${process.env.S3_ENDPOINT ?? ""}/${process.env.S3_BUCKET ?? ""}`
).replace(/\/+$/, "");

export default buildConfig({
  /**
   * Payload's REST API sits at /cms-api, not the default /api.
   *
   * app/api/contact/route.ts already owns /api/contact, and Payload's
   * catch-all would be a second route file resolving under the same prefix.
   * Moving Payload out of the way is one line; moving the contact endpoint
   * would mean changing a URL the live contact form already posts to.
   */
  routes: { admin: "/backoffice", api: "/cms-api" },

  admin: {
    user: Staff.slug,
    meta: {
      titleSuffix: "— Consulat Back Office",
    },
    // The route is /backoffice, not Payload's default /admin, so the folder
    // it derives the import map location from has moved too. Payload cannot
    // find it automatically once the route is customised.
    importMap: {
      importMapFile: path.resolve(
        dirname,
        "app/(payload)/backoffice/importMap.js",
      ),
    },
  },

  collections: [
    // Content
    Posts,
    Faqs,
    TeamMembers,
    Testimonials,
    ClientLogos,
    Media,
    // Access
    Staff,
  ],

  globals: [SiteSettings],

  /**
   * Media storage.
   *
   * Vercel's filesystem is read-only, so uploads cannot live on disk in
   * production — they go to an S3-compatible bucket. Written against the S3
   * API rather than any one vendor, with `endpoint` and `forcePathStyle`
   * set from env, so the same code works against Railway-hosted storage
   * (Garage, SILO), Cloudflare R2, or real AWS.
   *
   * The plugin is ALWAYS in the array, toggled by `enabled`, never added
   * conditionally. That is load-bearing: the adapter adds columns to the
   * media table (`_objectkey`, and a prefix field), so a config that only
   * includes the plugin when S3_BUCKET is set produces a different schema
   * per environment. A migration generated locally without a bucket then
   * omits those columns, and every media query in production fails with
   * `column "_objectkey" does not exist` — taking down the home page, about
   * page and blog, but only after deploy. `alwaysInsertFields` keeps the
   * columns present either way so one migration is correct everywhere.
   */
  plugins: [
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      alwaysInsertFields: true,
      collections: {
        media: {
          /**
           * Serve media straight from the bucket rather than proxying it
           * through /cms-api/media/file/*.
           *
           * Left on, Payload streams every file through a serverless
           * function to enforce access control. The home page alone shows
           * fifteen client logos, so an uncached view would be fifteen
           * function invocations — slow, billed, and competing for the
           * same Postgres connections as everything else. None of this
           * media is private; it is logos and team photos on a public
           * marketing site.
           *
           * The bucket must therefore allow anonymous reads, and its host
           * must be in images.remotePatterns (see next.config.mjs) or
           * next/image will refuse to optimise it.
           */
          disablePayloadAccessControl: true,

          /**
           * Build the public URL ourselves so it points at a host that
           * actually serves anonymous reads. See publicMediaBase above.
           *
           * `prefix` arrives already resolved by the plugin (semantic prefix
           * plus the object-key segment), and `filename` is the sized
           * filename when an image size is being resolved, so joining the two
           * is the whole object key.
           *
           * This runs in an afterRead hook as well as on write, so changing
           * S3_PUBLIC_URL fixes URLs for media already in the database — no
           * backfill, no re-upload.
           */
          generateFileURL: ({ filename, prefix }) => {
            const key = [prefix, filename].filter(Boolean).join("/");
            const encoded = key.split("/").map(encodeURIComponent).join("/");
            return `${publicMediaBase}/${encoded}`;
          },
        },
      },
      // Objects are world-readable, matching the above.
      acl: "public-read",
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION ?? "us-east-1",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        // Self-hosted S3 servers address buckets by path
        // (host/bucket/key), not by subdomain the way AWS does.
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
      },
    }),
  ],

  editor: lexicalEditor(),

  /**
   * Password resets are sent through Resend, the same service the contact
   * form already uses. Without an adapter Payload writes mail to the console,
   * which means a locked-out admin in production simply never receives the
   * reset link — a failure that only shows up the day someone needs it.
   *
   * Left unset in local development so reset links land in the terminal
   * rather than a real inbox.
   */
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress:
          process.env.PAYLOAD_FROM_ADDRESS ?? "no-reply@consulatng.net",
        defaultFromName: "Consulat Admin",
      })
    : undefined,

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
    // Alongside the rest of the CMS code rather than a bare /migrations at
    // the repo root, which reads ambiguously next to db/reference-schema.
    migrationDir: path.resolve(dirname, "cms/migrations"),
    /**
     * No dev-mode schema push.
     *
     * Payload defaults this to true in development, which silently syncs the
     * database to match the config. It is convenient and it is a trap: the
     * schema ends up in a state no migration produced, local and production
     * diverge, and `payload migrate` then refuses with a data-loss warning
     * because it cannot reconcile the two.
     *
     * With push off, every schema change goes through `npm run migrate:create`
     * and the migration is exercised locally before it ever runs on Railway.
     * Slower by one command; the command is the point.
     */
    push: false,
  }),

  // Generated types are the point of using Payload — keep them next to the
  // config and import them rather than hand-rolling content types.
  typescript: {
    outputFile: path.resolve(dirname, "cms/payload-types.ts"),
  },

  secret: process.env.PAYLOAD_SECRET || "",

  sharp,
});
