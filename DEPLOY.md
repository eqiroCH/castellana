# Übergabe & Deployment – castellana.ch

Kurzanleitung für Eqiro. Die Website ist ein **statischer Export** (Next.js `output: "export"`):
`npm run build` erzeugt den Ordner `out/`, der auf jedem statischen Hosting läuft. Vorbereitet sind
**Netlify** (empfohlen, inkl. Formularen) und **Vercel**.

## 1. Lokal bauen

Voraussetzung: Node.js ≥ 20.9 (empfohlen 22 LTS).

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint       # muss ohne Warnungen durchlaufen
npm run build      # statischer Export nach ./out
```

`out/` lässt sich lokal prüfen, z. B. mit `npx serve out`.

## 2. Deployment auf Netlify (empfohlen)

1. Repository in Netlify importieren. `netlify.toml` setzt Build (`npm run build`), Publish-Ordner
   (`out`), Node 22 und die Security-/Cache-Header.
2. **Formulare aktivieren:** Netlify → *Forms* → *Enable form detection*, danach einmal neu deployen.
   Das Formular «kontakt» wird über `public/__forms.html` erkannt (React rendert das Formular selbst,
   Netlify braucht eine statische Kopie). Felder dort synchron halten mit
   `src/components/forms/ContactForm.tsx`.
3. *Forms → Form notifications → Email notification* an **info@castellana.ch** einrichten.
   Der Betreff kommt aus dem Feld `subject` (z. B. «Probefahrt – Anfrage über castellana.ch von …»).
4. Spam-Schutz: Honeypot-Feld `website` (clientseitig und von Netlify geprüft) plus Netlifys
   eingebauter Spamfilter.
5. Redirects der alten PHP-URLs: `public/_redirects` (301).

## 3. Deployment auf Vercel (Alternative)

1. Repository in Vercel importieren (Framework: Next.js, wird erkannt). `vercel.json` enthält dieselben
   Redirects und Header wie Netlify – **beide Dateien synchron halten**.
2. **Wichtig:** Netlify Forms gibt es auf Vercel nicht. `NEXT_PUBLIC_FORM_ENDPOINT` muss gesetzt
   sein (siehe 4.), sonst zeigt das Formular nach dem Absenden den Fehlerzustand mit E-Mail-Fallback.

## 4. Formular-Endpoint (optional auf Netlify, Pflicht auf Vercel)

Das Kontaktformular sendet ohne Seiten-Reload, in dieser Reihenfolge:

| Stufe | Bedingung | Versand |
| --- | --- | --- |
| a | `NEXT_PUBLIC_FORM_ENDPOINT` gesetzt | `POST` JSON an den Endpoint (Formspree-kompatibel, `Accept: application/json`) |
| b | sonst | Netlify Forms: `POST` urlencoded inkl. `form-name` an `/__forms.html` |
| c | a/b schlägt fehl | Fehlermeldung mit «Erneut senden» und vorbefülltem `mailto:` an info@castellana.ch |

Ohne JavaScript ist es ein normales POST-Formular an dieselbe Adresse.

Formspree einrichten: Formular auf formspree.io anlegen (Empfänger info@castellana.ch), Endpoint
`https://formspree.io/f/…` als Umgebungsvariable im Hosting setzen, **neu deployen** (die Variable
wird beim Build eingesetzt). Vorlage: `.env.example`. Wird ein bestimmter Anbieter gewählt, diesen
in der Datenschutzerklärung (`src/app/datenschutz/page.tsx`, Abschnitt «Kontaktformular») namentlich
nennen.

Newsletter (Footer): `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` (POST JSON `{ email, source }`); ohne Endpoint
öffnet sich eine vorbereitete E-Mail.

Vorbefüllen per Link: `/kontakt/?anliegen=probefahrt&fahrzeug=Porsche%20911%20GT3`
(`anliegen`: `kaufinteresse`, `probefahrt`, `rueckruf`, `import`, `kommission`, `allgemein`).
Auf anderen Seiten kann das Formular mit `<ContactForm defaultReason="kommission" />` eingebunden werden.

## 5. Inhalte pflegen

