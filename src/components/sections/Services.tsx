import Link from "next/link";
import type { MediaSlug } from "@/content/media";
import { Container } from "@/components/ui/Container";
import { ArrowRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "./SectionHeader";

const services: Array<{ title: string; text: string; href: string; image: MediaSlug; alt?: string }> = [
  {
    title: "Direktimport",
    text: "Top-Fahrzeuge zu Top-Preisen aus der EU und den USA – von den Dokumenten bis zur schlüsselfertigen Übergabe.",
    href: "/import/",
    image: "porsche-gt3-rear-portrait",
  },
  {
    title: "Kommissionsverkauf",
    text: "Wir verkaufen Ihr Fahrzeug – mit Leasing, Garantie und Eintausch, die Sie privat nicht anbieten können.",
    href: "/kommission/",
    image: "amg-gt-portrait",
  },
  {
    title: "Showroom Thalwil",
    text: "Rund 200 Fahrzeuge vor Ort: im Showroom und in der Lagerhalle mit über 100 aufbereiteten Fahrzeugen.",
    href: "/showroom/",
    image: "showroom-maserati-portrait",
  },
  {
    title: "Finanzierung & Leasing",
    text: "Leasing und Finanzierung über unseren Partner Alphera Financial Services (BMW Group).",
    href: "/partner/",
    image: "porsche-cockpit-portrait",
  },
];

/** Four editorial service cards linking to the detail pages. */
export function Services() {
  return (
    <Section tone="dark" aria-labelledby="services-title" className="border-t border-line">
      <Container>
        <SectionHeader
          id="services-title"
          eyebrow="Leistungen"
          title={
            <>
              Kaufen, importieren, verkaufen. <em>Alles aus einer Hand.</em>
            </>
          }
        />
        <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal as="li" key={service.href} delay={i * 90}>
              <article className="group relative flex h-full flex-col">
                <div className="relative aspect-[16/10] overflow-hidden bg-surface sm:aspect-[4/5]">
                  <Photo
                    media={service.image}
                    alt=""
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                    className="size-full object-cover saturate-[0.8] transition-transform duration-[1400ms] ease-out-quart group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-transparent to-ink/30" />
                  <span className="absolute left-5 top-5 font-display text-lg text-paper/90 tabular" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-display-sm text-fg">
                  <Link href={service.href} className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-4 after:focus-visible:outline-fg">
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 text-[0.9375rem] text-muted">{service.text}</p>
                <span
                  aria-hidden="true"
                  className="mt-6 inline-flex items-center gap-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-fg"
                >
                  Mehr erfahren
                  <ArrowRight className="size-4 transition-transform duration-300 ease-out-quart group-hover:translate-x-1" />
                </span>
              </article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
