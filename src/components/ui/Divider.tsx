import { cn } from "@/lib/cn";

/** Hairline rule in the current tone. */
export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-line", className)} />;
}
