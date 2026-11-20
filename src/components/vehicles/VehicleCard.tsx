import Link from "next/link";
import type { Vehicle } from "@/content/vehicles";
import { formatChf, formatChfRound, formatKm } from "@/lib/format";
import { Photo } from "@/components/ui/Photo";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";

function SymbolBadge() {
  return (
    <span className="absolute left-3 top-3 bg-ink/70 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-paper/85 backdrop-blur-sm">
      Symbolbild
    </span>
  );
}

/**
 * Card for a real, curated listing. The whole card links to the dealer page on AutoScout24.
 * Price falls back to «Preis auf Anfrage».
 */
export function VehicleCard({ vehicle, headingLevel = "h3" }: { vehicle: Vehicle; headingLevel?: "h2" | "h3" }) {
  const Title = headingLevel;
  const specs = [
    vehicle.firstRegistration,
    vehicle.mileageKm !== null ? formatKm(vehicle.mileageKm) : null,
    vehicle.powerPs !== null ? `${vehicle.powerPs} PS` : null,
  ].filter((s): s is string => Boolean(s));

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Photo
          media={vehicle.image}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
          className="size-full object-cover transition-transform duration-[1400ms] ease-out-quart group-hover:scale-[1.035]"
        />
        {vehicle.imageIsSymbolic && <SymbolBadge />}
      </div>

      <div className="flex flex-1 flex-col pt-6">
        <p className="text-eyebrow font-semibold uppercase text-muted">{vehicle.make}</p>
        <Title className="mt-2 font-display text-display-sm text-fg">
          <a
            href={vehicle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-4 after:focus-visible:outline-fg"
          >
            {vehicle.model}
            <span className="sr-only"> – auf AutoScout24 ansehen (öffnet in neuem Fenster)</span>
          </a>
        </Title>
        {specs.length > 0 && (
          <ul className="mt-3 flex flex-wrap items-center gap-x-3 text-sm text-muted tabular" aria-label="Eckdaten">
            {specs.map((spec, i) => (
              <li key={spec} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="size-[3px] rounded-full bg-subtle" />}
                {spec}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-1 items-end justify-between gap-4 border-t border-line pt-5">
          <div>
            <p className="text-[1.0625rem] font-semibold text-fg tabular">
              {vehicle.priceChf !== null ? formatChf(vehicle.priceChf) : "Preis auf Anfrage"}
            </p>
            {vehicle.leasingFromChf !== null && (
              <p className="mt-0.5 text-[0.8125rem] text-muted tabular">Leasing ab {formatChfRound(vehicle.leasingFromChf)}/Mt.</p>
            )}
          </div>
          <span
            aria-hidden="true"
            className="inline-flex size-11 shrink-0 items-center justify-center border border-line-strong text-fg transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white"
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * Compact card for typical models (example entries). No price, year or mileage —
 * links to the contact form with the model pre-filled.
 */
export function ExampleVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const name = `${vehicle.make} ${vehicle.model}`;
  return (
    <article className="group relative flex items-center gap-5 border-t border-line py-5">
      <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden bg-surface sm:w-36">
        <Photo
          media={vehicle.image}
          sizes="144px"
          className="size-full object-cover transition-transform duration-[1400ms] ease-out-quart group-hover:scale-[1.05]"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-eyebrow font-semibold uppercase text-muted">{vehicle.make}</p>
        <h3 className="mt-1 font-display text-2xl leading-tight text-fg">
          <Link
            href={`/kontakt/?fahrzeug=${encodeURIComponent(name)}`}
            className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-2 after:focus-visible:outline-fg"
          >
            {vehicle.model}
            <span className="sr-only"> – Verfügbarkeit anfragen</span>
          </Link>
        </h3>
        <p className="mt-1 text-[0.8125rem] text-muted">Verfügbarkeit & Preis auf Anfrage</p>
      </div>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg" />
    </article>
  );
}
