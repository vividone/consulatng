import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/blog";
import { SITE, SERVICES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = ["", "/about", "/services", "/faq", "/contact", "/blog"];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  SERVICES.forEach((s) => {
    entries.push({
      url: `${SITE.url}/services/${s.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  getAllPostSlugs().forEach((slug) => {
    entries.push({
      url: `${SITE.url}/blog/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  return entries;
}
