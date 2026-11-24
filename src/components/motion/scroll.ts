import type Lenis from "lenis";

/**
 * Tiny scroll store shared by the header, parallax and anything else that reacts to scroll.
 * One passive native `scroll` listener, throttled to one update per animation frame.
 * Works identically with Lenis (which drives native scrolling) and without it
 * (reduced motion / touch), so consumers never need to know which one is active.
 */
export type ScrollSnapshot = {
  /** Current scroll position in px. */
  y: number;
  /** Signed velocity in px per 60 fps frame. */
  velocity: number;
  /** Last non-zero direction: 1 = down, -1 = up, 0 = not scrolled yet. */
  direction: 1 | -1 | 0;
};

type Listener = (state: Readonly<ScrollSnapshot>) => void;

const listeners = new Set<Listener>();
const state: ScrollSnapshot = { y: 0, velocity: 0, direction: 0 };
let frame = 0;
let lastY = 0;
let lastTime = 0;

function update() {
  frame = 0;
  const now = performance.now();
  const y = window.scrollY;
  const dy = y - lastY;
  state.y = y;
  state.velocity = (dy / Math.max(1, now - lastTime)) * 16.667;
  if (dy !== 0) state.direction = dy > 0 ? 1 : -1;
  lastY = y;
  lastTime = now;
  for (const listener of listeners) listener(state);
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(update);
}

/** Subscribe to scroll updates (called once immediately). Returns an unsubscribe function. */
export function subscribeScroll(listener: Listener): () => void {
  if (listeners.size === 0) {
    lastY = state.y = window.scrollY;
    lastTime = performance.now();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  listeners.add(listener);
  listener(state);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

export const getScroll = (): Readonly<ScrollSnapshot> => state;

/* --------------------------------------------------------------------------
   Lenis registry — set by <MotionProvider>, null when smooth scroll is off.
   -------------------------------------------------------------------------- */

let lenisInstance: Lenis | null = null;
let wakeLoop: () => void = () => {};

export function registerLenis(instance: Lenis | null, wake: () => void = () => {}) {
  lenisInstance = instance;
  wakeLoop = wake;
}

export const getLenis = () => lenisInstance;

/**
 * Smoothly scrolls to an element or position (native with reduced motion / no Lenis).
 * Element targets respect the root `scroll-padding-top` (sticky header).
 */
export function scrollToTarget(target: Element | number, { offset = 0 }: { offset?: number } = {}) {
  const lenis = lenisInstance;
  if (lenis && !lenis.isStopped) {
    // Lenis already honours scroll-padding-top / scroll-margin-top for element targets.
    lenis.scrollTo(target as HTMLElement | number, { offset, duration: 1.25, easing: easeInOutQuart });
    wakeLoop();
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target + offset });
  else target.scrollIntoView({ block: "start" });
}

const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);
