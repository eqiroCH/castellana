import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";

const delay = (ms: number) => ({ "--fade-delay": `${ms}ms` }) as CSSProperties;

const trust = [
  { value: `${site.rating.value}`, suffix: "★", label: "Google-Bewertung" },
  { value: `${site.rating.count}`, label: "Bewertungen auf Google" },
  { value: `${site.stock.cars}`, label: "Fahrzeuge im Bestand" },
  { value: "Garantie", label: "Unfallfrei & ab MFK" },
];

/** Home hero: full-viewport cinematic photo, headline, CTAs and trust strip. */
export function Hero() {
  return (
    <section className="tone-dark relative isolate flex min-h-[100svh] flex-col overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Photo
          media="hero-911-gt3rs"
          mobileMedia="hero-911-gt3rs-portrait"
          sizes="100vw"
          priority
          position="62% 50%"
          className="hero-settle size-full object-cover"
        />
        {/* Legibility: left wash on desktop, bottom wash everywhere */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent max-md:hidden" />
        <div className="absolute inset-0 bg-ink/35 md:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-[82%] bg-gradient-to-t from-ink from-35% via-ink/80 to-transparent md:h-[62%] md:from-0% md:via-ink/50" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/60 to-transparent" />
      </div>

      <Container className="flex flex-1 flex-col justify-end pb-8 pt-36 md:pb-12">
        <div className="max-w-4xl">
          <Eyebrow className="hero-fade" as="p">
            Thalwil am Zürichsee
          </Eyebrow>
          <h1 id="hero-title" className="hero-fade mt-6 font-display text-display-2xl text-fg" style={delay(100)}>
            Automobile Leidenschaft. <em className="text-fg/70">Seit {site.history.since}.</em>
          </h1>
          <p className="hero-fade mt-7 max-w-xl text-lead text-paper/80" style={delay(200)}>
            Premium-, Luxus- und Sportfahrzeuge von Porsche bis Ferrari – rund {site.stock.onSite} Fahrzeuge vor Ort,
            Direktimport und Kommissionsverkauf. Persönlich beraten von der Familie Castellana.
          </p>
          <div className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row" style={delay(300)}>
            <ButtonLink href="/fahrzeuge/" icon="arrow">
              Fahrzeuge entdecken
            </ButtonLink>
            <ButtonLink href="/kontakt/" variant="outline">
              Termin vereinbaren
            </ButtonLink>
          </div>
        </div>

        <dl className="hero-fade mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 md:mt-20 md:grid-cols-4" style={delay(450)}>
          {trust.map((item) => (
            <div key={item.label} className="flex flex-col-reverse justify-end gap-1.5">
              <dt className="text-[0.75rem] text-muted">{item.label}</dt>
              <dd className="font-display text-[1.75rem] leading-none tracking-tight text-fg tabular md:text-[2rem]">
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
      </Container>
    </section>
  );
}
