import { RateLimitError } from "@/src/types/errors";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export class InMemoryRateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private defaultLimit: number;
  private windowMs: number;

  constructor(limit: number = 10, windowMs: number = 10000) {
    this.defaultLimit = limit;
    this.windowMs = windowMs;
  }

  check(
    identifier: string,
    limit?: number
  ): { success: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.store.get(identifier);

    if (!entry || now >= entry.resetAt) {
      const newEntry: RateLimitEntry = { count: 1, resetAt: now + this.windowMs };
      this.store.set(identifier, newEntry);
      return {
        success: true,
        remaining: (limit || this.defaultLimit) - 1,
        resetAt: newEntry.resetAt,
      };
    }

    if (entry.count >= (limit || this.defaultLimit)) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      throw new RateLimitError(retryAfter, "Rate limit exceeded. Please try again later.");
    }

    entry.count++;
    return {
      success: true,
      remaining: (limit || this.defaultLimit) - entry.count,
      resetAt: entry.resetAt,
    };
  }

  reset(identifier: string): void {
    this.store.delete(identifier);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetAt) {
        this.store.delete(key);
      }
    }
  }

  getStats(): { total: number; active: number } {
    const now = Date.now();
    const active = Array.from(this.store.values()).filter((e) => now < e.resetAt).length;
    return { total: this.store.size, active };
  }
}

export const rateLimiter = new InMemoryRateLimiter(10, 10000);
