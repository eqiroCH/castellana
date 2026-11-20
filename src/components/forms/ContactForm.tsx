"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState, type FormEvent, type MouseEvent, type RefObject } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import {
  contactMailto,
  contactPayload,
  contactReasons,
  contactSubject,
  fieldOrder,
  limits,
  reasonCopy,
  reasonFromLabel,
  reasonLabel,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactReason,
  type ContactValues,
} from "./contact-schema";
import { Checkbox, FieldShell, Select, TextArea, TextInput, describedBy, formToneClass } from "./fields";
import { QueryPrefill, type Prefill } from "./QueryPrefill";
import { NETLIFY_FORMS_PATH, submitForm } from "./submit";

/** Inlined at build time. Empty → Netlify Forms. */
const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT?.trim() || undefined;

/** Netlify form name — keep in sync with public/__forms.html. */
export const CONTACT_FORM_NAME = "kontakt";

type Status = "idle" | "sending" | "success" | "error";

type ContactFormProps = {
  /** Preselected reason (a `?anliegen=` query parameter still wins). */
  defaultReason?: ContactReason;
  /** Colour context the form sits in. */
  tone?: "light" | "dark";
  /** Prefix for element ids — change it if two forms share a page. */
  idPrefix?: string;
  className?: string;
};

const emptyValues = (anliegen: ContactReason): ContactValues => ({
  anliegen,
  name: "",
  email: "",
  telefon: "",
  fahrzeug: "",
  nachricht: "",
  datenschutz: false,
  website: "",
});

/**
 * Contact form with progressive enhancement:
 * - Without JS it is a normal POST form (Formspree endpoint or Netlify Forms).
 * - With JS: German inline validation, error summary, async submit without reload,
 *   success/error states and a pre-filled mailto: fallback.
 */
