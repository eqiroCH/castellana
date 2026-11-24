import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DrawLine } from "@/components/motion/DrawLine";
import { SectionIndex } from "@/components/motion/SectionIndex";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";

type SectionHeaderProps = {
  eyebrow: string;
  /** Use <em> for the muted italic accent. Words rise line by line when scrolled into view. */
  title: ReactNode;
  lead?: ReactNode;
  /** Right-aligned slot on desktop (e.g. a ButtonLink) */
  action?: ReactNode;
  id?: string;
  className?: string;
  size?: "lg" | "md";
  /** Editorial section number (home): faint oversized outline numeral «01», plus a drawn hairline. */
  index?: number;
  /** Hairline with red lead segment above the header (default: on when `index` is set). */
  rule?: boolean;
};

/** Eyebrow + display heading + optional lead and action — the standard section opener. */
export function SectionHeader({ eyebrow, title, lead, action, id, className, size = "lg", index, rule = index !== undefined }: SectionHeaderProps) {
  const aside = index !== undefined || action;
  return (
    <div className={cn("relative isolate", className)}>
      {rule && <DrawLine className="mb-8 md:mb-12" />}
      <div className="grid gap-8 md:grid-cols-12 md:gap-x-8">
        <div className={cn(aside ? "md:col-span-8" : "md:col-span-10", "max-w-3xl")}>
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Heading id={id} size={size} className="mt-5">
            <SplitReveal delay={80}>{title}</SplitReveal>
          </Heading>
          {lead && (
            <Reveal delay={220}>
              <div className="mt-6 max-w-2xl text-lead text-muted">{lead}</div>
            </Reveal>
          )}
        </div>
        {aside && (
          <div className="flex flex-col gap-8 md:col-span-4 md:items-end md:justify-between">
            {index !== undefined && (
              <SectionIndex
                value={index}
                className="-z-10 max-md:absolute max-md:right-0 max-md:top-2 max-md:text-[4rem] md:-mr-[0.04em] md:-mt-1"
              />
            )}
            {action && (
              <Reveal delay={260} className="shrink-0 md:mt-auto">
                {action}
              </Reveal>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
