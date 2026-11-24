import { addressLine, formatSlots, site } from "@/content/site";
import { DrawLine } from "@/components/motion/DrawLine";
import { SectionIndex } from "@/components/motion/SectionIndex";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/**
 * Address, opening hours and routes — closes the home page before the footer.
 * The night photo bleeds to the left viewport edge on desktop and drifts slowly (Ken Burns).
 */
export function VisitBand() {
  return (
    <Section tone="dark" aria-labelledby="visit-title" className="overflow-hidden border-t border-line">
      <Container className="relative isolate grid gap-14 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-6 lg:ml-[calc((min(100vw,86rem)_-_100vw)/2_-_var(--spacing-gutter))]">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface lg:aspect-auto lg:h-full lg:min-h-[34rem]">
            <Photo
              media="showroom-nacht"
              sizes="(min-width: 1024px) 55vw, 100vw"
              position="45% 50%"
              className="ken-burns absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-ink/10" />
            <p className="absolute bottom-5 left-5 flex items-center gap-3 text-eyebrow font-semibold uppercase text-paper/80 lg:left-[calc(var(--spacing-gutter)+1.25rem)]">
              <span aria-hidden="true" className="size-[7px] bg-brand" />
              {site.address.street} · {site.address.city}
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <SectionIndex value={8} className="mb-6 text-[clamp(4.5rem,8vw,8rem)] max-lg:absolute max-lg:right-gutter max-lg:-top-4 max-lg:-z-10" />
          <Reveal>
            <Eyebrow>Besuchen Sie uns</Eyebrow>
          </Reveal>
          <Heading id="visit-title" size="xl" className="mt-5">
            <SplitReveal>
              Willkommen <em>in Thalwil.</em>
            </SplitReveal>
          </Heading>
          <Reveal delay={150}>
            <address className="mt-8 not-italic">
              <p className="text-lead text-fg">{site.name}</p>
              <p className="text-lead text-muted">{addressLine}</p>
            </address>

            <DrawLine className="mt-8" accent={false} />
            <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5 pt-6 text-[0.9375rem] tabular">
              {site.hours.map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-muted">{h.label}</dt>
                  <dd className="text-fg">{formatSlots(h.slots)}</dd>
                </div>
              ))}
            </dl>
            {site.hoursNote.enabled && <p className="mt-3 text-sm text-muted">{site.hoursNote.text}</p>}

            <div className="mt-8 flex flex-col gap-x-8 gap-y-1 border-t border-line pt-6 sm:flex-row sm:flex-wrap">
              <a href={site.phone.href} className="inline-flex min-h-11 items-center text-fg underline-offset-4 hover:underline tabular">
                {site.phone.display}
              </a>
              <a href={site.email.href} className="inline-flex min-h-11 items-center text-fg underline-offset-4 hover:underline">
                {site.email.display}
              </a>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={site.links.googleRoute}>Route planen</ButtonLink>
              <ButtonLink href={site.links.appleMaps} variant="outline">
                Apple Karten
              </ButtonLink>
              <ButtonLink href="/kontakt/" variant="link" className="sm:ml-2">
                Kontaktformular
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
