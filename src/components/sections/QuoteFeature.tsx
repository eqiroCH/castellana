import type { ReactNode } from "react";
import type { MediaSlug } from "@/content/media";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

type QuoteFeatureProps = {
  /** Quote text without guillemets. Use <em> for the muted italic accent. */
  quote: ReactNode;
  author: string;
  role?: string;
  /** Small portrait under /public (team photos are 180 px wide — shown at 56 px). */
  portrait?: string;
  image: MediaSlug;
  imageAlt?: string;
  imagePosition?: string;
  /** Tailwind aspect class for the photo, e.g. "aspect-[3/2]" (default) or "aspect-[4/5]". */
  imageAspect?: string;
  eyebrow?: string;
  tone?: "dark" | "light";
  /** Photo on the right instead of the left (desktop). */
  reverse?: boolean;
  /** Extra content under the quote (e.g. trust figures). */
  children?: ReactNode;
  /** Accessible name of the section. */
  label: string;
};

/** Photo + large serif quote with attribution — a personal trust moment between content sections. */
export function QuoteFeature({
  quote,
  author,
  role,
  portrait,
  image,
  imageAlt,
  imagePosition,
  imageAspect = "aspect-[3/2]",
  eyebrow,
  tone = "dark",
  reverse = false,
  children,
  label,
}: QuoteFeatureProps) {
  return (
    <Section tone={tone} aria-label={label}>
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className={cn("lg:col-span-6", reverse && "lg:order-2 lg:col-start-7")}>
          <div className={cn("relative overflow-hidden bg-surface", imageAspect)}>
            <Photo
              media={image}
              alt={imageAlt}
              sizes="(min-width: 1024px) 50vw, 100vw"
              position={imagePosition}
              className="size-full object-cover saturate-[0.9]"
            />
          </div>
        </Reveal>

        <Reveal className={cn("lg:col-span-5", reverse ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")} delay={100}>
          {eyebrow && <Eyebrow className="mb-8">{eyebrow}</Eyebrow>}
          <figure>
            <blockquote className="font-display text-display-lg text-fg [&_em]:italic [&_em]:text-fg/60">
              <p>«{quote}»</p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4 text-sm">
              {portrait ? (
                // eslint-disable-next-line @next/next/no-img-element -- tiny original portrait, shown below its native size
                <img
                  src={portrait}
                  alt=""
                  width={56}
                  height={56}
                  loading="lazy"
                  className="size-14 shrink-0 rounded-full object-cover object-top grayscale-[0.2]"
                />
              ) : (
                <span aria-hidden="true" className="h-px w-10 bg-fg/40" />
              )}
              <span>
                <span className="block font-semibold text-fg">{author}</span>
                {role && <span className="block text-muted">{role}</span>}
              </span>
            </figcaption>
          </figure>
          {children && <div className="mt-12">{children}</div>}
        </Reveal>
      </Container>
    </Section>
  );
}
