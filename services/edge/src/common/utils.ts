/**
 * Least-recently used cache eviction strategy Map implementation
 */
export class LRUCacheMap<T, K = any> {
  private values = new Map<K, T>();

  constructor(private maxEntries = 20) {}

  public get<V = T>(key: K) {
    const hasKey = this.values.has(key);
    let entry: unknown;
    if (hasKey) {
      // peek the entry, re-insert for LRU strategy
      entry = this.values.get(key);
      this.values.delete(key);
      this.values.set(key, entry as any);
    }

    return entry as V | undefined;
  }

  public has(key: K) {
    return this.values.has(key);
  }

  public set<V = T>(key: K, value: V) {
    if (this.values.size >= this.maxEntries) {
      // least-recently used cache eviction strategy
      const keyToDelete = this.values.keys().next().value;

      this.values.delete(keyToDelete);
    }

    this.values.set(key, value as any);
  }
}
