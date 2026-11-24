import { cn } from "@/lib/cn";

/** Faint oversized outline numeral («01» …) used as an editorial section marker. Decorative. */
export function SectionIndex({ value, className }: { value: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("section-index", className)}>
      {String(value).padStart(2, "0")}
    </span>
  );
}
