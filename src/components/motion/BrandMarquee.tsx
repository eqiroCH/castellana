import { cn } from "@/lib/cn";

/** Brands typically in stock (BRIEF.md §1). */
const brands = ["Porsche", "Ferrari", "Lamborghini", "Mercedes-AMG", "Bentley", "Audi RS", "BMW M", "Range Rover", "Maserati"];

/** Twice the list per group → an even count, so filled/outlined alternation loops seamlessly. */
const track = [...brands, ...brands];

function Group() {
  return (
    <ul className="marquee-group">
      {track.map((brand, i) => (
        <li key={`${brand}-${i}`} className="marquee-item">
          <span className={cn("marquee-word", i % 2 === 1 && "marquee-word--outline")}>{brand}</span>
          <span aria-hidden="true" className="marquee-sep" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Endless, slow brand marquee in huge display serif directly after the hero.
 * Pure CSS (duplicated track, translate −50 %), pauses on hover; with reduced motion a static
 * row with faded edges. Screen readers get the brand list once.
 */
export function BrandMarquee() {
  return (
    <section aria-label="Marken in unserem Bestand" className="marquee tone-dark">
      <p className="sr-only">Marken in unserem Bestand: {brands.join(", ")}.</p>
      <div className="marquee-track" aria-hidden="true">
        <Group />
        <Group />
      </div>
    </section>
  );
}
