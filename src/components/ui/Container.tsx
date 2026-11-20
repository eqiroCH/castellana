import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
  /** `wide` = full site width (default), `narrow` = reading width for long copy */
  size?: "wide" | "narrow";
} & ComponentPropsWithoutRef<T>;

/** Horizontal page frame: max 1376px with fluid gutters (20px → 48px). */
export function Container<T extends ElementType = "div">({ as, size = "wide", className, ...props }: ContainerProps<T>) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={cn("mx-auto w-full px-gutter", size === "wide" ? "max-w-site" : "max-w-3xl", className)}
      {...props}
    />
  );
}
