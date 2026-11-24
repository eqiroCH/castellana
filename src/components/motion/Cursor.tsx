"use client";

import { useEffect, useRef } from "react";
import { FINE_POINTER, REDUCED_MOTION, clamp, damp } from "./env";

/** Targets that get the native cursor back (form fields, embeds, third-party widgets). */
const NATIVE = 'input, textarea, select, iframe, [contenteditable="true"], [data-native-cursor], .hci-container';
const INTERACTIVE = 'a[href], button:not(:disabled), [role="button"], summary, label[for]';
/** Label targets: `data-cursor="Ansehen"` on any element except the root. */
const LABELLED = "[data-cursor]:not(html)";

/** Magnetic pull: share of the pointer offset and the maximum travel in px. */
const MAGNET_STRENGTH = 0.32;
const MAGNET_MAX = 14;

type State = "default" | "link" | "label" | "hidden";
type Spring = { el: HTMLElement; x: number; y: number; vx: number; vy: number };

function stepSpring(s: Spring, tx: number, ty: number, f: number) {
  // Damped spring (slight overshoot on release), normalised to 60 fps.
  const stiffness = 0.14;
  const damping = Math.pow(0.7, f);
  s.vx = (s.vx + (tx - s.x) * stiffness * f) * damping;
  s.vy = (s.vy + (ty - s.y) * stiffness * f) * damping;
  s.x += s.vx * f;
  s.y += s.vy * f;
}

