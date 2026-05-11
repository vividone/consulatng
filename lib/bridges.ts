import fs from "node:fs";
import path from "node:path";

const BRIDGES_DIR = path.join(process.cwd(), "public", "about-bridges");

/**
 * Lists every image file in /public/about-bridges/ at build time and
 * returns their public URLs (e.g. "/about-bridges/foo.jpg"). New files
 * dropped into the folder are picked up automatically on the next build.
 */
export function getBridgeImages(): string[] {
  if (!fs.existsSync(BRIDGES_DIR)) return [];
  return fs
    .readdirSync(BRIDGES_DIR)
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort()
    .map((f) => `/about-bridges/${f}`);
}
