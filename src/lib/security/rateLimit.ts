interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup stale entries periodically to prevent memory leaks in long-running processes
if (typeof setInterval !== "undefined") {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (record.resetAt <= now) {
        rateLimitMap.delete(key);
      }
    }
  }, 300_000);
  if (typeof cleanupTimer.unref === "function") {
    cleanupTimer.unref();
  }
}

export interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  headers: Record<string, string>;
}

export function checkRateLimit(
  request: Request,
  prefix = "general",
  options: RateLimitOptions = {}
): RateLimitResult {
  const windowMs = options.windowMs || 60_000;
  const maxRequests = options.maxRequests || 60;

  // Extract client IP safely from standard headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";
  const key = `${prefix}:${clientIp}`;

  const now = Date.now();
  const existing = rateLimitMap.get(key);

  if (!existing || existing.resetAt <= now) {
    const record: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitMap.set(key, record);

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: Math.ceil(record.resetAt / 1000),
      headers: {
        "X-RateLimit-Limit": String(maxRequests),
        "X-RateLimit-Remaining": String(maxRequests - 1),
        "X-RateLimit-Reset": String(Math.ceil(record.resetAt / 1000)),
      },
    };
  }

  existing.count += 1;
  const remaining = Math.max(0, maxRequests - existing.count);
  const resetSeconds = Math.ceil(existing.resetAt / 1000);
  const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  const success = existing.count <= maxRequests;

  return {
    success,
    limit: maxRequests,
    remaining,
    reset: resetSeconds,
    headers: {
      "X-RateLimit-Limit": String(maxRequests),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(resetSeconds),
      ...(success ? {} : { "Retry-After": String(retryAfterSeconds) }),
    },
  };
}

