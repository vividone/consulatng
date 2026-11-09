/**
 * The site's read path into the CMS.
 *
 * Every public page reads content through this module and nothing else, the
 * same way lib/wp.ts was the only thing that talked to WordPress. One place
 * to change if the backing store changes again, and one place that knows how
 * to turn a Payload document into the shape a component wants.
 *
 * Uses Payload's **Local API**, not HTTP: this runs inside the same Next
 * process as Payload, so queries are direct database calls with no network
 * hop and no auth round-trip. That matters for static generation, where a
 * build makes dozens of these.
 *
 * Wrapped in React `cache()` so that several components asking for site
 * settings during one render produce one query rather than several.
 */

import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

import type {
  AboutPage,
  ClientLogo,
  ContactPage,
  Faq,
  FaqPage,
  HomePage,
  ServicesPage,
  Media,
  Post,
  Service,
  SiteSetting,
  TeamMember,
  Testimonial,
} from "@/cms/payload-types";

const client = cache(async () => getPayload({ config }));

/** Payload relations come back either as an id or as the populated doc. */
function asMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === "object" ? value : null;
}

export type ResolvedImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Narrows a Media doc to the fields next/image needs. Returns null when any
 * are missing — a logo without intrinsic dimensions cannot be laid out, and
 * rendering it blows up the marquee rather than degrading.
 */
export function resolveImage(
  value: number | Media | null | undefined,
): ResolvedImage | null {
  const media = asMedia(value);
  if (!media?.url || !media.width || !media.height) return null;
  return {
    url: media.url,
    alt: media.alt ?? "",
    width: media.width,
    height: media.height,
  };
}

/* -------------------------------------------------------------------------
 * Pages
 * ---------------------------------------------------------------------- */

export const getHomePage = cache(async (): Promise<HomePage> => {
  const payload = await client();
  return payload.findGlobal({ slug: "home-page", depth: 1 });
});

export const getAboutPage = cache(async (): Promise<AboutPage> => {
  const payload = await client();
  return payload.findGlobal({ slug: "about-page" });
});

export const getServicesPage = cache(async (): Promise<ServicesPage> => {
  const payload = await client();
  return payload.findGlobal({ slug: "services-page" });
});

export const getFaqPage = cache(async (): Promise<FaqPage> => {
  const payload = await client();
  return payload.findGlobal({ slug: "faq-page" });
});

export const getContactPage = cache(async (): Promise<ContactPage> => {
  const payload = await client();
  return payload.findGlobal({ slug: "contact-page" });
});

/* -------------------------------------------------------------------------
 * Services
 * ---------------------------------------------------------------------- */

/**
 * The slim shape the navigation, footer, sitemap and service cards need.
 *
 * Those render on every page, so pulling the full service document — every
 * cover item, every section, all the rich text — just to print a title in
 * the nav would be wasteful. `select` keeps the query to the columns used.
 */
export type ServiceSummary = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  covers: string[];
  cardImage: ResolvedImage | null;
  menuIcon: string;
};

export const getServiceSummaries = cache(
  async (): Promise<ServiceSummary[]> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "services",
      sort: "order",
      limit: 100,
      pagination: false,
      depth: 1,
    });
    return docs.map((doc) => ({
      slug: doc.slug,
      title: doc.title,
      shortTitle: doc.shortTitle,
      summary: doc.summary,
      covers: (doc.covers ?? []).map((c) => c.label),
      cardImage: resolveImage(doc.cardImage),
      menuIcon: doc.menuIcon,
    }));
  },
);

export const getServiceBySlug = cache(
  async (slug: string): Promise<Service | null> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      limit: 1,
      pagination: false,
      depth: 1,
    });
    return docs[0] ?? null;
  },
);

/**
 * Previous and next in display order, wrapping at both ends so the pair is
 * always present — the same behaviour the hardcoded ServiceNav had.
 */
export function adjacentServices(
  services: ServiceSummary[],
  currentSlug: string,
): { prev: ServiceSummary; next: ServiceSummary } | null {
  const i = services.findIndex((s) => s.slug === currentSlug);
  if (i === -1 || services.length < 2) return null;
  return {
    prev: services[(i - 1 + services.length) % services.length],
    next: services[(i + 1) % services.length],
  };
}

/* -------------------------------------------------------------------------
 * FAQs
 * ---------------------------------------------------------------------- */

