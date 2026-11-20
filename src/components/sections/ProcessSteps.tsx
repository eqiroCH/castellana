import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

export type ProcessStep = { title: string; text: string };

type ProcessStepsProps = {
  steps: ReadonlyArray<ProcessStep>;
  /** Heading level of each step title (default h3, under a section h2). */
  headingLevel?: "h3" | "h4";
  className?: string;
};

/**
 * Numbered timeline: vertical on small screens, horizontal from `lg`. Tone-aware —
 * works in dark and light sections. The last marker is filled in brand red (the goal).
 */
export function ProcessSteps({ steps, headingLevel: Title = "h3", className }: ProcessStepsProps) {
  return (
    <ol className={cn("grid lg:grid-cols-4 lg:gap-8", className)}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <Reveal as="li" key={step.title} delay={i * 90} className={cn("relative pl-11 lg:pl-0 lg:pt-12", !last && "pb-14 lg:pb-0")}>
            {/* Connector: down to the next marker (mobile), across to the next column (desktop) */}
            {!last && (
              <span
                aria-hidden="true"
                className="absolute -bottom-[9px] left-1 top-[30px] w-px bg-line-strong lg:-right-[1.5625rem] lg:bottom-auto lg:left-4 lg:top-1 lg:h-px lg:w-auto"
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-[15px] size-[9px] lg:top-0",
                last ? "bg-brand" : "border border-fg/70 bg-bg",
              )}
            />
            <p className="font-display text-[2.5rem] leading-none tracking-tight text-subtle tabular lg:text-[3rem]" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </p>
            <Title className="mt-4 font-display text-display-sm text-fg">
              <span className="sr-only">Schritt {i + 1}: </span>
              {step.title}
            </Title>
            <p className="mt-3 max-w-sm text-[0.9375rem] text-muted lg:max-w-[17rem]">{step.text}</p>
          </Reveal>
        );
      })}
    </ol>
  );
}
