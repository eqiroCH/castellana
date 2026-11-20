/**
 * Single source of truth for all company facts (see BRIEF.md).
 * Never hard-code addresses, phone numbers, hours or figures in components —
 * import them from here.
 */

export type NavItem = { label: string; href: string; description?: string };

export type OpeningHours = {
  label: string;
  /** schema.org day names for JSON-LD */
  days: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday">;
  /** [opens, closes] in 24h format; empty = closed */
  slots: Array<[string, string]>;
};

export type TeamMember = {
  name: string;
  role: string;
  /** ISO-like short codes as listed on the old site */
  languages: string[];
  /** Path under /public (180×249 px originals — display small) or null for a monogram. */
  photo: string | null;
};

export type Job = { title: string; pdf: string | null; note?: string };

export type Partner = {
  name: string;
  role: string;
  address: string;
  phone: { display: string; href: string };
  logo: string;
};

export type FaqItem = { question: string; answer: string };

export type Video = { id: string; title: string };

export const site = {
  name: "Castellana Automobile AG",
  shortName: "Castellana",
  domain: "castellana.ch",
  url: "https://castellana.ch",
  claim: "Premium-, Luxus- und Sportfahrzeuge in Thalwil am Zürichsee.",
  description:
    "Castellana Automobile AG in Thalwil: Premium-, Luxus- und Sportfahrzeuge von Porsche, Ferrari, Mercedes-AMG, Lamborghini und mehr. Rund 200 Fahrzeuge vor Ort, Direktimport und Kommissionsverkauf – persönlich beraten seit 1983.",
  legal: {
    company: "Castellana Automobile AG",
    form: "Aktiengesellschaft",
    seat: "Thalwil ZH",
    uid: "CHE-201.688.026",
    commercialRegister: "Handelsregister des Kantons Zürich, CH-020.3.044.756-1",
  },
  history: {
    /** Antonio Castellana has been in the car business since */
    since: 1983,
    /** Sole proprietorship converted into an AG in */
    incorporated: 2017,
  },
  owner: { name: "Antonio Castellana", role: "Geschäftsführer und Inhaber" },

  address: {
    street: "Schützenstrasse 7",
    zip: "8800",
    city: "Thalwil",
    region: "ZH",
    country: "Schweiz",
    countryCode: "CH",
    geo: { lat: 47.285241, lng: 8.5629766 },
  },

  phone: { display: "+41 44 720 90 04", href: "tel:+41447209004" },
  email: { display: "info@castellana.ch", href: "mailto:info@castellana.ch" },

  hours: [
    {
      label: "Montag – Freitag",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      slots: [
        ["08:00", "12:00"],
        ["13:30", "18:30"],
      ],
    },
    { label: "Samstag", days: ["Saturday"], slots: [["09:00", "16:00"]] },
    { label: "Sonntag", days: ["Sunday"], slots: [] },
  ] satisfies OpeningHours[],
  /** Seasonal note, e.g. for 24./31. December. Shown only when enabled. */
  hoursNote: { enabled: false, text: "24. und 31. Dezember: 09:00 – 12:00 Uhr" },

  languages: ["Deutsch", "English", "Español", "Français", "Italiano", "Português"],

  links: {
    autoscout: "https://www.autoscout24.ch/de/s/seller-60849",
    googleMaps: "https://maps.google.com/?q=Castellana+Automobile+AG+Thalwil",
    googleRoute:
      "https://www.google.com/maps/dir/?api=1&destination=Castellana+Automobile+AG%2C+Sch%C3%BCtzenstrasse+7%2C+8800+Thalwil",
    appleMaps:
      "https://maps.apple.com/?q=Castellana+Automobile+AG&address=Sch%C3%BCtzenstrasse+7,+8800+Thalwil,+Schweiz&ll=47.285241,8.5629766",
    eqiro: "https://eqiro.ch",
  },

  /** AutoScout24 host integration (HCI v2) for /fahrzeuge */
  autoscoutWidget: {
    configId: "2054",
    language: "de",
    entryPoint: "search",
    script: "https://www.autoscout24.ch/assets/hci/v2/hci.current.js",
  },

  rating: { value: 4.6, count: 391, source: "Google" },

  stock: {
    /** Live count on AutoScout24 (19.11.2026) */
    cars: 175,
    campers: 2,
    /** Vehicles on site incl. warehouse */
    onSite: 200,
    warehouse: 100,
    priceRange: "CHF 40’000 bis 250’000+",
    brands: [
      "Porsche",
      "Ferrari",
      "Mercedes-AMG",
      "Lamborghini",
      "Audi RS",
      "BMW M",
      "Range Rover",
      "Bentley",
      "Maserati",
    ],
  },

  stats: [
    { value: "175", label: "Fahrzeuge im Bestand" },
    { value: "40+", label: "Jahre Erfahrung, seit 1983" },
    { value: "4.6", suffix: "★", label: "Google · 391 Bewertungen" },
    { value: "6", label: "Sprachen im Betrieb" },
  ],

  quality: {
    statement:
      "Alle unsere Fahrzeuge sind garantiert unfallfrei, enthalten Werksgarantie oder ein Garantiepaket von 12 Monaten, sind ab MFK und servicegepflegt.",
    items: [
      { title: "Garantiert unfallfrei", text: "Jedes Fahrzeug wird vor dem Verkauf geprüft – ohne Kompromisse." },
      { title: "Werksgarantie oder 12 Monate", text: "Werksgarantie oder ein Garantiepaket von 12 Monaten inklusive." },
      { title: "Ab MFK", text: "Frisch vorgeführt und bereit für die Schweizer Strasse." },
      { title: "Servicegepflegt", text: "Lückenlos gewartet und sorgfältig aufbereitet." },
    ],
  },

  quote: {
    text: "Bei uns sind Sie nicht ein Kunde, sondern ein Freund.",
    author: "Antonio Castellana",
    role: "Inhaber, seit 1983 in der Autobranche",
  },

  about:
    "Die Castellana Automobile AG ist seit über 30 Jahren in der Automobilbranche tätig und auf Fahrzeuge im Premiumbereich spezialisiert. Kerngeschäft ist der Direktimport von Top-Fahrzeugen zu Top-Preisen; vor Ort präsentieren wir rund 200 Fahrzeuge. Unser ganzes Wissen und unsere langjährige Erfahrung setzen wir für die langfristige Zufriedenheit unserer Kundinnen und Kunden ein.",

  showroom:
    "Unser Showroom in Thalwil vermittelt eine heimische und einzigartige Atmosphäre. Luxuriöse Fahrzeuge, höchste Technik und viel Glanz wecken Emotionen – und sorgen nebst dem freundschaftlichen Kundenkontakt dafür, dass Sie sich bei uns wohlfühlen. Regelmässig stehen neue Fahrzeuge zur Auswahl, in einer weiteren Lagerhalle vor Ort über 100 weitere aufbereitete Fahrzeuge.",

  importSteps: [
    { title: "Dokumente", text: "Wir organisieren alle Dokumente für einen reibungslosen Import." },
    { title: "Transport & Verzollung", text: "Wir organisieren den Transport bis in die Schweiz – inklusive Verzollung." },
    { title: "MFK-Kontrolle", text: "Das Fahrzeug wird vorgeführt und auf Sie zugelassen." },
    { title: "Übergabe", text: "Wir garantieren Ihnen eine schlüsselfertige Übergabe." },
  ],

  importFaq: [
    {
      question: "Was ist ein Importfahrzeug?",
      answer:
        "Nehmen wir einen Mercedes SL 63 AMG: Er wird im Werk Bremen gebaut und weltweit an Vertretungen verkauft. Wird ein solches Fahrzeug in die Schweiz eingeführt, spricht man von einem Import. Die Qualität des Autos ist immer dieselbe.",
    },
    {
      question: "Warum ein Auto importieren?",
      answer:
        "Andere Länder, andere Preise: Unterschiedliche Mehrwertsteuersätze, Luxussteuern und Währungen führen zu grossen Preisunterschieden. Beim Kauf im EU-Ausland oder in den USA lässt sich deshalb oft sehr viel Geld sparen.",
    },
    {
      question: "Lohnt sich ein Import immer?",
      answer:
        "Nein. Wir vergleichen zuerst die Preise in der Schweiz, dann im EU-Nachbarland und in den USA – erst danach geben wir Ihnen eine ehrliche Kaufempfehlung ab.",
    },
    {
      question: "Worauf muss ich achten?",
      answer:
        "Autokauf ist Vertrauenssache. Wir arbeiten ausschliesslich mit starken Partnern in der Schweiz, der EU und den USA. Selbst in den USA werden Fahrzeuge vor dem Kauf von Partnern vor Ort besichtigt.",
    },
    {
      question: "Wie kann ich mich absichern?",
      answer: "Gerne nennen wir Ihnen Referenzadressen zufriedener Importkundinnen und -kunden.",
    },
    {
      question: "Wie lange ist die Lieferfrist?",
      answer: "Aus den USA rechnen wir mit sechs bis acht Wochen, aus Deutschland mit rund zwei Wochen.",
    },
    {
      question: "Welche Garantie erhalte ich?",
      answer:
        "Neuwagen: zwei Jahre ab erster Inverkehrsetzung, auf Wunsch mit Anschlussgarantie. Occasionen: mindestens zwölf Monate oder 20’000 km. Der Service ist in Ihrer Vertrauenswerkstatt möglich.",
    },
    {
      question: "Gibt es bei gewissen Marken Gratis-Service?",
      answer: "Auf Wunsch bieten wir Ihnen eine Lösung mit Gratis-Service an.",
    },
    {
      question: "Welche Risiken gehe ich ein?",
      answer:
        "Für Sie keine. Wir verfügen über mehrjährige Importerfahrung und ein bewährtes Modell – unsere Kundinnen und Kunden bestätigen es.",
    },
  ] satisfies FaqItem[],

  commission: {
    intro:
      "Wie beim Immobilienbroker: Wir verkaufen Ihr Fahrzeug professionell – und Sie erzielen in der Regel einen besseren Preis als im Privatverkauf.",
    arguments: [
      { title: "Leasing", text: "Privat können Sie kein Leasing anbieten – wir schon." },
      { title: "Garantie", text: "Privat können Sie keine Garantie anbieten – wir schon." },
      { title: "Eintausch", text: "Privat können Sie kein anderes Auto in Zahlung nehmen – wir schon." },
      { title: "Zeit", text: "Telefonate, Erklärungen, Probefahrten: Das alles übernehmen wir für Sie." },
      { title: "Preis", text: "Mit professioneller Präsentation erzielen Sie einen höheren Preis." },
    ],
    quote: { text: "Wir übernehmen für Sie die Abwicklung von A bis Z.", author: "Antonio Castellana" },
  },

  team: [
    { name: "Antonio Castellana", role: "Geschäftsführer und Inhaber, seit 1983 in der Autobranche", languages: ["DE", "EN", "FR", "IT", "ES"], photo: "/images/team/8-antonio-castellana.jpg" },
    { name: "Nino Castellana", role: "Stv. Geschäftsführer / Verkaufsberater, BSc Betriebsökonomie", languages: ["DE", "EN", "FR", "IT"], photo: "/images/team/11-nino-castellana.jpg" },
    { name: "Myrta Castellana", role: "Buchhaltung", languages: ["DE", "EN", "FR", "IT"], photo: "/images/team/9-myrta-castellana.jpg" },
    { name: "Laura Castellana", role: "Marketing, MA Publizistik & Kommunikationswissenschaft", languages: ["DE", "EN", "FR", "IT", "RU", "ES"], photo: "/images/team/25-laura-castellana.png" },
    { name: "Giuseppe Catania", role: "Verkaufsberater", languages: ["DE", "FR", "IT"], photo: "/images/team/52-giuseppe-catania.jpg" },
    { name: "Victor Olivier", role: "Verkaufsberater & Kaufm. Angestellter", languages: ["DE", "EN", "FR"], photo: null },
    { name: "Kevin Laubi", role: "Assistent Buchhaltung & Geschäftsleitung", languages: ["DE", "EN"], photo: null },
    { name: "Manuel Bianco", role: "Fahrzeugaufbereiter", languages: ["DE", "IT"], photo: null },
    { name: "Jacopo Grazioli", role: "Fahrzeugaufbereiter", languages: ["DE", "IT"], photo: null },
    { name: "Andrea Chilelli", role: "Automechaniker / Allrounder", languages: ["DE", "IT"], photo: null },
    { name: "Leo", role: "Wachhund – Welpen-Spielgruppe Langnau am Albis, Ausbildung zum Wachhund", languages: [], photo: "/images/team/14-leo.png" },
  ] satisfies TeamMember[],

  jobs: [
    { title: "Automobilmechatroniker/in", pdf: "/pdf/Automobilmechatroniker.pdf" },
    { title: "Fahrzeugaufbereiter/in", pdf: "/pdf/Fahrzeugaufbereiter.pdf" },
    { title: "Automobil-Verkaufsassistent/in", pdf: null, note: "Bewerbung bitte per E-Mail an info@castellana.ch" },
  ] satisfies Job[],

  partners: [
    { name: "Mercedes-Benz Automobile AG", role: "Markenvertretung", address: "Seestrasse 153, 8712 Stäfa", phone: { display: "+41 44 928 13 13", href: "tel:+41449281313" }, logo: "/images/partners/1-mercedes-benz-automobile-ag.jpg" },
    { name: "The RE/MAX Collection", role: "Immobilien", address: "Seestrasse 142, 8806 Bäch", phone: { display: "+41 79 531 76 30", href: "tel:+41795317630" }, logo: "/images/partners/6-the-re-max-collection.png" },
    { name: "Alphera Financial Services", role: "Leasing & Finanzierung (BMW Group)", address: "Industriestrasse 20, 8157 Dielsdorf", phone: { display: "+41 58 269 66 66", href: "tel:+41582696666" }, logo: "/images/partners/2-alphera-financial-services.jpg" },
    { name: "SEESICHT Media AG", role: "Medien & Kommunikation", address: "Böhnirainstrasse 14, 8800 Thalwil", phone: { display: "+41 44 721 91 55", href: "tel:+41447219155" }, logo: "/images/partners/3-seesicht-media-ag.jpg" },
  ] satisfies Partner[],

  videos: [
    { id: "4r49EJO_irE", title: "Castellana Automobile AG – Firmenporträt" },
    { id: "NU1DGvBoPu0", title: "Castellana Automobile in der Automobil Revue" },
    { id: "bVMyvLQfwQ8", title: "Fahrzeugimport mit Castellana" },
  ] satisfies Video[],

  newsletter: {
    text: "Erhalten Sie als Erste/r Informationen über neu eingetroffene Fahrzeuge.",
  },

  /** Promo bar above the header. Keep disabled unless a campaign is running. */
  promo: {
    enabled: false,
    text: "Leasing-Aktion: Konditionen auf Anfrage",
    href: "/kontakt/",
    linkLabel: "Mehr erfahren",
  },

  contactReasons: ["Kaufinteresse", "Probefahrt", "Rückruf"],
} as const;

