"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "./env";
import { observeOnce } from "./observe";

type CountUpProps = {
  /** Final value as rendered on the server, e.g. "175", "40+", "4.6". */
  value: string;
  /** Duration in ms. */
  duration?: number;
  className?: string;
};

const NUMBER = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/;
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts a figure up from zero when it scrolls into view.
 * The real value is server-rendered and stays in the DOM (SEO, screen readers, no-JS);
 * the animated digits are an aria-hidden overlay on top of it, and the final value keeps
 * reserving the width, so nothing shifts. Skipped when already on screen at hydration
 * or with reduced motion.
 */
export function CountUp({ value, duration = 1800, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const finalRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const finalEl = finalRef.current;
    const live = liveRef.current;
    const match = NUMBER.exec(value);
    if (!el || !finalEl || !live || !match || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already visible

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
    const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

    let raf = 0;
    finalEl.style.opacity = "0";
    live.textContent = format(0);
    live.hidden = false;

    const stopObserving = observeOnce(
      el,
      () => {
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          live.textContent = format(target * easeOutExpo(t));
          if (t < 1) raf = requestAnimationFrame(step);
          else {
            finalEl.style.opacity = "";
            live.hidden = true;
          }
        };
        raf = requestAnimationFrame(step);
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.2 },
    );

    return () => {
      stopObserving();
      cancelAnimationFrame(raf);
      finalEl.style.opacity = "";
      live.hidden = true;
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={cn("relative inline-block whitespace-nowrap tabular", className)}>
      <span ref={finalRef}>{value}</span>
      <span ref={liveRef} aria-hidden="true" className="absolute inset-0" hidden />
    </span>
  );
}
