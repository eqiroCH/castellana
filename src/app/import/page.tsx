import type { Metadata } from "next";
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
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { QuoteFeature } from "@/components/sections/QuoteFeature";
import { SectionHeader } from "@/components/sections/SectionHeader";

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

      <PageHero
        eyebrow="Direktimport"
        title={
          <>
            Ihr Wunschfahrzeug. <em>Importiert zu Top-Preisen.</em>
          </>
        }
        lead="Aus der EU oder den USA: Wir vergleichen die Preise, organisieren Dokumente, Transport, Verzollung und MFK – und übergeben Ihnen das Fahrzeug schlüsselfertig in Thalwil."
        image="porsche-gt3-rear"
        imagePosition="50% 60%"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/kontakt/?anliegen=import" icon="arrow">
            Wunschfahrzeug anfragen
          </ButtonLink>
          <ButtonLink href="#ablauf" variant="outline">
            So funktioniert’s
          </ButtonLink>
        </div>
      </PageHero>

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
              {importFacts.map((fact) => (
                <div key={fact.label} className="flex flex-col-reverse justify-end gap-3">
                  <dt className="max-w-[16rem] text-[0.8125rem] leading-snug text-muted">{fact.label}</dt>
                  <dd className="font-display text-[clamp(2.75rem,4.5vw,4rem)] leading-none tracking-tight text-fg tabular">
                    {fact.value}
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
