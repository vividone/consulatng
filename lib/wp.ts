/**
 * WordPress REST client — the only module that talks to the CMS.
 *
 * Design notes
 * ------------
 * 1. **Optional by design.** If `WP_API_URL` is unset, `isWpEnabled()` is
 *    false and every caller falls back to the hardcoded content it used
 *    before. That keeps `next build` green while WordPress is still being
 *    provisioned, and makes rollback a matter of unsetting one env var
 *    rather than reverting a deploy.
 *
 * 2. **Zod at the boundary.** WordPress is a live system edited by humans;
 *    a deleted field group or renamed field would otherwise surface as
 *    `undefined` rendering as blank space in production. `.parse()` turns
 *    that into a loud build-time error instead.
 *
 * 3. **Tags, not paths.** Every request carries a cache tag matching the
 *    ones in wordpress/consulat-headless/inc/revalidate.php, so a WordPress
 *    save can purge exactly what changed. Keep the two lists in sync.
 *
 * 4. **Explicit `per_page`.** WordPress silently caps collections at 10
 *    items. Every list request below asks for 100.
 */

import { z } from "zod";

const WP_API_URL = process.env.WP_API_URL?.replace(/\/$/, "");

/** Cache tags — must match `consulat_revalidate_tags_for()` in the WP plugin. */
export const TAGS = {
  posts: "posts",
  pages: "pages",
  faqs: "faqs",
  testimonials: "testimonials",
  team: "team",
  clients: "clients",
  settings: "settings",
} as const;

/**
 * Whether the CMS is wired up. Callers use this to decide between live
 * content and their hardcoded fallback.
 */
export function isWpEnabled(): boolean {
  return Boolean(WP_API_URL);
}

/* -------------------------------------------------------------------------
 * Low-level fetch
 * ---------------------------------------------------------------------- */

type FetchOpts = {
  /** Cache tags for on-demand revalidation. */
  tags: string[];
  /** Include an Authorization header — needed only for drafts/previews. */
  authenticated?: boolean;
};

async function wpFetch<T>(path: string, { tags, authenticated }: FetchOpts): Promise<T> {
  if (!WP_API_URL) {
    throw new Error(
      "wpFetch called without WP_API_URL set. Guard the call with isWpEnabled().",
    );
  }

  const headers: Record<string, string> = { Accept: "application/json" };

  if (authenticated) {
    const user = process.env.WP_APP_USER;
    const pass = process.env.WP_APP_PASSWORD;
    if (!user || !pass) {
      throw new Error(
        "Authenticated WordPress request needs WP_APP_USER and WP_APP_PASSWORD (a WordPress Application Password).",
      );
    }
    headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
  }

  const url = `${WP_API_URL}${path}`;
  const res = await fetch(url, {
    headers,
    // Drafts must never be cached; published content is tag-revalidated.
    next: authenticated ? { revalidate: 0 } : { tags },
  });

  if (!res.ok) {
    throw new Error(`WordPress ${res.status} ${res.statusText} for ${path}`);
  }

  return res.json() as Promise<T>;
}

/* -------------------------------------------------------------------------
 * HTML helpers
 *
 * WordPress returns pre-rendered HTML with encoded entities. Titles and
 * excerpts land in plain-text contexts (headings, meta descriptions,
 * JSON-LD), so they need decoding and tag-stripping.
 * ---------------------------------------------------------------------- */

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#8217;": "’",
  "&#8216;": "‘",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8211;": "–",
  "&#8212;": "—",
  "&hellip;": "…",
  "&nbsp;": " ",
};

/** Decode the entities WordPress emits, for use in plain-text contexts. */
export function decodeEntities(input: string): string {
  return input.replace(
    /&(?:amp|lt|gt|quot|#039|#8217|#8216|#8220|#8221|#8211|#8212|hellip|nbsp);/g,
    (m) => ENTITIES[m] ?? m,
  );
}

/** Strip tags and decode entities — for excerpts and meta descriptions. */
export function toPlainText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}

