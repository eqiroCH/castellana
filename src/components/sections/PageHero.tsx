import type { CSSProperties, ReactNode } from "react";
import type { MediaSlug } from "@/content/media";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { SplitReveal } from "@/components/motion/SplitReveal";

const fade = (ms: number) => ({ "--fade-delay": `${ms}ms` }) as CSSProperties;

type PageHeroProps = {
  eyebrow: string;
  /** Use <em> for the muted italic accent. */
  title: ReactNode;
  lead?: ReactNode;
  /** Optional background photo (slug from src/content/media.ts). */
  image?: MediaSlug;
  /** object-position for the photo, e.g. "50% 60%" */
  imagePosition?: string;
  /** Extra content below the lead (buttons, meta). */
  children?: ReactNode;
};

/**
 * Dark page opener for all sub-pages. Sits under the transparent header, so it always
 * starts with enough top padding. With an image it becomes a cinematic band.
 * The title rises word by word on first paint (CSS only, see <SplitReveal trigger="load">).
 */
export function PageHero({ eyebrow, title, lead, image, imagePosition, children }: PageHeroProps) {
  return (
    <section className="tone-dark relative isolate overflow-hidden border-b border-line" aria-labelledby="page-title">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Photo media={image} sizes="100vw" priority position={imagePosition} className="hero-settle size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />
        </div>
      )}
      <Container
        className={cn(
          "flex flex-col justify-end pt-40 pb-14 md:pb-20",
          image ? "min-h-[68svh] md:min-h-[72svh]" : "min-h-[44svh] md:min-h-[52svh]",
        )}
      >
        <Eyebrow className="hero-fade">{eyebrow}</Eyebrow>
        <h1 id="page-title" className="mt-6 max-w-5xl font-display text-display-xl text-fg [&_em]:italic [&_em]:text-fg/70">
          <SplitReveal trigger="load" delay={120}>
            {title}
          </SplitReveal>
        </h1>
        {lead && (
          <div className="hero-fade mt-7 max-w-2xl text-lead text-paper/80" style={fade(450)}>
            {lead}
          </div>
        )}
        {children && (
          <div className="hero-fade mt-10" style={fade(600)}>
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
