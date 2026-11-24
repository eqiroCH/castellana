import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { commissionArguments, commissionIntro, commissionSteps } from "@/content/kommission";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { QuoteFeature } from "@/components/sections/QuoteFeature";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ArgumentStack } from "@/components/scroll/ArgumentStack";
import { ClipReveal } from "@/components/scroll/ClipReveal";

const title = "Auto auf Kommission verkaufen in Thalwil";
const description =
  "Kommissionsverkauf in Thalwil am Zürichsee: Wir verkaufen Ihr Fahrzeug professionell – mit Leasing, Garantie und Eintausch, die Sie privat nicht anbieten können. Abwicklung von A bis Z.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/kommission/" });

const offerHref = "/kontakt/?anliegen=kommission";

export default function KommissionPage() {
  return (
    <>
      <PageHero
        eyebrow="Kommissionsverkauf"
        title={
          <>
            Wir verkaufen Ihr Fahrzeug. <em>Von A bis Z.</em>
          </>
        }
        lead="Sie möchten Ihr Auto verkaufen, ohne selbst zu inserieren? Wir übernehmen Präsentation, Interessenten, Probefahrten und Abwicklung – mit Leasing, Garantie und Eintausch, die Sie privat nicht anbieten können."
        image="amg-gt-wide"
        imagePosition="50% 65%"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={offerHref} icon="arrow">
            Fahrzeug anbieten
          </ButtonLink>
          <ButtonLink href="#ablauf" variant="outline">
            So läuft es ab
          </ButtonLink>
        </div>
      </PageHero>

      {/* Editorial intro: the broker analogy */}
      <Section tone="light" aria-labelledby="prinzip-title">
        <Container>
          <Reveal>
            <Eyebrow>Das Prinzip</Eyebrow>
            <Heading id="prinzip-title" size="xl" className="mt-8 max-w-5xl">
              {commissionIntro.statement} <em>{commissionIntro.accent}</em>
            </Heading>
          </Reveal>

          <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-8">
            <ClipReveal className="lg:col-span-7">
              <div className="relative aspect-[3/2] overflow-hidden bg-surface">
                <Photo media="showroom-aston-martin" sizes="(min-width: 1024px) 58vw, 100vw" className="size-full object-cover" />
              </div>
            </ClipReveal>
            <Reveal className="flex flex-col justify-end gap-8 lg:col-span-4 lg:col-start-9" delay={100}>
              <p className="text-lead text-muted">{commissionIntro.text}</p>
              <p className="border-t border-line-strong pt-6 text-[0.9375rem] text-muted">
                Ihr Fahrzeug steht dabei in bester Gesellschaft: Rund {site.stock.onSite} Premium-, Luxus- und
                Sportfahrzeuge präsentieren wir in Showroom und Lagerhalle in Thalwil.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Five arguments — sticky scroll stack */}
      <Section tone="dark" aria-labelledby="vorteile-title">
        <Container>
          <ArgumentStack
            id="vorteile-title"
            eyebrow="Warum durch uns verkaufen"
            title={
              <>
                Fünf Gründe, <em>uns den Verkauf zu überlassen.</em>
              </>
            }
            items={commissionArguments}
          />
        </Container>
      </Section>

      {/* Process */}
      <Section tone="light" id="ablauf" aria-labelledby="ablauf-title">
        <Container>
          <SectionHeader
            id="ablauf-title"
            eyebrow="So läuft es ab"
            title={
              <>
                Vom ersten Gespräch <em>bis zur Auszahlung.</em>
              </>
            }
            lead="Sie übergeben uns Ihr Fahrzeug – wir kümmern uns um alles Weitere."
            action={
              <ButtonLink href={offerHref} variant="outline" icon="arrow">
                Fahrzeug anbieten
              </ButtonLink>
            }
          />
          <ProcessSteps steps={commissionSteps} className="mt-16 md:mt-24" />
        </Container>
      </Section>

      <QuoteFeature
        label="Das Versprechen von Antonio Castellana"
        eyebrow="Unser Versprechen"
        quote={
          <>
            Wir übernehmen für Sie die Abwicklung <em>von&nbsp;A&nbsp;bis&nbsp;Z.</em>
          </>
        }
        author={site.commission.quote.author}
        role={site.owner.role}
        portrait="/images/team/8-antonio-castellana.jpg"
        image="showroom-lamborghini"
        reverse
        drift
      />

      <CtaBand
        id="kommission-cta-title"
        eyebrow="Fahrzeug verkaufen"
        title={
          <>
            Bereit für den Verkauf? <em>Erzählen Sie uns von Ihrem Auto.</em>
          </>
        }
        lead="Marke, Modell, Jahrgang und Kilometerstand genügen für den ersten Schritt. Wir melden uns persönlich bei Ihnen."
        image="porsche-cockpit-wide"
        imagePosition="50% 50%"
      >
        <ButtonLink href={offerHref} icon="arrow">
          Fahrzeug anbieten
        </ButtonLink>
        <ButtonLink href="/showroom/" variant="outline">
          Showroom besuchen
        </ButtonLink>
      </CtaBand>
    </>
  );
}
