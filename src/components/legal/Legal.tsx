import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Typography for legal pages (Impressum, Datenschutz): a Swiss-style sheet with the
 * heading on the left and the copy on the right, separated by hairlines. Light tone.
 */

const copy =
  "space-y-5 text-[1.0625rem] leading-[1.75] text-muted [&_a]:text-fg [&_a]:underline [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a:hover]:decoration-2 [&_strong]:font-semibold [&_strong]:text-fg";

type LegalSectionProps = {
  id: string;
  /** e.g. "01" — optional running number */
  number?: string;
  title: ReactNode;
  children: ReactNode;
};

export function LegalSection({ id, number, title, children }: LegalSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-line-strong py-12 md:py-16">
      <Reveal className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          {number && (
            <span className="font-display text-lg text-subtle tabular" aria-hidden="true">
              {number}
            </span>
          )}
          <h2 id={`${id}-title`} className={cn("font-display text-display-sm text-fg", number && "mt-2")}>
            {title}
          </h2>
        </div>
        <div className={cn(copy, "max-w-2xl lg:col-span-7 lg:col-start-6")}>{children}</div>
      </Reveal>
    </section>
  );
}

/** Sub-heading inside a section. */
export function LegalSubheading({ children }: { children: ReactNode }) {
  return <h3 className="pt-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-fg">{children}</h3>;
}

/** Bullet list with the small red square as marker. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="relative pl-6">
          <span aria-hidden="true" className="absolute left-0 top-[0.72em] size-[5px] bg-brand" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Label/value pairs (company facts). */
export function LegalFacts({ rows }: { rows: Array<{ label: string; value: ReactNode }> }) {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {rows.map((row) => (
        <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
          <dt className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-subtle sm:pt-1">{row.label}</dt>
          <dd className="text-fg">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Numbered table of contents with anchor links. */
export function LegalToc({ items }: { items: Array<{ id: string; title: string }> }) {
  return (
    <nav aria-labelledby="toc-title" className="border-t border-line-strong py-12 md:py-16">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <h2 id="toc-title" className="font-display text-display-sm text-fg lg:col-span-4">
          Inhalt
        </h2>
        <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {items.map((item, i) => (
            <li key={item.id} className="border-b border-line">
              <a
                href={`#${item.id}`}
                className="group flex min-h-12 items-baseline gap-4 py-3 text-[0.9375rem] text-fg transition-colors hover:text-brand-dark"
              >
                <span className="w-6 shrink-0 font-display text-base text-subtle tabular">{String(i + 1).padStart(2, "0")}</span>
                <span className="underline-offset-4 group-hover:underline">{item.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
