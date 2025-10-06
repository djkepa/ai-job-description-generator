export const measurePerformance = <T>(fn: () => T, label: string): T => {
  if (!import.meta.env.DEV) {
    return fn();
  }

  const start = performance.now();
  const result = fn();
  const end = performance.now();

  // eslint-disable-next-line no-console
  console.info(`${label}: ${(end - start).toFixed(2)}ms`);

  return result;
};

export const debounce = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number,
): ((...args: Args) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Args): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <Args extends unknown[]>(
  fn: (...args: Args) => void,
  limit: number,
): ((...args: Args) => void) => {
  let inThrottle: boolean;

  return (...args: Args): void => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const memoize = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): ((...args: Args) => Return) => {
  const cache = new Map<string, Return>();

  return (...args: Args): Return => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  };
};
