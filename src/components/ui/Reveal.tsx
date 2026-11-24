"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { observeOnce } from "@/components/motion/observe";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger in ms */
  delay?: number;
  as?: "div" | "li" | "section" | "article";
};

/**
 * Fades content in (opacity + 12px rise) the first time it enters the viewport.
 * Without JS or with `prefers-reduced-motion: reduce` the content is simply visible
 * (styles in globals.css → `[data-reveal]`). Uses the shared observer pool.
 */
export function Reveal({ children, className, delay = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => {
      el.dataset.revealed = "";
    });
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal=""
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
