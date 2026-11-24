/**
 * Intro controller — runs as an inline <script> while the HTML is parsed (before first paint and
 * independent of React hydration). It is serialised with `Function.prototype.toString`, so it must
 * stay self-contained: no imports, no closures over module scope.
 *
 * State lives on <html>:
 *   data-intro="running" | "done"          public hook (header etc.), set only when the intro plays
 *   data-intro-seq="wait" | "play" | "skip" | "end"   internal: pre-T0 styles, skip transitions
 *
 * Returning visitors (sessionStorage key), prefers-reduced-motion and browsers without the Web
 * Animations API get no attributes at all → the hero's quick CSS fades.
 */

export type IntroTrack = {
  /** selector inside [data-hero] */
  s: string;
  /** keyframes (offset 0..1) */
  k: Keyframe[];
  /** delay after T0 (ms) */
  o: number;
  /** duration (ms) */
  d: number;
  /** stagger per matched element (ms) */
  g: number;
  /** 0 = all, 1 = ≥ 768 px, 2 = < 768 px */
  m: 0 | 1 | 2;
};

export type IntroConfig = {
  key: string;
  /** start at the latest this long after parse, even if the photo is not decoded yet */
  cap: number;
  /** ms after T0: data-intro="done" */
  done: number;
  /** ms after T0: release all animations */
  end: number;
  /** duration of the skip cross-fade */
  skip: number;
  tracks: IntroTrack[];
};

export type IntroHandle = { sync: () => void; skip: () => void };

export function introController(c: IntroConfig) {
  const d = document.documentElement;
  const ds = d.dataset;
  try {
    if (sessionStorage.getItem(c.key) || matchMedia("(prefers-reduced-motion: reduce)").matches || !d.animate) return;
    sessionStorage.setItem(c.key, "1");
  } catch {
    return;
  }

  const w = window as unknown as Window & { __castellanaIntro?: IntroHandle };
  const PROPS = ["opacity", "transform", "translate", "scale"];
  const mobile = matchMedia("(max-width: 767px)").matches;
  let phase = "wait";
  let anims: Animation[] = [];
  let touched: HTMLElement[] = [];
  let timers: number[] = [];
  const hero = () => document.querySelector<HTMLElement>("[data-hero]");
  const attrs = () => {
    ds.intro = phase === "wait" || phase === "play" ? "running" : "done";
    ds.introSeq = phase;
  };
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
  const clear = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };

  const events = ["pointerdown", "wheel", "touchstart", "keydown", "click", "scroll"];
  const onEvent = (e: Event) => {
    if (e.type === "keydown" && /^(Shift|Control|Alt|Meta|CapsLock|Fn)$/.test((e as KeyboardEvent).key)) return;
    if (e.type === "scroll" && window.scrollY < 4) return;
    skip();
  };
  const listen = (on: boolean) =>
    events.forEach((t) => window[on ? "addEventListener" : "removeEventListener"](t, onEvent, { capture: true, passive: true }));

  function start() {
    const root = hero();
    if (phase !== "wait") return;
    if (!root) return end();
    clear();
    phase = "play";
    attrs();
    c.tracks.forEach((t) => {
      if ((t.m === 1 && mobile) || (t.m === 2 && !mobile)) return;
      root.querySelectorAll<HTMLElement>(t.s).forEach((el, i) => {
        anims.push(el.animate(t.k, { delay: t.o + i * t.g, duration: t.d, fill: "both" }));
      });
    });
    later(() => {
      if (phase === "play") {
        ds.intro = "done";
      }
    }, c.done);
    later(end, c.end);
  }

  function skip() {
    if (phase !== "wait" && phase !== "play") return;
    clear();
    anims.forEach((a) => {
      const el = (a.effect as KeyframeEffect | null)?.target as HTMLElement | null;
      try {
        a.commitStyles();
        if (el) touched.push(el);
      } catch {
        // element not rendered — nothing to hand over
      }
      a.cancel();
    });
    anims = [];
    phase = "skip";
    attrs();
    // Flush styles so the CSS transitions start from the committed (current) values.
    hero()?.getBoundingClientRect();
    touched.forEach((el) => PROPS.forEach((p) => el.style.removeProperty(p)));
    later(end, c.skip);
  }

  function end() {
    if (phase === "end") return;
    clear();
    listen(false);
    anims.forEach((a) => a.cancel());
    touched.forEach((el) => PROPS.forEach((p) => el.style.removeProperty(p)));
    anims = [];
    touched = [];
    phase = "end";
    attrs();
    // Hero already gone (client navigation)? Drop the marker so the next mount gets the quick fades.
    if (!hero()) delete ds.introSeq;
  }

  /** Start once the hero photos are decoded (or after the cap). */
  function ready() {
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("[data-hero] .hx-img"));
    if (!imgs.length || imgs.some((img) => !img.complete)) return;
    Promise.all(imgs.map((img) => (img.decode ? img.decode().catch(() => {}) : null))).then(start);
  }

  attrs();
  listen(true);
  later(start, c.cap);
  document.addEventListener(
    "load",
    (e) => {
      if ((e.target as Element).classList?.contains("hx-img")) ready();
    },
    true,
  );
  document.addEventListener("DOMContentLoaded", ready);
  w.__castellanaIntro = {
    // React dev (Strict Mode) may reset <html> attributes during hydration — restore them.
    sync: () => {
      if (phase !== "end") attrs();
    },
    skip,
  };
}
