/**
 * Fixed-window rate limiter, in process memory.
 *
 * Caveat, stated plainly: serverless instances do not share memory, so the
 * effective limit is `max` per instance per window, not per deployment. A
 * determined attacker spreading requests across cold starts gets more through
 * than the number below suggests.
 *
 * It is still worth having. The traffic this actually stops — a script
 * hammering /api/contact from one address — hits one warm instance and is
 * blocked. When the operations platform brings a Supabase connection with it,
 * move the counter into Postgres (or Upstash) and this module goes away.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

/** Drop expired entries so the map cannot grow without bound. */
function sweep(now: number) {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets. Suitable for a Retry-After header. */
  retryAfter: number;
};

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();

  // Cheap amortised cleanup — the map only ever holds a handful of keys.
  if (buckets.size > 500) sweep(now);

  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;

  if (entry.count > max) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * Best-effort client IP. Vercel sets `x-forwarded-for`; the leftmost entry is
 * the client. Falls back to a constant, which means unknown-IP traffic shares
 * one bucket — deliberately conservative.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
