/**
 * Shared, pooled IntersectionObservers: one observer per (rootMargin, threshold) pair
 * instead of one per component. `observeOnce` fires the callback the first time the element
 * intersects and then stops watching it.
 */
type Options = { rootMargin?: string; threshold?: number };

type Pool = { observer: IntersectionObserver; callbacks: Map<Element, () => void> };

const pools = new Map<string, Pool>();

function getPool({ rootMargin = "0px 0px -8% 0px", threshold = 0.08 }: Options): Pool {
  const key = `${rootMargin}|${threshold}`;
  let pool = pools.get(key);
  if (!pool) {
    const callbacks = new Map<Element, () => void>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const callback = callbacks.get(entry.target);
          callbacks.delete(entry.target);
          observer.unobserve(entry.target);
          callback?.();
        }
      },
      { rootMargin, threshold },
    );
    pool = { observer, callbacks };
    pools.set(key, pool);
  }
  return pool;
}

export function observeOnce(element: Element, callback: () => void, options: Options = {}): () => void {
  if (typeof IntersectionObserver === "undefined") {
    callback();
    return () => {};
  }
  const pool = getPool(options);
  pool.callbacks.set(element, callback);
  pool.observer.observe(element);
  return () => {
    pool.callbacks.delete(element);
    pool.observer.unobserve(element);
  };
}
