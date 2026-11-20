import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** The four guarantees as a calm typographic band (light tone). */
export function QualityPromise() {
  return (
    <Section tone="light" aria-labelledby="quality-title">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <Eyebrow>Unser Qualitätsversprechen</Eyebrow>
          <Heading id="quality-title" className="mt-5">
            Jedes Fahrzeug. <em>Ohne Kompromisse.</em>
          </Heading>
          <p className="mt-6 max-w-md text-lead text-muted">{site.quality.statement}</p>
        </Reveal>

        <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {site.quality.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 80} className="border-t border-line-strong py-8">
              <span className="font-display text-lg text-subtle tabular" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-display-sm text-fg">{item.title}</h3>
              <p className="mt-3 max-w-xs text-[0.9375rem] text-muted">{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
