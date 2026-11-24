"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { clamp01, observeScroll, prefersReducedMotion } from "./scroll-loop";
import "./scroll.css";

type ClipRevealProps = {
  children: ReactNode;
  className?: string;
};

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Scroll-linked reveal: the frame opens from a clip-path inset while the image inside settles
 * from a slight zoom — fully open once the element's centre reaches 55 % of the viewport.
 * No JS / reduced motion: shown unclipped.
 */
export function ClipReveal({ children, className }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    el.dataset.clip = "";
    const stop = observeScroll(el, (vh) => {
      const r = el.getBoundingClientRect();
      const p = clamp01((vh - r.top) / (vh * 0.45 + r.height * 0.5));
      return () => el.style.setProperty("--clip", easeOutCubic(p).toFixed(4));
    });
    return () => {
      stop();
      delete el.dataset.clip;
      el.style.removeProperty("--clip");
    };
  }, []);

  return (
    <div ref={ref} className={cn("sc-clip", className)}>
      {children}
    </div>
  );
}
