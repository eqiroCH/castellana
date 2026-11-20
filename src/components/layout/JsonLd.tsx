import { site } from "@/content/site";

/** Serialises structured data safely into a <script type="application/ld+json">. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** schema.org AutoDealer for the root layout. */
export function autoDealerJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${site.url}/#dealer`,
    name: site.name,
    description: site.description,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    image: `${site.url}/opengraph-image.jpg`,
    telephone: site.phone.href.replace("tel:", ""),
    email: site.email.display,
    priceRange: "CHF 40’000 – 250’000+",
    foundingDate: String(site.history.since),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.address.geo.lat, longitude: site.address.geo.lng },
    hasMap: site.links.googleMaps,
    openingHoursSpecification: site.hours.flatMap((h) =>
      h.slots.map(([opens, closes]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days,
        opens,
        closes,
      })),
    ),
    knowsLanguage: ["de", "en", "es", "fr", "it", "pt"],
    sameAs: [site.links.autoscout],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
    },
  };
}
