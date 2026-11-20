import { addressLine, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** Walking distance Bahnhof Thalwil → Schützenstrasse 7 (OpenStreetMap foot routing: 1.6 km, ~22 min). */
const walk = { distance: "1,6 km", minutes: "gut 20 Minuten" };

/** 47.285241 → «47°17′07″ N» */
function toDms(value: number, positive: string, negative: string) {
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${deg}°${pad(min)}′${pad(sec)}″ ${value >= 0 ? positive : negative}`;
}

const coordinates = `${toDms(site.address.geo.lat, "N", "S")} · ${toDms(site.address.geo.lng, "E", "W")}`;

/** Shoreline of the lake in the schematic (north = up, lake to the north-east). */
const shore = "M 470 -20 C 545 110, 620 250, 820 400";

/**
 * Stylised, consent-free location graphic: no map tiles, no third-party requests.
 * Geometry is schematic (direction correct, not to scale). Labels are HTML so they stay
 * legible at every size; the SVG is decorative.
 */
function LocationMap() {
  const marker = { x: 290, y: 420 };
  const station = { x: 410, y: 150 };
  const pct = (x: number, y: number) => ({ left: `${(x / 800) * 100}%`, top: `${(y / 600) * 100}%` });

  return (
    <figure className="m-0">
      <div className="relative aspect-[4/3] overflow-hidden border border-line bg-ink-800">
        <svg viewBox="0 0 800 600" className="absolute inset-0 size-full" aria-hidden="true" focusable="false">
          <defs>
            <pattern id="loc-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f4f2ee" strokeOpacity="0.035" strokeWidth="1" />
            </pattern>
            <radialGradient id="loc-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(${marker.x} ${marker.y}) scale(260)`}>
              <stop offset="0" stopColor="#e30613" stopOpacity="0.16" />
              <stop offset="1" stopColor="#e30613" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="600" fill="url(#loc-grid)" />

          {/* Hillside contours, parallel to the shore */}
          {Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={shore}
              transform={`translate(${-(i + 1) * 62} ${(i + 1) * 30})`}
              fill="none"
              stroke="#f4f2ee"
              strokeOpacity={0.05 + (i % 3 === 2 ? 0.03 : 0)}
              strokeWidth="1"
            />
          ))}

          {/* Lake */}
          <path d={`${shore} L 820 -20 Z`} fill="#f4f2ee" fillOpacity="0.045" />
          <path d={shore} fill="none" stroke="#f4f2ee" strokeOpacity="0.28" strokeWidth="1.25" />
          {Array.from({ length: 5 }, (_, i) => (
            <path
              key={i}
              d={shore}
              transform={`translate(${(i + 1) * 26} ${-(i + 1) * 16})`}
              fill="none"
              stroke="#f4f2ee"
              strokeOpacity={0.06 - i * 0.008}
              strokeWidth="1"
              strokeDasharray="1 9"
              strokeLinecap="round"
            />
          ))}
          <text
            x="655"
            y="120"
            transform="rotate(40 655 120)"
            textAnchor="middle"
            fill="#f4f2ee"
            fillOpacity="0.42"
            style={{ fontFamily: "var(--font-instrument-serif), serif", fontStyle: "italic", fontSize: 34 }}
          >
            Zürichsee
          </text>

          {/* Glow + walking route */}
          <rect width="800" height="600" fill="url(#loc-glow)" />
          <path
            d={`M ${station.x} ${station.y} C ${station.x - 10} 250, ${marker.x + 70} 330, ${marker.x} ${marker.y}`}
            fill="none"
            stroke="#f4f2ee"
            strokeOpacity="0.6"
            strokeWidth="2"
            strokeDasharray="0.5 9"
            strokeLinecap="round"
          />

          {/* Station */}
          <circle cx={station.x} cy={station.y} r="9" fill="#141418" stroke="#f4f2ee" strokeWidth="1.5" />
          <circle cx={station.x} cy={station.y} r="3" fill="#f4f2ee" />

          {/* Castellana marker — the red square */}
          <rect x={marker.x - 30} y={marker.y - 30} width="60" height="60" fill="none" stroke="#f4f2ee" strokeOpacity="0.14" />
          <rect
            x={marker.x - 12}
            y={marker.y - 12}
            width="24"
            height="24"
            fill="none"
            stroke="#e30613"
            strokeWidth="1.5"
            className="origin-center [transform-box:fill-box] motion-safe:animate-[ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]"
          />
          <rect x={marker.x - 11} y={marker.y - 11} width="22" height="22" fill="#e30613" />

          {/* North arrow */}
          <g transform="translate(56 64)" stroke="#f4f2ee" strokeOpacity="0.5" fill="none" strokeWidth="1.25">
            <path d="M 0 26 L 0 -6 M -6 2 L 0 -6 L 6 2" strokeLinecap="square" />
          </g>
          <text x="56" y="112" textAnchor="middle" fill="#f4f2ee" fillOpacity="0.5" style={{ fontSize: 13, letterSpacing: "0.2em", fontWeight: 600 }}>
            N
          </text>
        </svg>

        {/* HTML labels (aria-hidden: the caption below carries the information) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Left of the station on small screens (keeps clear of the lake), right of it from sm. */}
          <div className="absolute -translate-x-full -translate-y-1/2 pr-4 sm:translate-x-0 sm:pl-6 sm:pr-0" style={pct(station.x, station.y)}>
            <p className="whitespace-nowrap text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-fg sm:text-[0.8125rem]">Bahnhof Thalwil</p>
          </div>
          <div className="absolute hidden -translate-y-1/2 pl-3 sm:block" style={pct(392, 290)}>
            <p className="text-[0.8125rem] text-muted">
              {walk.minutes} zu Fuss
              <span className="block text-subtle tabular">{walk.distance}</span>
            </p>
          </div>
          <div className="absolute -translate-y-1/2 pl-7 sm:pl-10" style={pct(marker.x, marker.y)}>
            <p className="whitespace-nowrap text-[0.875rem] font-semibold text-fg sm:text-base">{site.name}</p>
            <p className="text-[0.8125rem] text-muted sm:text-[0.875rem]">{site.address.street}</p>
          </div>
        </div>
      </div>

      <figcaption className="mt-4 flex flex-col gap-1 text-[0.8125rem] text-subtle sm:flex-row sm:justify-between">
        <span className="tabular">{coordinates}</span>
        <span>Schematische Darstellung, nicht massstabsgetreu</span>
        <span className="sr-only">
          {site.name}, {addressLine}. Vom Bahnhof Thalwil rund {walk.distance}, zu Fuss {walk.minutes}.
        </span>
      </figcaption>
    </figure>
  );
}

