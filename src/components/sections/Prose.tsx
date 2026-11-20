import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** Simple reading section (light tone) for intro copy and legal text. */
export function Prose({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <Section tone={tone}>
      <Container size="narrow">
        <Reveal className="space-y-6 text-lead text-muted [&_strong]:font-semibold [&_strong]:text-fg">{children}</Reveal>
      </Container>
    </Section>
  );
}
