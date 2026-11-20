import { languageNames, type Milestone } from "@/content/ueber-uns";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";

export type TeamPerson = {
  name: string;
  role: string;
  languages: readonly string[];
  /** Path under /public (180×249 px originals) or null for a monogram. */
  photo: string | null;
};

export type TeamGroup = { title: string; members: readonly TeamPerson[] };

export type TeamCompanion = {
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  milestones: readonly Milestone[];
};

type TeamGridProps = {
  groups: readonly TeamGroup[];
  /** Four-legged colleague, shown as a wide card at the end of the last group. */
  companion?: TeamCompanion;
};

/** 80 px (mobile) / 112 px (≥ 640 px) wide, 4:5 — never above ~1.25× the 180 px originals on retina. */
const frame = "relative aspect-[4/5] w-20 shrink-0 overflow-hidden border border-line bg-surface sm:w-28";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Portrait({ name, photo }: Pick<TeamPerson, "name" | "photo">) {
  if (!photo) {
    return (
      <div className={cn(frame, "grid place-items-center")} aria-hidden="true">
        <span className="absolute left-2.5 top-2.5 size-[5px] bg-brand" />
        <span className="font-display text-[1.75rem] leading-none tracking-[0.04em] text-fg/55 sm:text-[2.25rem]">
          {initials(name)}
        </span>
      </div>
    );
  }
  return (
    <div className={frame}>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny original portrait, shown below its native size */}
      <img
        src={photo}
        alt={`Porträt von ${name}`}
        width={180}
        height={249}
        loading="lazy"
        decoding="async"
        className="size-full object-cover object-top grayscale transition-[filter] duration-700 ease-out-quart group-hover:grayscale-0"
      />
    </div>
  );
}

function Languages({ codes }: { codes: readonly string[] }) {
  if (codes.length === 0) return null;
  return (
    <p className="mt-4 text-[0.6875rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-subtle">
      <span className="sr-only">Sprachen: {codes.map((code) => languageNames[code] ?? code).join(", ")}</span>
      <span aria-hidden="true">{codes.join(" · ")}</span>
    </p>
  );
}

function PersonCard({ person, delay }: { person: TeamPerson; delay: number }) {
  return (
    <Reveal as="li" delay={delay} className="group grid grid-cols-[auto_1fr] items-start gap-5 border-t border-line-strong pt-6 sm:block">
      <Portrait name={person.name} photo={person.photo} />
      <div className="sm:mt-6">
        <h4 className="font-display text-[1.625rem] leading-[1.1] tracking-[-0.01em] text-fg">{person.name}</h4>
        <p className="mt-2 max-w-xs text-[0.9375rem] leading-snug text-muted">{person.role}</p>
        <Languages codes={person.languages} />
      </div>
    </Reveal>
  );
}

function CompanionCard({ companion, delay }: { companion: TeamCompanion; delay: number }) {
  return (
    <Reveal as="li" delay={delay} className="border-t border-line-strong pt-6 sm:col-span-2">
      <div className="grid grid-cols-[auto_1fr] items-start gap-5 sm:gap-8">
        <div className={cn(frame, "flex items-end justify-center")}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 123×136 px transparent original, shown at native size or below */}
          <img
            src={companion.photo}
            alt={companion.photoAlt}
            width={123}
            height={136}
            loading="lazy"
            decoding="async"
            className="h-auto w-[88%]"
          />
        </div>
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-subtle">Und nicht zu vergessen</p>
          <h4 className="mt-2 font-display text-[1.625rem] leading-[1.1] tracking-[-0.01em] text-fg">
            {companion.name}, <em className="italic text-fg/60">{companion.role}</em>
          </h4>
          <dl className="mt-5 max-w-md text-[0.9375rem]">
            {companion.milestones.map((m) => (
              <div key={m.label} className="flex gap-5 border-t border-line py-2.5 last:border-b">
                <dt className="w-20 shrink-0 text-subtle tabular">{m.label}</dt>
                <dd className="text-muted">{m.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * Team list in groups (e.g. family / team). Small 4:5 portraits — the originals are only
 * 180×249 px — and refined monograms for people without a photo. Language codes are
 * spelled out for screen readers.
 */
export function TeamGrid({ groups, companion }: TeamGridProps) {
  return (
    <div className="space-y-16 md:space-y-24">
      {groups.map((group, g) => {
        const isLast = g === groups.length - 1;
        return (
          <div key={group.title}>
            <h3 className="flex items-center gap-3 text-eyebrow font-semibold uppercase text-muted">
              <span aria-hidden="true" className="size-[7px] shrink-0 bg-brand" />
              {group.title}
            </h3>
            <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-14">
              {group.members.map((person, i) => (
                <PersonCard key={person.name} person={person} delay={(i % 4) * 70} />
              ))}
              {isLast && companion && <CompanionCard companion={companion} delay={(group.members.length % 4) * 70} />}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
