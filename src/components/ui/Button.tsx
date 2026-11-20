import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowRight, ArrowUpRight } from "./Icons";

type Variant = "primary" | "outline" | "ghost" | "link";
type Size = "md" | "sm";

const base =
  "group/button inline-flex items-center justify-center gap-3 whitespace-nowrap font-sans font-semibold uppercase tracking-[0.16em] transition-[background-color,border-color,color] duration-300 ease-out-quart focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark focus-visible:outline-fg",
  outline: "border border-line-strong text-fg hover:border-fg hover:bg-fg hover:text-bg",
  ghost: "text-fg hover:bg-fg/[0.06]",
  link: "min-h-11 gap-2.5 px-0 text-fg underline-offset-[6px] decoration-1 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "min-h-13 px-7 text-[0.75rem]",
  sm: "min-h-11 px-5 text-[0.6875rem]",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], variant === "link" && "text-[0.75rem]", className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  /** `arrow` (internal), `external` (↗) or none. Defaults: link → arrow, external href → external. */
  icon?: "arrow" | "external" | "none";
  children: ReactNode;
  className?: string;
};

function ButtonIcon({ icon }: { icon: "arrow" | "external" | "none" }) {
  if (icon === "none") return null;
  const Icon = icon === "external" ? ArrowUpRight : ArrowRight;
  return (
    <Icon
      className={cn(
        "size-4 shrink-0 transition-transform duration-300 ease-out-quart",
        icon === "arrow" ? "group-hover/button:translate-x-1" : "group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5",
      )}
    />
  );
}

type ButtonLinkProps = CommonProps & Omit<ComponentPropsWithoutRef<"a">, "children" | "className"> & { href: string };

/**
 * Link styled as a button. Internal paths use next/link; http(s) links open in a new tab;
 * tel:/mailto: stay plain anchors.
 */
export function ButtonLink({ href, variant = "primary", size = "md", icon, children, className, ...props }: ButtonLinkProps) {
  const isExternal = /^https?:\/\//.test(href);
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const resolvedIcon = icon ?? (isExternal ? "external" : variant === "link" ? "arrow" : "none");
  const classes = buttonClasses({ variant, size, className });
  const content = (
    <>
      <span>{children}</span>
      <ButtonIcon icon={resolvedIcon} />
    </>
  );

  if (isInternal) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={classes}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {content}
      {isExternal && <span className="sr-only"> (öffnet in neuem Fenster)</span>}
    </a>
  );
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

/** Native <button> with the same styles (forms, dialogs). */
export function Button({ variant = "primary", size = "md", icon = "none", children, className, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      <span>{children}</span>
      <ButtonIcon icon={icon} />
    </button>
  );
}
