import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

/**
 * Site-wide Open Graph / Twitter card image, served at a stable `/og`.
 *
 * A plain route rather than Next's `opengraph-image` file convention, which
 * turned out not to survive this app's structure: the convention attaches the
 * image to its own segment, and any child segment exporting its own
 * `openGraph` object — which every page here does, via buildMetadata —
 * replaces the inherited one, image included. The result was a correct card
 * on the home page and none at all on the other sixteen.
 *
 * As a route the URL is fixed and hash-free, so lib/metadata.ts can reference
 * it directly on every page and the behaviour is the same everywhere.
 *
 * Edge, not Node: the Node build of @vercel/og calls fileURLToPath on a
 * Windows path during prerender and throws `Invalid URL`, failing the build
 * on a Windows dev machine while passing in CI.
 */
export const runtime = "edge";

// Not exported: a route module may only export the HTTP verbs and a fixed
// set of config keys, and anything else fails the build's type check.
const SIZE = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#04165C",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, #1F49C9 0%, transparent 55%), radial-gradient(circle at 85% 95%, #3B82F6 0%, transparent 50%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 30,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#60A5FA",
              fontWeight: 600,
            }}
          >
            {SITE.tagline}
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 82,
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#ffffff",
              maxWidth: 900,
            }}
          >
            Immigration &amp; work permits in Nigeria
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid rgba(255,255,255,0.18)",
            paddingTop: 36,
          }}
        >
          <div style={{ fontSize: 46, fontWeight: 800, color: "#ffffff" }}>
            {SITE.name}
          </div>
          <div style={{ fontSize: 30, color: "#DBEAFE" }}>{SITE.domain}</div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        // Brand lockup; it changes when the code does. Let the CDN keep it.
        "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
      },
    },
  );
}
