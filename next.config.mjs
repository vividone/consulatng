import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */

/**
 * Security headers.
 *
 * No CSP yet: the site embeds a Google Maps iframe and loads Google Fonts,
 * and a policy tight enough to be worth having needs to be written against a
 * real inventory of third-party origins. The headers below are the ones that
 * carry no such risk of breaking a page.
 */
const securityHeaders = [
  // HSTS. Vercel serves HTTPS only, so there is no plaintext origin to break.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking: nothing on this site is meant to be framed elsewhere.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these; deny them so an injected script cannot.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

/**
 * Media uploads are served straight from the bucket (see
 * `disablePayloadAccessControl` in payload.config.ts), so next/image needs
 * that host allowed or it refuses to optimise and the images 400.
 *
 * Read from S3_PUBLIC_URL when set, since that — not the S3 API endpoint — is
 * the host browsers actually fetch from. Providers like Tigris serve public
 * objects on a per-bucket subdomain while the API lives elsewhere, and a CDN
 * in front of the bucket changes it again. Falls back to S3_ENDPOINT, which
 * matches the default path-style URLs.
 *
 * Derived rather than hardcoded so staging, production and a change of
 * provider need no code change — and an unset or malformed value yields no
 * extra pattern instead of failing the build.
 *
 * This is read at BUILD time, so the variable must be present in the build
 * environment on Vercel, not only at runtime.
 */
const bucketPattern = (() => {
  const source = process.env.S3_PUBLIC_URL?.trim() || process.env.S3_ENDPOINT;
  if (!source) return [];
  try {
    const { protocol, hostname } = new URL(source);
    return [{ protocol: protocol.replace(":", ""), hostname }];
  } catch {
    console.warn(`[next.config] Bucket URL is not valid, ignoring: ${source}`);
    return [];
  }
})();

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...bucketPattern,
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withPayload(nextConfig);
