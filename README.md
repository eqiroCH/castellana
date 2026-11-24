# castellana.ch

Website der Castellana Automobile AG, Thalwil. Next.js 16 (App Router, statischer Export),
TypeScript, Tailwind CSS 4. Inhalte und Fakten: siehe `BRIEF.md`.

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver auf :3000 |
| `npm run build` | Statischer Export nach `out/` |
| `npm run lint` | ESLint (muss ohne Warnungen durchlaufen) |
| `npm run images` | Fotos aus `scripts/image-manifest.mjs` → WebP in `public/images/opt`, `src/content/media.ts`, `CREDITS.md` |
| `npm run icons` | Favicons + OG-Bild in `src/app` (nach `npm run build`, nutzt die echten Schriften) |
| `npm run screenshots` | Ganzseiten-Screenshots aller Routen (390 / 1440 px) aus `out/`; `BASE_URL`, `ROUTES`, `SHOTS_DIR` optional |

## Struktur

```
src/
  app/                 Routen (jede Seite beginnt mit einem dunklen Hero)
  content/
    site.ts            ALLE Fakten: Adresse, Zeiten, Team, Partner, FAQ, Import, Kommission …
    vehicles.ts        kuratierte Fahrzeuge (curated) + Beispielmodelle (example, ohne Preis)
    media.ts           GENERIERT – verfügbare Fotos (Slug → Grössen, Alt-Text)
  styles/globals.css   Design-Tokens (@theme), Ton-Varianten, Motion
  components/
    ui/                Container, Section, Eyebrow, Heading, Button/ButtonLink, Logo,
                       Divider, Stat, Reveal, Photo, Icons
    layout/            Header, MobileNav, Footer, NewsletterForm, PromoBar, JsonLd
    sections/          Hero, PageHero, SectionHeader, Prose, VehicleHighlights,
                       QualityPromise, Services, AboutTeaser, ShowroomGallery,
                       RatingBand, VisitBand
    vehicles/          VehicleCard, ExampleVehicleCard
assets/photos/         Kundenfotos (Quellen für die Bildpipeline)
scripts/               image-manifest, optimize-images, generate-icons, screenshot
```

## Designsystem in Kürze