function enable(root: HTMLDivElement): () => void {
  const html = document.documentElement;
  const label = root.querySelector<HTMLElement>("[data-cursor-label]");
  let x = -100;
  let y = -100;
  let cx = x;
  let cy = y;
  let raf = 0;
  let last = 0;
  let state: State = "default";
  let magnet: Spring | null = null;
  const releasing = new Set<Spring>();

  // Flag on <html> (not `data-cursor`, which marks label targets): hides the native cursor.
  html.dataset.hasCursor = "";

  const setState = (next: State) => {
    if (next === state) return;
    state = next;
    root.dataset.state = next;
  };

  const show = (visible: boolean) => {
    root.dataset.visible = String(visible);
  };

  const frame = (time: number) => {
    const dt = Math.min(64, last ? time - last : 16.667);
    last = time;
    const f = dt / 16.667;

    // Read phase: magnet centre (subtract our own translation).
    let mtx = 0;
    let mty = 0;
    if (magnet) {
      const r = magnet.el.getBoundingClientRect();
      const centerX = r.left + r.width / 2 - magnet.x;
      const centerY = r.top + r.height / 2 - magnet.y;
      mtx = clamp((x - centerX) * MAGNET_STRENGTH, -MAGNET_MAX, MAGNET_MAX);
      mty = clamp((y - centerY) * MAGNET_STRENGTH, -MAGNET_MAX, MAGNET_MAX);
    }

    // Write phase.
    const k = damp(0.3, dt);
    cx += (x - cx) * k;
    cy += (y - cy) * k;
    root.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;

    if (magnet) {
      stepSpring(magnet, mtx, mty, f);
      magnet.el.style.transform = `translate3d(${magnet.x.toFixed(2)}px, ${magnet.y.toFixed(2)}px, 0)`;
    }
    for (const s of releasing) {
      stepSpring(s, 0, 0, f);
      if (Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.vx) + Math.abs(s.vy) < 0.05) {
        s.el.style.transform = "";
        releasing.delete(s);
      } else {
        s.el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
      }
    }

    const settled = Math.abs(x - cx) < 0.1 && Math.abs(y - cy) < 0.1 && !magnet && releasing.size === 0;
    raf = settled ? 0 : requestAnimationFrame(frame);
    if (settled) last = 0;
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const setMagnet = (el: HTMLElement | null) => {
    if (magnet?.el === el) return;
    if (magnet) releasing.add(magnet);
    magnet = null;
    if (el) {
      // Re-grab an element that is still springing back.
      const existing = [...releasing].find((s) => s.el === el);
      if (existing) releasing.delete(existing);
      magnet = existing ?? { el, x: 0, y: 0, vx: 0, vy: 0 };
    }
    kick();
  };

  const resolve = (target: Element | null) => {
    if (!target || target === html) {
      setState("default");
      setMagnet(null);
      return;
    }
    if (target.closest(NATIVE)) {
      setState("hidden");
      setMagnet(null);
      return;
    }
    const labelled = target.closest<HTMLElement>(LABELLED);
    const interactive = target.closest<HTMLElement>(INTERACTIVE);
    const text = labelled?.dataset.cursor;
    if (text) {
      if (label && label.textContent !== text) label.textContent = text;
      setState("label");
    } else if (interactive) {
      root.style.color = getComputedStyle(interactive).color;
      setState("link");
    } else {
      setState("default");
    }
    setMagnet(target.closest<HTMLElement>("[data-magnetic]"));
  };

  // Content moving under a resting pointer (scroll, Lenis inertia) must not leave a stale
  // label behind: re-hit-test the pointer position, at most every ~80 ms while scrolling.
  let scrollCheck = 0;
  const onScroll = () => {
    if (scrollCheck || root.dataset.visible !== "true") return;
    scrollCheck = window.setTimeout(() => {
      requestAnimationFrame(() => {
        scrollCheck = 0;
        resolve(document.elementFromPoint(x, y));
      });
    }, 80);
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    x = event.clientX;
    y = event.clientY;
    if (root.dataset.visible !== "true") {
      cx = x;
      cy = y;
      show(true);
    }
    kick();
  };

  const onOver = (event: PointerEvent) => {
    if (event.pointerType === "mouse") resolve(event.target as Element | null);
  };
  const onOut = (event: PointerEvent) => {
    // Leaving the window (or into an iframe): reset completely.
    if (!event.relatedTarget) {
      show(false);
      setState("default");
      setMagnet(null);
    }
  };
  const onDown = () => {
    root.dataset.pressed = "true";
  };
  const onUp = () => {
    delete root.dataset.pressed;
  };
  const onBlur = () => {
    show(false);
    setState("default");
    setMagnet(null);
  };

  const opts = { passive: true } as const;
  window.addEventListener("pointermove", onMove, opts);
  document.addEventListener("pointerover", onOver, opts);
  document.addEventListener("pointerout", onOut, opts);
  window.addEventListener("pointerdown", onDown, opts);
  window.addEventListener("pointerup", onUp, opts);
  window.addEventListener("blur", onBlur);
  document.documentElement.addEventListener("mouseleave", onBlur, opts);
  window.addEventListener("scroll", onScroll, opts);

  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(scrollCheck);
    document.documentElement.removeEventListener("mouseleave", onBlur);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerover", onOver);
    document.removeEventListener("pointerout", onOut);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("blur", onBlur);
    for (const s of [magnet, ...releasing]) if (s) s.el.style.transform = "";
    delete html.dataset.hasCursor;
    show(false);
  };
}

/**
 * Custom cursor for mouse/trackpad users (never on touch, off for reduced motion):
 * an 8 px Castellana-red square that trails the pointer, an outlined square over links and
 * buttons, a red label tile over `[data-cursor="Label"]` targets, and the native cursor over
 * form fields, iframes and `[data-native-cursor]`. Also drives magnetic `[data-magnetic]`
 * buttons in the same animation frame.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fine = window.matchMedia(FINE_POINTER);
    const reduced = window.matchMedia(REDUCED_MOTION);
    let teardown: (() => void) | null = null;
    const setup = () => {
      teardown?.();
      teardown = fine.matches && !reduced.matches ? enable(root) : null;
    };
    setup();
    fine.addEventListener("change", setup);
    reduced.addEventListener("change", setup);
    return () => {
      fine.removeEventListener("change", setup);
      reduced.removeEventListener("change", setup);
      teardown?.();
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true" data-state="default" data-visible="false">
      <div className="cursor-press">
        <span className="cursor-dot" />
        <span className="cursor-ring" />
        <span className="cursor-label" data-cursor-label="" />
      </div>
    </div>
  );
}
