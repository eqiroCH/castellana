/** Media queries shared by all motion components. */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;
}

/** Mouse / trackpad with real hover — never true on touch devices. */
export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia(FINE_POINTER).matches;
}

/** Pointer effects (tilt, magnetic, cursor, flashlight) need a fine pointer and allowed motion. */
export function canUsePointerFx(): boolean {
  return hasFinePointer() && !prefersReducedMotion();
}

/** Frame-rate independent lerp factor: `base` is the factor per 60 fps frame. */
export function damp(base: number, dtMs: number): number {
  return 1 - Math.pow(1 - base, dtMs / 16.667);
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
