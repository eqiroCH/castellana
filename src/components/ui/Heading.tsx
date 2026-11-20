import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const sizes = {
  "2xl": "text-display-2xl",
  xl: "text-display-xl",
  lg: "text-display-lg",
  md: "text-display-md",
  sm: "text-display-sm",
} as const;

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
  id?: string;
};

/**
 * Display heading in Instrument Serif. Wrap words in <em> for the italic accent,
 * which renders slightly muted: <Heading>Leidenschaft <em>seit 1983.</em></Heading>
 */
export function Heading({ as: Tag = "h2", size = "lg", children, className, id }: HeadingProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "font-display font-normal text-fg [&_em]:italic [&_em]:text-fg/70",
        sizes[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
