/**
 * Home intro timeline — authored in milliseconds after T0 (= hero photo decoded, or the
 * 1.2 s cap). Converted to Web Animations keyframes and handed to the inline controller
 * (see controller.ts), so the sequence runs before React hydrates.
 *
 *   0.00  ink: photo at ~5 % behind a dark shade
 *   0.50  headlight flash #1 (≈120 ms on)          ← key-fob unlock
 *   0.78  headlight flash #2 (≈140 ms on)
 *   1.06  lights power up and stay on
 *   1.60  light sweep front → rear, photo to 100 %, camera pulls back, floor fog
 *   2.25  copy: eyebrow → headline words from line masks → «Seit 1983.» → lead → CTAs → trust strip
 *   3.15  html[data-intro="done"] (header comes in)
 *   4.30  cleanup: html[data-intro-seq="end"], animations released
 */
import type { IntroConfig, IntroTrack } from "./controller";

type Props = Record<string, string | number>;
/** [ms after T0, CSS props, easing towards the next step] */
type Step = [number, Props, string?];

/** Steep attack for a lamp switching on, short tail when it switches off. */
const ON = "cubic-bezier(0.1, 0.7, 0.1, 1)";
const OFF = "cubic-bezier(0.5, 0, 0.9, 0.4)";
const REVEAL = "cubic-bezier(0.22, 1, 0.36, 1)";
const REVEAL_LONG = "cubic-bezier(0.16, 1, 0.3, 1)";
const SWEEP = "cubic-bezier(0.62, 0.02, 0.32, 1)";
const SETTLE = "cubic-bezier(0.33, 0, 0.15, 1)";

function track(
  selector: string,
  steps: Step[],
  options: { stagger?: number; media?: IntroTrack["m"] } = {},
): IntroTrack {
  const start = steps[0][0];
  const duration = steps[steps.length - 1][0] - start;
  return {
    s: selector,
    o: start,
    d: duration,
    g: options.stagger ?? 0,
    m: options.media ?? 0,
    k: steps.map(([t, props, easing]) => ({
      offset: Math.round(((t - start) / duration) * 1e4) / 1e4,
      easing: easing ?? "linear",
      ...props,
    })),
  };
}

/**
 * Flash envelope shared by every light layer: two hard blinks (peak), a dip, then the lamps power
 * up to a steady level a little below the blink peak, and finally settle to the resting value.
 */
function flash(peak: number, steady: number, rest: number, extra: (v: number) => Props = () => ({})): Step[] {
  const s = (t: number, v: number, e?: string): Step => [t, { opacity: v, ...extra(v) }, e];
  return [
    s(0, 0),
    s(500, 0, ON),
    s(528, peak),
    s(620, peak, OFF),
    s(690, 0),
    s(780, 0, ON),
    s(806, peak),
    s(920, peak, OFF),
    s(1000, peak * 0.1, "ease-in-out"),
    s(1080, peak * 0.12, "cubic-bezier(0.3, 0, 0.1, 1)"),
    s(1340, steady * 1.06, "ease-in-out"),
    s(1520, steady, "linear"),
    s(1680, steady, "cubic-bezier(0.45, 0, 0.2, 1)"),
    s(2900, rest),
  ];
}

/**
 * Copy starts at 0.5 % instead of 0: invisible, but painted — so the largest text block still counts
 * as painted at first paint (LCP) instead of only when the intro reveals it.
 */
const HIDDEN = 0.005;

const shade = (x: string, skew: number) => `translate3d(${x}, 0, 0) skewX(${skew}deg)`;
/** exact inverse of shade(): keeps the light-pass photo registered with the scene */
const unshade = (x: string, skew: number) => `skewX(${-skew}deg) translate3d(${x}, 0, 0)`;
const rise = (y: string) => `translate3d(0, ${y}, 0)`;
/**
 * Mobile camera pan towards the headlight (portrait photo, lamp near the left edge): 35 % of the
 * plane, clamped to the image overhang (rendered width − plane width) × 62 % so no edge shows.
 * Keep in sync with html[data-intro-seq="wait"] .hx-dolly in intro.css.
 */
const PAN = "min(35cqw, (max(100cqw, 75cqh) - 100cqw) * 0.62)";

