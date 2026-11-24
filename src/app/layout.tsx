import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { site } from "@/content/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd, autoDealerJsonLd } from "@/components/layout/JsonLd";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import "@/styles/globals.css";

const display = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – Premium- & Sportwagen in Thalwil`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: site.name,
    title: `${site.name} – Premium- & Sportwagen in Thalwil`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de-CH" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables reveal animations only when JS runs (see globals.css). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 bg-paper px-5 py-3 text-sm font-semibold text-ink transition-transform focus:translate-y-0"
        >
          Zum Inhalt springen
        </a>
        <Header />
        <PageTransition>{children}</PageTransition>
        <Footer />
        {/* Smooth scroll, custom cursor, magnetic buttons. */}
        <MotionProvider />
        {/* Red hairline captured by the page view transition (globals.css → .vt-wipe). */}
        <div aria-hidden="true" className="vt-wipe" />
        <JsonLd data={autoDealerJsonLd()} />
      </body>
    </html>
  );
}
