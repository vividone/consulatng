/**
 * Content seed — `npm run seed`.
 *
 * Loads the site's starting content into Payload. Safe to run on every
 * deploy, because it is strictly **create-if-missing**: anything already in
 * the CMS is left alone. That rule matters more than it looks. A seed that
 * upserts would silently revert an editor's work on the next deploy, and the
 * client would learn not to trust the admin.
 *
 * Matching keys, per collection:
 *   faqs            question
 *   testimonials    personName
 *   team-members    name
 *   client-logos    name
 *   posts           slug
 *   media           filename
 *   site-settings   singleton — seeded only when tagline is empty
 *
 * Run order matters: media must exist before the records that reference it.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/*
 * Load .env.local when running on a developer machine. On Vercel and Railway
 * the environment is already populated and there is no such file, so a
 * missing one is normal rather than an error.
 */
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local — expected in CI and in production.
}

import matter from "gray-matter";
import {
  convertMarkdownToLexical,
  editorConfigFactory,
} from "@payloadcms/richtext-lexical";
import { getPayload } from "payload";
import type { Payload } from "payload";

import {
  CLIENT_LOGOS,
  FAQS,
  SITE_SETTINGS,
  TEAM,
  TESTIMONIALS,
} from "./snapshot";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(dirname, "../..");
const PUBLIC_DIR = path.join(REPO, "public");
const BLOG_DIR = path.join(REPO, "content", "blog");

const created: Record<string, number> = {};
const skipped: Record<string, number> = {};

function note(collection: string, wasCreated: boolean) {
  const bucket = wasCreated ? created : skipped;
  bucket[collection] = (bucket[collection] ?? 0) + 1;
}

/* -------------------------------------------------------------------------
 * Media
 * ---------------------------------------------------------------------- */

/**
 * Uploads a file from public/ unless a Media doc with that filename exists.
 * Returns the Media id either way, so callers can link to it.
 *
 * Narrowed to `number` because Payload types document ids as `string | number`
 * to cover MongoDB, while the Postgres adapter always issues integers. The
 * generated relation types (`number | Media`) reflect that, so returning the
 * wide type would not assign.
 */
async function ensureMedia(
  payload: Payload,
  relativePath: string,
  alt: string,
): Promise<number | null> {
  const filePath = path.join(PUBLIC_DIR, relativePath);
  if (!fs.existsSync(filePath)) {
    payload.logger.warn(`[seed] Missing file, skipping: public/${relativePath}`);
    return null;
  }

  const filename = path.basename(filePath);
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    pagination: false,
  });

  if (existing.docs.length > 0) {
    note("media", false);
    return existing.docs[0].id as number;
  }

  const doc = await payload.create({
    collection: "media",
    data: { alt },
    filePath,
  });
  note("media", true);
  return doc.id as number;
}

/* -------------------------------------------------------------------------
 * Collections
 * ---------------------------------------------------------------------- */

async function seedFaqs(payload: Payload) {
  for (const [i, faq] of FAQS.entries()) {
    const existing = await payload.find({
      collection: "faqs",
      where: { question: { equals: faq.q } },
      limit: 1,
      pagination: false,
    });
    if (existing.docs.length > 0) {
      note("faqs", false);
      continue;
    }
    await payload.create({
      collection: "faqs",
      data: { question: faq.q, answer: faq.a, order: i },
    });
    note("faqs", true);
  }
}

async function seedTestimonials(payload: Payload) {
  for (const [i, t] of TESTIMONIALS.entries()) {
    const existing = await payload.find({
      collection: "testimonials",
      where: { personName: { equals: t.personName } },
      limit: 1,
      pagination: false,
    });
    if (existing.docs.length > 0) {
      note("testimonials", false);
      continue;
    }
    await payload.create({ collection: "testimonials", data: { ...t, order: i } });
    note("testimonials", true);
  }
}

