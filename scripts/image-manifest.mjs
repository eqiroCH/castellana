/**
 * Single source of truth for every photo on the site.
 *
 * - `source.type: "unsplash"` photos are downloaded on demand into `.cache/images`
 *   (git-ignored) by `scripts/optimize-images.mjs`; credits are generated into CREDITS.md.
 * - `source.type: "local"` photos are client originals kept in `assets/photos`.
 *
 * Every entry becomes `public/images/opt/<slug>-<width>.webp` plus a typed record in
 * `src/content/media.ts`. Use the slug with `<Photo media="…" />`.
 *
 * `crop.aspect` = width / height of the output. `crop.focusX/focusY` (0–1) is the point
 * that should stay in frame. Widths larger than the cropped source are skipped.
 */

const HERO = [640, 1280, 1920, 2560];
const CARD = [480, 800, 1200];
const PORTRAIT = [480, 800, 1200];

/** @type {Array<{
 *   slug: string;
 *   alt: string;
 *   widths: number[];
 *   crop?: { aspect: number; focusX?: number; focusY?: number };
 *   source:
 *     | { type: "unsplash"; id: string; photographer: string; handle: string }
 *     | { type: "local"; path: string };
 * }>} */
export const images = [
  // ---------------------------------------------------------------- Unsplash
  {
    slug: "hero-911-gt3rs",
    alt: "Roter Porsche 911 GT3 RS mit eingeschalteten Scheinwerfern in einer dunklen Halle",
    widths: HERO,
    source: { type: "unsplash", id: "8RBH1GD0VkI", photographer: "Moses Malik Roldan", handle: "mosesmroldan" },
  },
  {
    slug: "hero-911-gt3rs-portrait",
    alt: "Roter Porsche 911 GT3 RS mit eingeschalteten Scheinwerfern in einer dunklen Halle",
    widths: [480, 800, 1080],
    crop: { aspect: 3 / 4, focusX: 0.6, focusY: 0.5 },
    source: { type: "unsplash", id: "8RBH1GD0VkI", photographer: "Moses Malik Roldan", handle: "mosesmroldan" },
  },
  {
    slug: "porsche-lake",
    alt: "Porsche 911 Cabriolet am Seeufer vor einer Bergkulisse",
    widths: HERO,
    source: { type: "unsplash", id: "jJxbx1nX0HY", photographer: "Marvin Meyer", handle: "marvelous" },
  },
  {
    slug: "ferrari-front",
    alt: "Roter Ferrari 488 in der Frontansicht vor einer dunklen Holzwand",
    widths: HERO,
    source: { type: "unsplash", id: "3akA0XDg1_g", photographer: "Matt Antonioli", handle: "antoniolio" },
  },
  {
    slug: "porsche-gt3-rear",
    alt: "Weisser Porsche 911 GT3 von hinten auf einer Allee",
    widths: HERO,
    source: { type: "unsplash", id: "9ydt_0e3gZQ", photographer: "Erik Fabian", handle: "fabianerik" },
  },
  {
    slug: "porsche-gt3-rear-portrait",
    alt: "Weisser Porsche 911 GT3 von hinten auf einer Allee",
    widths: PORTRAIT,
    crop: { aspect: 4 / 5, focusX: 0.5, focusY: 0.55 },
    source: { type: "unsplash", id: "9ydt_0e3gZQ", photographer: "Erik Fabian", handle: "fabianerik" },
  },
  {
    slug: "amg-gt-portrait",
    alt: "Schwarzer Mercedes-AMG GT vor einer Betonwand",
    widths: PORTRAIT,
    crop: { aspect: 4 / 5, focusX: 0.5, focusY: 0.55 },
    source: { type: "unsplash", id: "VH_oOHVhAdI", photographer: "Tim Vegas", handle: "tim_media" },
  },
  {
    slug: "amg-gt-wide",
    alt: "Schwarzer Mercedes-AMG GT vor einer Betonwand",
    widths: HERO,
    crop: { aspect: 16 / 9, focusX: 0.5, focusY: 0.6 },
    source: { type: "unsplash", id: "VH_oOHVhAdI", photographer: "Tim Vegas", handle: "tim_media" },
  },
  {
    slug: "porsche-cockpit-portrait",
    alt: "Lenkrad mit Porsche-Wappen im abgedunkelten Cockpit",
    widths: PORTRAIT,
    crop: { aspect: 4 / 5, focusX: 0.45, focusY: 0.3 },
    source: { type: "unsplash", id: "rDi5_0SO1OU", photographer: "Deniz Demirci", handle: "ddography" },
  },
  {
    slug: "porsche-cockpit-wide",
    alt: "Lenkrad mit Porsche-Wappen im abgedunkelten Cockpit",
    widths: HERO,
    crop: { aspect: 16 / 9, focusX: 0.5, focusY: 0.3 },
    source: { type: "unsplash", id: "rDi5_0SO1OU", photographer: "Deniz Demirci", handle: "ddography" },
  },
  {
    slug: "ferrari-wheel-wide",
    alt: "Hinterrad eines roten Ferrari im Lichtkegel",
    widths: HERO,
    crop: { aspect: 16 / 9, focusX: 0.5, focusY: 0.5 },
    source: { type: "unsplash", id: "bOfnYZZPg9U", photographer: "yokatan", handle: "yokatan" },
  },
  {
    slug: "vehicle-mercedes-c63",
    alt: "Schwarzer Mercedes-AMG C 63 mit Regentropfen (Symbolbild)",
    widths: CARD,
    crop: { aspect: 4 / 3, focusX: 0.5, focusY: 0.42 },
    source: { type: "unsplash", id: "i_igoT44PkA", photographer: "AltumCode", handle: "altumcode" },
  },
  {
    slug: "vehicle-porsche-cayenne-coupe",
    alt: "Schwarzer Porsche Cayenne Coupé von schräg hinten (Symbolbild)",
    widths: CARD,
    crop: { aspect: 4 / 3, focusX: 0.45, focusY: 0.55 },
    source: { type: "unsplash", id: "7CguI06KKNk", photographer: "Tim Meyer", handle: "timmeyer" },
  },
  {
    slug: "vehicle-ferrari-california-t",
    alt: "Schriftzug «California T» an einem Ferrari (Symbolbild)",
    widths: CARD,
    crop: { aspect: 4 / 3, focusX: 0.45, focusY: 0.5 },
    source: { type: "unsplash", id: "X-HJhkP6--k", photographer: "Adam Khan", handle: "adamkhan16" },
  },
  {
    slug: "vehicle-porsche-911-gt3",
    alt: "Schwarzer Porsche 911 GT3 in der Seitenansicht vor Boxentoren (Symbolbild)",
    widths: CARD,
    crop: { aspect: 4 / 3, focusX: 0.5, focusY: 0.6 },
    source: { type: "unsplash", id: "JUiftQpriyo", photographer: "Nejc Soklič", handle: "nejc_soklic" },
  },
  {
    slug: "vehicle-lamborghini-urus",
    alt: "Schwarzer Lamborghini Urus in einer Stadtstrasse (Symbolbild)",
    widths: CARD,
    crop: { aspect: 4 / 3, focusX: 0.5, focusY: 0.55 },
    source: { type: "unsplash", id: "qoZSYNBvIxg", photographer: "Samuel Hagger", handle: "samuel_hagger" },
  },
  {
    slug: "vehicle-mercedes-g63",
    alt: "Schwarzer Mercedes-AMG G 63 vor verschneiten Bergen (Symbolbild)",
    widths: CARD,
    crop: { aspect: 4 / 3, focusX: 0.55, focusY: 0.6 },
    source: { type: "unsplash", id: "xZJ6uV5F4_k", photographer: "D Panyukov", handle: "dpanyukov" },
  },

  // ---------------------------------------------------------------- Client photos
  {
    slug: "fassade-schild",
    alt: "Beleuchtetes Castellana-Schild mit rotem Quadrat an der Fassade in Thalwil",
    widths: [640, 1170],
    source: { type: "local", path: "assets/photos/fassade-schild.jpg" },
  },
  {
    slug: "showroom-nacht",
    alt: "Blick in den beleuchteten Castellana-Showroom bei Nacht",
    widths: [640, 1170],
    source: { type: "local", path: "assets/photos/showroom-nacht.jpg" },
  },
  {
    slug: "team-gruppe",
    alt: "Das Team der Castellana Automobile AG mit Wachhund Leo im Showroom",
    widths: [640, 1170],
    source: { type: "local", path: "assets/photos/team-gruppe.jpg" },
  },
  {
    slug: "showroom-mclaren",
    alt: "Orangefarbener McLaren mit geöffneten Flügeltüren im Showroom",
    widths: [640, 1024],
    source: { type: "local", path: "assets/photos/showroom/12-showroom.jpg" },
  },
  {
    slug: "showroom-aston-martin",
    alt: "Aston Martin Vantage im Showroom, dahinter McLaren und Ferrari",
    widths: [640, 1024],
    source: { type: "local", path: "assets/photos/showroom/13-showroom.jpg" },
  },
  {
    slug: "showroom-cockpit",
    alt: "Cockpit eines Porsche Cayenne mit Lederlenkrad",
    widths: [640, 1024],
    source: { type: "local", path: "assets/photos/showroom/14-showroom.jpg" },
  },
  {
    slug: "showroom-lamborghini",
    alt: "Weisser Lamborghini Gallardo vor dem Castellana-Schriftzug",
    widths: [640, 1024],
    source: { type: "local", path: "assets/photos/showroom/15-showroom.jpg" },
  },
  {
    slug: "showroom-detail",
    alt: "Rückleuchte und Lüftungsgitter eines Ferrari in Nahaufnahme",
    widths: [640, 1024],
    source: { type: "local", path: "assets/photos/showroom/16-showroom.jpg" },
  },
  {
    slug: "showroom-maserati",
    alt: "Zwei blaue Maserati GranCabrio im Showroom unter dem Castellana-Schriftzug",
    widths: [640, 1024],
    source: { type: "local", path: "assets/photos/showroom/17-showroom.jpg" },
  },
  {
    slug: "showroom-maserati-portrait",
    alt: "Blauer Maserati GranCabrio im Castellana-Showroom",
    widths: [546],
    crop: { aspect: 4 / 5, focusX: 0.3, focusY: 0.5 },
    source: { type: "local", path: "assets/photos/showroom/17-showroom.jpg" },
  },
];
