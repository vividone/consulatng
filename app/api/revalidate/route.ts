import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { TAGS } from "@/lib/wp";

/**
 * On-demand revalidation endpoint, called by the WordPress plugin whenever
 * content is saved, deleted, or the Site Settings page is updated.
 *
 * See wordpress/consulat-headless/inc/revalidate.php for the caller. The tag
 * vocabulary is shared between the two and must stay in sync.
 *
 * Auth is a shared secret in the `X-Consulat-Secret` header, compared in
 * constant time. Without it this endpoint would let anyone force the site to
 * re-fetch every page from a shared-hosting WordPress on demand — a cheap
 * amplification attack against the client's own server.
 */

/** Tags this route is willing to purge. An allowlist, so a compromised or
 *  buggy caller cannot invent tags and force arbitrary cache misses. */
const ALLOWED = new Set<string>([...Object.values(TAGS)]);

/** Prefixed per-document tags, e.g. `post:my-slug`. */
const ALLOWED_PREFIXES = ["post:", "page:"];

function isAllowed(tag: string): boolean {
  if (ALLOWED.has(tag)) return true;
  return ALLOWED_PREFIXES.some(
    (prefix) => tag.startsWith(prefix) && tag.length > prefix.length,
  );
}

/** Length-safe, timing-attack-resistant string comparison. */
function secretsMatch(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    // Misconfiguration, not a client error — fail closed and say so in logs.
    console.error("[revalidate] REVALIDATE_SECRET is not set; rejecting request.");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const provided = request.headers.get("x-consulat-secret") ?? "";
  if (!secretsMatch(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const requested =
    typeof body === "object" && body !== null && Array.isArray((body as { tags?: unknown }).tags)
      ? ((body as { tags: unknown[] }).tags.filter(
          (t): t is string => typeof t === "string",
        ))
      : [];

  if (requested.length === 0) {
    return NextResponse.json({ error: "No tags supplied" }, { status: 400 });
  }

  const purged: string[] = [];
  const rejected: string[] = [];

  for (const tag of requested) {
    if (!isAllowed(tag)) {
      rejected.push(tag);
      continue;
    }
    revalidateTag(tag);
    purged.push(tag);
  }

  if (rejected.length > 0) {
    console.warn(`[revalidate] Ignored unrecognised tags: ${rejected.join(", ")}`);
  }

  return NextResponse.json({ revalidated: purged, ignored: rejected });
}
