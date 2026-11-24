"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

type Part = string | { value: number; decimals: number; grouped: boolean };

/** Numbers inside a label: «6–8», «20’000», «4.6», «175». */
const NUMBER = /\d{1,3}(?:[’']\d{3})+|\d+(?:\.\d+)?/g;

function parse(text: string): Part[] {
  const parts: Part[] = [];
  let last = 0;
  for (const match of text.matchAll(NUMBER)) {
    const raw = match[0];
    const index = match.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    const grouped = /[’']/.test(raw);
    const clean = raw.replace(/[’']/g, "");
    parts.push({ value: Number(clean), decimals: clean.split(".")[1]?.length ?? 0, grouped });
    last = index + raw.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function format(parts: Part[], progress: number): string {
  return parts
    .map((part) => {
      if (typeof part === "string") return part;
      const v = part.value * progress;
      if (part.decimals) return v.toFixed(part.decimals);
      return part.grouped ? formatNumber(v) : String(Math.round(v));
    })
    .join("");
}

const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;

type CountUpProps = {
  /** Final text, e.g. "6–8", "20’000", "4.6". Text without digits is rendered as is. */
  value: string;
  /** Animation length in ms (default 1600). */
  duration?: number;
  /** Start delay in ms once visible (stagger). */
  delay?: number;
  className?: string;
};

/**
 * Counts every number in `value` up from 0 the first time it scrolls into view.
 * Server-rendered with the final value (no JS / reduced motion: static). The final text also
 * reserves the width, so counting never shifts the layout; screen readers get the final value.
 */
export function CountUp({ value, duration = 1600, delay = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current?.firstChild;
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const parts = parse(value);
    if (!parts.some((p) => typeof p !== "string")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Mutate React's own text node (not textContent) so later re-renders stay in sync.
    node.nodeValue = format(parts, 0);
    let raf = 0;
    let timer = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      node.nodeValue = format(parts, easeOutQuart(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          raf = requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.6 },
    );
    io.observe(node.parentElement!);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      node.nodeValue = value;
    };
  }, [value, duration, delay]);

  return (
    <span className={cn("inline-grid tabular", className)}>
      <span aria-hidden="true" className="invisible [grid-area:1/1]">
        {value}
      </span>
      <span ref={ref} aria-hidden="true" className="[grid-area:1/1]">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
