import type { Metadata } from "next";
import { Fragment } from "react";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { creditNotice, financePoints, leasingExamples } from "@/content/partner";
import { formatChf, formatChfRound, formatNumber } from "@/lib/format";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { PartnerCards } from "@/components/sections/PartnerCards";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const description =
  "Leasing und Finanzierung über Alphera Financial Services (BMW Group) sowie unsere Partner Mercedes-Benz Automobile AG, The RE/MAX Collection und SEESICHT Media AG – Castellana Automobile AG, Thalwil.";

export const metadata: Metadata = pageMetadata({
  title: "Partner, Leasing & Finanzierung",
  description,
  path: "/partner/",
});

const lowestRate = leasingExamples[0]?.leasingFromChf;
const offerHref = "/kontakt/?anliegen=kaufinteresse";

export default function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner"
        title={
          <>
            Starke Partner. <em>Für Ihr nächstes Fahrzeug.</em>
          </>
        }
        lead="Leasing und Finanzierung über Alphera Financial Services und ein Netzwerk aus der Region – damit Sie sich ganz auf Ihr Wunschfahrzeug konzentrieren können."
        image="porsche-cockpit-wide"
        imagePosition="50% 40%"
      >
        <ButtonLink href="#finanzierung" variant="outline">
          Leasing & Finanzierung
        </ButtonLink>
      </PageHero>

      {/* Network --------------------------------------------------------- */}
      <Section tone="light" aria-labelledby="network-title">
        <Container>
          <SectionHeader
            id="network-title"
            eyebrow="Unser Netzwerk"
            title={
              <>
                Partner, <em>auf die wir uns verlassen.</em>
              </>
            }
            lead={
              <>
                Autokauf ist Vertrauenssache – das gilt auch für alle, die daran beteiligt sind. Deshalb arbeiten wir mit
                ausgewählten Partnern zusammen: von Leasing und Finanzierung über Alphera Financial Services bis zur
                Mercedes-Benz Automobile AG in Stäfa, The RE/MAX Collection in Bäch und der SEESICHT Media AG in Thalwil.
              </>
            }
          />
          <div className="mt-14 md:mt-20">
            <PartnerCards partners={site.partners} />
          </div>
        </Container>
      </Section>

      {/* Finance --------------------------------------------------------- */}
      <Section tone="dark" id="finanzierung" aria-labelledby="finance-title">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Reveal>
              <Eyebrow>Finanzierung & Leasing</Eyebrow>
              <Heading id="finance-title" className="mt-5">
                Ihr Wunschfahrzeug. <em>Bequem finanziert.</em>
              </Heading>
              <p className="mt-6 max-w-xl text-lead text-muted">
                Für Leasing und Finanzierung arbeiten wir mit Alphera Financial Services zusammen, dem Finanzdienstleister der
                BMW Group. Wir stellen Ihnen eine unverbindliche Offerte zusammen – passend zu Fahrzeug, Laufzeit und
                Anzahlung.
              </p>
            </Reveal>
            <ul className="mt-12 border-b border-line">
              {financePoints.map((point, i) => (
                <Reveal
                  as="li"
                  key={point.title}
                  delay={i * 80}
                  className="grid gap-2 border-t border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
                >
                  <h3 className="font-display text-[1.5rem] leading-tight text-fg">{point.title}</h3>
                  <p className="max-w-md text-[0.9375rem] text-muted">{point.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal className="lg:col-span-5 lg:col-start-8" delay={120}>
            <div className="border border-line bg-surface p-6 sm:p-8 lg:p-10">
              <Eyebrow>Beispiele aus dem Bestand</Eyebrow>
              {lowestRate !== undefined && (
                <div className="mt-8">
                  <p className="flex flex-wrap items-baseline gap-x-3 text-sm text-muted">
                    <span>Leasing ab CHF</span>
                    <span className="font-display text-[clamp(3.75rem,6vw,5.25rem)] leading-none tracking-tight text-fg tabular">
                      {formatNumber(lowestRate)}.–
                    </span>
                    <span>pro Monat</span>
                  </p>
                  <p className="mt-4 text-sm text-muted">je nach Fahrzeug, Laufzeit und Anzahlung</p>
                </div>
              )}

              <table className="mt-10 w-full text-[0.9375rem]" aria-label="Beispiele für Leasingraten aus aktuellen Inseraten">
                <thead>
                  <tr className="text-left text-[0.6875rem] uppercase tracking-[0.18em] text-subtle">
                    <th scope="col" className="pb-3 font-semibold">
                      Fahrzeug
                    </th>
                    <th scope="col" className="pb-3 text-right font-semibold max-sm:hidden">
                      Preis
                    </th>
                    <th scope="col" className="pb-3 text-right font-semibold">
                      Leasing ab
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leasingExamples.map((vehicle) => (
                    <tr key={vehicle.id} className="border-t border-line align-top">
                      <th scope="row" className="py-4 pr-4 text-left font-normal">
                        <span className="block text-[0.75rem] text-subtle">{vehicle.make}</span>
                        <span className="text-fg">
                          {/* keep hyphenated words like «E-Hybrid» together */}
                          {vehicle.model.split(" ").map((word, w) => (
                            <Fragment key={w}>
                              {w > 0 && " "}
                              <span className="whitespace-nowrap">{word}</span>
                            </Fragment>
                          ))}
                        </span>
                      </th>
                      <td className="py-4 pr-4 text-right text-muted tabular max-sm:hidden">{formatChf(vehicle.priceChf)}</td>
                      <td className="whitespace-nowrap py-4 text-right text-fg tabular">{formatChfRound(vehicle.leasingFromChf)}/Mt.</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 space-y-2 border-t border-line pt-6 text-[0.8125rem] leading-relaxed text-subtle">
                <p>Beispielraten aus aktuellen Inseraten. Massgebend sind die Konditionen der individuellen Offerte.</p>
                <p>{creditNotice}</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={offerHref} icon="arrow">
                  Offerte anfragen
                </ButtonLink>
                <ButtonLink href="/fahrzeuge/" variant="link">
                  Alle Fahrzeuge
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Persönliche Beratung"
        title={
          <>
            Ihre Offerte. <em>Unverbindlich und persönlich.</em>
          </>
        }
        lead="Sagen Sie uns, welches Fahrzeug Sie interessiert – wir stellen Ihnen die passende Leasing- oder Finanzierungsofferte zusammen."
        image="amg-gt-wide"
        imagePosition="50% 50%"
      >
        <ButtonLink href={offerHref} icon="arrow">
          Offerte anfragen
        </ButtonLink>
        <ButtonLink href="/fahrzeuge/" variant="outline">
          Fahrzeuge ansehen
        </ButtonLink>
      </CtaBand>
    </>
  );
}
