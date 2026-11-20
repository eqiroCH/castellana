import type { Metadata } from "next";
import { addressLine, site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { LegalFacts, LegalSection, LegalSubheading } from "@/components/legal/Legal";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
// Single source of truth for photo credits (also generates CREDITS.md).
import { images } from "../../../scripts/image-manifest.mjs";

const title = "Impressum";
const description = `Impressum der ${site.legal.company}, ${addressLine}: Kontakt, Handelsregister, UID, Haftungsausschluss und Bildnachweis.`;

export const metadata: Metadata = pageMetadata({ title, description, path: "/impressum/" });

type Credit = { photographer: string; handle: string; photos: Array<{ id: string; alt: string }> };

/** Unsplash photographers, de-duplicated, in manifest order. */
function unsplashCredits(): Credit[] {
  const byHandle = new Map<string, Credit>();
  for (const image of images) {
    const { source } = image;
    if (source.type !== "unsplash") continue;
    const credit = byHandle.get(source.handle) ?? { photographer: source.photographer, handle: source.handle, photos: [] };
    if (!credit.photos.some((p) => p.id === source.id)) credit.photos.push({ id: source.id, alt: image.alt });
    byHandle.set(source.handle, credit);
  }
  return [...byHandle.values()];
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const newTab = <span className="sr-only"> (öffnet in neuem Fenster)</span>;

export default function ImpressumPage() {
  const credits = unsplashCredits();

  return (
    <>
      <PageHero
        eyebrow="Rechtliches"
        title="Impressum"
        lead="Angaben zur Betreiberin dieser Website, zu Haftung, Urheberrecht und Bildnachweis."
      />

      <Section tone="light" className="pt-12 md:pt-16">
        <Container>
          <LegalSection id="betreiberin" title="Betreiberin">
            <address className="not-italic">
              <strong>{site.legal.company}</strong>
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
              <br />
              {site.address.country}
            </address>
            <LegalFacts
              rows={[
                {
                  label: "Telefon",
                  value: (
                    <a href={site.phone.href} className="tabular">
                      {site.phone.display}
                    </a>
                  ),
                },
                { label: "E-Mail", value: <a href={site.email.href}>{site.email.display}</a> },
                { label: "Website", value: site.domain },
              ]}
            />
          </LegalSection>

          <LegalSection id="vertretung" title="Vertretungsberechtigte Person">
            <p>
              <strong>{site.owner.name}</strong>, Geschäftsführer
            </p>
          </LegalSection>

          <LegalSection id="handelsregister" title="Handelsregister">
            <LegalFacts
              rows={[
                { label: "Rechtsform", value: site.legal.form },
                { label: "Sitz", value: site.legal.seat },
                { label: "Eintrag", value: site.legal.commercialRegister },
                { label: "UID", value: <span className="tabular">{site.legal.uid}</span> },
              ]}
            />
          </LegalSection>

          <LegalSection id="haftung" title="Haftungsausschluss">
            <LegalSubheading>Inhalte dieser Website</LegalSubheading>
            <p>
              Wir erstellen die Inhalte dieser Website mit grösster Sorgfalt. Für die Richtigkeit, Vollständigkeit und
              Aktualität der Informationen übernehmen wir jedoch keine Gewähr. Fahrzeugangaben, Preise, Leasingbeispiele
              und Verfügbarkeiten sind unverbindlich; Irrtümer, Preisänderungen und Zwischenverkauf bleiben vorbehalten.
              Massgebend sind ausschliesslich die Angaben im Kaufvertrag.
            </p>
            <p>
              Haftungsansprüche für Schäden materieller oder immaterieller Art, die aus dem Zugriff auf diese Website, der
              Nutzung oder Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch
              technische Störungen entstehen, sind – soweit gesetzlich zulässig – ausgeschlossen. Wir behalten uns vor,
              Inhalte jederzeit ohne Ankündigung zu ändern, zu ergänzen oder zu entfernen.
            </p>
            <LegalSubheading>Leasing und Finanzierung</LegalSubheading>
            <p>
              Angegebene Leasingraten sind unverbindliche Beispiele. Massgebend sind die Konditionen und der Vertrag der
              finanzierenden Gesellschaft. Die Kreditvergabe ist verboten, falls sie zur Überschuldung der Konsumentin
              oder des Konsumenten führt.
            </p>
            <LegalSubheading>Links auf andere Websites</LegalSubheading>
            <p>
              Diese Website enthält Links zu Websites Dritter, etwa zu AutoScout24, zu Kartendiensten oder zu unseren
              Partnern. Diese liegen ausserhalb unseres Verantwortungsbereichs; für deren Inhalte und Datenbearbeitung
              sind ausschliesslich die jeweiligen Betreiber verantwortlich. Der Zugriff und die Nutzung solcher Websites
              erfolgen auf eigene Gefahr.
            </p>
          </LegalSection>

          <LegalSection id="urheberrecht" title="Urheberrechte">
            <p>
              Texte, Fotos, Grafiken und das Design dieser Website sind urheberrechtlich geschützt. Die Rechte liegen bei
              der {site.legal.company} oder bei den ausdrücklich genannten Rechteinhaberinnen und Rechteinhabern. Jede
              Vervielfältigung oder Verwendung ausserhalb dieser Website bedarf der vorgängigen schriftlichen Zustimmung.
            </p>
            <p>
              Genannte Marken- und Produktnamen wie Porsche, Ferrari oder Mercedes-AMG sind Eigentum der jeweiligen
              Inhaber. Ihre Nennung dient ausschliesslich der Beschreibung unseres Angebots.
            </p>
          </LegalSection>

          <LegalSection id="bildnachweis" title="Bildnachweis">
            <p>
              Fotos von Showroom, Fassade und Team: {site.legal.company}. Partnerlogos: die jeweiligen Partnerunternehmen.
            </p>
            <p>
              Weitere Fotos stammen von{" "}
              <a href="https://unsplash.com" {...external}>
                Unsplash
                {newTab}
              </a>{" "}
              und werden gemäss der{" "}
              <a href="https://unsplash.com/license" {...external}>
                Unsplash-Lizenz
                {newTab}
              </a>{" "}
              verwendet. Fahrzeugfotos, die nicht das konkrete Angebot zeigen, sind als «Symbolbild» gekennzeichnet.
            </p>
            <ul className="divide-y divide-line border-y border-line">
              {credits.map((credit) => (
                <li key={credit.handle} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <a href={`https://unsplash.com/@${credit.handle}`} className="self-start text-[0.9375rem]" {...external}>
                    {credit.photographer}
                    {newTab}
                  </a>
                  <span className="text-[0.9375rem]">
                    {credit.photos.map((photo, i) => (
                      <span key={photo.id}>
                        {i > 0 && " · "}
                        <a
                          href={`https://unsplash.com/photos/${photo.id}`}
                          className="text-muted! decoration-line-strong hover:text-fg!"
                          {...external}
                        >
                          {photo.alt}
                          {newTab}
                        </a>
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection id="umsetzung" title="Konzept, Design & Umsetzung">
            <p>
              <a href={site.links.eqiro} {...external}>
                Eqiro – eqiro.ch
                {newTab}
              </a>
            </p>
          </LegalSection>
        </Container>
      </Section>
    </>
  );
}
