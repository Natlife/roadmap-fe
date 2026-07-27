import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom is missing a few browser APIs MUI/notistack touch.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-expect-error attach stub
window.ResizeObserver = window.ResizeObserver || ResizeObserverStub;
window.scrollTo = window.scrollTo || (() => {});
