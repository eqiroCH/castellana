import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Right-aligned slot on desktop (e.g. a ButtonLink) */
  action?: ReactNode;
  id?: string;
  className?: string;
  size?: "lg" | "md";
};

/** Eyebrow + display heading + optional lead and action — the standard section opener. */
export function SectionHeader({ eyebrow, title, lead, action, id, className, size = "lg" }: SectionHeaderProps) {
  return (
    <Reveal className={cn("flex flex-col gap-8 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading id={id} size={size} className="mt-5">
          {title}
        </Heading>
        {lead && <div className="mt-6 max-w-2xl text-lead text-muted">{lead}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