export const introConfig: IntroConfig = {
  key: "castellana:intro",
  cap: 1200,
  done: 3150,
  end: 4300,
  skip: 950,
  tracks: [
    // Darkness: a wide gradient wedge that flickers with the flashes, then wipes off front → rear.
    track('[data-hx="shade"]', [
      [0, { opacity: 0.955 }],
      [500, { opacity: 0.955 }, ON],
      [528, { opacity: 0.8 }],
      [620, { opacity: 0.8 }, OFF],
      [690, { opacity: 0.955 }],
      [780, { opacity: 0.955 }, ON],
      [806, { opacity: 0.78 }],
      [920, { opacity: 0.78 }, OFF],
      [1000, { opacity: 0.945 }, "ease-in-out"],
      [1080, { opacity: 0.94 }, SETTLE],
      [1360, { opacity: 0.9 }],
    ]),
    // Sweep geometry in intro.css: ramp travels 2.3 W; the light band leads it by ~0.2 W.
    ...[
      { media: 1 as const, skew: -12 },
      { media: 2 as const, skew: -6 },
    ].flatMap(({ media, skew }) => [
      track('[data-hx="shade"]', [
        [1600, { transform: shade("0%", skew) }, SWEEP],
        [2750, { transform: shade("35.38%", skew) }],
      ], { media }),
      track('[data-hx="sweep"]', [
        [1600, { transform: shade("-100%", skew) }, SWEEP],
        [2750, { transform: shade("130%", skew) }],
      ], { media }),
      track('[data-hx="sweep-inner"]', [
        [1600, { transform: unshade("100%", skew) }, SWEEP],
        [2750, { transform: unshade("-130%", skew) }],
      ], { media }),
    ]),
    track('[data-hx="sweep"]', [
      [1600, { opacity: 0 }, "ease-out"],
      [1800, { opacity: 1 }],
      [2550, { opacity: 1 }, "ease-in"],
      [2750, { opacity: 0 }],
    ]),

    // Lights: the photo's own lamps/beams (lights-only layer) plus CSS bloom on top.
    // Rest values match the CSS base styles in intro.css, so releasing the animations is seamless.
    track('[data-hx="lights"]', flash(1, 0.82, 0.3)),
    track('[data-hx="lamp"]', flash(1, 0.7, 0.3, (v) => ({ transform: `scale(${(1 + (v - 0.3) * 0.3).toFixed(3)})` }))),
    track('[data-hx="streak"]', flash(1, 0.55, 0.12, (v) => ({ transform: `scaleX(${(1 + (v - 0.12) * 0.3).toFixed(3)})` }))),
    track('[data-hx="beam"]', flash(1, 0.7, 0.22)),
    track('[data-hx="fog"]', [
      [1250, { opacity: 0 }, "ease-out"],
      [1700, { opacity: 0.55 }, "ease-in-out"],
      [2900, { opacity: 1 }],
    ]),
    track('[data-hx="wash"]', [
      [1750, { opacity: 0 }, "ease-in-out"],
      [2900, { opacity: 1 }],
    ]),

    // Camera: starts close on the near headlight (origin set in CSS), pulls back during the sweep.
    track(
      '[data-hx="dolly"]',
      [
        [0, { scale: 1.1 }],
        [1600, { scale: 1.082 }, SETTLE],
        [3500, { scale: 1 }],
      ],
      { media: 1 },
    ),
    track(
      '[data-hx="dolly"]',
      [
        [0, { scale: 1.1, translate: `${PAN} 0` }],
        [1600, { scale: 1.085, translate: `calc(${PAN} * 0.92) 0` }, SETTLE],
        [3500, { scale: 1, translate: "0px 0" }],
      ],
      { media: 2 },
    ),

    // Copy
    track('[data-hx="eyebrow"]', [
      [2250, { opacity: HIDDEN, transform: rise("14px") }, REVEAL],
      [3050, { opacity: 1, transform: rise("0px") }],
    ]),
    track(
      '[data-hx="word"]',
      [
        [2380, { transform: rise("135%") }, REVEAL],
        [3280, { transform: rise("0%") }],
      ],
      { stagger: 75 },
    ),
    track(
      '[data-hx="word-em"]',
      [
        [2640, { transform: rise("135%") }, REVEAL_LONG],
        [3840, { transform: rise("0%") }],
      ],
      { stagger: 95 },
    ),
    track('[data-hx="lead"]', [
      [2780, { opacity: HIDDEN, transform: rise("18px") }, REVEAL],
      [3780, { opacity: 1, transform: rise("0px") }],
    ]),
    track(
      '[data-hx="cta"]',
      [
        [2900, { opacity: HIDDEN, transform: rise("16px") }, REVEAL],
        [3800, { opacity: 1, transform: rise("0px") }],
      ],
      { stagger: 90 },
    ),
    track('[data-hx="rule"]', [
      [2950, { transform: "scaleX(0)" }, "cubic-bezier(0.65, 0, 0.35, 1)"],
      [4050, { transform: "scaleX(1)" }],
    ]),
    track(
      '[data-hx="trust"]',
      [
        [3020, { opacity: HIDDEN, transform: rise("14px") }, REVEAL],
        [3920, { opacity: 1, transform: rise("0px") }],
      ],
      { stagger: 70 },
    ),

    // «Überspringen» progress hairline
    track('[data-hx="skipfill"]', [
      [0, { transform: "scaleX(0)" }],
      [3150, { transform: "scaleX(1)" }],
    ]),
  ],
};
