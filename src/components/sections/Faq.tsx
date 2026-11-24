import type { FaqItem } from "@/content/site";
import { cn } from "@/lib/cn";
import "@/components/scroll/scroll.css";

type FaqProps = {
  items: ReadonlyArray<FaqItem>;
  /**
   * Shared `name` makes the native accordion exclusive (one item open at a time) in
   * supporting browsers. Omit to allow several open items.
   */
  name?: string;
  /** Index of the item that starts open (default: first). `null` = all closed. */
  defaultOpen?: number | null;
  className?: string;
};

/**
 * Accessible FAQ accordion on native <details>/<summary> — works without JavaScript,
 * keyboard and screen-reader friendly. Opening/closing animates the height (grid rows on
 * `::details-content`, see scroll.css) with a soft fade of the answer, and the plus rotates
 * into a cross. Browsers without `::details-content` simply toggle. Tone-aware.
 * Pair with `faqPageJsonLd(items)` for structured data.
 */
export function Faq({ items, name, defaultOpen = 0, className }: FaqProps) {
  return (
    <div className={cn("border-b border-line-strong", className)}>
      {items.map((item, i) => (
        <details key={item.question} name={name} open={i === defaultOpen} className="sc-faq group border-t border-line-strong">
          <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-6 py-6 md:py-7 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[1.375rem] leading-snug text-fg transition-colors duration-300 group-hover:text-fg/80 md:text-[1.625rem]">
              {item.question}
            </span>
            <span
              aria-hidden="true"
              className="sc-faq-icon relative mt-0.5 inline-flex size-9 shrink-0 items-center justify-center border border-line-strong text-fg group-hover:border-fg group-open:border-brand group-open:bg-brand group-open:text-white"
            >
              <span className="sc-faq-cross relative flex size-3.5 items-center justify-center">
                <span className="absolute h-px w-3.5 bg-current" />
                <span className="absolute h-3.5 w-px bg-current" />
              </span>
            </span>
          </summary>
          <div className="sc-faq-panel">
            <p className="max-w-2xl pb-8 pr-12 text-muted md:pb-10 md:text-[1.0625rem]">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

/** schema.org FAQPage for the same items (render with <JsonLd data={…} />). */
export function faqPageJsonLd(items: ReadonlyArray<FaqItem>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
