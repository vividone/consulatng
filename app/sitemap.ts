import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/content";
import { SITE, SERVICES } from "@/lib/constants";

/**
 * Blog entries carry their own publish date rather than build time. Stamping
 * `new Date()` on every URL claims all 15 pages changed simultaneously on
 * every deploy, which trains Google to ignore the signal.
 *
 * Static routes still use build time — they change only when the code does,
 * so a deploy genuinely is their last-modified date.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildTime = new Date();
  const staticRoutes = ["", "/about", "/services", "/faq", "/contact", "/blog"];
  // Indexable, but they should never outrank a service page.
  const legalRoutes = ["/privacy", "/terms"];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: buildTime,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  legalRoutes.forEach((path) => {
    entries.push({
      url: `${SITE.url}${path}`,
      lastModified: buildTime,
      changeFrequency: "yearly",
      priority: 0.2,
    });
  });

  SERVICES.forEach((s) => {
    entries.push({
      url: `${SITE.url}/services/${s.slug}`,
      lastModified: buildTime,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  (await getPosts()).forEach((post) => {
    entries.push({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return entries;
}
