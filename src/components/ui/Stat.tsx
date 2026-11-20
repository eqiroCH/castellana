import { cn } from "@/lib/cn";

type StatProps = {
  value: string;
  suffix?: string;
  label: string;
  className?: string;
};

/**
 * Large serif figure with a small label. Renders a <dt>/<dd> pair — place inside a <dl>.
 * DOM order is label → value (valid HTML); the value is shown on top.
 */
export function Stat({ value, suffix, label, className }: StatProps) {
  return (
    <div className={cn("flex flex-col-reverse justify-end border-t border-line pt-5", className)}>
      <dt className="mt-3 text-[0.8125rem] leading-snug text-muted">{label}</dt>
      <dd className="font-display text-[clamp(2.75rem,4.5vw,4rem)] leading-none tracking-tight text-fg tabular">
        {value}
        {suffix && (
          <span aria-hidden="true" className="ml-1 align-top text-[0.45em] text-brand">
            {suffix}
          </span>
        )}
      </dd>
    </div>
  );
}
