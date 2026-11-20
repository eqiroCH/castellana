import type { Metadata } from "next";
import { addressLine, site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { LocationSection } from "@/components/contact/LocationSection";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/layout/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const title = "Kontakt & Anfahrt";
const description = `Probefahrt, Rückruf oder Beratung: Schreiben Sie uns oder besuchen Sie die ${site.name}, ${addressLine}. Telefon ${site.phone.display}.`;

export const metadata: Metadata = pageMetadata({ title, description, path: "/kontakt/" });

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title={
          <>
            Wir freuen uns <em>auf Sie.</em>
          </>
        }
        lead="Probefahrt, Rückruf oder ein unverbindliches Gespräch über Ihr nächstes Fahrzeug – schreiben Sie uns, rufen Sie an oder besuchen Sie uns in Thalwil."
        image="fassade-schild"
        imagePosition="30% 50%"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="#anfrage" icon="arrow">
            Anfrage senden
          </ButtonLink>
          <ButtonLink href={site.phone.href} variant="outline" className="tabular">
            {site.phone.display}
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="light" id="anfrage" aria-labelledby="anfrage-title">
        <Container className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <Eyebrow>Ihre Anfrage</Eyebrow>
              <Heading id="anfrage-title" className="mt-5">
                Schreiben Sie <em>uns.</em>
              </Heading>
              <p className="mt-6 max-w-xl text-lead text-muted">
                Erzählen Sie uns, worum es geht – wir melden uns so rasch wie möglich persönlich bei Ihnen.
              </p>
            </Reveal>
            <ContactForm className="mt-12 md:mt-16" />
          </div>

          <aside aria-label="Kontaktangaben" className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <ContactDetails />
            </div>
          </aside>
        </Container>
      </Section>

      <LocationSection />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `${title} – ${site.name}`,
          url: `${site.url}/kontakt/`,
          inLanguage: "de-CH",
          about: { "@id": `${site.url}/#dealer` },
        }}
      />
    </>
  );
}
