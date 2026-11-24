import type { ReactNode } from "react";
import type { MediaSlug } from "@/content/media";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { DrawLine } from "@/components/motion/DrawLine";
import { SplitReveal } from "@/components/motion/SplitReveal";

type CtaBandProps = {
  eyebrow: string;
  /** Use <em> for the muted italic accent. */
  title: ReactNode;
  lead?: ReactNode;
  /** Actions, typically one primary and one outline <ButtonLink>. */
  children: ReactNode;
  /** Optional background photo (darkened) for a cinematic closing band. */
  image?: MediaSlug;
  imagePosition?: string;
  /** Phone, e-mail and «Mo–Sa» hint below the actions (default true). */
  showContact?: boolean;
  id?: string;
  className?: string;
};

/**
 * Closing call-to-action band (dark). Big serif headline, actions on the right on desktop,
 * direct contact details underneath — so every key page ends with a clear next step.
 */
export function CtaBand({ eyebrow, title, lead, children, image, imagePosition, showContact = true, id = "cta-title", className }: CtaBandProps) {
  return (
    <section className={cn("tone-dark relative isolate overflow-hidden border-t border-line", className)} aria-labelledby={id}>
      {image && (
        <div className="absolute inset-0 -z-10">
          <Photo media={image} alt="" sizes="100vw" position={imagePosition} className="size-full object-cover opacity-60 saturate-[0.85]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
        </div>
      )}
      <Container className="py-section">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
            <Heading id={id} size="xl" className="mt-6">
              <SplitReveal>{title}</SplitReveal>
            </Heading>
            {lead && (
              <Reveal delay={200}>
                <div className="mt-6 max-w-xl text-lead text-paper/80">{lead}</div>
              </Reveal>
            )}
          </div>
          <Reveal delay={280} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:col-span-4 lg:flex-col lg:items-stretch">
            {children}
          </Reveal>
        </div>

        {showContact && (
          <Reveal delay={100}>
            <DrawLine className="mt-14 md:mt-20" />
            <div className="flex flex-col gap-x-10 gap-y-1 pt-6 text-[0.9375rem] sm:flex-row sm:flex-wrap sm:items-center">
              <span className="text-muted">Lieber persönlich?</span>
              <a href={site.phone.href} className="inline-flex min-h-11 items-center text-fg underline-offset-4 hover:underline tabular">
                {site.phone.display}
              </a>
              <a href={site.email.href} className="inline-flex min-h-11 items-center text-fg underline-offset-4 hover:underline">
                {site.email.display}
              </a>
              <span className="text-muted sm:ml-auto">
                {site.address.street}, {site.address.zip} {site.address.city}
              </span>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
