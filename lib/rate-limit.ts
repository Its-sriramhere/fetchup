import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { createHash } from "node:crypto";

const local = new Map<string, { count: number; reset: number }>();
const configured = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
const limiter = configured ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, "10 m"), analytics: false, prefix: "fetchup:enquiry" }) : null;

export async function limitEnquiry(ip: string) {
  const key = createHash("sha256").update(ip).digest("hex");
  if (limiter) return (await limiter.limit(key)).success;
  if (process.env.NODE_ENV === "production") throw new Error("Production rate limiting is not configured");
  const now = Date.now();
  for (const [id, value] of local) if (value.reset < now) local.delete(id);
  const value = local.get(key) || { count: 0, reset: now + 600000 };
  value.count++;
  local.set(key, value);
  return value.count <= 5;
}
