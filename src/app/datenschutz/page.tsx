import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { LegalList, LegalSection, LegalSubheading, LegalToc } from "@/components/legal/Legal";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const title = "Datenschutz";
const description = `Datenschutzerklärung der ${site.legal.company} nach Schweizer Datenschutzgesetz (DSG): keine Tracking-Cookies, kein Analytics, Kontaktformular, AutoScout24 und YouTube.`;
const updated = "November 2026";

export const metadata: Metadata = pageMetadata({ title, description, path: "/datenschutz/" });

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} {...external}>
      {children}
      <span className="sr-only"> (öffnet in neuem Fenster)</span>
    </a>
  );
}

const Mail = () => <a href={site.email.href}>{site.email.display}</a>;

const sections: Array<{ id: string; title: string; body: ReactNode }> = [
  {
    id: "verantwortliche-stelle",
    title: "Verantwortliche Stelle",
    body: (
      <>
        <p>Verantwortlich für die Bearbeitung von Personendaten im Zusammenhang mit dieser Website ist:</p>
        <address className="not-italic">
          <strong>{site.legal.company}</strong>
          <br />
          {site.address.street}, {site.address.zip} {site.address.city}, {site.address.country}
          <br />
          E-Mail <Mail /> · Telefon{" "}
          <a href={site.phone.href} className="tabular">
            {site.phone.display}
          </a>
        </address>
        <p>
          Für Fragen und Anliegen zum Datenschutz erreichen Sie uns unter <Mail /> oder per Post an die obige Adresse.
        </p>
      </>
    ),
  },
  {
    id: "grundsaetze",
    title: "Grundsätze",
    body: (
      <>
        <p>
          Wir bearbeiten Personendaten im Einklang mit dem Bundesgesetz über den Datenschutz (Datenschutzgesetz, DSG)
          und der Datenschutzverordnung (DSV), die in ihrer revidierten Fassung seit dem 1. September 2023 in Kraft sind.
        </p>
        <p>
          Personendaten sind alle Angaben, die sich auf eine bestimmte oder bestimmbare Person beziehen – etwa Name,
          E-Mail-Adresse, Telefonnummer oder IP-Adresse. Wir bearbeiten nur die Daten, die für den jeweiligen Zweck nötig
          sind, und nur so lange, wie es dieser Zweck oder eine gesetzliche Pflicht erfordert.
        </p>
        <p>
          Diese Erklärung gilt für die Website {site.domain}. Über diese Website finden weder automatisierte
          Einzelentscheidungen noch Profiling statt.
        </p>
      </>
    ),
  },
  {
    id: "website-besuch",
    title: "Besuch der Website",
    body: (
      <>
        <p>
          Diese Website wird bei einem externen Hosting-Provider betrieben. Bei jedem Aufruf erfassen dessen Server
          automatisch technische Angaben, die Ihr Browser übermittelt (sogenannte Server-Logfiles):
        </p>
        <LegalList
          items={[
            "IP-Adresse Ihres Geräts",
            "Datum und Uhrzeit des Zugriffs",
            "aufgerufene Seite oder Datei und übertragene Datenmenge",
            "Website, von der aus Sie zu uns gelangt sind (Referrer)",
            "Browsertyp, Betriebssystem und Statuscode der Anfrage",
          ]}
        />
        <p>
          Diese Daten sind technisch erforderlich, um die Website auszuliefern, ihre Stabilität und Sicherheit zu
          gewährleisten und Missbrauch abzuwehren. Sie werden nicht mit anderen Daten zusammengeführt und nicht dazu
          verwendet, einzelne Besucherinnen und Besucher zu identifizieren. Die Logfiles werden nur kurzzeitig
          aufbewahrt und anschliessend automatisch gelöscht, sofern sie nicht zur Aufklärung eines Sicherheitsvorfalls
          länger benötigt werden.
        </p>
        <p>Die Verbindung zu dieser Website ist durchgehend verschlüsselt (HTTPS).</p>
      </>
    ),
  },
  {
    id: "kontaktformular",
    title: "Kontaktformular und E-Mail",
    body: (
      <>
        <p>
          Wenn Sie uns über das <Link href="/kontakt/">Kontaktformular</Link>, per E-Mail oder telefonisch kontaktieren,
          bearbeiten wir die Angaben, die Sie uns mitteilen: Ihr Anliegen, Name, E-Mail-Adresse und Nachricht sowie –
          freiwillig – Telefonnummer und Angaben zu einem Fahrzeug.
        </p>
        <LegalSubheading>Zweck</LegalSubheading>
        <p>
          Wir verwenden diese Angaben ausschliesslich, um Ihre Anfrage zu beantworten, eine Probefahrt oder einen
          Rückruf zu vereinbaren und Ihnen auf Wunsch ein Angebot zu unterbreiten.
        </p>
        <LegalSubheading>Übermittlung</LegalSubheading>
        <p>
          Die Formulardaten werden verschlüsselt an einen Formular-Dienstleister übertragen, der sie uns per E-Mail
          zustellt – je nach Konfiguration der Formulardienst unseres Hosting-Providers oder ein darauf spezialisierter
          Anbieter. Der Dienstleister bearbeitet die Daten nur in unserem Auftrag und nur zu diesem Zweck. Kann das
          Formular ausnahmsweise nicht gesendet werden, bietet es an, Ihre Angaben als vorbereitete E-Mail in Ihrem
          eigenen E-Mail-Programm zu öffnen.
        </p>
        <LegalSubheading>Schutz vor Spam</LegalSubheading>
        <p>
          Das Formular enthält ein für Menschen unsichtbares Feld, das automatisierte Eingaben erkennt. Dafür werden
          keine zusätzlichen Daten erhoben.
        </p>
        <LegalSubheading>Aufbewahrung</LegalSubheading>
        <p>
          Wir bewahren Ihre Anfrage so lange auf, wie es für die Bearbeitung und allfällige Rückfragen nötig ist. Führt
          die Anfrage zu einem Vertrag, gelten die gesetzlichen Aufbewahrungspflichten (für geschäftsrelevante
          Unterlagen in der Regel zehn Jahre).
        </p>
      </>
    ),
  },
  {
    id: "newsletter",
    title: "Newsletter",
    body: (
      <>
        <p>
          In der Fusszeile können Sie sich für Informationen über neu eingetroffene Fahrzeuge anmelden. Dafür benötigen
          wir nur Ihre E-Mail-Adresse. Wir verwenden sie ausschliesslich für diesen Zweck und geben sie nicht an Dritte
          weiter – ausgenommen an einen allfälligen Versanddienstleister, der die Nachrichten in unserem Auftrag
          verschickt.
        </p>
        <p>
          Sie können sich jederzeit abmelden, zum Beispiel mit einer kurzen E-Mail an <Mail />. Danach entfernen wir
          Ihre Adresse aus dem Verteiler.
        </p>
      </>
    ),
  },
  {
    id: "autoscout24",
    title: "Fahrzeugbestand über AutoScout24",
    body: (
      <>
        <p>
          Auf der Seite <Link href="/fahrzeuge/">Fahrzeuge</Link> zeigen wir unseren aktuellen Bestand über eine
          Einbindung der Plattform AutoScout24. Damit Sie die Fahrzeuge direkt bei uns durchsuchen können, lädt Ihr
          Browser beim Aufruf dieser Seite Programmcode und Inhalte von Servern von AutoScout24 (autoscout24.ch).
        </p>
        <p>
          Dabei werden insbesondere Ihre IP-Adresse, Angaben zu Ihrem Browser und die aufgerufene Seite an AutoScout24
          übermittelt. AutoScout24 kann eigene Cookies oder ähnliche Technologien einsetzen und ist für diese
          Bearbeitung selbst verantwortlich; wir haben darauf keinen Einfluss. Einzelheiten entnehmen Sie der
          Datenschutzerklärung von AutoScout24, abrufbar auf{" "}
          <ExternalLink href="https://www.autoscout24.ch">autoscout24.ch</ExternalLink>.
        </p>
        <p>
          Auf den übrigen Seiten verlinken wir AutoScout24 lediglich – Daten werden erst übertragen, wenn Sie einen
          solchen Link anklicken. Möchten Sie die Einbindung nicht nutzen, senden wir Ihnen Angebote gerne auch direkt
          per E-Mail.
        </p>
      </>
    ),
  },
  {
    id: "youtube",
    title: "YouTube-Videos",
    body: (
      <>
        <p>
          Auf einzelnen Seiten zeigen wir Videos der Plattform YouTube. Anbieterin für Nutzerinnen und Nutzer in der
          Schweiz und im Europäischen Wirtschaftsraum ist die Google Ireland Limited, Gordon House, Barrow Street,
          Dublin 4, Irland.
        </p>
        <p>
          Wir nutzen den erweiterten Datenschutzmodus (youtube-nocookie.com): Der Videoplayer wird erst geladen, wenn
          Sie auf ein Video klicken. Erst dann kann YouTube Cookies setzen und Informationen über Ihre Nutzung des
          Videos erfassen.
        </p>
        <p>
          Die Vorschaubilder der Videos werden von einem Bildserver von YouTube (i.ytimg.com) geladen. Dabei werden
          technisch bedingt Ihre IP-Adresse und Angaben zu Ihrem Browser an Google übermittelt.
        </p>
        <p>
          Google kann Daten auch in den USA bearbeiten. Weitere Informationen finden Sie in der{" "}
          <ExternalLink href="https://policies.google.com/privacy">Datenschutzerklärung von Google</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    id: "schriften",
    title: "Schriften",
    body: (
      <p>
        Die Schriften dieser Website (Instrument Serif und Instrument Sans) sind lokal eingebunden und werden von
        unserem eigenen Server ausgeliefert. Beim Aufruf der Website wird keine Verbindung zu Google Fonts oder anderen
        Schriftanbietern hergestellt.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies und Analyse",
    body: (
      <>
        <p>
          Diese Website setzt selbst keine Cookies und verwendet keine Analyse-, Tracking- oder Werbedienste – kein
          Google Analytics, keine Werbepixel, keine Nutzungsprofile. Deshalb zeigen wir Ihnen auch kein Cookie-Banner.
        </p>
        <p>
          Cookies oder ähnliche Technologien von Drittanbietern können nur im Zusammenhang mit der AutoScout24-Einbindung
          auf der Seite «Fahrzeuge» und nach dem Start eines YouTube-Videos zum Einsatz kommen (siehe oben).
        </p>
      </>
    ),
  },
  {
    id: "externe-links",
    title: "Kartendienste und externe Links",
    body: (
      <p>
        Wir binden keine interaktive Karte ein. Die Schaltflächen zur Routenplanung führen zu Google Maps beziehungsweise
        Apple Karten, weitere Links zu AutoScout24 und zu unseren Partnern. Erst wenn Sie einen solchen Link anklicken,
        verlassen Sie unsere Website; ab dann gelten die Datenschutzbestimmungen des jeweiligen Anbieters.
      </p>
    ),
  },
  {
    id: "weitergabe",
    title: "Weitergabe und Bekanntgabe ins Ausland",
    body: (
      <>
        <p>
          Wir geben Personendaten nur weiter, wenn dies für die genannten Zwecke nötig ist – etwa an unseren
          Hosting-Provider, an Formular- und E-Mail-Dienstleister oder, wenn Sie es wünschen, an Finanzierungs- und
          Leasingpartner. Unsere Dienstleister bearbeiten die Daten nur in unserem Auftrag und gemäss unseren Weisungen.
        </p>
        <p>
          Einzelne Dienstleister können Daten auch ausserhalb der Schweiz bearbeiten, insbesondere in Staaten der EU
          oder des EWR und in den USA. Eine Bekanntgabe ins Ausland erfolgt nur in Staaten, deren Datenschutz der
          Bundesrat als angemessen anerkannt hat, oder gestützt auf geeignete Garantien wie Standardvertragsklauseln
          beziehungsweise auf eine gesetzliche Ausnahme (Art. 16 und 17 DSG).
        </p>
      </>
    ),
  },
  {
    id: "datensicherheit",
    title: "Datensicherheit",
    body: (
      <p>
        Wir treffen angemessene technische und organisatorische Massnahmen, um Ihre Daten vor Verlust, Missbrauch und
        unbefugtem Zugriff zu schützen. Eine vollständig sichere Übertragung über das Internet kann allerdings niemand
        garantieren – unverschlüsselte E-Mails können unter Umständen von Dritten eingesehen werden. Vertrauliche
        Angaben besprechen wir deshalb gerne auch telefonisch.
      </p>
    ),
  },
  {
    id: "rechte",
    title: "Ihre Rechte",
    body: (
      <>
        <p>Im Rahmen des Datenschutzgesetzes haben Sie insbesondere das Recht auf:</p>
        <LegalList
          items={[
            <>
              <strong>Auskunft</strong> – ob und welche Personendaten wir über Sie bearbeiten (Art. 25 DSG);
            </>,
            <>
              <strong>Berichtigung</strong> – unrichtige oder unvollständige Daten korrigieren zu lassen;
            </>,
            <>
              <strong>Löschung</strong> – Ihre Daten löschen zu lassen, soweit keine gesetzliche Aufbewahrungspflicht
              entgegensteht;
            </>,
            <>
              <strong>Widerspruch</strong> – einer Bearbeitung zu widersprechen oder eine erteilte Einwilligung jederzeit
              mit Wirkung für die Zukunft zu widerrufen;
            </>,
            <>
              <strong>Datenherausgabe</strong> – Ihre Daten in einem gängigen elektronischen Format zu erhalten (Art. 28
              DSG).
            </>,
          ]}
        />
        <p>
          Richten Sie Ihr Anliegen an <Mail /> oder per Post an die oben genannte Adresse. Damit wir Missbrauch
          ausschliessen können, müssen wir Ihre Identität gegebenenfalls überprüfen. Wir beantworten Anfragen
          grundsätzlich innert 30 Tagen.
        </p>
        <p>
          Sind Sie mit unserer Antwort nicht einverstanden, können Sie sich an den Eidgenössischen Datenschutz- und
          Öffentlichkeitsbeauftragten (EDÖB) wenden:{" "}
          <ExternalLink href="https://www.edoeb.admin.ch">edoeb.admin.ch</ExternalLink>.
        </p>
      </>
    ),
  },
  {
    id: "aenderungen",
    title: "Änderungen",
    body: (
      <>
        <p>
          Wir passen diese Datenschutzerklärung an, wenn sich unsere Website, unsere Dienstleister oder die Rechtslage
          ändern. Es gilt jeweils die auf dieser Seite veröffentlichte Fassung.
        </p>
        <p>
          <strong>Stand: {updated}</strong>
        </p>
      </>
    ),
  },
];

const highlights = [
  { title: "Kein Tracking", text: "Keine Analyse- oder Werbe-Cookies – deshalb auch kein Cookie-Banner." },
  { title: "Schriften lokal", text: "Keine Verbindung zu Google Fonts oder anderen Schriftanbietern." },
  { title: "Nur für Ihre Anfrage", text: "Formulardaten verwenden wir ausschliesslich, um Ihnen zu antworten." },
];

export default function DatenschutzPage() {
  return (
    <>
      <PageHero
        eyebrow="Rechtliches"
        title={"Datenschutz­erklärung"}
        lead={
          <>
            Wie wir mit Ihren Personendaten umgehen – verständlich erklärt und nach Schweizer Datenschutzgesetz (DSG).
            <span className="mt-3 block text-[0.875rem] text-paper/60">Stand: {updated}</span>
          </>
        }
      />

      <Section tone="light" className="pt-14 md:pt-20">
        <Container>
          <Reveal as="div">
            <h2 className="sr-only">Auf einen Blick</h2>
            <ul className="grid gap-px border border-line bg-line sm:grid-cols-3">
              {highlights.map((item) => (
                <li key={item.title} className="bg-paper px-6 py-7 md:px-8 md:py-9">
                  <span aria-hidden="true" className="block size-[7px] bg-brand" />
                  <p className="mt-5 font-display text-[1.625rem] leading-tight text-fg">{item.title}</p>
                  <p className="mt-2 text-[0.9375rem] text-muted">{item.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-14 md:mt-20">
            <LegalToc items={sections.map(({ id, title }) => ({ id, title }))} />
            {sections.map((section, i) => (
              <LegalSection key={section.id} id={section.id} number={String(i + 1).padStart(2, "0")} title={section.title}>
                {section.body}
              </LegalSection>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
