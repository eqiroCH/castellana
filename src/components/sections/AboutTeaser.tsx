import { site } from "@/content/site";
import { DrawLine } from "@/components/motion/DrawLine";
import { SectionIndex } from "@/components/motion/SectionIndex";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";

/** Family business teaser: Antonio's quote as the oversized element, team photo, key figures. */
export function AboutTeaser() {
  return (
    <Section tone="light" aria-labelledby="about-title">
      <Container className="relative isolate">
        <DrawLine className="mb-8 md:mb-12" />
        <SectionIndex value={5} className="absolute right-gutter top-8 -z-10 max-md:text-[5.5rem] md:top-12" />
        <Reveal>
          <Eyebrow>Familienbetrieb seit {site.history.since}</Eyebrow>
        </Reveal>
        <h2 id="about-title" className="sr-only">
          Über Castellana
        </h2>
        <figure className="mt-8 max-w-6xl">
          <blockquote className="font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.96] tracking-[-0.025em] text-fg">
            <p>
              <SplitReveal delay={60}>
                «Bei uns sind Sie nicht ein Kunde, <em className="italic text-fg/55">sondern ein Freund.</em>»
              </SplitReveal>
            </p>
          </blockquote>
          <Reveal delay={350}>
            <figcaption className="mt-10 flex items-center gap-4 text-sm">
              <span aria-hidden="true" className="h-px w-10 bg-brand" />
              <span>
                <span className="font-semibold text-fg">{site.quote.author}</span>
                <span className="text-muted"> · {site.quote.role}</span>
              </span>
            </figcaption>
          </Reveal>
        </figure>

        <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-12 lg:gap-8">
          <Reveal className="flex flex-col justify-between gap-8 lg:order-2 lg:col-span-4 lg:col-start-9 lg:pt-16" delay={100}>
            <p className="text-lead text-muted">
              Antonio, Nino, Myrta und Laura Castellana führen das Unternehmen gemeinsam mit ihrem Team. Seit über 30
              Jahren setzen wir unser ganzes Wissen für die langfristige Zufriedenheit unserer Kundinnen und Kunden ein.
            </p>
            <ButtonLink href="/ueber-uns/" variant="outline" icon="arrow" className="self-start">
              Über uns
            </ButtonLink>
          </Reveal>
          <Reveal className="lg:order-1 lg:col-span-7">
            <div className="group relative aspect-[1170/441] overflow-hidden bg-surface">
              <Photo
                media="team-gruppe"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="size-full object-cover transition-transform duration-[1600ms] ease-out-quart group-hover:scale-[1.03]"
              />
            </div>
          </Reveal>
        </div>

        <Reveal>
          <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-10 lg:mt-28 lg:grid-cols-4">
            {site.stats.map((stat) => (
              <Stat key={stat.label} value={stat.value} suffix={"suffix" in stat ? stat.suffix : undefined} label={stat.label} />
            ))}
          </dl>
        </Reveal>
      </Container>
    </Section>
  );
}
