import { debounce } from "moderndash";

export { merge as objectMerge, debounce, decDebounce, decThrottle } from "moderndash";
export type { PlainObject } from "moderndash";

export function getEnumMembers<T>(myEnum: T): (keyof T)[] {
  // @ts-ignore
  return Object.keys(myEnum).filter((k) => typeof (myEnum as any)[k] === "number") as any;
}

export function getEnumMembersMKeyMap<T>(myEnum: T): { [s: string]: keyof T } {
  const obj: { [s: string]: keyof T } = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key of getEnumMembers(myEnum)) {
    obj[key as string] = key;
  }

  return obj;
}

/**
 * Least-recently used cache eviction strategy Map implementation
 */
export class LRUCacheMap<Value, Key = any> {
  private values = new Map<Key, Value>();

  constructor(private maxEntries = 20) {}

  public get<V = Value>(key: Key) {
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

  public has(key: Key) {
    return this.values.has(key);
  }

  public set<V = Value>(key: Key, value: V) {
    if (this.values.size >= this.maxEntries) {
      // least-recently used cache eviction strategy
      const keyToDelete = this.values.keys().next().value;

      this.values.delete(keyToDelete);
    }

    this.values.set(key, value as any);
  }
}

export function isObject(item: any) {
  return typeof item === "object" && !Array.isArray(item);
}

export async function wait(ms: number) {
  return new Promise<true>((resolve) => setTimeout(() => resolve(true), ms));
}

export function asyncDebounce<F extends (...args: any[]) => Promise<any>>(func: F, wait: number) {
  const resolveSet = new Set<(p: any) => void>();
  const rejectSet = new Set<(p: any) => void>();

  const debounced = debounce((args: Parameters<F>) => {
    func(...args)
      .then((...res) => {
        resolveSet.forEach((resolve) => resolve(...res));
        resolveSet.clear();
      })
      .catch((...res) => {
        rejectSet.forEach((reject) => reject(...res));
        rejectSet.clear();
      });
  }, wait);

  return (...args: Parameters<F>): ReturnType<F> =>
    new Promise((resolve, reject) => {
      resolveSet.add(resolve);
      rejectSet.add(reject);
      debounced(args);
    }) as ReturnType<F>;
}

export function asyncThrottle<F extends (...args: any[]) => Promise<any>>(func: F, wait: number) {
  const resolveSet = new Set<(p: any) => void>();
  const rejectSet = new Set<(p: any) => void>();

  const throttled = throttle((args: Parameters<F>) => {
    return func(...args)
      .then((...res) => {
        resolveSet.forEach((resolve) => resolve(...res));
        resolveSet.clear();
      })
      .catch((...res) => {
        rejectSet.forEach((reject) => reject(...res));
        rejectSet.clear();
      });
  }, wait);

  return (...args: Parameters<F>): ReturnType<F> =>
    new Promise((resolve, reject) => {
      resolveSet.add(resolve);
      rejectSet.add(reject);
      const r = throttled(args);
      if (!(r instanceof Promise)) {
        resolve(r);
      }
    }) as ReturnType<F>;
}

/**
 * Generates a function that invokes the given function at most once per every `wait` milliseconds.
 * The last result is returned.
 *
 * This function can be used as a decorator with {@link decThrottle}.
 * @example
 * const throttled = throttle(() => console.log("Throttled!"), 1000);
 *
 * throttled();
 * throttled();
 * // => "Throttled!" is logged once per second.
 * @param func The function to throttle.
 * @param wait The number of milliseconds to throttle invocations to.
 * @returns Returns the new throttled function.
 */

export function throttle<TFunc extends (...args: any) => any>(
  func: TFunc,
  wait: number
): TFunc & {
  cancel: () => void;
  flush: () => void;
  pending: () => boolean;
} {
  let timeoutId: number | undefined;
  const throttled = function (this: unknown, ...args: Parameters<TFunc>) {
    if (!timeoutId) {
      timeoutId = setTimeout(() => (timeoutId = undefined), wait);
      return func.apply(this, args);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  };

  throttled.flush = function (this: unknown, ...args: Parameters<TFunc>) {
    throttled.cancel();
    return func.apply(this, args);
  };

  throttled.pending = function () {
    return timeoutId !== undefined;
  };

  return throttled as TFunc & { cancel: () => void; flush: () => void; pending: () => boolean };
}

export function queuedThrottle<P extends any[], TFunc extends (...args: P) => any>(func: TFunc, wait: number) {
  let timeoutId: number | undefined;
  let joinTimeoutId: number | undefined;
  const joinPromiseResolves: Set<(s: boolean) => void> = new Set();
  let calling = false;
  let prevValue: any;
  const throttled = async function (this: unknown, ...args: Parameters<TFunc>) {
    if (!timeoutId && !calling) {
      calling = true;
      timeoutId = setTimeout(() => (timeoutId = undefined), wait);
      try {
        const r = await func.apply(this, args);
        prevValue = r;
        return r;
      } finally {
        calling = false;
      }
    } else {
      if (joinTimeoutId) {
        clearTimeout(joinTimeoutId);
        joinPromiseResolves.forEach((resolve) => resolve(true));
      }
      await throttled.join();
    }
    return prevValue;
  };

  throttled.join = async function () {
    while (timeoutId || calling) {
      const p = await new Promise<boolean>((resolve) => {
        joinPromiseResolves.add(resolve);
        joinTimeoutId = setTimeout(() => {
          joinTimeoutId = undefined;
          joinPromiseResolves.delete(resolve);
          resolve(false);
        }, 50);
      });
      if (p) {
        break;
      }
    }
  };

  throttled.cancel = function () {
    if (joinTimeoutId) {
      clearTimeout(joinTimeoutId);
      joinPromiseResolves.forEach((resolve) => resolve(true));
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = undefined;
  };

  throttled.flush = function (this: unknown, ...args: Parameters<TFunc>) {
    if (timeoutId) {
      throttled.cancel();
      func.apply(this, args);
    }
  };

  throttled.pending = function () {
    return timeoutId !== undefined || calling;
  };

  return throttled as ((...args: P) => Promise<ReturnType<TFunc>>) & {
    cancel: () => void;
    flush: () => void;
    pending: () => boolean;
    join: () => Promise<ReturnType<TFunc>>;
  };
}
