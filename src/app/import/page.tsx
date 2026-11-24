import type { Metadata } from "next";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/metadata";
import { importFacts, importFaq, importReasons } from "@/content/import";
import { site } from "@/content/site";
import { JsonLd } from "@/components/layout/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq, faqPageJsonLd } from "@/components/sections/Faq";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { QuoteFeature } from "@/components/sections/QuoteFeature";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { CountUp } from "@/components/scroll/CountUp";
import { Globe } from "@/components/three/Globe";

const title = "Luxus- und Sportwagen Import Schweiz";
const description =
  "Direktimport von Luxus- und Sportwagen aus der EU und den USA: ehrlicher Preisvergleich, Dokumente, Transport, Verzollung, MFK und schlüsselfertige Übergabe in Thalwil – aus einer Hand.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/import/" });

const trust = [
  { value: `${site.rating.value}`, suffix: "★", label: `Google · ${site.rating.count} Bewertungen` },
  { value: "Referenzen", label: "Kontakte zufriedener Importkunden auf Anfrage" },
  { value: "40+", label: `Jahre Erfahrung im Autohandel, seit ${site.history.since}` },
];

export default function ImportPage() {
  return (
    <>
      <JsonLd data={faqPageJsonLd(importFaq)} />

      {/* Hero: headline left, globe right (mobile: globe between headline and lead) */}
      <section className="tone-dark relative isolate overflow-hidden border-b border-line" aria-labelledby="page-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_74%_56%,rgb(227_6_19/0.09),transparent_70%)] max-lg:bg-[radial-gradient(80%_40%_at_50%_58%,rgb(227_6_19/0.08),transparent_70%)]"
        />
        <Container
          className={cn(
            "grid pt-36 pb-14 md:pb-20 lg:min-h-[88svh] lg:gap-x-10 lg:pt-28 lg:pb-16",
            "[grid-template-areas:'head'_'globe'_'body'] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:[grid-template-areas:'._globe'_'head_globe'_'body_globe'_'._globe']",
          )}
        >
          <div className="[grid-area:head]">
            <Eyebrow className="hero-fade">Direktimport</Eyebrow>
            <h1
              id="page-title"
              className="hero-fade mt-6 max-w-3xl font-display text-display-xl text-fg lg:text-display-lg [&_em]:italic [&_em]:text-fg/70"
            >
              Ihr Wunschfahrzeug. <em>Importiert zu Top-Preisen.</em>
            </h1>
          </div>

          <div className="hero-fade mx-auto mt-10 w-[min(100%,25rem)] [--fade-delay:200ms] [grid-area:globe] lg:mt-0 lg:w-full lg:max-w-[45rem] lg:self-center">
            <Globe focus="thalwil" showRoutes />
          </div>

          <div className="hero-fade mt-10 [--fade-delay:120ms] [grid-area:body] lg:mt-8">
            <p className="max-w-xl text-lead text-paper/80">
              Aus der EU oder den USA: Wir vergleichen die Preise, organisieren Dokumente, Transport, Verzollung und MFK
              – und übergeben Ihnen das Fahrzeug schlüsselfertig in Thalwil.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/kontakt/?anliegen=import" icon="arrow">
                Wunschfahrzeug anfragen
              </ButtonLink>
              <ButtonLink href="#ablauf" variant="outline">
                So funktioniert’s
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Why import */}
      <Section tone="light" aria-labelledby="why-title">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <Eyebrow>Warum importieren</Eyebrow>
            <Heading id="why-title" className="mt-5">
              Dasselbe Fahrzeug. <em>Ein anderer Preis.</em>
            </Heading>
            <p className="mt-6 max-w-md text-lead text-muted">
              Ein Mercedes SL 63 AMG wird im Werk Bremen gebaut und weltweit verkauft. Je nach Land kostet er
              unterschiedlich viel – genau dort setzen wir an.
            </p>
            <ButtonLink href="#fragen" variant="link" icon="arrow" className="mt-4">
              Häufige Fragen zum Import
            </ButtonLink>
          </Reveal>

          <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {importReasons.map((reason, i) => (
              <Reveal as="li" key={reason.title} delay={i * 80} className="border-t border-line-strong py-8">
                <span className="font-display text-lg text-subtle tabular" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-display-sm text-fg">{reason.title}</h3>
                <p className="mt-3 max-w-xs text-[0.9375rem] text-muted">{reason.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Process */}
      <Section tone="dark" id="ablauf" aria-labelledby="ablauf-title">
        <Container>
          <SectionHeader
            id="ablauf-title"
            eyebrow="So funktioniert’s"
            title={
              <>
                In vier Schritten <em>zu Ihrem Fahrzeug.</em>
              </>
            }
            lead="Sie sagen uns, was Sie suchen. Um alles Weitere kümmern wir uns – vom ersten Dokument bis zur Schlüsselübergabe."
          />
          <ProcessSteps steps={site.importSteps} className="mt-16 md:mt-24" />

          <Reveal>
            <dl className="mt-20 grid gap-x-8 gap-y-10 border-t border-line pt-10 sm:grid-cols-3 md:mt-28">
              {importFacts.map((fact, i) => (
                <div key={fact.label} className="flex flex-col-reverse justify-end gap-3">
                  <dt className="max-w-[16rem] text-[0.8125rem] leading-snug text-muted">
                    {fact.label}
                    {fact.note && (
                      <span className="mt-1.5 block text-fg/80">
                        {fact.note.prefix} <CountUp value={fact.note.value} delay={i * 150 + 300} /> {fact.note.unit}
                      </span>
                    )}
                  </dt>
                  <dd className="font-display text-[clamp(2.75rem,4.5vw,4rem)] leading-none tracking-tight text-fg">
                    <CountUp value={fact.value} delay={i * 150} />
                    <span className="ml-2 font-sans text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-muted">
                      {fact.unit}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {/* Trust */}
      <QuoteFeature
        tone="light"
        label="Persönlich und vertrauenswürdig"
        eyebrow="Vertrauenssache"
        quote={
          <>
            Bei uns sind Sie nicht ein Kunde, <em>sondern ein Freund.</em>
          </>
        }
        author={site.quote.author}
        role={site.quote.role}
        portrait="/images/team/8-antonio-castellana.jpg"
        image="porsche-lake"
        imagePosition="50% 55%"
        imageAspect="aspect-[4/3]"
      >
        <dl className="grid gap-x-6 gap-y-6 border-t border-line-strong pt-6 sm:grid-cols-3">
          {trust.map((item) => (
            <div key={item.label} className="flex flex-col-reverse justify-end gap-2">
              <dt className="text-[0.75rem] leading-snug text-muted">{item.label}</dt>
              <dd className="font-display text-[1.75rem] leading-none tracking-tight text-fg tabular">
                {item.value}
                {item.suffix && (
                  <span aria-hidden="true" className="ml-1 align-[0.35em] text-[0.55em] text-brand">
                    {item.suffix}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </QuoteFeature>

      {/* FAQ */}
      <Section tone="dark" id="fragen" aria-labelledby="faq-title">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--spacing-header)+3rem)]">
              <Eyebrow>Häufige Fragen</Eyebrow>
              <Heading id="faq-title" className="mt-5">
                Gut zu wissen. <em>Vor dem Import.</em>
              </Heading>
              <p className="mt-6 max-w-sm text-muted">
                Ihre Frage ist nicht dabei? Wir beraten Sie gerne persönlich – in Thalwil oder am Telefon.
              </p>
              <ButtonLink href={site.phone.href} variant="link" icon="arrow" className="mt-3 tabular">
                {site.phone.display}
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7 lg:col-start-6" delay={100}>
            <Faq items={importFaq} name="import-faq" />
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        id="import-cta-title"
        eyebrow="Import anfragen"
        title={
          <>
            Welches Fahrzeug <em>dürfen wir für Sie finden?</em>
          </>
        }
        lead="Nennen Sie uns Marke, Modell und Ihre Wünsche. Wir vergleichen die Preise in der Schweiz, der EU und den USA – und sagen Ihnen ehrlich, ob sich ein Import lohnt."
        image="ferrari-wheel-wide"
        imagePosition="60% 50%"
      >
        <ButtonLink href="/kontakt/?anliegen=import" icon="arrow">
          Wunschfahrzeug anfragen
        </ButtonLink>
        <ButtonLink href="/fahrzeuge/" variant="outline">
          Bestand ansehen
        </ButtonLink>
      </CtaBand>
    </>
  );
}