| Was | Wo |
| --- | --- |
| Adresse, Telefon, Öffnungszeiten, Feiertagshinweis (`hoursNote`), Promo-Leiste, Team, Partner, FAQ | `src/content/site.ts` |
| Kuratierte Fahrzeuge der Startseite | `src/content/vehicles.ts` |
| Texte einzelner Seiten | `src/content/*.ts` bzw. die jeweilige `src/app/<seite>/page.tsx` |
| Fotos | `scripts/image-manifest.mjs` erfassen → `npm run images` (WebP nach `public/images/opt`, `CREDITS.md`, Bildnachweis im Impressum aktualisiert sich automatisch) |
| Favicons & Social-Share-Bild | `npm run icons` (nach `npm run build`) |
| Screenshots aller Seiten | `npm run screenshots` (aus `out/`) oder `BASE_URL=http://localhost:3000 npm run screenshots` |
| Sitemap-Datum | `CONTENT_UPDATED` in `src/app/sitemap.ts` bei grösseren Textänderungen anpassen |

## 6. Domain & DNS (castellana.ch)

- Im Hosting die Domains `castellana.ch` und `www.castellana.ch` hinzufügen; eine davon als primäre
  Domain festlegen (die andere leitet automatisch weiter).
- DNS beim bisherigen Registrar/Provider:
  - Netlify: `A  castellana.ch → 75.2.60.5`, `CNAME  www → <site>.netlify.app` (oder Netlify DNS nutzen)
  - Vercel: `A  castellana.ch → 76.76.21.21`, `CNAME  www → cname.vercel-dns.com`
  - Massgebend sind die Werte, die das Hosting-Dashboard beim Hinzufügen der Domain anzeigt.
- **MX- und übrige E-Mail-Einträge (SPF, DKIM) nicht verändern** – info@castellana.ch muss
  weiterlaufen.
- TTL einige Stunden vor der Umstellung senken. HTTPS-Zertifikat stellt das Hosting automatisch aus;
  «Force HTTPS» aktiv lassen (die Datenschutzerklärung nennt die verschlüsselte Verbindung).

## 7. Nach dem Go-live

- Testanfrage über `/kontakt/` senden und Zustellung an info@castellana.ch prüfen.
- Alte URLs prüfen, z. B. `curl -I https://castellana.ch/about.php` → `301` auf `/ueber-uns/`.
- Google Search Console: Domain bestätigen, `https://castellana.ch/sitemap.xml` einreichen.
- Google-Unternehmensprofil: Website-Link auf `https://castellana.ch/` setzen.

## 8. Offene Punkte für die Kundin

- **Fotoshooting:** eigene Fotos von Showroom, Lagerhalle, Team (aktuelle Teamfotos nur 180×249 px)
  und Fahrzeugen, um Unsplash-Symbolbilder zu ersetzen.
- **Formular:** Empfängeradresse bestätigen; Netlify Forms oder Formspree festlegen (siehe 4.).
- **AutoScout24:** prüfen, ob die HCI-Konfiguration `data-config-id="2054"` noch gilt und für die neue
  Domain bzw. das neue Hosting freigeschaltet ist.
- **Google-Profil:** direkten Link zum Google-Unternehmensprofil bzw. zu den Bewertungen liefern
  (heute eine Google-Maps-Suche).
- **Anfahrt:** Angaben auf `/kontakt/` bestätigen – Fussweg ab Bahnhof Thalwil rund 1,6 km bzw. gut
  20 Minuten (OpenStreetMap-Routing), Parkplätze direkt vor Ort.
- **Impressum:** vertretungsberechtigte Person gemäss Handelsregister bestätigen (heute: Antonio
  Castellana, Geschäftsführer); MWST-Nummer ergänzen, falls gewünscht.
- **Leasing:** Wo Leasingraten genannt werden, ist der Hinweis «Die Kreditvergabe ist verboten, falls
  sie zur Überschuldung der Konsumentin oder des Konsumenten führt» Pflicht (Art. 3 Abs. 1 lit. n UWG).
- **Datenschutz:** nach Wahl von Hosting und Formular-Dienst die Anbieter namentlich ergänzen.