export function ContactForm({ defaultReason = "kaufinteresse", tone = "light", idPrefix = "kontakt", className }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  const [values, setValues] = useState<ContactValues>(() => emptyValues(defaultReason));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<"network" | "server" | null>(null);
  const [focusTarget, setFocusTarget] = useState<{ el: "summary" | "success" | "first"; n: number } | null>(null);

  const id = (field: string) => `${idPrefix}-${field}`;
  const copy = reasonCopy(values.anliegen);
  const invalidFields = fieldOrder.filter((field) => errors[field]);

  // JS is running → take over validation (native bubbles stay as no-JS fallback).
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
  }, []);

  // Move focus after the DOM reflects the new state.
  useEffect(() => {
    if (!focusTarget) return;
    if (focusTarget.el === "summary") summaryRef.current?.focus();
    if (focusTarget.el === "success") successRef.current?.focus();
    if (focusTarget.el === "first") document.getElementById(id("anliegen"))?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `id` is derived from the stable prefix
  }, [focusTarget]);

  const onPrefill = useCallback((prefill: Prefill) => {
    setValues((prev) => ({
      ...prev,
      anliegen: prefill.anliegen ?? prev.anliegen,
      fahrzeug: prefill.fahrzeug ?? prev.fahrzeug,
    }));
  }, []);

  function update<K extends keyof ContactValues>(key: K, value: ContactValues[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    // After the first submit attempt, errors update live while typing.
    if (submitted) setErrors(validateContact(next));
    else if (errors[key as ContactField]) setErrors((prev) => ({ ...prev, [key]: validateContact(next)[key as ContactField] }));
  }

  /** Validate a single field on blur, but only once something was entered. */
  function onBlur(field: ContactField) {
    if (!submitted && !String(values[field]).trim()) return;
    setErrors((prev) => ({ ...prev, [field]: validateContact(values)[field] }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    setSubmitted(true);
    setFailure(null);

    if (fieldOrder.some((field) => nextErrors[field])) {
      setStatus("idle");
      setFocusTarget({ el: "summary", n: Date.now() });
      return;
    }

    // Honeypot filled → most likely a bot. Pretend success, send nothing.
    const honeypot = event.currentTarget.elements.namedItem("website");
    if (honeypot instanceof HTMLInputElement && honeypot.value) {
      setStatus("success");
      setFocusTarget({ el: "success", n: Date.now() });
      return;
    }

    setStatus("sending");
    const result = await submitForm(contactPayload(values), { endpoint, formName: CONTACT_FORM_NAME });
    if (result.ok) {
      setStatus("success");
      setFocusTarget({ el: "success", n: Date.now() });
    } else {
      setStatus("error");
      setFailure(result.reason);
    }
  }

  function reset() {
    setValues(emptyValues(values.anliegen));
    setErrors({});
    setSubmitted(false);
    setFailure(null);
    setStatus("idle");
    setFocusTarget({ el: "first", n: Date.now() });
  }

  function focusField(event: MouseEvent<HTMLAnchorElement>, field: ContactField) {
    event.preventDefault();
    const el = document.getElementById(id(field));
    el?.focus({ preventScroll: true });
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  const sending = status === "sending";

  return (
    <div className={cn(formToneClass[tone], className)}>
      <div role="status" aria-live="polite">
        {status === "success" && (
          <SuccessPanel headingRef={successRef} reason={values.anliegen} onReset={reset} />
        )}
      </div>

      {status !== "success" && (
        <form
          ref={formRef}
          name={CONTACT_FORM_NAME}
          method="post"
          action={endpoint ?? NETLIFY_FORMS_PATH}
          onSubmit={onSubmit}
          aria-describedby={id("required-note")}
          className="relative"
        >
          {/* Netlify routes the submission by this name (registered via public/__forms.html). */}
          {!endpoint && <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />}
          <input type="hidden" name="subject" value={contactSubject(values)} />

          <Suspense fallback={null}>
            <QueryPrefill onPrefill={onPrefill} />
          </Suspense>

          {submitted && invalidFields.length > 0 && (
            <div
              ref={summaryRef}
              tabIndex={-1}
              aria-labelledby={id("summary-title")}
              className="mb-12 border-l-2 border-[var(--form-error)] bg-[var(--form-error)]/[0.05] px-6 py-5 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--form-error)]"
            >
              <h3 id={id("summary-title")} className="font-display text-[1.5rem] leading-tight text-fg">
                {invalidFields.length === 1 ? "Eine Angabe fehlt noch." : `${invalidFields.length} Angaben fehlen noch.`}
              </h3>
              <ul className="mt-3 space-y-1.5 text-[0.9375rem]">
                {invalidFields.map((field) => (
                  <li key={field}>
                    <a
                      href={`#${id(field)}`}
                      onClick={(event) => focusField(event, field)}
                      className="inline-flex min-h-8 items-center text-[var(--form-error)] underline decoration-1 underline-offset-4 hover:decoration-2"
                    >
                      {errors[field]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 sm:gap-y-10">
            <FieldShell id={id("anliegen")} label="Ihr Anliegen" required className="sm:col-span-2">
              <Select
                id={id("anliegen")}
                name="anliegen"
                required
                value={reasonLabel(values.anliegen)}
                onChange={(e) => update("anliegen", reasonFromLabel(e.target.value))}
                className="font-display text-[1.625rem] tracking-[-0.01em] sm:text-[1.875rem]"
              >
                {contactReasons.map((reason) => (
                  <option key={reason.key} value={reason.label} className="bg-paper font-sans text-base text-ink">
                    {reason.label}
                  </option>
                ))}
              </Select>
            </FieldShell>

            <FieldShell id={id("name")} label="Name" required error={errors.name}>
              <TextInput
                id={id("name")}
                name="name"
                type="text"
                required
                autoComplete="name"
                maxLength={limits.name}
                value={values.name}
                invalid={!!errors.name}
                aria-describedby={describedBy(id("name"), { error: errors.name })}
                onChange={(e) => update("name", e.target.value)}
                onBlur={() => onBlur("name")}
              />
            </FieldShell>

            <FieldShell id={id("email")} label="E-Mail" required error={errors.email}>
              <TextInput
                id={id("email")}
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                maxLength={limits.email}
                value={values.email}
                invalid={!!errors.email}
                aria-describedby={describedBy(id("email"), { error: errors.email })}
                onChange={(e) => update("email", e.target.value)}
                onBlur={() => onBlur("email")}
              />
            </FieldShell>

            <FieldShell
              id={id("telefon")}
              label="Telefon"
              required={copy.phoneRequired}
              hint={copy.phoneRequired ? "Damit wir Sie zurückrufen können." : undefined}
              error={errors.telefon}
            >
              <TextInput
                id={id("telefon")}
                name="telefon"
                type="tel"
                required={copy.phoneRequired}
                autoComplete="tel"
                inputMode="tel"
                maxLength={limits.telefon}
                value={values.telefon}
                invalid={!!errors.telefon}
                aria-describedby={describedBy(id("telefon"), { hint: copy.phoneRequired || undefined, error: errors.telefon })}
                onChange={(e) => update("telefon", e.target.value)}
                onBlur={() => onBlur("telefon")}
              />
            </FieldShell>

            <FieldShell id={id("fahrzeug")} label={copy.vehicleLabel}>
              <TextInput
                id={id("fahrzeug")}
                name="fahrzeug"
                type="text"
                autoComplete="off"
                maxLength={limits.fahrzeug}
                placeholder={copy.vehiclePlaceholder}
                value={values.fahrzeug}
                onChange={(e) => update("fahrzeug", e.target.value)}
              />
            </FieldShell>

            <FieldShell id={id("nachricht")} label="Nachricht" required error={errors.nachricht} className="sm:col-span-2">
              <TextArea
                id={id("nachricht")}
                name="nachricht"
                required
                rows={6}
                maxLength={limits.nachricht}
                placeholder={copy.messagePlaceholder}
                value={values.nachricht}
                invalid={!!errors.nachricht}
                aria-describedby={describedBy(id("nachricht"), { error: errors.nachricht })}
                onChange={(e) => update("nachricht", e.target.value)}
                onBlur={() => onBlur("nachricht")}
              />
            </FieldShell>
          </div>

          {/* Honeypot: off-screen, skipped by keyboard and assistive tech, ignored by autofill. */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
            <label htmlFor={id("website")}>Website (bitte leer lassen)</label>
            <input id={id("website")} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <div className="mt-10">
            <Checkbox
              id={id("datenschutz")}
              name="datenschutz"
              value="akzeptiert"
              required
              checked={values.datenschutz}
              error={errors.datenschutz}
              onChange={(e) => update("datenschutz", e.target.checked)}
              label={
                <>
                  Ich habe die{" "}
                  <Link href="/datenschutz/" className="text-fg underline decoration-1 underline-offset-4 hover:decoration-2">
                    Datenschutzerklärung
                  </Link>{" "}
                  gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden.
                  <span aria-hidden="true" className="ml-1 text-brand">
                    *
                  </span>
                </>
              }
            />
          </div>

          {status === "error" && (
            <div role="alert" className="mt-10 border border-line-strong px-6 py-5">
              <p className="font-display text-[1.5rem] leading-tight text-fg">
                {failure === "network" ? "Keine Verbindung zum Server." : "Das hat leider nicht geklappt."}
              </p>
              <p className="mt-2 text-[0.9375rem] text-muted">
                Ihre Anfrage konnte nicht übermittelt werden. Versuchen Sie es bitte erneut – oder senden Sie uns Ihre
                Angaben direkt per E-Mail, sie sind bereits übernommen.
              </p>
              <div className="mt-4 flex flex-col gap-x-8 sm:flex-row sm:flex-wrap">
                <a
                  href={contactMailto(site.email.display, values)}
                  className="inline-flex min-h-11 items-center text-[0.9375rem] font-semibold text-fg underline decoration-1 underline-offset-4 hover:decoration-2"
                >
                  Per E-Mail senden
                </a>
                <a
                  href={site.phone.href}
                  className="inline-flex min-h-11 items-center text-[0.9375rem] text-fg underline decoration-1 underline-offset-4 hover:decoration-2 tabular"
                >
                  {site.phone.display}
                </a>
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              icon={sending ? "none" : "arrow"}
              aria-disabled={sending || undefined}
              className="w-full sm:w-auto aria-disabled:cursor-progress aria-disabled:opacity-80"
            >
              {sending ? (
                <span className="inline-flex items-center gap-3">
                  <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-[1.5px] border-current border-r-transparent" />
                  Wird gesendet …
                </span>
              ) : status === "error" ? (
                "Erneut senden"
              ) : (
                "Anfrage senden"
              )}
            </Button>
            <p id={id("required-note")} className="text-[0.8125rem] text-subtle">
              <span aria-hidden="true" className="text-brand">
                *
              </span>{" "}
              Pflichtfeld · Lieber direkt?{" "}
              <a href={site.phone.href} className="text-fg underline-offset-4 hover:underline tabular">
                {site.phone.display}
              </a>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

function SuccessPanel({
  headingRef,
  reason,
  onReset,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  reason: ContactReason;
  onReset: () => void;
}) {
  return (
    <div className="border-t border-line-strong pt-10">
      <p className="flex items-center gap-3 text-eyebrow font-semibold uppercase text-muted">
        <span aria-hidden="true" className="size-[7px] bg-brand" />
        Anfrage gesendet
      </p>
      <h3 ref={headingRef} tabIndex={-1} className="mt-6 font-display text-display-md text-fg outline-none [&_em]:italic [&_em]:text-fg/70">
        Vielen Dank. <em>Wir melden uns persönlich.</em>
      </h3>
      <p className="mt-6 max-w-xl text-lead text-muted">
        Ihre Anfrage zum Thema «{reasonLabel(reason)}» ist bei uns eingegangen. Wir melden uns so rasch wie möglich bei
        Ihnen.
      </p>
      <p className="mt-4 max-w-xl text-[0.9375rem] text-muted">
        Eilt es? Rufen Sie uns an unter{" "}
        <a href={site.phone.href} className="text-fg underline decoration-1 underline-offset-4 hover:decoration-2 tabular">
          {site.phone.display}
        </a>{" "}
        – wir sind gerne für Sie da.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/fahrzeuge/" icon="arrow">
          Fahrzeuge entdecken
        </ButtonLink>
        <Button variant="outline" onClick={onReset}>
          Weitere Anfrage
        </Button>
      </div>
    </div>
  );
}
