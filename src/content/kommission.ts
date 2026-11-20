/**
 * Copy for /kommission. Facts come from BRIEF.md (old site, «Kommission»): the broker
 * analogy, the five arguments and Antonio's promise «Abwicklung von A bis Z».
 * Keep the process steps generic — no fees, durations or guarantees that the brief does not state.
 */

export type CommissionArgument = { title: string; lead: string; text: string };
export type CommissionStep = { title: string; text: string };

export const commissionIntro = {
  statement: "Wer ein Haus verkauft, beauftragt einen Immobilienbroker.",
  accent: "Beim Auto gilt dasselbe Prinzip.",
  text: "Der Broker kennt den Markt, präsentiert das Objekt professionell und führt die Gespräche mit den Interessenten – der Eigentümer muss sich um nichts kümmern. Genau so funktioniert der Kommissionsverkauf bei Castellana: Wir verkaufen Ihr Fahrzeug in Ihrem Auftrag, mit allem, was ein Privatverkauf nicht bieten kann.",
};

/** The five reasons from the old site («Warum durch uns verkaufen lassen?»). */
export const commissionArguments: CommissionArgument[] = [
  {
    title: "Leasing",
    lead: "Privat können Sie kein Leasing anbieten.",
    text: "Wir schon – und machen Ihr Fahrzeug damit auch für Käuferinnen und Käufer interessant, die lieber monatlich bezahlen.",
  },
  {
    title: "Garantie",
    lead: "Privat können Sie keine Garantie anbieten.",
    text: "Wir schon. Eine Garantie gibt dem Käufer Sicherheit – und Ihnen ein überzeugendes Verkaufsargument.",
  },
  {
    title: "Eintausch",
    lead: "Privat können Sie kein anderes Auto in Zahlung nehmen.",
    text: "Wir schon. Viele Interessenten möchten ihr bisheriges Fahrzeug eintauschen – bei uns ist das möglich.",
  },
  {
    title: "Zeit",
    lead: "Ein Privatverkauf kostet Zeit.",
    text: "Telefonate, Erklärungen, Besichtigungen und Probefahrten: Das alles übernehmen wir für Sie.",
  },
  {
    title: "Preis",
    lead: "Sie erzielen einen höheren Preis.",
    text: "Mit professioneller Aufbereitung und Präsentation kommt Ihr Fahrzeug zur Geltung – und erzielt einen besseren Preis als im Privatverkauf.",
  },
];

/** «So läuft es ab» — deliberately generic, true to «Abwicklung von A bis Z». */
export const commissionSteps: CommissionStep[] = [
  {
    title: "Bewertung vor Ort",
    text: "Sie bringen Ihr Fahrzeug zu uns nach Thalwil. Wir begutachten es gemeinsam mit Ihnen und besprechen den Verkaufspreis.",
  },
  {
    title: "Aufbereitung & Fotos",
    text: "Unsere Fahrzeugaufbereiter bringen Ihr Auto in Bestform. Danach setzen wir es für das Inserat ins richtige Licht.",
  },
  {
    title: "Vermarktung auf AutoScout24 & im Showroom",
    text: "Ihr Fahrzeug erscheint in unserem Bestand auf AutoScout24 und wird bei uns in Thalwil präsentiert. Anfragen und Probefahrten übernehmen wir.",
  },
  {
    title: "Verkauf, Abwicklung & Auszahlung",
    text: "Wir führen die Verhandlungen und kümmern uns um die gesamte Abwicklung. Am Ende erhalten Sie Ihre Auszahlung.",
  },
];
