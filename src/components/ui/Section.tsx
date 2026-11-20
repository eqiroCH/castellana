import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  /** Colour scheme. All tone-aware utilities (text-fg, border-line…) follow it. */
  tone?: "dark" | "light";
  /** Vertical rhythm. `none` when the section manages its own padding. */
  spacing?: "default" | "compact" | "none";
};

/** Page section with tone (dark/light) and consistent vertical rhythm. */
export function Section({ tone = "dark", spacing = "default", className, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        tone === "dark" ? "tone-dark" : "tone-light",
        "relative",
        spacing === "default" && "py-section",
        spacing === "compact" && "py-16 md:py-24",
        className,
      )}
      {...props}
    />
  );
}
