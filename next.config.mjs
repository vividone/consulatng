/** @type {import('next').NextConfig} */

/**
 * Media uploaded in WordPress is served from the CMS host, so that host must be
 * allowed for next/image. Derived from WP_API_URL rather than hardcoded, so
 * staging and production need no config change — and a missing env var simply
 * yields no extra pattern instead of a build error.
 */
const wpHost = (() => {
  if (!process.env.WP_API_URL) return [];
  try {
    const { protocol, hostname } = new URL(process.env.WP_API_URL);
    return [{ protocol: protocol.replace(":", ""), hostname }];
  } catch {
    console.warn(
      `[next.config] WP_API_URL is not a valid URL, ignoring: ${process.env.WP_API_URL}`,
    );
    return [];
  }
})();

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      ...wpHost,
    ],
  },
};

export default nextConfig;
