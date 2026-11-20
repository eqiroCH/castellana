import { partnerLogoSizes } from "@/content/partner";
import { PhoneIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

export type PartnerCardData = {
  name: string;
  role: string;
  address: string;
  phone: { display: string; href: string };
  /** Path under /public — small originals (≈ 316×233 px), shown at max. 160 px wide. */
  logo: string;
};

/**
 * Partner cards: logo on a white tile (grayscale, colour on hover), role, name, address
 * and a phone link. Light or dark tone — the tile stays white so the JPG logos blend in.
 */
export function PartnerCards({ partners }: { partners: readonly PartnerCardData[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
      {partners.map((partner, i) => {
        const size = partnerLogoSizes[partner.logo] ?? { width: 316, height: 233 };
        return (
          <Reveal as="li" key={partner.name} delay={i * 80}>
            <article className="group flex h-full flex-col">
              <div className="grid aspect-[2/1] place-items-center border border-line bg-white p-6 sm:aspect-[4/3] sm:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny original logo, shown below its native size */}
                <img
                  src={partner.logo}
                  alt={`Logo ${partner.name}`}
                  width={size.width}
                  height={size.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto max-h-full w-full max-w-[140px] object-contain brightness-[1.06] contrast-[1.08] grayscale transition-[filter] duration-500 ease-out-quart group-hover:grayscale-0 sm:max-w-[160px]"
                />
              </div>
              <p className="mt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-subtle">{partner.role}</p>
              <h3 className="mt-2 font-display text-display-sm text-fg">{partner.name}</h3>
              <address className="mt-3 text-[0.9375rem] not-italic text-muted">{partner.address}</address>
              <p className="mt-auto pt-3">
                <a
                  href={partner.phone.href}
                  className="inline-flex min-h-11 items-center gap-2.5 text-[0.9375rem] text-fg underline-offset-4 hover:underline tabular"
                >
                  <PhoneIcon className="size-4 shrink-0 text-muted" />
                  <span className="sr-only">Telefon </span>
                  {partner.phone.display}
                </a>
              </p>
            </article>
          </Reveal>
        );
      })}
    </ul>
  );
}