/* -------------------------------------------------------------------------
 * Shared schemas
 * ---------------------------------------------------------------------- */

const Rendered = z.object({ rendered: z.string() });

/** An SCF image field with `return_format: 'array'`. */
const ScfImage = z
  .object({
    url: z.string(),
    alt: z.string().default(""),
    width: z.number().optional(),
    height: z.number().optional(),
  })
  .nullish();

/** A `_embed`ed featured image. */
const EmbeddedMedia = z
  .object({
    source_url: z.string(),
    alt_text: z.string().default(""),
    media_details: z
      .object({ width: z.number().optional(), height: z.number().optional() })
      .partial()
      .optional(),
  })
  .array()
  .optional();

const Embedded = z
  .object({
    "wp:featuredmedia": EmbeddedMedia,
    author: z.array(z.object({ name: z.string() })).optional(),
  })
  .partial()
  .optional();

export type WpImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

function embeddedImage(embedded: z.infer<typeof Embedded>): WpImage | undefined {
  const media = embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) return undefined;
  return {
    url: media.source_url,
    alt: media.alt_text ?? "",
    width: media.media_details?.width,
    height: media.media_details?.height,
  };
}

/* -------------------------------------------------------------------------
 * Blog posts
 * ---------------------------------------------------------------------- */

const WpPost = z.object({
  slug: z.string(),
  date: z.string(),
  modified: z.string(),
  title: Rendered,
  excerpt: Rendered,
  content: Rendered,
  _embedded: Embedded,
  yoast_head_json: z
    .object({ title: z.string().optional(), description: z.string().optional() })
    .partial()
    .optional(),
});

export type WpBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  author: string;
  html: string;
  image?: WpImage;
  seoTitle?: string;
  seoDescription?: string;
};

function mapPost(raw: z.infer<typeof WpPost>): WpBlogPost {
  return {
    slug: raw.slug,
    title: decodeEntities(raw.title.rendered),
    excerpt: toPlainText(raw.excerpt.rendered),
    date: raw.date,
    modified: raw.modified,
    author: raw._embedded?.author?.[0]?.name ?? "Consulat Team",
    html: raw.content.rendered,
    image: embeddedImage(raw._embedded),
    seoTitle: raw.yoast_head_json?.title,
    seoDescription: raw.yoast_head_json?.description,
  };
}

export async function fetchPosts(): Promise<WpBlogPost[]> {
  const raw = await wpFetch<unknown[]>(
    "/wp/v2/posts?per_page=100&_embed&orderby=date&order=desc",
    { tags: [TAGS.posts] },
  );
  return z.array(WpPost).parse(raw).map(mapPost);
}

export async function fetchPost(slug: string): Promise<WpBlogPost | null> {
  const raw = await wpFetch<unknown[]>(
    `/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`,
    { tags: [TAGS.posts, `post:${slug}`] },
  );
  const parsed = z.array(WpPost).parse(raw);
  return parsed[0] ? mapPost(parsed[0]) : null;
}

/** Draft or pending post, for preview mode. Never cached. */
export async function fetchPostPreview(slug: string): Promise<WpBlogPost | null> {
  const raw = await wpFetch<unknown[]>(
    `/wp/v2/posts?slug=${encodeURIComponent(slug)}&status=draft,pending,future,publish&_embed`,
    { tags: [], authenticated: true },
  );
  const parsed = z.array(WpPost).parse(raw);
  return parsed[0] ? mapPost(parsed[0]) : null;
}

/* -------------------------------------------------------------------------
 * FAQs
 * ---------------------------------------------------------------------- */

const WpFaq = z.object({
  slug: z.string(),
  title: Rendered,
  content: Rendered,
});

export type WpFaqItem = { q: string; a: string };

