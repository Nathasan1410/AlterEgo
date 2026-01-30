import { SimpleCache } from '../../src/cache/simpleCache';

describe('SimpleCache', () => {
  let cache: SimpleCache;

  beforeEach(() => {
    cache = new SimpleCache(1, 3); // 1 sec TTL, max 3 entries
  });

  it('should store and retrieve values', async () => {
    await cache.set('key1', 'value1');
    const val = await cache.get('key1');
    expect(val).toBe('value1');
  });

  it('should return null for missing keys', async () => {
    const val = await cache.get('missing');
    expect(val).toBeNull();
  });

  it('should expire items after TTL', async () => {
    await cache.set('key1', 'value1');
    
    // Mock time passing
    const realDateNow = Date.now;
    Date.now = jest.fn(() => realDateNow() + 2000); // +2s

    const val = await cache.get('key1');
    expect(val).toBeNull();

    Date.now = realDateNow; // Restore
  });

  it('should evict oldest item when full', async () => {
    await cache.set('a', 1);
    await cache.set('b', 2);
    await cache.set('c', 3);
    
    // Cache is full (3 items). Next set should evict 'a'
    await cache.set('d', 4);

    expect(await cache.get('a')).toBeNull();
    expect(await cache.get('b')).toBe(2);
    expect(await cache.get('d')).toBe(4);
  });
});
