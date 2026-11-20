import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import {
  aboutMilestones,
  aboutValues,
  applicationMailto,
  companionMilestones,
  numberWord,
  videoDetails,
} from "@/content/ueber-uns";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { TeamGrid, type TeamCompanion } from "@/components/sections/TeamGrid";
import { VideoFacade } from "@/components/sections/VideoFacade";
import { ButtonLink, buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Stat } from "@/components/ui/Stat";

const description = `Familienbetrieb seit ${site.history.since}: Lernen Sie die Castellana Automobile AG in Thalwil kennen – Geschichte, Werte, Team und offene Stellen. Direktimport und Verkauf von Premium- und Sportfahrzeugen.`;

export const metadata: Metadata = pageMetadata({
  title: `Über uns – Familienbetrieb seit ${site.history.since}`,
  description,
  path: "/ueber-uns/",
});

/* Team data, derived from site.team */
const isCompanion = (member: (typeof site.team)[number]) => member.role.startsWith("Wachhund");
const people = site.team.filter((m) => !isCompanion(m));
const family = people.filter((m) => m.name.endsWith(` ${site.shortName}`));
const staff = people.filter((m) => !m.name.endsWith(` ${site.shortName}`));
const leo = site.team.find(isCompanion);
const companion: TeamCompanion | undefined = leo?.photo
  ? {
      name: leo.name,
      role: leo.role.split(" – ")[0],
      photo: leo.photo,
      photoAlt: `${leo.name}, ein kleiner weisser Hund, blickt in die Kamera`,
      milestones: companionMilestones,
    }
  : undefined;
const antonio = site.team.find((m) => m.name === site.owner.name);

/* «Bei uns sind Sie nicht ein Kunde, | sondern ein Freund.» — second half in italics */
const [quoteLead, quoteAccent] = site.quote.text.split(/,\s*(?=sondern)/);

