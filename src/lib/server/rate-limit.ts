import "server-only";

type Bucket = { count: number; resetAt: number };

const globalBuckets = globalThis as typeof globalThis & {
  __mocSuongRateLimits?: Map<string, Bucket>;
};
const buckets =
  globalBuckets.__mocSuongRateLimits ??
  (globalBuckets.__mocSuongRateLimits = new Map<string, Bucket>());

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
  } else if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  } else {
    current.count += 1;
  }

  if (buckets.size > 5_000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  return { allowed: true, retryAfter: 0 };
}
