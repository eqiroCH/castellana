"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import { observeOnce } from "./observe";

type InViewProps<T extends ElementType> = {
  as?: T;
  rootMargin?: string;
  threshold?: number;
} & ComponentPropsWithoutRef<T>;

/**
 * Sets `data-inview` on itself the first time it enters the viewport — a hook for purely
 * CSS-driven entrances (hairlines, light-up tiles, Ken Burns…). See globals.css.
 */
export function InView<T extends ElementType = "div">({ as, rootMargin, threshold, ...props }: InViewProps<T>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => el.setAttribute("data-inview", ""), { rootMargin, threshold });
  }, [rootMargin, threshold]);

  const Tag: ElementType = as ?? "div";
  return <Tag ref={ref} {...props} />;
}
