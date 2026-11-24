import { site } from "@/content/site";
import { CountUp } from "@/components/motion/CountUp";
import { DrawLine } from "@/components/motion/DrawLine";
import { SectionIndex } from "@/components/motion/SectionIndex";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { StarIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** 5 stars, the last one partially filled according to the rating. */
function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span key={i} className="relative size-5">
            <StarIcon className="absolute inset-0 size-5 text-fg/15" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon className="size-5 text-brand" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** Google rating proof — numbers only, no fabricated review texts. The 4.6 counts up. */
export function RatingBand() {
  return (
    <Section tone="light" spacing="compact" aria-labelledby="rating-title">
      <Container className="relative isolate">
        {/* The numeral sits on the hairline. */}
        <SectionIndex value={7} className="absolute bottom-full right-gutter -mb-px text-[clamp(3.5rem,6vw,5.5rem)]" />
        <DrawLine />
        <div className="grid items-end gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-8">
          <Reveal className="flex items-end gap-6 sm:gap-10 lg:col-span-6">
            <p className="font-display text-[clamp(6.5rem,16vw,15rem)] leading-[0.74] tracking-[-0.04em] text-fg">
              <CountUp value={String(site.rating.value)} duration={2000} />
            </p>
            <div className="space-y-3 pb-1">
              <Stars value={site.rating.value} />
              <p className="text-sm text-muted">
                {site.rating.value} von 5 Sternen
                <br />
                {site.rating.count} Bewertungen auf {site.rating.source}
              </p>
            </div>
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <Eyebrow>Bewertungen</Eyebrow>
            </Reveal>
            <Heading id="rating-title" size="md" className="mt-4">
              <SplitReveal>Vertrauen, das man nachlesen kann.</SplitReveal>
            </Heading>
            <Reveal delay={200}>
              <p className="mt-4 max-w-lg text-muted">
                {site.rating.count} Kundinnen und Kunden haben uns auf Google bewertet. Machen Sie sich selbst ein Bild – und
                lernen Sie uns danach persönlich kennen.
              </p>
              <ButtonLink href={site.links.googleMaps} variant="link" className="mt-4">
                Bewertungen auf Google lesen
              </ButtonLink>
            </Reveal>
          </div>
        </div>
        <DrawLine accent={false} delay={200} />
      </Container>
    </Section>
  );
}
