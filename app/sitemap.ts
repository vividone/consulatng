import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE, SERVICES } from "@/lib/constants";

/**
 * Blog entries carry their real `modified` date from the CMS rather than build
 * time. Stamping `new Date()` on every URL claims all 15 pages changed
 * simultaneously on every deploy, which trains Google to ignore the signal.
 *
 * Static routes still use build time — they change only when the code does,
 * so a deploy genuinely is their last-modified date.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const buildTime = new Date();
  const staticRoutes = ["", "/about", "/services", "/faq", "/contact", "/blog"];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: buildTime,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  SERVICES.forEach((s) => {
    entries.push({
      url: `${SITE.url}/services/${s.slug}`,
      lastModified: buildTime,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  (await getAllPosts()).forEach((post) => {
    entries.push({
      url: `${SITE.url}/blog/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return entries;
}
