/**
 * Form transport — progressive, no page reload.
 *
 *  1. `endpoint` set (NEXT_PUBLIC_FORM_ENDPOINT, e.g. Formspree): POST JSON with
 *     `Accept: application/json`.
 *  2. Otherwise Netlify Forms: POST urlencoded incl. `form-name` to the static
 *     `/__forms.html` (the form is registered there at deploy time, see public/__forms.html).
 *  3. The caller offers a mailto: fallback when this resolves with `ok: false`.
 *
 * Framework-free on purpose (no imports) so it can be exercised outside Next.js.
 */

export type SubmitResult = { ok: true } | { ok: false; reason: "network" | "server"; status?: number };

export type SubmitOptions = {
  /** Formspree-compatible endpoint. Empty/undefined → Netlify Forms. */
  endpoint?: string;
  /** Netlify form name, must match the form in public/__forms.html. */
  formName: string;
  /** Static path Netlify intercepts. */
  netlifyPath?: string;
  /** Abort after this many ms and treat as network failure. */
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

export const NETLIFY_FORMS_PATH = "/__forms.html";

export async function submitForm(payload: Record<string, string>, options: SubmitOptions): Promise<SubmitResult> {
  const { endpoint, formName, netlifyPath = NETLIFY_FORMS_PATH, timeoutMs = 15000, fetchImpl = fetch } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const request: RequestInit = endpoint
    ? {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        // Formspree reads `_subject` for the notification subject and `email` as reply-to.
        body: JSON.stringify({ ...payload, _subject: payload.subject }),
      }
    : {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ "form-name": formName, ...payload }).toString(),
      };

  try {
    const response = await fetchImpl(endpoint || netlifyPath, { ...request, signal: controller.signal });
    if (!response.ok) return { ok: false, reason: "server", status: response.status };
    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  } finally {
    clearTimeout(timer);
  }
}
