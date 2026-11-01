import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * On-demand revalidation.
 *
 * Every public page is statically generated, so without this a publish in the
 * back office changes nothing on the live site until the next deploy — and
 * Google goes on indexing the old copy. This is the same requirement the
 * WordPress integration solved with a webhook; here Payload runs inside the
 * same Next process, so it is a direct function call with no shared secret
 * and no network hop.
 *
 * Paths are listed explicitly rather than revalidating everything. A blanket
 * purge on every keystroke of an autosaved draft would throw away the whole
 * static cache several times a minute.
 */

/** Pages that render a given collection. Keep in step with lib/content.ts. */
const PATHS = {
  faqs: ["/faq"],
  testimonials: ["/"],
  "client-logos": ["/"],
  "team-members": ["/about"],
  // Settings feed the footer and the organisation schema, which are on
  // every page — hence the layout, which covers all of them at once.
  settings: ["/", "/about", "/services", "/faq", "/contact", "/blog"],
} as const;

/**
 * Services appear in more places than any other collection: their own page,
 * the services index, the home page stack, and the navigation and footer on
 * every page. The layout covers the last of those, which is why the full
 * page list is purged rather than just the service's own URL.
 */
const SERVICE_PATHS = [
  "/",
  "/about",
  "/services",
  "/faq",
  "/contact",
  "/blog",
  "/sitemap.xml",
] as const;

/**
 * `revalidatePath` only works inside a Next request or render context. Payload
 * writes also happen well outside one — the content seed, migration scripts,
 * scheduled jobs — and there it throws "static generation store missing".
 *
 * Those callers are not serving a cache that needs purging, so swallowing it
 * is correct rather than merely convenient. Anything else is logged: a
 * revalidation that fails silently during a real publish is the exact bug
 * this module exists to prevent.
 */
function purge(paths: readonly string[]) {
  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("static generation store")) continue;
      console.error(`[revalidate] Failed to purge ${path}:`, message);
    }
  }
}

export function revalidateCollection(
  key: keyof typeof PATHS,
): CollectionAfterChangeHook {
  return ({ doc, req }) => {
    // Autosave fires afterChange constantly while someone types. Only a
    // published document is on the public site, so only that needs a purge.
    if (req.context?.skipRevalidation) return doc;
    purge(PATHS[key]);
    return doc;
  };
}

export function revalidateCollectionOnDelete(
  key: keyof typeof PATHS,
): CollectionAfterDeleteHook {
  return ({ doc }) => {
    purge(PATHS[key]);
    return doc;
  };
}

export const revalidateSettings: GlobalAfterChangeHook = ({ doc }) => {
  purge(PATHS.settings);
  return doc;
};

/**
 * Purges a single page. Used by the per-page globals, each of which backs
 * exactly one route, so there is nothing else to invalidate.
 */
export function revalidatePage(path: string): GlobalAfterChangeHook {
  return ({ doc }) => {
    purge([path]);
    return doc;
  };
}

/**
 * Posts need the index and their own page, and the sitemap entry that lists
 * them. A slug change has to purge the old path too, or the previous URL
 * keeps serving a page the CMS no longer knows about.
 */
export const revalidatePost: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
}) => {
  if (doc._status === "published") {
    purge(["/blog", `/blog/${doc.slug}`, "/sitemap.xml"]);
  }

  // Unpublished, or renamed: the old URL must stop serving.
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    purge([`/blog/${previousDoc.slug}`]);
  }
  if (previousDoc?._status === "published" && doc._status !== "published") {
    purge(["/blog", `/blog/${doc.slug}`, "/sitemap.xml"]);
  }

  return doc;
};

export const revalidatePostOnDelete: CollectionAfterDeleteHook = ({ doc }) => {
  purge(["/blog", "/sitemap.xml"]);
  if (doc?.slug) purge([`/blog/${doc.slug}`]);
  return doc;
};

/**
 * A service change also has to purge the detail page, and the previous URL
 * when the slug changed — otherwise the old path keeps serving a page the
 * CMS no longer knows about, and the prev/next links point into a 404.
 */
export const revalidateService: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
}) => {
  purge(SERVICE_PATHS);
  if (doc?.slug) purge([`/services/${doc.slug}`]);
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    purge([`/services/${previousDoc.slug}`]);
  }
  return doc;
};

export const revalidateServiceOnDelete: CollectionAfterDeleteHook = ({
  doc,
}) => {
  purge(SERVICE_PATHS);
  if (doc?.slug) purge([`/services/${doc.slug}`]);
  return doc;
};
