"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FINE_POINTER, REDUCED_MOTION } from "./env";
import { observeOnce } from "./observe";

type SpotlightGridProps = {
  /** The grid (typically a <ul>). Tiles carry `.lights-tile` and `style={{ "--i": index }}`. */
  children: ReactNode;
  className?: string;
};

/**
 * Gallery wrapper with two effects:
 * 1. «Lights on» — the first time the grid enters the viewport, the photos in `.lights-tile`
 *    switch on one after another with a short fluorescent-tube flicker (CSS, `data-lit`).
 * 2. Flashlight — on mouse/trackpad, while the pointer is over the grid, one overlay dims
 *    every tile to ~40 % and a soft radial spotlight follows the pointer across tile borders
 *    (mask-image driven by `--spot-x/--spot-y`). Touch and reduced motion: full brightness.
 * Content that should never be dimmed (e.g. a text cell) gets `relative z-[2]`.
 */
export function SpotlightGrid({ children, className }: SpotlightGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lights on.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => el.setAttribute("data-lit", ""), { rootMargin: "0px 0px -15% 0px", threshold: 0.05 });
  }, []);

  // Flashlight.
  useEffect(() => {
    const el = ref.current;
    const overlay = overlayRef.current;
    if (!el || !overlay) return;
    if (!window.matchMedia(FINE_POINTER).matches || window.matchMedia(REDUCED_MOTION).matches) return;

    let raf = 0;
    let clientX = 0;
    let clientY = 0;

    const frame = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      overlay.style.setProperty("--spot-x", `${(clientX - r.left).toFixed(1)}px`);
      overlay.style.setProperty("--spot-y", `${(clientY - r.top).toFixed(1)}px`);
    };
    const track = (event: PointerEvent) => {
      clientX = event.clientX;
      clientY = event.clientY;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      track(event);
      el.dataset.spot = "on";
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") track(event);
    };
    const onLeave = () => {
      delete el.dataset.spot;
    };

    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} data-lights="" className={cn("spotlight relative", className)}>
      {children}
      <div ref={overlayRef} aria-hidden="true" className="spotlight-overlay" />
    </div>
  );
}
