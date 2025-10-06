import { useRef, useEffect } from 'react';

interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
}

export const usePerformanceMonitor = (componentName: string): PerformanceMetrics => {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const lastRenderStart = useRef(0);

  useEffect(() => {
    lastRenderStart.current = performance.now();
  });

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - lastRenderStart.current;
    renderTimes.current.push(renderTime);

    // Keep only last 10 render times for average calculation
    if (renderTimes.current.length > 10) {
      renderTimes.current.shift();
    }

    if (import.meta.env.DEV && renderTime > 16) {
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms (>16ms)`);
    }
  });

  const averageRenderTime =
    renderTimes.current.length > 0
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
      : 0;

  return {
    renderCount: renderCount.current,
    averageRenderTime,
    lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0,
  };
};
