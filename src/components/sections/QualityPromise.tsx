import { site } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "./SectionHeader";

/**
 * The four guarantees as a calm typographic band (light tone): big serif numerals in a row,
 * each turning red with a red rule drawing across on hover.
 */
export function QualityPromise() {
  return (
    <Section tone="light" aria-labelledby="quality-title">
      <Container>
        <SectionHeader
          id="quality-title"
          index={2}
          eyebrow="Unser Qualitätsversprechen"
          title={
            <>
              Jedes Fahrzeug. <em>Ohne Kompromisse.</em>
            </>
          }
        />

        <div className="mt-10 grid lg:mt-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={120}>
            <p className="font-display text-[clamp(1.375rem,2vw,1.875rem)] leading-[1.3] tracking-[-0.01em] text-fg">
              «{site.quality.statement}»
            </p>
          </Reveal>
        </div>

        <ol className="mt-16 grid gap-x-8 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {site.quality.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 90} className="group relative border-t border-line-strong pb-6 pt-7 lg:pb-0">
              <span
                aria-hidden="true"
                className="absolute -top-px left-0 h-[2px] w-full origin-left scale-x-0 bg-brand transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
              <span
                aria-hidden="true"
                className="block font-display text-[clamp(3rem,4.6vw,4.5rem)] leading-none tracking-tight text-fg/25 tabular transition-colors duration-500 group-hover:text-brand"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 font-display text-display-sm text-fg">{item.title}</h3>
              <p className="mt-3 max-w-xs text-[0.9375rem] text-muted">{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
