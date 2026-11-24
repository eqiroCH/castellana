"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { observeScroll } from "./scroll-loop";
import "./scroll.css";

export type StackItem = { title: string; lead: string; text: string };

type ArgumentStackProps = {
  id: string;
  eyebrow: string;
  /** Use <em> for the muted italic accent. */
  title: ReactNode;
  items: ReadonlyArray<StackItem>;
  className?: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Sticky scroll stack: headline and a big red counter stay pinned on the left (desktop) while the
 * arguments scroll past on the right. The item nearest the viewport centre is active — its
 * hairline draws, number turns red, text goes from muted to full colour; the counter cross-fades.
 * Without JS every item is shown in full and the counter is hidden.
 */
export function ArgumentStack({ id, eyebrow, title, items, className }: ArgumentStackProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const args = Array.from(root.querySelectorAll<HTMLElement>("[data-arg]"));
    const nums = Array.from(root.querySelectorAll<HTMLElement>("[data-num]"));
    const ticks = Array.from(root.querySelectorAll<HTMLElement>("[data-tick]"));
    root.dataset.scroll = "";
    let current = -1;

    const apply = (active: number) => {
      current = active;
      args.forEach((el, i) => {
        el.toggleAttribute("data-active", i === active);
        el.toggleAttribute("data-passed", i < active);
      });
      nums.forEach((el, i) => {
        el.dataset.pos = i === active ? "current" : i < active ? "before" : "after";
      });
      ticks.forEach((el, i) => el.toggleAttribute("data-on", i <= active));
    };

    const stop = observeScroll(
      root,
      (vh) => {
        const mid = vh * 0.5;
        let best = 0;
        let bestDistance = Infinity;
        args.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - mid);
          if (d < bestDistance) {
            bestDistance = d;
            best = i;
          }
        });
        if (best !== current) return () => apply(best);
      },
      "0px",
    );

    return () => {
      stop();
      delete root.dataset.scroll;
    };
  }, [items.length]);

  return (
    <div ref={ref} className={cn("sc-stack grid gap-x-8 lg:grid-cols-12", className)}>
      <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)] lg:col-span-5 lg:flex lg:h-[calc(100svh-var(--spacing-header)-4rem)] lg:flex-col lg:justify-between lg:self-start lg:pb-4">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Heading id={id} className="mt-5 max-w-md">
            {title}
          </Heading>
        </div>

        <div aria-hidden="true" className="sc-stack-counter hidden lg:block">
          <div className="grid">
            {items.map((item, i) => (
              <div key={item.title} data-num="" data-pos={i === 0 ? "current" : "after"} className="sc-stack-num [grid-area:1/1]">
                <span className="block font-display text-[clamp(7.5rem,13vw,12.5rem)] leading-[0.8] tracking-tight text-brand tabular">
                  {pad(i + 1)}
                </span>
                <span className="mt-6 block text-eyebrow font-semibold uppercase text-fg">{item.title}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <ol className="flex gap-1.5">
              {items.map((item) => (
                <li key={item.title} data-tick="" className="sc-stack-tick" />
              ))}
            </ol>
            <span className="text-eyebrow font-semibold uppercase text-subtle tabular">/ {pad(items.length)}</span>
          </div>
        </div>
      </div>

      <ol className="mt-14 border-b border-line md:mt-20 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:border-b-0">
        {items.map((item, i) => (
          <li
            key={item.title}
            data-arg=""
            className="sc-arg relative py-10 md:py-12 lg:flex lg:min-h-[58svh] lg:flex-col lg:justify-center lg:py-16"
          >
            <span aria-hidden="true" className="sc-arg-line" />
            <span aria-hidden="true" className="sc-arg-num font-display text-lg tabular">
              {pad(i + 1)}
            </span>
            <h3 className="sc-arg-title mt-4 font-display text-display-lg">{item.title}</h3>
            <p className="sc-arg-lead mt-5 max-w-lg text-lead">{item.lead}</p>
            <p className="sc-arg-text mt-2 max-w-lg">{item.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
