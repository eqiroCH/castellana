"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { clamp01, observeScroll, prefersReducedMotion } from "@/components/scroll/scroll-loop";
import "@/components/scroll/scroll.css";

export type ProcessStep = { title: string; text: string };

type ProcessStepsProps = {
  steps: ReadonlyArray<ProcessStep>;
  /** Heading level of each step title (default h3, under a section h2). */
  headingLevel?: "h3" | "h4";
  className?: string;
};

/**
 * Numbered timeline: vertical on small screens, horizontal from `lg`. Tone-aware.
 *
 * Scroll-driven: a red line fills from marker to marker as the steps pass the viewport centre
 * (desktop: the row is staggered over ~30 % of the viewport so the line still travels left to
 * right) and each step's number and marker switch from muted to brand red. Without JS or with
 * reduced motion the timeline is static, the last marker filled (the goal).
 */
export function ProcessSteps({ steps, headingLevel: Title = "h3", className }: ProcessStepsProps) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || prefersReducedMotion()) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > li"));
    const markers = items.map((li) => li.querySelector<HTMLElement>("[data-marker]"));
    const fills = items.map((li) => li.querySelector<HTMLElement>("[data-fill]"));
    const wide = window.matchMedia("(min-width: 1024px)");
    list.dataset.scroll = "";

    const stop = observeScroll(list, (vh) => {
      const horizontal = wide.matches;
      const line = vh * (horizontal ? 0.68 : 0.55);
      const ys = markers.map((m, i) => {
        const r = m?.getBoundingClientRect();
        if (!r) return Infinity;
        return horizontal ? r.top + i * vh * 0.1 : r.top + r.height / 2;
      });
      return () => {
        items.forEach((li, i) => li.toggleAttribute("data-active", ys[i] <= line));
        fills.forEach((fill, i) => {
          if (!fill || i >= ys.length - 1) return;
          const p = clamp01((line - ys[i]) / Math.max(1, ys[i + 1] - ys[i]));
          fill.style.setProperty("--fill", p.toFixed(3));
        });
      };
    });

    return () => {
      stop();
      delete list.dataset.scroll;
      items.forEach((li) => li.removeAttribute("data-active"));
    };
  }, [steps.length]);

  return (
    <ol ref={ref} className={cn("sc-steps grid lg:grid-cols-4 lg:gap-8", className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <Reveal as="li" key={step.title} delay={i * 90} className={cn("relative pl-11 lg:pl-0 lg:pt-12", !last && "pb-14 lg:pb-0")}>
            {/* Connector: down to the next marker (mobile), across to the next column (desktop) */}
            {!last && (
              <span
                aria-hidden="true"
                className="absolute -bottom-[9px] left-1 top-[30px] w-px bg-line-strong lg:-right-[1.5625rem] lg:bottom-auto lg:left-4 lg:top-1 lg:h-px lg:w-auto"
              >
                <span data-fill="" className="sc-steps-fill" />
              </span>
            )}
            <span
              aria-hidden="true"
              data-marker=""
              className={cn(
                "sc-steps-marker absolute left-0 top-[15px] size-[9px] lg:top-0",
                last ? "bg-brand" : "border border-fg/70 bg-bg",
              )}
            />
            <p className="sc-steps-num font-display text-[2.5rem] leading-none tracking-tight text-subtle tabular lg:text-[3rem]" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </p>
            <div className="sc-steps-body">
              <Title className="mt-4 font-display text-display-sm text-fg">
                <span className="sr-only">Schritt {i + 1}: </span>
                {step.title}
              </Title>
              <p className="mt-3 max-w-sm text-[0.9375rem] text-muted lg:max-w-[17rem]">{step.text}</p>
            </div>
          </Reveal>
        );
      })}
    </ol>
  );
}
