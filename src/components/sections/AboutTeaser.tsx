import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";

/** Family business teaser: Antonio's quote, team photo, key figures. */
export function AboutTeaser() {
  return (
    <Section tone="light" aria-labelledby="about-title">
      <Container>
        <Reveal>
          <Eyebrow>Familienbetrieb seit {site.history.since}</Eyebrow>
          <h2 id="about-title" className="sr-only">
            Über Castellana
          </h2>
          <figure className="mt-8 max-w-5xl">
            <blockquote className="font-display text-display-xl text-fg">
              <p>
                «Bei uns sind Sie nicht ein Kunde, <em className="text-fg/60">sondern ein Freund.</em>»
              </p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 text-sm">
              <span aria-hidden="true" className="h-px w-10 bg-fg/40" />
              <span>
                <span className="font-semibold text-fg">{site.quote.author}</span>
                <span className="text-muted"> · {site.quote.role}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <div className="relative aspect-[1170/441] overflow-hidden bg-surface">
              <Photo media="team-gruppe" sizes="(min-width: 1024px) 58vw, 100vw" className="size-full object-cover" />
            </div>
          </Reveal>
          <Reveal className="flex flex-col justify-between gap-8 lg:col-span-4 lg:col-start-9" delay={100}>
            <p className="text-lead text-muted">
              Antonio, Nino, Myrta und Laura Castellana führen das Unternehmen gemeinsam mit ihrem Team. Seit über 30
              Jahren setzen wir unser ganzes Wissen für die langfristige Zufriedenheit unserer Kundinnen und Kunden ein.
            </p>
            <ButtonLink href="/ueber-uns/" variant="outline" icon="arrow" className="self-start">
              Über uns
            </ButtonLink>
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
