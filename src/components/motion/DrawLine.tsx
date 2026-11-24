import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { InView } from "./InView";

type DrawLineProps = {
  className?: string;
  /** Delay in ms after entering the viewport. */
  delay?: number;
  /** Short red lead segment at the start of the line (default true). */
  accent?: boolean;
};

/** Hairline in the current tone that draws itself from the left (red lead segment first). */
export function DrawLine({ className, delay = 0, accent = true }: DrawLineProps) {
  return (
    <InView
      aria-hidden="true"
      className={cn("draw-line", accent && "draw-line--accent", className)}
      style={delay ? ({ "--draw-delay": `${delay}ms` } as CSSProperties) : undefined}
      threshold={0}
    />
  );
}
