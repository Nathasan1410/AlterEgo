/**
 * Simple In-Memory Cache
 * Uses LRU-like strategy with TTL
 */

import { ICacheAdapter } from "../services/adapters/interfaces";
import { CacheEntry } from "../models/generated";

export class SimpleCache implements ICacheAdapter {
  private cache: Map<string, CacheEntry<any>>;
  private readonly defaultTTL: number;
  private readonly maxEntries: number;

  constructor(defaultTTLSeconds: number = 300, maxEntries: number = 100) {
    this.cache = new Map();
    this.defaultTTL = defaultTTLSeconds * 1000;
    this.maxEntries = maxEntries;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    // Evict oldest if full (simple logic: delete first key)
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl: (ttlSeconds || this.defaultTTL / 1000) * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}
