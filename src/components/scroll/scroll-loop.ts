/**
 * One passive scroll/resize listener and one rAF for every scroll-linked effect on the page.
 * Readers measure (getBoundingClientRect) and may return a writer; all writers run after all
 * readers, so effects never interleave layout reads and style writes.
 */

type Writer = () => void;
type Reader = (viewportHeight: number) => Writer | void;

const readers = new Set<Reader>();
let frame = 0;

function run() {
  frame = 0;
  const vh = window.innerHeight;
  const writers: Writer[] = [];
  readers.forEach((read) => {
    const write = read(vh);
    if (write) writers.push(write);
  });
  writers.forEach((write) => write());
}

function request() {
  if (!frame) frame = requestAnimationFrame(run);
}

function subscribe(read: Reader): () => void {
  readers.add(read);
  if (readers.size === 1) {
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
  }
  request();
  return () => {
    readers.delete(read);
    if (readers.size === 0) {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

/**
 * Runs `read` on every scroll frame while `el` is within `margin` of the viewport.
 * Returns a cleanup function (call it from the effect's cleanup).
 */
export function observeScroll(el: Element, read: Reader, margin = "25% 0px"): () => void {
  let off: (() => void) | null = null;
  const io = new IntersectionObserver(
    (entries) => {
      const near = entries[entries.length - 1].isIntersecting;
      if (near && !off) off = subscribe(read);
      else if (!near && off) {
        off();
        off = null;
      }
    },
    { rootMargin: margin },
  );
  io.observe(el);
  return () => {
    io.disconnect();
    off?.();
  };
}

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
