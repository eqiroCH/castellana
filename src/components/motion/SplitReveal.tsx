import { Children, Fragment, cloneElement, isValidElement, type CSSProperties, type ReactNode } from "react";
import { SplitTrigger } from "./SplitTrigger";

type SplitRevealProps = {
  /** Text, optionally with inline elements such as <em> or <br />. */
  children: ReactNode;
  /**
   * `inview` (default): words rise line by line the first time the text scrolls into view.
   * `load`: pure CSS animation on first paint — for above-the-fold titles (no JS needed).
   */
  trigger?: "inview" | "load";
  /** Extra delay before the first word, in ms. */
  delay?: number;
  className?: string;
};

const WHITESPACE = /([ \t\n\r]+)/;

function splitText(text: string, counter: { i: number }): ReactNode[] {
  return text.split(WHITESPACE).map((part, k) => {
    if (!part) return null;
    if (WHITESPACE.test(part)) return " ";
    const style = { "--i": counter.i++ } as CSSProperties;
    return (
      <span key={k} className="split-word">
        <span className="split-inner" style={style}>
          {part}
        </span>
      </span>
    );
  });
}

function splitNode(node: ReactNode, counter: { i: number }): ReactNode {
  if (typeof node === "string" || typeof node === "number") return splitText(String(node), counter);
  if (Array.isArray(node)) return Children.toArray(node).map((child) => splitNode(child, counter));
  if (isValidElement<{ children?: ReactNode }>(node)) {
    const { children } = node.props;
    if (node.type === Fragment) return splitNode(Children.toArray(children), counter);
    // Only plain host elements (<em>, <span>, <strong> …) are split; components stay intact.
    if (typeof node.type !== "string" || children == null) return node;
    return cloneElement(node, undefined, splitNode(Children.toArray(children), counter));
  }
  return node;
}

/**
 * Splits a title into words that rise out of a clipped mask (line by line, staggered).
 * The split happens on the server, so the markup — and therefore line breaks — are identical
 * before and after hydration: no layout shift. Without JS, with reduced motion or if the
 * observer never fires (2.5 s safety net), the text is simply visible. Works inside any
 * heading and keeps <em> accents: <Heading><SplitReveal>Titel <em>kursiv.</em></SplitReveal></Heading>
 */
export function SplitReveal({ children, trigger = "inview", delay = 0, className }: SplitRevealProps) {
  return (
    <SplitTrigger trigger={trigger} delay={delay} className={className}>
      {splitNode(Children.toArray(children), { i: 0 })}
    </SplitTrigger>
  );
}
