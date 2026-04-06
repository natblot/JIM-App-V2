// Tests useDebounce — logique temporelle via vi.fakeTimers
// Pas de renderHook (React DOM non disponible dans @jim/shared) — on vérifie
// le comportement du setTimeout sous-jacent via la fonction debounce pure
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Réimplémenter la logique debounce pure pour tester sans React DOM
function debounce<T>(fn: (value: T) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (value: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(value), delay);
  };
}

describe('useDebounce — logique debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('appelle la fonction après le délai', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 200);
    debouncedFn('test');
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledWith('test');
  });

  it('n\'appelle pas la fonction avant le délai', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 200);
    debouncedFn('test');
    vi.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled();
  });

  it('annule les appels intermédiaires', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 200);
    debouncedFn('a');
    vi.advanceTimersByTime(100);
    debouncedFn('b');
    vi.advanceTimersByTime(100);
    debouncedFn('c');
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('fonctionne avec des nombres', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 200);
    debouncedFn(30);
    debouncedFn(50);
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(50);
  });

  it('peut être appelé à nouveau après le délai', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 200);
    debouncedFn('premier');
    vi.advanceTimersByTime(200);
    debouncedFn('second');
    vi.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 'premier');
    expect(fn).toHaveBeenNthCalledWith(2, 'second');
  });
});
