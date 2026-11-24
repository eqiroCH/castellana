"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION, clamp } from "./env";
import { subscribeScroll } from "./scroll";

const LETTERS = "CASTELLANA".split("");

/**
 * Giant outlined «CASTELLANA» closing the footer. Letters fill in white on hover (and fade
 * out slowly, like a sign switching off); the word rises gently as the page bottom arrives.
 * Decorative — the accessible brand name lives in the footer logo.
 */
export function FooterWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const word = wordRef.current;
    if (!wrap || !word || window.matchMedia(REDUCED_MOTION).matches) return;

    let unsubscribe: (() => void) | null = null;
    const update = () => {
      const r = wrap.getBoundingClientRect();
      const progress = clamp((window.innerHeight - r.top) / r.height, 0, 1);
      word.style.transform = `translate3d(0, ${((1 - progress) * 38).toFixed(2)}%, 0)`;
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !unsubscribe) unsubscribe = subscribeScroll(update);
      else if (!entry.isIntersecting && unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    });
    io.observe(wrap);
    return () => {
      io.disconnect();
      unsubscribe?.();
      word.style.transform = "";
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden="true" className="footer-wordmark">
      <p ref={wordRef} className="footer-wordmark-word">
        {LETTERS.map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
      </p>
    </div>
  );
}
