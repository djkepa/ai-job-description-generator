import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce.js';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));

    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    expect(result.current).toBe('initial');

    // Change value
    rerender({ value: 'changed', delay: 500 });
    expect(result.current).toBe('initial');

    // Fast forward less than delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Fast forward past delay
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('changed');
  });

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 },
    });

    // First change
    rerender({ value: 'first', delay: 500 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Second change before first debounce completes
    rerender({ value: 'second', delay: 500 });

    // First debounce should be cancelled
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe('initial');

    // Complete second debounce
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('second');
  });
});