export default function UeberUnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Über uns"
        title={
          <>
            Familienbetrieb. <em>Seit {site.history.since}.</em>
          </>
        }
        lead={`${site.owner.name} ist seit ${site.history.since} in der Autobranche. Heute führt er das Unternehmen gemeinsam mit seiner Familie und einem Team, das Sie persönlich berät – in ${numberWord(site.languages.length)} Sprachen.`}
        image="porsche-lake"
        imagePosition="55% 50%"
      />

      {/* Story ---------------------------------------------------------- */}
      <Section tone="light" aria-labelledby="story-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5">
              <Eyebrow>Unsere Geschichte</Eyebrow>
              <Heading id="story-title" className="mt-5">
                Aus Leidenschaft gewachsen. <em>Familie geblieben.</em>
              </Heading>
            </Reveal>
            <Reveal className="space-y-6 lg:col-span-6 lg:col-start-7 lg:pt-11" delay={100}>
              <p className="text-lead text-fg">
                {site.owner.name} ist seit {site.history.since} in der Autobranche zu Hause. Aus seiner Leidenschaft für
                aussergewöhnliche Fahrzeuge ist ein Unternehmen gewachsen, das seit über 30 Jahren im Premiumbereich tätig
                ist – seit {site.history.incorporated} als Aktiengesellschaft.
              </p>
              <p className="text-muted">
                Unser Kerngeschäft ist der Direktimport von Top-Fahrzeugen zu Top-Preisen. Vor Ort präsentieren wir rund{" "}
                {site.stock.onSite} Fahrzeuge – im Showroom und in unserer Lagerhalle. Geführt wird das Unternehmen von
                Antonio, Nino, Myrta und Laura Castellana, gemeinsam mit einem Team, das sein ganzes Wissen und seine
                Erfahrung für die langfristige Zufriedenheit unserer Kundinnen und Kunden einsetzt.
              </p>
            </Reveal>
          </div>

          <ol className="mt-16 grid gap-y-10 sm:grid-cols-3 sm:gap-x-8 md:mt-24">
            {aboutMilestones.map((milestone, i) => (
              <Reveal as="li" key={milestone.label} delay={i * 90} className="border-t border-line-strong pt-6">
                <p className="font-display text-display-md text-fg tabular">{milestone.label}</p>
                <p className="mt-3 max-w-xs text-[0.9375rem] text-muted">{milestone.text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <figure className="mt-16 grid gap-6 md:mt-24 lg:grid-cols-12 lg:gap-8">
              <div className="relative -mx-gutter aspect-[1170/441] overflow-hidden bg-surface sm:mx-0 lg:col-span-10">
                <Photo
                  media="team-gruppe"
                  sizes="(min-width: 1376px) 1060px, (min-width: 1024px) 80vw, 100vw"
                  className="size-full object-cover"
                />
              </div>
              <figcaption className="flex items-start gap-4 text-sm leading-relaxed text-muted lg:col-span-2 lg:self-end">
                <span aria-hidden="true" className="mt-2.5 h-px w-8 shrink-0 bg-fg/40" />
                <span>Das Castellana-Team mit Wachhund Leo im Showroom in Thalwil.</span>
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </Section>

      {/* Quote, values & figures ----------------------------------------- */}
      <Section tone="dark" aria-labelledby="values-title">
        <Container>
          <Reveal>
            <figure className="max-w-5xl">
              <blockquote className="font-display text-display-xl text-fg">
                <p>
                  «{quoteLead}
                  {quoteAccent && (
                    <>
                      , <em className="italic text-fg/60">{quoteAccent}</em>
                    </>
                  )}
                  »
                </p>
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4 text-sm">
                {antonio?.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- tiny original portrait, shown below its native size
                  <img
                    src={antonio.photo}
                    alt=""
                    width={56}
                    height={56}
                    loading="lazy"
                    className="size-14 shrink-0 rounded-full object-cover object-top grayscale"
                  />
                ) : (
                  <span aria-hidden="true" className="h-px w-10 bg-fg/40" />
                )}
                <span>
                  <span className="block font-semibold text-fg">{site.quote.author}</span>
                  <span className="block text-muted">{site.quote.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="mt-20 grid gap-12 border-t border-line pt-14 lg:mt-28 lg:grid-cols-12 lg:gap-8 lg:pt-20">
            <Reveal className="lg:col-span-4">
              <Eyebrow>Was uns ausmacht</Eyebrow>
              <Heading id="values-title" className="mt-5">
                Erfahrung, Auswahl <em>und ein offenes Ohr.</em>
              </Heading>
            </Reveal>
            <ol className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
              {aboutValues.map((value, i) => (
                <Reveal as="li" key={value.title} delay={i * 80} className="border-t border-line-strong py-8">
                  <span className="font-display text-lg text-subtle tabular" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-display-sm text-fg">{value.title}</h3>
                  <p className="mt-1 font-display text-[1.125rem] italic text-fg/60">{value.kicker}</p>
                  <p className="mt-4 max-w-sm text-[0.9375rem] text-muted">{value.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>

          <Reveal>
            <h3 className="sr-only">In Zahlen</h3>
            <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 lg:mt-24 lg:grid-cols-4">
              {site.stats.map((stat) => (
                <Stat key={stat.label} value={stat.value} suffix={"suffix" in stat ? stat.suffix : undefined} label={stat.label} />
              ))}
            </dl>
          </Reveal>
        </Container>
      </Section>

      {/* Team ------------------------------------------------------------ */}
      <Section tone="light" aria-labelledby="team-title">
        <Container>
          <SectionHeader
            id="team-title"
            eyebrow="Das Team"
            title={
              <>
                Die Menschen <em>hinter Castellana.</em>
              </>
            }
            lead="Vom ersten Gespräch über die Probefahrt bis zur Aufbereitung: Diese Menschen kümmern sich um Sie und Ihr Fahrzeug."
          />
          <div className="mt-14 md:mt-20">
            <TeamGrid
              groups={[
                { title: `Familie ${site.shortName}`, members: family },
                { title: "Unser Team", members: staff },
              ]}
              companion={companion}
            />
          </div>
        </Container>
      </Section>

      {/* Videos ---------------------------------------------------------- */}
      <Section tone="dark" aria-labelledby="videos-title">
        <Container>
          <SectionHeader
            id="videos-title"
            eyebrow="Einblicke"
            title={
              <>
                Castellana <em>in bewegten Bildern.</em>
              </>
            }
          />
          <ul className="mt-14 grid gap-x-6 gap-y-14 md:mt-20 md:grid-cols-3">
            {site.videos.map((video, i) => {
              const details = videoDetails[video.id] ?? { title: video.title, text: "", posterScale: undefined };
              return (
                <Reveal as="li" key={video.id} delay={i * 90}>
                  <VideoFacade id={video.id} title={details.title} posterScale={details.posterScale} />
                  <h3 className="mt-6 font-display text-display-sm text-fg">{details.title}</h3>
                  {details.text && <p className="mt-3 max-w-sm text-[0.9375rem] text-muted">{details.text}</p>}
                </Reveal>
              );
            })}
          </ul>
          <p className="mt-14 max-w-2xl text-sm text-subtle">
            Die Videos werden erst nach einem Klick im erweiterten Datenschutzmodus von YouTube geladen; die Vorschaubilder
            stammen von YouTube. Mehr dazu in der{" "}
            <Link href="/datenschutz/" className="text-muted underline underline-offset-4 hover:text-fg">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </Container>
      </Section>

      {/* Jobs ------------------------------------------------------------ */}
      <Section tone="light" aria-labelledby="jobs-title">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5 xl:col-span-4">
            <Eyebrow>Karriere</Eyebrow>
            <Heading id="jobs-title" className="mt-5">
              Offene Stellen. <em>Werden Sie Teil des Teams.</em>
            </Heading>
            <p className="mt-6 max-w-md text-muted">
              Wir suchen Verstärkung für unseren Betrieb in Thalwil. Senden Sie uns Ihre Bewerbung per <span className="whitespace-nowrap">E-Mail</span> an{" "}
              <a href={applicationMailto()} className="text-fg underline underline-offset-4">
                {site.email.display}
              </a>{" "}
              – wir freuen uns, von Ihnen zu hören.
            </p>
            <ButtonLink href={applicationMailto()} icon="arrow" className="mt-8">
              Bewerbung senden
            </ButtonLink>
          </Reveal>

          <ul className="border-b border-line-strong lg:col-span-7 lg:col-start-6 lg:self-start">
            {site.jobs.map((job, i) => (
              <Reveal
                as="li"
                key={job.title}
                delay={i * 80}
                className="grid gap-5 border-t border-line-strong py-8 md:grid-cols-[2.5rem_1fr_auto] md:items-center md:gap-8"
              >
                <span aria-hidden="true" className="font-display text-lg text-subtle tabular max-md:hidden">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-display-sm text-fg">{job.title}</h3>
                  <p className="mt-2 text-sm text-muted">
                    {job.pdf ? "Thalwil · Stelleninserat als PDF" : "note" in job ? job.note : "Thalwil"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  {job.pdf && (
                    <a
                      href={job.pdf}
                      target="_blank"
                      rel="noopener"
                      className={buttonClasses({ variant: "outline", size: "sm" })}
                    >
                      <span>
                        Inserat <span className="opacity-60">· PDF</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0" />
                      <span className="sr-only"> zur Stelle {job.title} (öffnet in neuem Fenster)</span>
                    </a>
                  )}
                  <ButtonLink href={applicationMailto(job.title)} variant="link" icon="arrow">
                    Bewerben<span className="sr-only"> als {job.title}</span>
                  </ButtonLink>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <CtaBand
        eyebrow="Besuchen Sie uns"
        title={
          <>
            Lernen Sie uns <em>persönlich kennen.</em>
          </>
        }
        lead="Im Showroom in Thalwil oder vorab am Telefon – wir nehmen uns Zeit für Sie."
      >
        <ButtonLink href="/kontakt/" icon="arrow">
          Kontakt aufnehmen
        </ButtonLink>
        <ButtonLink href="/showroom/" variant="outline">
          Showroom entdecken
        </ButtonLink>
      </CtaBand>
    </>
  );
}
