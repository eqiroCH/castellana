"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { isContactReason, limits, type ContactReason } from "./contact-schema";

export type Prefill = { anliegen: ContactReason | null; fahrzeug: string | null };

/**
 * Reads `?anliegen=` and `?fahrzeug=` and hands them to the form.
 * Renders nothing. Must sit inside <Suspense> (static export): only this tiny
 * boundary is client-rendered, the form itself stays in the prerendered HTML.
 *
 *   /kontakt/?anliegen=probefahrt&fahrzeug=Porsche%20911%20GT3
 *   anliegen: kaufinteresse | probefahrt | rueckruf | import | kommission | allgemein
 */
export function QueryPrefill({ onPrefill }: { onPrefill: (prefill: Prefill) => void }) {
  const params = useSearchParams();
  const rawReason = params.get("anliegen");
  const rawVehicle = params.get("fahrzeug");

  useEffect(() => {
    const anliegen = rawReason?.trim().toLowerCase() ?? null;
    const fahrzeug = rawVehicle?.trim().slice(0, limits.fahrzeug) || null;
    if (!anliegen && !fahrzeug) return;
    onPrefill({ anliegen: isContactReason(anliegen) ? anliegen : null, fahrzeug });
  }, [rawReason, rawVehicle, onPrefill]);

  return null;
}
