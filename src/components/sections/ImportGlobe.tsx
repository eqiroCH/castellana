import { importFacts, importTeaser } from "@/content/import";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { CountUp } from "@/components/scroll/CountUp";
import { Globe } from "@/components/three/Globe";
import { SectionIndex } from "@/components/motion/SectionIndex";

/**
 * Home «Direktimport»: the WebGL globe eases from the USA to Thalwil as the section scrolls
 * into view; next to it the promise, three key figures that count up and a CTA to /import/.
 * The four import steps close the section as a compact row.
 */
export function ImportGlobe() {
  return (
    <Section tone="dark" aria-labelledby="import-globe-title" className="isolate overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(48%_52%_at_27%_46%,rgb(227_6_19/0.08),transparent_70%)] max-lg:bg-[radial-gradient(90%_36%_at_50%_42%,rgb(227_6_19/0.07),transparent_70%)]"
      />
      <SectionIndex value={4} className="pointer-events-none absolute right-[max(1rem,4vw)] top-10 -z-10 max-md:text-[4rem]" />
      <Container className="grid [grid-template-areas:'head'_'globe'_'facts'] lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-16 lg:[grid-template-areas:'globe_.'_'globe_head'_'globe_facts'_'globe_.']">
        <Reveal className="[grid-area:head]">
          <Eyebrow>{importTeaser.eyebrow}</Eyebrow>
          <Heading id="import-globe-title" className="mt-5">
            {importTeaser.title} <em>{importTeaser.accent}</em>
          </Heading>
          <p className="mt-6 max-w-lg text-lead text-muted">{importTeaser.lead}</p>
        </Reveal>

        <div className="mx-auto mt-12 w-[min(100%,26rem)] [grid-area:globe] lg:mt-0 lg:w-full lg:max-w-[42rem] lg:self-center">
          <Globe focus="thalwil" showRoutes />
        </div>

        <Reveal className="mt-12 [grid-area:facts] lg:mt-12" delay={100}>
          <dl className="grid grid-cols-3 gap-x-5 border-t border-line pt-6">
            {importFacts.map((fact, i) => (
              <div key={fact.label} className="flex flex-col-reverse justify-end gap-2.5">
                <dt className="text-[0.75rem] leading-snug text-muted">{fact.label}</dt>
                <dd className="font-display text-[clamp(2.25rem,3.6vw,3.25rem)] leading-none tracking-tight text-fg">
                  <CountUp value={fact.value} delay={i * 120} />
                  <span className="mt-2 block font-sans text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-muted sm:ml-1.5 sm:mt-0 sm:inline sm:align-[0.2em]">
                    {fact.unit}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-col gap-x-8 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href="/import/" icon="arrow">
              So funktioniert der Import
            </ButtonLink>
            <ButtonLink href="/kontakt/?anliegen=import" variant="link">
              Wunschfahrzeug anfragen
            </ButtonLink>
          </div>
        </Reveal>
      </Container>

      <Container>
        <ol className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 md:mt-28 lg:grid-cols-4 lg:gap-x-8">
          {site.importSteps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 80}>
              <p aria-hidden="true" className="flex items-center gap-3 text-eyebrow font-semibold uppercase text-subtle">
                <span className="tabular">{String(i + 1).padStart(2, "0")}</span>
                <span className={i === site.importSteps.length - 1 ? "h-px flex-1 bg-brand" : "h-px flex-1 bg-line-strong"} />
              </p>
              <h3 className="mt-4 font-display text-[1.375rem] leading-tight text-fg md:text-[1.5rem]">
                <span className="sr-only">Schritt {i + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 max-w-[16rem] text-[0.875rem] leading-relaxed text-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