export async function fetchFaqs(): Promise<WpFaqItem[]> {
  const raw = await wpFetch<unknown[]>(
    "/wp/v2/faqs?per_page=100&orderby=menu_order&order=asc",
    { tags: [TAGS.faqs] },
  );
  return z.array(WpFaq).parse(raw).map((f) => ({
    q: decodeEntities(f.title.rendered),
    // Answers render as plain text inside an accordion, and feed FAQPage
    // structured data where markup is not allowed.
    a: toPlainText(f.content.rendered),
  }));
}

/* -------------------------------------------------------------------------
 * Testimonials
 * ---------------------------------------------------------------------- */

const WpTestimonial = z.object({
  slug: z.string(),
  acf: z.object({
    quote: z.string(),
    person_name: z.string(),
    role: z.string(),
    country: z.string(),
    flag: z.string(),
  }),
});

export type WpTestimonialItem = {
  quote: string;
  name: string;
  role: string;
  country: string;
  flag: string;
};

export async function fetchTestimonials(): Promise<WpTestimonialItem[]> {
  const raw = await wpFetch<unknown[]>(
    "/wp/v2/testimonials?per_page=100&orderby=menu_order&order=asc",
    { tags: [TAGS.testimonials] },
  );
  return z.array(WpTestimonial).parse(raw).map((t) => ({
    quote: t.acf.quote,
    name: t.acf.person_name,
    role: t.acf.role,
    country: t.acf.country,
    flag: t.acf.flag,
  }));
}

/* -------------------------------------------------------------------------
 * Team
 * ---------------------------------------------------------------------- */

const WpTeamMember = z.object({
  title: Rendered,
  acf: z.object({
    role: z.string(),
    // SCF returns `false` for an empty repeater, not an empty array.
    bio: z
      .union([z.array(z.object({ text: z.string() })), z.literal(false), z.null()])
      .transform((v) => (Array.isArray(v) ? v : [])),
  }),
  _embedded: Embedded,
});

export type WpTeamMemberItem = {
  name: string;
  role: string;
  image?: string;
  bio: string[];
};

export async function fetchTeam(): Promise<WpTeamMemberItem[]> {
  const raw = await wpFetch<unknown[]>(
    "/wp/v2/team?per_page=100&_embed&orderby=menu_order&order=asc",
    { tags: [TAGS.team] },
  );
  return z.array(WpTeamMember).parse(raw).map((m) => ({
    name: decodeEntities(m.title.rendered),
    role: m.acf.role,
    image: embeddedImage(m._embedded)?.url,
    bio: m.acf.bio.map((b) => b.text),
  }));
}

/* -------------------------------------------------------------------------
 * Client logos
 * ---------------------------------------------------------------------- */

const WpClient = z.object({
  title: Rendered,
  _embedded: Embedded,
});

export type WpClientItem = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export async function fetchClients(): Promise<WpClientItem[]> {
  const raw = await wpFetch<unknown[]>(
    "/wp/v2/clients?per_page=100&_embed&orderby=menu_order&order=asc",
    { tags: [TAGS.clients] },
  );

  return z
    .array(WpClient)
    .parse(raw)
    .flatMap((c) => {
      const img = embeddedImage(c._embedded);
      // A logo with no image, or no intrinsic dimensions, cannot be laid out
      // by next/image — skip it rather than crash the marquee.
      if (!img?.width || !img.height) return [];
      return [
        {
          name: decodeEntities(c.title.rendered),
          src: img.url,
          width: img.width,
          height: img.height,
        },
      ];
    });
}

/* -------------------------------------------------------------------------
 * Service page copy
 * ---------------------------------------------------------------------- */

/** SCF returns `false` for empty repeaters — normalise to []. */
function repeater<T extends z.ZodTypeAny>(schema: T) {
  return z
    .union([z.array(schema), z.literal(false), z.null(), z.undefined()])
    .transform((v) => (Array.isArray(v) ? v : []));
}