- **Schriften:** Instrument Serif (Display, `font-display`, Kursiv via `<em>`) + Instrument Sans (Text/UI, `font-sans`).
- **Farben:** `ink` #0B0B0D, `paper` #F4F2EE, `brand` #E30613 (einziger Akzent – Logo-Quadrat, Eyebrow-Punkt, Primär-CTA).
- **Töne:** `<Section tone="dark|light">`. Darin immer die ton-abhängigen Utilities verwenden:
  `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `text-subtle`, `border-line`, `border-line-strong`.
  Alle Paare erfüllen WCAG AA.
- **Typo-Skala:** `text-display-2xl|xl|lg|md|sm` (fluid), `text-lead`, `text-eyebrow`.
- **Layout:** `<Container>` (max. 1376 px, Gutter `px-gutter`), Sektionsabstand `py-section`, Header-Höhe `h-header`.
- **Buttons:** `<ButtonLink href variant="primary|outline|ghost|link">` – interne Links via next/link,
  externe öffnen in neuem Tab mit ↗, `tel:`/`mailto:` bleiben normale Links. Mindesthöhe 44 px.
- **Bilder:** nur über `<Photo media="slug" sizes="…" />` (srcset aus `media.ts`). Neue Fotos zuerst im
  Manifest erfassen und `npm run images` ausführen. Unsplash-Fotos werden automatisch in `CREDITS.md` aufgeführt.
  Fahrzeugfotos, die nicht das konkrete Auto zeigen, als «Symbolbild» kennzeichnen.
- **Motion:** `<Reveal delay={…}>` (einmaliges Einblenden, 12 px). Respektiert `prefers-reduced-motion`
  und zeigt Inhalte spätestens nach 2.5 s auch ohne JavaScript.

## Regeln

- Keine Fakten erfinden – alles kommt aus `src/content/site.ts` bzw. `BRIEF.md`.
- Schweizer Schreibweise (ss, CHF, 175’000 → `formatNumber`/`formatChf` aus `src/lib/format.ts`).
- Promo-Leiste: `site.promo.enabled`; Feiertags-Öffnungszeiten: `site.hoursNote.enabled`.

## Formulare & Deployment

- **Kontaktformular** (`src/components/forms/`): `ContactForm` (Client-Komponente) mit Validierung, Fehlerübersicht,
  Honeypot `website` und Vorbefüllung per `?anliegen=…&fahrzeug=…`. Versand ohne Reload: an
  `NEXT_PUBLIC_FORM_ENDPOINT` (Formspree-kompatibel, JSON), sonst Netlify Forms (`POST` an `/__forms.html`),
  im Fehlerfall vorbefülltes `mailto:`. Netlify erkennt das Formular über `public/__forms.html` – Feldnamen
  synchron halten. Wiederverwendbar: `<ContactForm defaultReason="kommission" />`.
- **Hosting:** `netlify.toml` + `public/_redirects` (Netlify) bzw. `vercel.json` (Vercel) – Redirects der alten
  `*.php`-URLs und Header in beiden Dateien identisch halten. Umgebungsvariablen: `.env.example`.
- **Übergabe, DNS, offene Punkte:** siehe `DEPLOY.md`.

## Weitere Komponenten (Phase 2)

- `sections/ProcessSteps` – nummerierte Prozess-Schritte (`steps: {title,text}[]`), vertikal auf Mobile, horizontal ab `lg`.
- `sections/Faq` – Accordion auf `<details>/<summary>`; `faqPageJsonLd(items)` liefert das FAQPage-Schema.
- `sections/CtaBand` – dunkles Abschluss-Band mit Buttons und Kontaktzeile (`showContact`).
- `sections/QuoteFeature` – Foto + grosses Serif-Zitat mit Porträt.
- `sections/TeamGrid`, `sections/VideoFacade` (Click-to-load YouTube, nocookie), `sections/Gallery` (Lightbox auf `<dialog>`), `sections/PartnerCards`.
- `vehicles/AutoScoutWidget` – AutoScout24 Host-Integration (Config-ID in `site.autoscoutWidget`). Rendert nur auf `https://castellana.ch` (CSP `frame-ancestors`), sonst Fallback-Karte.
- `forms/ContactForm` – `<ContactForm defaultReason="kommission" tone="dark|light" />`, liest `?anliegen=` und `?fahrzeug=`.
- `lib/metadata.ts` – `pageMetadata({ title, description, path })` für Canonical, Open Graph und Twitter je Seite.
- Inhalte je Seite liegen in `src/content/{import,kommission,ueber-uns,showroom,partner}.ts`, globale Fakten in `src/content/site.ts`.

## Motion-Ebene (Phase 3)

- **Intro** (`src/components/intro/`): Scheinwerfer-Sequenz beim ersten Besuch pro Sitzung (`sessionStorage` «castellana:intro»), Timing in `timeline.ts`, Lampenpositionen in `intro.css`. Setzt `html[data-intro="running|done"]`. Nach Bildwechsel `node scripts/hero-variants.mjs` ausführen.
- **Motion-System** (`src/components/motion/`): `MotionProvider` (Lenis Smooth Scroll, Anker-Links), `Cursor` (eigener Cursor; `data-cursor="Label"`, `data-native-cursor`, `data-magnetic`), `SplitReveal`, `CountUp`, `Tilt`, `SpotlightGrid`, `DrawLine`, `SectionIndex` (`SectionHeader index={n}`), `BrandMarquee`, `FooterWordmark`, `PageTransition` (rendert `<main>`; View Transitions).
- **Scroll-Helfer** (`src/components/scroll/`): `CountUp`, `ClipReveal`, `Drift`, `ArgumentStack`, gemeinsamer `scroll-loop.ts`; CSS mit Präfix `sc-`.
- **3D-Globus** (`src/components/three/Globe.tsx`, `cobe`): `<Globe focus="thalwil" showRoutes legend />`, Routen auf 2D-Overlay mit cobe-Projektion, pausiert ausserhalb des Viewports.
- CSS-Module funktionieren wegen der Turbopack-CSS-Regel in `next.config.ts` nicht; globale Klassen mit Präfix verwenden (`fx-`, `sc-`, `globe-`).
- Alle Effekte respektieren `prefers-reduced-motion` und rendern ohne JS im Endzustand.
