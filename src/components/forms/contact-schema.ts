/**
 * Contact form model: reasons, per-reason copy, validation and the mailto fallback.
 * Framework-free so it can be shared by the form, tests and other pages
 * (e.g. /kommission/ can render <ContactForm defaultReason="kommission" />).
 */

export const contactReasons = [
  { key: "kaufinteresse", label: "Kaufinteresse" },
  { key: "probefahrt", label: "Probefahrt" },
  { key: "rueckruf", label: "Rückruf" },
  { key: "import", label: "Import-Anfrage" },
  { key: "kommission", label: "Fahrzeug verkaufen (Kommission)" },
  { key: "allgemein", label: "Allgemein" },
] as const;

export type ContactReason = (typeof contactReasons)[number]["key"];

export function isContactReason(value: string | null | undefined): value is ContactReason {
  return contactReasons.some((r) => r.key === value);
}

export function reasonLabel(key: ContactReason): string {
  return contactReasons.find((r) => r.key === key)?.label ?? key;
}

export function reasonFromLabel(label: string): ContactReason {
  return contactReasons.find((r) => r.label === label)?.key ?? "allgemein";
}

/** Copy that adapts to the selected reason (labels stay visible, placeholders only hint). */
export function reasonCopy(reason: ContactReason) {
  switch (reason) {
    case "probefahrt":
      return {
        vehicleLabel: "Fahrzeug oder Inserat-Link",
        vehiclePlaceholder: "z. B. Porsche 911 GT3",
        messagePlaceholder: "Wann würde es Ihnen passen? Nennen Sie uns gerne zwei, drei Wunschtermine.",
        phoneRequired: false,
      };
    case "rueckruf":
      return {
        vehicleLabel: "Fahrzeug oder Inserat-Link",
        vehiclePlaceholder: "Falls es um ein bestimmtes Fahrzeug geht",
        messagePlaceholder: "Worum geht es, und wann erreichen wir Sie am besten?",
        phoneRequired: true,
      };
    case "import":
      return {
        vehicleLabel: "Wunschfahrzeug",
        vehiclePlaceholder: "Marke, Modell, Ausstattung",
        messagePlaceholder: "Erzählen Sie uns von Ihrem Wunschfahrzeug – Budget, Farbe, Zeitrahmen.",
        phoneRequired: false,
      };
    case "kommission":
      return {
        vehicleLabel: "Ihr Fahrzeug",
        vehiclePlaceholder: "Marke, Modell, Jahrgang, Kilometerstand",
        messagePlaceholder: "Zustand, Ausstattung, Servicehistorie, Preisvorstellung – alles, was uns hilft.",
        phoneRequired: false,
      };
    case "kaufinteresse":
      return {
        vehicleLabel: "Fahrzeug oder Inserat-Link",
        vehiclePlaceholder: "z. B. Porsche 911 GT3",
        messagePlaceholder: "Was möchten Sie über das Fahrzeug wissen?",
        phoneRequired: false,
      };
    default:
      return {
        vehicleLabel: "Fahrzeug oder Inserat-Link",
        vehiclePlaceholder: "Falls es um ein bestimmtes Fahrzeug geht",
        messagePlaceholder: "Wie können wir Ihnen helfen?",
        phoneRequired: false,
      };
  }
}

export type ContactValues = {
  anliegen: ContactReason;
  name: string;
  email: string;
  telefon: string;
  fahrzeug: string;
  nachricht: string;
  datenschutz: boolean;
  /** Honeypot – must stay empty. */
  website: string;
};

export type ContactField = Exclude<keyof ContactValues, "website">;
export type ContactErrors = Partial<Record<ContactField, string>>;

/** Order used for the error summary and for focusing the first invalid field. */
export const fieldOrder: ContactField[] = ["anliegen", "name", "email", "telefon", "fahrzeug", "nachricht", "datenschutz"];

export const limits = { name: 120, email: 200, telefon: 40, fahrzeug: 400, nachricht: 5000 } as const;

const emailPattern = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
const phonePattern = /^\+?[0-9\s()./-]{6,}$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.telefon.trim();
  const { phoneRequired } = reasonCopy(values.anliegen);

  if (!name) errors.name = "Bitte geben Sie Ihren Namen an.";
  else if (name.length < 2) errors.name = "Bitte geben Sie Ihren vollständigen Namen an.";

  if (!email) errors.email = "Bitte geben Sie Ihre E-Mail-Adresse an.";
  else if (!emailPattern.test(email)) errors.email = "Bitte prüfen Sie die E-Mail-Adresse – zum Beispiel name@beispiel.ch.";

  const digits = phone.replace(/\D/g, "").length;
  if (!phone && phoneRequired) errors.telefon = "Für einen Rückruf benötigen wir Ihre Telefonnummer.";
  else if (phone && (!phonePattern.test(phone) || digits < 7 || digits > 15))
    errors.telefon = "Bitte prüfen Sie die Telefonnummer – zum Beispiel +41 44 123 45 67.";

  if (!values.nachricht.trim()) errors.nachricht = "Bitte schreiben Sie uns kurz, worum es geht.";

  if (!values.datenschutz) errors.datenschutz = "Bitte bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben.";

  return errors;
}

/** Subject line used for e-mail notifications (endpoint, Netlify and mailto). */
export function contactSubject(values: Pick<ContactValues, "anliegen" | "name">): string {
  const name = values.name.trim();
  return `${reasonLabel(values.anliegen)} – Anfrage über castellana.ch${name ? ` von ${name}` : ""}`;
}

/** Flat, human-readable payload (labels instead of keys) for every transport. */
export function contactPayload(values: ContactValues): Record<string, string> {
  return {
    subject: contactSubject(values),
    anliegen: reasonLabel(values.anliegen),
    name: values.name.trim(),
    email: values.email.trim(),
    telefon: values.telefon.trim(),
    fahrzeug: values.fahrzeug.trim(),
    nachricht: values.nachricht.trim(),
    datenschutz: values.datenschutz ? "akzeptiert" : "",
  };
}

/** Last resort: a pre-filled e-mail in the visitor's own mail program. */
export function contactMailto(to: string, values: ContactValues): string {
  const lines = [`Anliegen: ${reasonLabel(values.anliegen)}`, `Name: ${values.name.trim()}`, `E-Mail: ${values.email.trim()}`];
  if (values.telefon.trim()) lines.push(`Telefon: ${values.telefon.trim()}`);
  if (values.fahrzeug.trim()) lines.push(`Fahrzeug: ${values.fahrzeug.trim()}`);
  lines.push("", values.nachricht.trim());
  const params = `subject=${encodeURIComponent(contactSubject(values))}&body=${encodeURIComponent(lines.join("\n"))}`;
  return `mailto:${to}?${params}`;
}