async function seedTeam(payload: Payload) {
  for (const [i, m] of TEAM.entries()) {
    const existing = await payload.find({
      collection: "team-members",
      where: { name: { equals: m.name } },
      limit: 1,
      pagination: false,
    });
    if (existing.docs.length > 0) {
      note("team-members", false);
      continue;
    }
    const photo = await ensureMedia(payload, m.file, `${m.name}, ${m.role}`);
    await payload.create({
      collection: "team-members",
      data: {
        name: m.name,
        role: m.role,
        photo,
        bio: m.bio.map((text) => ({ text })),
        order: i,
      },
    });
    note("team-members", true);
  }
}

async function seedClientLogos(payload: Payload) {
  for (const [i, c] of CLIENT_LOGOS.entries()) {
    const existing = await payload.find({
      collection: "client-logos",
      where: { name: { equals: c.name } },
      limit: 1,
      pagination: false,
    });
    if (existing.docs.length > 0) {
      note("client-logos", false);
      continue;
    }
    const logo = await ensureMedia(payload, c.file, c.name);
    if (!logo) continue; // ensureMedia already warned
    await payload.create({
      collection: "client-logos",
      data: { name: c.name, logo, order: i },
    });
    note("client-logos", true);
  }
}

async function seedPosts(payload: Payload) {
  if (!fs.existsSync(BLOG_DIR)) return;

  // The editor config has to come from the live Payload config, or the
  // converted nodes reference features this editor does not have enabled
  // and the admin renders an empty document.
  const editorConfig = await editorConfigFactory.default({
    config: payload.config,
  });

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  for (const file of files) {
    const slug = file.replace(/\.mdx?$/, "");
    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
      // Drafts count as existing — re-seeding must not duplicate a post
      // someone has unpublished.
      draft: true,
    });
    if (existing.docs.length > 0) {
      note("posts", false);
      continue;
    }

    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
    const { data, content } = matter(raw);

    const coverImage = data.image
      ? await ensureMedia(
          payload,
          String(data.image).replace(/^\//, ""),
          String(data.title ?? slug),
        )
      : null;

    await payload.create({
      collection: "posts",
      data: {
        title: data.title ?? slug,
        slug,
        excerpt: data.excerpt ?? "",
        author: data.author ?? "Consulat Team",
        publishedAt: data.date
          ? new Date(data.date).toISOString()
          : new Date().toISOString(),
        coverImage,
        content: convertMarkdownToLexical({ editorConfig, markdown: content }),
        _status: "published",
      },
    });
    note("posts", true);
  }
}

async function seedSiteSettings(payload: Payload) {
  const current = await payload.findGlobal({ slug: "site-settings" });

  // Only populate an untouched global. Once it has a description somebody
  // has saved it, and overwriting would discard their edits.
  if (current?.description) {
    note("site-settings", false);
    return;
  }

  await payload.updateGlobal({
    slug: "site-settings",
    data: SITE_SETTINGS,
  });
  note("site-settings", true);
}

/* -------------------------------------------------------------------------
 * Runner
 * ---------------------------------------------------------------------- */

async function main() {
  // Dynamic import, not a static one at the top of the file: ES module
  // imports are hoisted and evaluated before any statement in this module,
  // so a static import would read process.env before loadEnvFile() above
  // had populated it — and Payload would abort on a missing secret.
  const { default: config } = await import("../../payload.config");

  const payload = await getPayload({ config });

  // Media first — team photos and client logos reference it.
  await seedFaqs(payload);
  await seedTestimonials(payload);
  await seedTeam(payload);
  await seedClientLogos(payload);
  await seedPosts(payload);
  await seedSiteSettings(payload);

  const names = [...new Set([...Object.keys(created), ...Object.keys(skipped)])].sort();
  console.log("\nSeed complete.\n");
  console.log("  collection        created   already present");
  for (const n of names) {
    console.log(
      `  ${n.padEnd(18)}${String(created[n] ?? 0).padStart(5)}   ${String(skipped[n] ?? 0).padStart(15)}`,
    );
  }
  console.log("");

  process.exit(0);
}

main().catch((err) => {
  console.error("\nSeed failed:\n", err);
  process.exit(1);
});
