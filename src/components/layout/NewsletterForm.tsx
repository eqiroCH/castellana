"use client";

import { useId, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

/**
 * Newsletter sign-up. POSTs JSON to NEXT_PUBLIC_NEWSLETTER_ENDPOINT when configured,
 * otherwise falls back to a pre-filled e-mail to info@castellana.ch.
 */
export function NewsletterForm() {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // honeypot
    const email = String(data.get("email") ?? "").trim();
    if (!email) return;

    if (!endpoint) {
      const subject = encodeURIComponent("Newsletter-Anmeldung");
      const body = encodeURIComponent(`Bitte nehmen Sie mich in den Newsletter auf: ${email}`);
      window.open(`${site.email.href}?subject=${subject}&body=${body}`, "_self");
      setStatus("done");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate={false}>
      <label htmlFor={`${id}-email`} className="block text-sm text-muted">
        {site.newsletter.text}
      </label>
      <div className="flex border border-line-strong focus-within:border-fg">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="E-Mail-Adresse"
          className="min-h-12 w-full min-w-0 bg-transparent px-4 text-sm text-fg placeholder:text-subtle focus:outline-none"
        />
        <Button type="submit" variant="ghost" size="sm" icon="arrow" className="shrink-0 px-4" disabled={status === "sending"}>
          <span className="sr-only sm:not-sr-only">Anmelden</span>
        </Button>
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <p role="status" aria-live="polite" className="min-h-5 text-xs text-muted">
        {status === "done" && "Vielen Dank – wir halten Sie auf dem Laufenden."}
        {status === "error" && "Das hat leider nicht geklappt. Bitte versuchen Sie es erneut."}
      </p>
    </form>
  );
}
