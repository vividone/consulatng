import type { Metadata } from "next";
import { SITE } from "./constants";

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
};

/**
 * The card image is set explicitly on every page rather than left to Next's
 * `opengraph-image` file convention. The convention attaches the image to its
 * own segment only, and an explicit `openGraph` object in a child segment —
 * which this function produces for every page — replaces the inherited one,
 * image included. That silently left sixteen of seventeen pages with no card.
 *
 * `/og` is a route (app/og/route.tsx), so the URL is stable and hash-free.
 */
const OG_IMAGE = `${SITE.url}/og`;

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
}: PageMetaInput): Metadata {
  const url = `${SITE.url}${path}`;
  const images = [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }];
  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "en_GB",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
