import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Form primitives: always-visible labels, hairline underline controls and a brand-red
 * focus line. Errors are wired via aria-invalid + aria-describedby.
 * The error colour comes from `--form-error`, set on the <form> per tone.
 */

export const formToneClass = {
  light: "[--form-error:var(--color-brand-dark)]",
  dark: "[--form-error:#ff8a8f]",
} as const;

const control =
  "block w-full min-h-12 appearance-none rounded-none border-0 border-b border-line-strong bg-transparent px-0 pb-3 pt-2 text-[1.0625rem] leading-snug text-fg placeholder:text-subtle transition-[border-color,box-shadow,background-color] duration-300 ease-out-quart hover:border-fg/60 focus:border-brand focus:shadow-[0_1px_0_0_var(--color-brand)] focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-[var(--form-error)]";

export function describedBy(id: string, { hint, error }: { hint?: ReactNode; error?: string }) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

type ShellProps = {
  id: string;
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function FieldShell({ id, label, required, hint, error, className, children }: ShellProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 text-brand">
              *
            </span>
          )}
        </label>
        {!required && <span className="text-[0.75rem] text-subtle">optional</span>}
      </div>
      <div className="mt-1.5">{children}</div>
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] leading-snug text-subtle">
          {hint}
        </p>
      )}
      <FieldError id={id} error={error} />
    </div>
  );
}

export function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-[0.8125rem] font-medium leading-snug text-[var(--form-error)]">
      <svg viewBox="0 0 16 16" className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" focusable="false">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 4.5v4.5M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
      <span>{error}</span>
    </p>
  );
}

type InputProps = Omit<ComponentPropsWithoutRef<"input">, "className"> & { invalid?: boolean; className?: string };

export function TextInput({ invalid, className, ...props }: InputProps) {
  return <input aria-invalid={invalid || undefined} className={cn(control, className)} {...props} />;
}

type TextareaProps = Omit<ComponentPropsWithoutRef<"textarea">, "className"> & { invalid?: boolean; className?: string };

export function TextArea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(control, "min-h-40 resize-y py-3 leading-relaxed", className)}
      {...props}
    />
  );
}

type SelectProps = Omit<ComponentPropsWithoutRef<"select">, "className"> & { invalid?: boolean; className?: string };

export function Select({ invalid, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select aria-invalid={invalid || undefined} className={cn(control, "cursor-pointer pr-10", className)} {...props}>
        {children}
      </select>
      <svg
        viewBox="0 0 16 16"
        className="pointer-events-none absolute right-1 top-1/2 size-4 -translate-y-1/2 text-fg"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M3.5 6 8 10.5 12.5 6" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
      </svg>
    </div>
  );
}

type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "className" | "type"> & {
  id: string;
  label: ReactNode;
  error?: string;
};

/** Square checkbox that fills with Castellana red when checked — the logo mark as UI. */
export function Checkbox({ id, label, error, ...props }: CheckboxProps) {
  return (
    <div>
      <div className="flex items-start gap-4">
        {/* 44px hit area (transparent input), 24px visual box drawn by its siblings. */}
        <span className="relative mt-0.5 inline-flex size-6 shrink-0 items-center justify-center">
          <input
            id={id}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="peer absolute -inset-2.5 z-10 m-0 cursor-pointer appearance-none bg-transparent focus-visible:outline-none"
            {...props}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 border border-line-strong transition-colors duration-200 peer-hover:border-fg peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-brand peer-aria-[invalid=true]:border-[var(--form-error)]"
          />
          <svg
            viewBox="0 0 16 16"
            className="pointer-events-none relative size-3.5 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" />
          </svg>
        </span>
        <label htmlFor={id} className="cursor-pointer text-[0.9375rem] leading-relaxed text-muted">
          {label}
        </label>
      </div>
      <div className="pl-10">
        <FieldError id={id} error={error} />
      </div>
    </div>
  );
}
