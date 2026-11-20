import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
  /** Small red square before the label — the Castellana mark in miniature. */
  mark?: boolean;
  as?: "p" | "span" | "div";
};

/** Uppercase, widely tracked label above headings. */
export function Eyebrow({ children, className, mark = true, as: Tag = "p" }: EyebrowProps) {
  return (
    <Tag className={cn("flex items-center gap-3 text-eyebrow font-semibold uppercase text-muted", className)}>
      {mark && <span aria-hidden="true" className="size-[7px] shrink-0 bg-brand" />}
      <span>{children}</span>
    </Tag>
  );
}
