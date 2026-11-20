import { site } from "@/content/site";
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

/** Google rating proof — numbers only, no fabricated review texts. */
export function RatingBand() {
  return (
    <Section tone="light" spacing="compact" aria-labelledby="rating-title">
      <Container>
        <Reveal className="grid items-center gap-10 border-y border-line-strong py-12 md:py-16 lg:grid-cols-12 lg:gap-8">
          <div className="flex items-center gap-8 lg:col-span-5">
            <p className="font-display text-[clamp(5rem,11vw,9rem)] leading-[0.8] tracking-tight text-fg tabular">
              {site.rating.value}
            </p>
            <div className="space-y-3">
              <Stars value={site.rating.value} />
              <p className="text-sm text-muted">
                {site.rating.value} von 5 Sternen
                <br />
                {site.rating.count} Bewertungen auf {site.rating.source}
              </p>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <Eyebrow>Bewertungen</Eyebrow>
            <Heading id="rating-title" size="md" className="mt-4">
              Vertrauen, das man nachlesen kann.
            </Heading>
            <p className="mt-4 max-w-lg text-muted">
              {site.rating.count} Kundinnen und Kunden haben uns auf Google bewertet. Machen Sie sich selbst ein Bild – und
              lernen Sie uns danach persönlich kennen.
            </p>
            <ButtonLink href={site.links.googleMaps} variant="link" className="mt-4">
              Bewertungen auf Google lesen
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
