"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { observeOnce } from "./observe";

type SplitTriggerProps = {
  children: ReactNode;
  trigger: "inview" | "load";
  delay: number;
  className?: string;
};

/** Client half of <SplitReveal>: reveals the pre-split words with a line-aware stagger. */
export function SplitTrigger({ children, trigger, delay, className }: SplitTriggerProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || trigger !== "inview") return;
    return observeOnce(
      el,
      () => {
        const words = Array.from(el.querySelectorAll<HTMLElement>(".split-inner"));
        // Read all positions first, then write: each new line starts 110 ms after the last.
        const tops = words.map((word) => word.offsetTop);
        let line = -1;
        let lineTop = -Infinity;
        let inLine = 0;
        const delays = tops.map((top) => {
          if (top > lineTop + 4) {
            line += 1;
            lineTop = top;
            inLine = 0;
          } else inLine += 1;
          return delay + line * 110 + inLine * 34;
        });
        words.forEach((word, i) => {
          word.style.transitionDelay = `${delays[i]}ms`;
        });
        el.dataset.revealed = "";
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.15 },
    );
  }, [trigger, delay]);

  const style = trigger === "load" && delay ? ({ "--split-delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <span ref={ref} data-split={trigger} className={cn("split", className)} style={style}>
      {children}
    </span>
  );
}
