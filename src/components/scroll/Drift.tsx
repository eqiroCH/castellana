"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { clamp01, observeScroll, prefersReducedMotion } from "./scroll-loop";

type DriftProps = {
  children: ReactNode;
  /** Total travel in px across the element's pass through the viewport (default 56). */
  distance?: number;
  className?: string;
};

/**
 * Slow vertical drift tied to scroll position: the content rises gently against the page while
 * it passes through the viewport. Transform only; disabled with reduced motion.
 */
export function Drift({ children, distance = 56, className }: DriftProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const stop = observeScroll(el, (vh) => {
      const r = el.getBoundingClientRect();
      const p = clamp01((vh - r.top) / (vh + r.height));
      return () => {
        el.style.transform = `translate3d(0, ${((0.5 - p) * distance).toFixed(2)}px, 0)`;
      };
    }, "10% 0px");
    return () => {
      stop();
      el.style.transform = "";
    };
  }, [distance]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