export const getFaqs = cache(async (): Promise<Faq[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "faqs",
    sort: "order",
    limit: 200,
    pagination: false,
  });
  return docs;
});

/* -------------------------------------------------------------------------
 * Testimonials
 * ---------------------------------------------------------------------- */

export const getTestimonials = cache(async (): Promise<Testimonial[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "testimonials",
    sort: "order",
    limit: 200,
    pagination: false,
  });
  return docs;
});

/* -------------------------------------------------------------------------
 * Client logos
 * ---------------------------------------------------------------------- */

export type ClientLogoView = { name: string; image: ResolvedImage };

export const getClientLogos = cache(async (): Promise<ClientLogoView[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "client-logos",
    sort: "order",
    limit: 200,
    pagination: false,
    depth: 1,
  });

  return docs.flatMap((doc: ClientLogo) => {
    const image = resolveImage(doc.logo);
    return image ? [{ name: doc.name, image }] : [];
  });
});

/* -------------------------------------------------------------------------
 * Team
 * ---------------------------------------------------------------------- */

export type TeamMemberView = {
  name: string;
  role: string;
  image?: string;
  bio: string[];
};

export const getTeam = cache(async (): Promise<TeamMemberView[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "team-members",
    sort: "order",
    limit: 200,
    pagination: false,
    depth: 1,
  });

  return docs.map((m: TeamMember) => ({
    name: m.name,
    role: m.role,
    image: asMedia(m.photo)?.url ?? undefined,
    bio: (m.bio ?? []).map((p) => p.text),
  }));
});

/* -------------------------------------------------------------------------
 * Blog posts
 * ---------------------------------------------------------------------- */

/**
 * Published posts only.
 *
 * The `_status` filter is load-bearing, not defensive. Posts have drafts
 * enabled, and the collection's `isPublishedOrStaff` read rule does NOT
 * apply here: the Local API runs with `overrideAccess: true` by default, so
 * access control is skipped and unpublished drafts come back like anything
 * else.
 *
 * Two things go wrong without it. An unfinished draft appears on /blog and
 * in the sitemap, which is a content leak. Worse, Payload does not enforce
 * required fields on drafts, so clicking "Create New" in the back office and
 * letting autosave fire produces a row with a null slug — and that fails the
 * production build outright in generateStaticParams, because Next reports a
 * null param as "received object".
 */
export const getPosts = cache(async (): Promise<Post[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 500,
    pagination: false,
    depth: 1,
  });
  return docs;
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "posts",
    // Published only, for the same reason as getPosts above: without it an
    // unpublished draft is readable by anyone who guesses its URL.
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }],
    },
    limit: 1,
    pagination: false,
    depth: 1,
  });
  return docs[0] ?? null;
});

/* -------------------------------------------------------------------------
 * Site settings
 * ---------------------------------------------------------------------- */

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await client();
  return payload.findGlobal({ slug: "site-settings" });
});

/**
 * Display and link forms of the WhatsApp number, both derived from the single
 * digits-only field.
 *
 * They used to be two separate constants and had drifted — the displayed
 * number was missing a digit while the link was correct. Deriving both from
 * one value makes that impossible rather than merely unlikely.
 */
export function whatsapp(settings: SiteSetting) {
  const digits = (settings.whatsappNumber ?? "").replace(/\D/g, "");
  const message =
    settings.whatsappMessage ??
    "Hello Consulat, I would like to enquire about your immigration services.";

  // +234 814 165 7981 — country code, then 3-3-4.
  const display = digits.startsWith("234")
    ? `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`.trim()
    : `+${digits}`;

  return {
    display,
    href: `https://wa.me/${digits}?text=${encodeURIComponent(message)}`,
  };
}

/**
 * Minutes to read, from the Lexical document.
 *
 * Counts words in the text nodes rather than characters in the JSON — the
 * markup is most of the payload, so measuring the serialised document would
 * make every post read as several times longer than it is.
 */
export function readingTime(content: Post["content"]): number {
  let words = 0;

  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") return;
    const n = node as { text?: unknown; children?: unknown[] };
    if (typeof n.text === "string" && n.text.trim()) {
      words += n.text.trim().split(/\s+/).length;
    }
    if (Array.isArray(n.children)) n.children.forEach(walk);
  };

  walk(content?.root);
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