const WpServicePage = z.object({
  slug: z.string(),
  modified: z.string(),
  acf: z.object({
    hero_subtitle: z.string().default(""),
    intro_paragraphs: repeater(z.object({ text: z.string() })),
    what_we_handle: repeater(
      z.object({ title: z.string(), description: z.string() }),
    ),
    eligibility_intro: z.string().default(""),
    eligibility: repeater(z.object({ item: z.string() })),
    eligibility_outro: z.string().default(""),
    cta_heading: z.string().default(""),
    cta_body: z.string().default(""),
    banner_image: ScfImage,
    cover_image: ScfImage,
    schema_description: z.string().default(""),
  }),
  yoast_head_json: z
    .object({ title: z.string().optional(), description: z.string().optional() })
    .partial()
    .optional(),
});

export type WpServicePageContent = {
  slug: string;
  modified: string;
  heroSubtitle: string;
  introParagraphs: string[];
  whatWeHandle: { title: string; description: string }[];
  eligibilityIntro: string;
  eligibility: string[];
  eligibilityOutro: string;
  ctaHeading: string;
  ctaBody: string;
  bannerImage?: WpImage;
  coverImage?: WpImage;
  schemaDescription: string;
  seoTitle?: string;
  seoDescription?: string;
};

function scfImage(v: z.infer<typeof ScfImage>): WpImage | undefined {
  if (!v?.url) return undefined;
  return { url: v.url, alt: v.alt ?? "", width: v.width, height: v.height };
}

export async function fetchServicePage(
  slug: string,
): Promise<WpServicePageContent | null> {
  const raw = await wpFetch<unknown[]>(
    `/wp/v2/pages?slug=${encodeURIComponent(slug)}`,
    { tags: [TAGS.pages, `page:${slug}`] },
  );

  const parsed = z.array(WpServicePage).parse(raw);
  const page = parsed[0];
  if (!page) return null;

  return {
    slug: page.slug,
    modified: page.modified,
    heroSubtitle: page.acf.hero_subtitle,
    introParagraphs: page.acf.intro_paragraphs.map((p) => p.text),
    whatWeHandle: page.acf.what_we_handle,
    eligibilityIntro: page.acf.eligibility_intro,
    eligibility: page.acf.eligibility.map((e) => e.item),
    eligibilityOutro: page.acf.eligibility_outro,
    ctaHeading: page.acf.cta_heading,
    ctaBody: page.acf.cta_body,
    bannerImage: scfImage(page.acf.banner_image),
    coverImage: scfImage(page.acf.cover_image),
    schemaDescription: page.acf.schema_description,
    seoTitle: page.yoast_head_json?.title,
    seoDescription: page.yoast_head_json?.description,
  };
}

/* -------------------------------------------------------------------------
 * Site settings (the SCF options page)
 * ---------------------------------------------------------------------- */

const WpSettings = z.object({
  updated_at: z.string().default(""),
  fields: z.object({
    tagline: z.string().nullish(),
    description: z.string().nullish(),
    email: z.string().nullish(),
    phone: z.string().nullish(),
    phone2: z.string().nullish(),
    altphone: z.string().nullish(),
    whatsapp: z.string().nullish(),
    whatsapp_message: z.string().nullish(),
    hours: z.string().nullish(),
    calendar_url: z.string().nullish(),
    address: z
      .object({
        street_address: z.string().nullish(),
        address_locality: z.string().nullish(),
        address_region: z.string().nullish(),
        address_country: z.string().nullish(),
      })
      .nullish(),
    social: z
      .object({
        linkedin: z.string().nullish(),
        twitter: z.string().nullish(),
        instagram: z.string().nullish(),
      })
      .nullish(),
  }),
});

export type WpSettingsContent = z.infer<typeof WpSettings>["fields"] & {
  updatedAt: string;
};

export async function fetchSettings(): Promise<WpSettingsContent> {
  const raw = await wpFetch<unknown>("/consulat/v1/settings", {
    tags: [TAGS.settings],
  });
  const parsed = WpSettings.parse(raw);
  return { ...parsed.fields, updatedAt: parsed.updated_at };
}