/** Primary navigation (header, mobile menu, footer). Trailing slashes match `trailingSlash: true`. */
export const navigation: NavItem[] = [
  { label: "Fahrzeuge", href: "/fahrzeuge/", description: "Über 175 Fahrzeuge im Bestand" },
  { label: "Über uns", href: "/ueber-uns/", description: "Familienbetrieb seit 1983" },
  { label: "Showroom", href: "/showroom/", description: "Klein aber fein, in Thalwil" },
  { label: "Import", href: "/import/", description: "Direktimport aus EU und USA" },
  { label: "Kommission", href: "/kommission/", description: "Wir verkaufen Ihr Fahrzeug" },
  { label: "Partner", href: "/partner/", description: "Finanzierung, Leasing & mehr" },
  { label: "Kontakt", href: "/kontakt/", description: "Beratung & Probefahrt" },
];

export const legalNavigation: NavItem[] = [
  { label: "Impressum", href: "/impressum/" },
  { label: "Datenschutz", href: "/datenschutz/" },
];

/** «Schützenstrasse 7, 8800 Thalwil» */
export const addressLine = `${site.address.street}, ${site.address.zip} ${site.address.city}`;

/** «08:00 – 12:00 · 13:30 – 18:30» or «Geschlossen» */
export function formatSlots(slots: ReadonlyArray<readonly [string, string]>): string {
  if (slots.length === 0) return "Geschlossen";
  return slots.map(([from, to]) => `${from} – ${to}`).join(" · ");
}
