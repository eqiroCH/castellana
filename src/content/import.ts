import type { FaqItem } from "./site";

/**
 * Copy for /import. Facts come from BRIEF.md (old site, import section) — only the
 * wording is polished. The four process steps live in `site.importSteps`.
 */

export type ImportReason = { title: string; text: string };
export type ImportFact = {
  value: string;
  unit: string;
  label: string;
  /** Secondary figure shown under the label, e.g. «oder 20’000 km». */
  note?: { prefix: string; value: string; unit: string };
};

/** A place on the import globe (WGS84). */
export type GeoPlace = { name: string; lat: number; lng: number };
export type ImportRegion = "usa" | "germany";
export type ImportRoute = {
  region: ImportRegion;
  /** Legend label, e.g. «USA» */
  label: string;
  /** Delivery time to Thalwil (BRIEF: USA 6–8 Wochen, Deutschland 2 Wochen). */
  duration: string;
  /**
   * Illustrative departure points for the route arcs. They are NOT partner locations and are
   * never labelled on the globe — the legend only names the country.
   */
  origins: GeoPlace[];
};

/** «Warum importieren» — arguments condensed from the original FAQ. */
export const importReasons: ImportReason[] = [
  {
    title: "Andere Länder, andere Preise",
    text: "Unterschiedliche Mehrwertsteuersätze, Luxussteuern und Wechselkurse führen zu teils erheblichen Preisunterschieden. Im EU-Ausland oder in den USA lässt sich deshalb oft sehr viel Geld sparen.",
  },
  {
    title: "Dieselbe Qualität",
    text: "Ein Importfahrzeug stammt aus demselben Werk wie das Schweizer Modell – nur der Vertriebsweg ist ein anderer. An der Qualität ändert das nichts.",
  },
  {
    title: "Ehrliche Empfehlung",
    text: "Ein Import lohnt sich nicht immer. Wir vergleichen die Preise in der Schweiz, im EU-Nachbarland und in den USA – erst dann empfehlen wir Ihnen den Kauf.",
  },
  {
    title: "Geprüft vor dem Kauf",
    text: "Wir arbeiten ausschliesslich mit starken Partnern in der Schweiz, der EU und den USA. Selbst in den USA werden die Fahrzeuge vor dem Kauf vor Ort besichtigt.",
  },
];

/** Key figures shown next to the process (count up on scroll). */
export const importFacts: ImportFact[] = [
  { value: "6–8", unit: "Wochen", label: "Lieferfrist aus den USA" },
  { value: "2", unit: "Wochen", label: "Lieferfrist aus Deutschland" },
  {
    value: "12",
    unit: "Monate",
    label: "Mindestgarantie auf Occasionen",
    note: { prefix: "oder", value: "20’000", unit: "km" },
  },
];

/** Destination of every route: the showroom in Thalwil (site.address.geo, rounded). */
export const importDestination: GeoPlace = { name: "Thalwil", lat: 47.29, lng: 8.56 };

/** Route arcs on the import globe — USA first (the long way), then Germany. */
export const importRoutes: ImportRoute[] = [
  {
    region: "usa",
    label: "USA",
    duration: "6–8 Wochen",
    origins: [
      { name: "Los Angeles", lat: 34.05, lng: -118.24 },
      { name: "Miami", lat: 25.76, lng: -80.19 },
      { name: "New York", lat: 40.71, lng: -74.01 },
    ],
  },
  {
    region: "germany",
    label: "Deutschland",
    duration: "2 Wochen",
    origins: [
      { name: "Stuttgart", lat: 48.78, lng: 9.18 },
      { name: "München", lat: 48.14, lng: 11.58 },
      { name: "Bremen", lat: 53.08, lng: 8.8 },
    ],
  },
];

/** Accessible summary of the globe graphic (the canvas itself is decorative). */
export const importGlobeLabel =
  "Weltkugel mit den Importrouten nach Thalwil: aus den USA in sechs bis acht Wochen, aus Deutschland in zwei Wochen.";

/** Home page section «Direktimport» (ImportGlobe). */
export const importTeaser = {
  eyebrow: "Direktimport",
  title: "Ihr Wunschfahrzeug.",
  accent: "Aus der EU und den USA.",
  lead: "Wir vergleichen die Preise in der Schweiz, im EU-Ausland und in den USA, organisieren Dokumente, Transport, Verzollung und MFK – und übergeben Ihnen das Fahrzeug schlüsselfertig in Thalwil.",
};

/** FAQ in polished Swiss German (ss, CHF, 20’000 km). Feeds the accordion and the FAQPage JSON-LD. */
export const importFaq: FaqItem[] = [
  {
    question: "Was ist ein Importfahrzeug?",
    answer:
      "Ein Beispiel: Der Mercedes SL 63 AMG wird im Werk Bremen gebaut und von dort an Vertretungen in der ganzen Welt verkauft. Gelangt ein solches Fahrzeug aus dem Ausland in die Schweiz, spricht man von einem Import. An der Qualität ändert das nichts – es ist dasselbe Auto aus demselben Werk.",
  },
  {
    question: "Warum sollte ich ein Auto importieren?",
    answer:
      "Andere Länder, andere Preise: Unterschiedliche Mehrwertsteuersätze, Luxussteuern und Währungen führen zu grossen Preisunterschieden. Wer im EU-Ausland oder in den USA kauft, kann deshalb sehr viel Geld sparen.",
  },
  {
    question: "Lohnt sich ein Import immer?",
    answer:
      "Nein – und das sagen wir Ihnen auch. Wir vergleichen zuerst den Preis in der Schweiz, dann im EU-Nachbarland und schliesslich in den USA. Erst danach geben wir Ihnen eine Kaufempfehlung ab.",
  },
  {
    question: "Worauf muss ich beim Import achten?",
    answer:
      "Ein Autokauf ist Vertrauenssache. Darum arbeiten wir ausschliesslich mit starken Partnern in der Schweiz, in der EU und in den USA zusammen. Selbst in den USA werden die Fahrzeuge vor dem Kauf von unseren Partnern vor Ort besichtigt.",
  },
  {
    question: "Wie kann ich mich absichern?",
    answer:
      "Fragen Sie uns nach Referenzen: Gerne nennen wir Ihnen Kontaktadressen zufriedener Importkundinnen und -kunden.",
  },
  {
    question: "Wie lange dauert die Lieferung?",
    answer: "Aus den USA rechnen Sie mit sechs bis acht Wochen, aus Deutschland mit zwei Wochen.",
  },
  {
    question: "Welche Garantie erhalte ich?",
    answer:
      "Neuwagen haben zwei Jahre Garantie ab der ersten Inverkehrsetzung, auf Wunsch mit Anschlussgarantie. Für Occasionen gilt eine Garantie von mindestens zwölf Monaten oder 20’000 km. Den Service können Sie in Ihrer Vertrauenswerkstatt durchführen lassen.",
  },
  {
    question: "Gibt es bei gewissen Marken einen Gratis-Service?",
    answer: "Auf Wunsch bieten wir Ihnen eine Lösung mit Gratis-Service an – sprechen Sie uns darauf an.",
  },
  {
    question: "Welche Risiken gehe ich ein?",
    answer:
      "Für Sie keine. Wir verfügen über mehrjährige Importerfahrung und ein bewährtes Modell – unsere Kundinnen und Kunden bestätigen es.",
  },
];