/** «So finden Sie zu uns» — schematic map, directions and route buttons. */
export function LocationSection() {
  return (
    <Section tone="dark" aria-labelledby="anfahrt-title" id="anfahrt" className="border-t border-line">
      {/* DOM order = mobile order (heading → map → details); on desktop the map spans both rows. */}
      <Container className="grid gap-y-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-0">
        <Reveal className="lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:self-end" delay={100}>
          <Eyebrow>Anfahrt</Eyebrow>
          <Heading id="anfahrt-title" className="mt-5">
            So finden Sie <em>zu uns.</em>
          </Heading>
          <address className="mt-8 not-italic">
            <p className="text-lead text-fg">{site.name}</p>
            <p className="text-lead text-muted">{addressLine}</p>
          </address>
        </Reveal>

        <Reveal className="lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center">
          <LocationMap />
        </Reveal>

        <Reveal className="lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:pt-8" delay={160}>
          <dl className="space-y-5 border-t border-line pt-6 text-[0.9375rem]">
            <div>
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-subtle">Mit dem Zug</dt>
              <dd className="mt-1.5 text-muted">
                Vom Bahnhof Thalwil erreichen Sie uns zu Fuss in {walk.minutes} (rund {walk.distance}).
              </dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-subtle">Mit dem Auto</dt>
              <dd className="mt-1.5 text-muted">Parkplätze finden Sie direkt bei uns vor Ort.</dd>
            </div>
            <div>
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-subtle">Tipp</dt>
              <dd className="mt-1.5 text-muted">
                Kündigen Sie Ihren Besuch kurz an – dann steht Ihr Wunschfahrzeug für die Probefahrt bereit.
              </dd>
            </div>
          </dl>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={site.links.googleRoute}>Route in Google Maps</ButtonLink>
            <ButtonLink href={site.links.appleMaps} variant="outline">
              Apple Karten
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
