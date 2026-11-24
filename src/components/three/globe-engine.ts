import type createGlobe from "cobe";
import type { Globe as CobeGlobe, Marker } from "cobe";

/**
 * Imperative core of <Globe>: one WebGL globe (cobe) plus a synchronised 2-D overlay
 * (route arcs, travelling dots, pulse rings, the «Thalwil» tag), driven by ONE rAF loop
 * that only runs while the globe is on screen.
 *
 * Projection — mirrors cobe v2 exactly (marker/arc vertex shaders and its anchor code):
 *   lat/lng → unit vector   v = (cos φ·cos λ, sin φ, −cos φ·sin λ)
 *   rotation (phi, theta)   x = cos(phi)·vx + sin(phi)·vz
 *                           y = sin(phi)·sin(theta)·vx + cos(theta)·vy − cos(phi)·sin(theta)·vz
 *                           z = −sin(phi)·cos(theta)·vx + sin(theta)·vy + cos(phi)·cos(theta)·vz
 *   i.e. x = cos φ·cos(λ+phi), y = cos φ·sin θ·sin(λ+phi) + cos θ·sin φ,
 *        z = −cos φ·cos θ·sin(λ+phi) + sin θ·sin φ
 *   sphere radius 0.8 (clip units), screen px = S/2 · (1 + x·scale), S/2 · (1 − y·scale)
 *   hidden ⇔ z < 0 and x² + y² < 0.8²  (behind the globe and inside its silhouette)
 *   centring (lat, lng): phi = −π/2 − λ, theta = φ
 */

type CreateGlobe = typeof createGlobe;
type Vec3 = [number, number, number];
type Rgb = [number, number, number];
export type LatLng = { lat: number; lng: number };
export type GlobeRouteInput = { region: string; origins: LatLng[] };

const DEG = Math.PI / 180;
const SPHERE = 0.8;
const SCALE = 1;
const DPR_CAP = 2;

const RED: Rgb = [227 / 255, 6 / 255, 19 / 255];
const RED_CSS = "227, 6, 19";
const RED_LIGHT_CSS = "255, 72, 64";

/** Look of the WebGL globe: ink sphere, cool-grey dotted land, faint red atmosphere. */
const LOOK = {
  mapSamples: 30000,
  mapBrightness: 2.8,
  mapBaseBrightness: 0.035,
  baseColor: [0.2, 0.205, 0.225] as Rgb,
  glowColor: [0.22, 0.024, 0.04] as Rgb,
  markerColor: RED,
  diffuse: 1.35,
  dark: 1,
  opacity: 1,
};

/** Marker radius in px = size · S / 4 (cobe: quad of 2·size, disc cut at 0.25). */
const MARKER_DEST = 0.03;
const MARKER_ORIGIN = 0.015;
/** German origins sit a few px from Thalwil — keep them small so the cluster stays legible. */
const MARKER_ORIGIN_NEAR = 0.01;

/**
 * Final framing relative to the destination. Great circles through the disc centre project as
 * straight lines, so the view centre sits slightly south-west of Thalwil: Thalwil lands upper
 * right of centre and every route reads as a curve across the Atlantic.
 */
const VIEW_OFFSET = { lat: -11, lng: -26 };
const START_VIEW = { lat: 31, lng: -97 };

const INTRO_MS = 2600;
const RETURN_MS = 1800;
const SWAY_PHI = 0.2;
const SWAY_PERIOD = 30000;
const THETA_MIN = -0.35;
const THETA_MAX = 1.15;

/* ------------------------------------------------------------------------ */
/* Math                                                                     */
/* ------------------------------------------------------------------------ */

export function toVec(lat: number, lng: number): Vec3 {
  const la = lat * DEG;
  const ln = lng * DEG;
  const c = Math.cos(la);
  return [c * Math.cos(ln), Math.sin(la), -c * Math.sin(ln)];
}

/** phi/theta that put (lat, lng) in the centre of the disc. */
export function frameOn(lat: number, lng: number) {
  return { phi: -Math.PI / 2 - lng * DEG, theta: lat * DEG };
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
/** Wrap an angle difference into [−π, π]. */
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/* ------------------------------------------------------------------------ */
/* Routes                                                                   */
/* ------------------------------------------------------------------------ */

type Arc = {
  long: boolean;
  segments: number;
  /** 3-D sample points (sphere units, lifted great circle), xyz interleaved */
  pts: Float64Array;
  /** per-frame scratch: screen px, visibility 0–1, cumulative screen length */
  sx: Float64Array;
  sy: Float64Array;
  vis: Float64Array;
  cum: Float64Array;
  revealAt: number;
  revealMs: number;
  dotPeriod: number;
};

function buildArc(from: Vec3, to: Vec3, long: boolean, revealAt: number, revealMs: number, dotPeriod: number): Arc {
  const dot = clamp(from[0] * to[0] + from[1] * to[1] + from[2] * to[2], -1, 1);
  const omega = Math.acos(dot);
  const segments = long ? 72 : 18;
  const lift = 0.16 * omega ** 0.7; // ≈ 0.2 across the Atlantic, a few px for Germany
  const pts = new Float64Array((segments + 1) * 3);
  const sinO = Math.sin(omega) || 1;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = Math.sin((1 - t) * omega) / sinO;
    const b = Math.sin(t * omega) / sinO;
    const r = SPHERE * (1 + lift * Math.sin(Math.PI * t));
    pts[i * 3] = (a * from[0] + b * to[0]) * r;
    pts[i * 3 + 1] = (a * from[1] + b * to[1]) * r;
    pts[i * 3 + 2] = (a * from[2] + b * to[2]) * r;
  }
  const n = segments + 1;
  return {
    long,
    segments,
    pts,
    sx: new Float64Array(n),
    sy: new Float64Array(n),
    vis: new Float64Array(n),
    cum: new Float64Array(n),
    revealAt,
    revealMs,
    dotPeriod,
  };
}

/* ------------------------------------------------------------------------ */
/* Engine                                                                   */
/* ------------------------------------------------------------------------ */

export type GlobeEngineOptions = {
  createGlobe: CreateGlobe;
  /** Square element that receives pointer events and defines the size. */
  surface: HTMLElement;
  /** Empty, React-free element the WebGL canvas is appended to. */
  host: HTMLElement;
  overlay: HTMLCanvasElement;
  /** «Thalwil» tag, positioned on the destination every frame. */
  label: HTMLElement | null;
  destination: LatLng;
  /** Framing the intro starts from (default: the USA). */
  start?: LatLng;
  routes: GlobeRouteInput[];
  reducedMotion: boolean;
  onReady: () => void;
};

export type GlobeEngine = {
  /** Feed from an IntersectionObserver: on screen at all / ratio for the intro. */
  setVisibility: (inView: boolean, ratio: number) => void;
  destroy: () => void;
};

type Mode = "pre" | "tween" | "idle" | "drag" | "inertia";

export function startGlobeEngine(opts: GlobeEngineOptions): GlobeEngine | null {
  const { surface, host, overlay, label, reducedMotion } = opts;

  // --- WebGL availability (same attributes cobe requests, so it reuses this context)
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText = "display:block;width:100%;height:100%";
  const attrs: WebGLContextAttributes = { alpha: true, stencil: false, antialias: false, depth: false, preserveDrawingBuffer: false };
  const gl = (canvas.getContext("webgl2", attrs) ?? canvas.getContext("webgl", attrs)) as WebGLRenderingContext | null;
  const ctx2d = overlay.getContext("2d");
  if (!gl || !ctx2d) return null;
  const ctx: CanvasRenderingContext2D = ctx2d;

  host.append(canvas);

  const dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
  let size = Math.max(1, surface.clientWidth);

  const focus = frameOn(opts.destination.lat + VIEW_OFFSET.lat, opts.destination.lng + VIEW_OFFSET.lng);
  const startView = reducedMotion ? focus : frameOn(opts.start?.lat ?? START_VIEW.lat, opts.start?.lng ?? START_VIEW.lng);
  let phi = startView.phi;
  let theta = startView.theta;

  const destVec = toVec(opts.destination.lat, opts.destination.lng);
  const markers: Marker[] = [{ location: [opts.destination.lat, opts.destination.lng], size: MARKER_DEST }];
  const arcs: Arc[] = [];
  opts.routes.forEach((route) => {
    const long = route.region === "usa";
    route.origins.forEach((o, i) => {
      markers.push({ location: [o.lat, o.lng], size: long ? MARKER_ORIGIN : MARKER_ORIGIN_NEAR });
      const revealAt = long ? 520 + i * 200 : 2050 + i * 140;
      const revealMs = long ? 1500 : 650;
      const period = long ? 5600 : 2300;
      arcs.push(buildArc(toVec(o.lat, o.lng), destVec, long, revealAt, revealMs, period));
    });
  });

  // --- cobe (renders synchronously on create and on every update())
  const headBefore = new Set(Array.from(document.head.children));
  let globe: CobeGlobe;
  try {
    globe = opts.createGlobe(canvas, {
      ...LOOK,
      width: size,
      height: size,
      devicePixelRatio: dpr,
      phi,
      theta,
      scale: SCALE,
      markers,
      markerElevation: 0,
      context: attrs,
    });
  } catch {
    host.replaceChildren();
    return null;
  }
  // cobe v2 rewrites a `:root{…}` <style> for CSS-anchor bindings on every update(). We use no
  // anchor ids, so detach it — otherwise each frame would invalidate the whole document's styles.
  for (const el of Array.from(document.head.children)) {
    if (!headBefore.has(el) && el.tagName === "STYLE") el.remove();
  }

  /* --- state ------------------------------------------------------------ */
  let mode: Mode = reducedMotion ? "idle" : "pre";
  let clock = 0;
  let introAt = reducedMotion ? -1e9 : Infinity; // clock time the intro started
  let introRequested = false;
  let wasOut = false;
  let tween = { from: { phi, theta }, to: focus, at: 0, ms: INTRO_MS };
  let sway = { phi: focus.phi, theta: focus.theta, at: 0 };
  let vx = 0;
  let vy = 0;
  let drag: { id: number; x: number; y: number; t: number; touch: boolean } | null = null;

  let inView = false;
  let pageVisible = document.visibilityState !== "hidden";
  let raf = 0;
  let lastTick = 0;
  let destroyed = false;
  let ready = false;
  // cobe uploads its land texture asynchronously: fade in once it has had time to decode,
  // and (reduced motion: no loop) render again so the land dots appear.
  const timers = [
    window.setTimeout(() => {
      ready = true;
      opts.onReady();
      maybeStartIntro();
      schedule();
    }, 160),
    window.setTimeout(() => schedule(), 700),
  ];

  /* --- overlay drawing ---------------------------------------------------- */
  const glow = document.createElement("canvas");
  {
    const g = glow.getContext("2d");
    glow.width = glow.height = 64;
    if (g) {
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, `rgba(${RED_LIGHT_CSS}, 0.9)`);
      grad.addColorStop(0.25, `rgba(${RED_CSS}, 0.45)`);
      grad.addColorStop(1, `rgba(${RED_CSS}, 0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
    }
  }

  function sizeOverlay() {
    overlay.width = Math.round(size * dpr);
    overlay.height = Math.round(size * dpr);
  }
  sizeOverlay();

  const cosSin = { cp: 1, sp: 0, ct: 1, st: 0 };
  function projectInto(x: number, y: number, z: number, out: { x: number; y: number; z: number; r2: number }) {
    const { cp, sp, ct, st } = cosSin;
    out.x = cp * x + sp * z;
    out.y = sp * st * x + ct * y - cp * st * z;
    out.z = -sp * ct * x + st * y + cp * ct * z;
    out.r2 = out.x * out.x + out.y * out.y;
  }
  const tmp = { x: 0, y: 0, z: 0, r2: 0 };
  const dest = { x: 0, y: 0, z: 0, r2: 0 };

  /** 1 = visible, 0 = behind the globe; soft near the limb so arcs fade instead of popping. */
  function visibility(z: number, r2: number) {
    const r = Math.sqrt(r2);
    return Math.max(smoothstep(-0.015, 0.05, z), smoothstep(SPHERE - 0.004, SPHERE + 0.03, r));
  }

  function arcReveal(arc: Arc) {
    return clamp((clock - introAt - arc.revealAt) / arc.revealMs, 0, 1);
  }

  /** Stroke a polyline in runs of equal (quantised) alpha so hidden parts fade out. */
  function strokeArc(arc: Arc, upto: number, alpha: number, dash: number[] | null, dashShift: number) {
    const last = Math.min(arc.segments, Math.ceil(upto));
    if (last <= 0) return;
    ctx.setLineDash(dash ?? []);
    let runStart = 0;
    let runAlpha = -1;
    const flush = (end: number) => {
      if (runAlpha <= 0.01 || end <= runStart) return;
      ctx.globalAlpha = runAlpha;
      if (dash) ctx.lineDashOffset = arc.cum[runStart] - dashShift;
      ctx.beginPath();
      ctx.moveTo(arc.sx[runStart], arc.sy[runStart]);
      for (let i = runStart + 1; i <= end; i++) {
        if (i === end && end === last && upto < last) {
          const f = upto - (last - 1);
          ctx.lineTo(lerp(arc.sx[i - 1], arc.sx[i], f), lerp(arc.sy[i - 1], arc.sy[i], f));
        } else {
          ctx.lineTo(arc.sx[i], arc.sy[i]);
        }
      }
      ctx.stroke();
    };
    for (let i = 0; i < last; i++) {
      const a = Math.round(Math.min(arc.vis[i], arc.vis[i + 1]) * alpha * 12) / 12;
      if (a !== runAlpha) {
        flush(i);
        runStart = i;
        runAlpha = a;
      }
    }
    flush(last);
  }

  function pointAt(arc: Arc, f: number) {
    const i = clamp(Math.floor(f), 0, arc.segments - 1);
    const t = clamp(f - i, 0, 1);
    return {
      x: lerp(arc.sx[i], arc.sx[i + 1], t),
      y: lerp(arc.sy[i], arc.sy[i + 1], t),
      v: lerp(arc.vis[i], arc.vis[i + 1], t),
    };
  }

  function drawDot(x: number, y: number, alpha: number, radius: number) {
    if (alpha <= 0.01) return;
    const g = radius * 5;
    ctx.globalAlpha = alpha * 0.8;
    ctx.drawImage(glow, x - g, y - g, g * 2, g * 2);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgb(255, 236, 232)";
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  let labelX = -1;
  let labelY = -1;
  let labelO = -1;

  function render() {
    if (destroyed) return;
    cosSin.cp = Math.cos(phi);
    cosSin.sp = Math.sin(phi);
    cosSin.ct = Math.cos(theta);
    cosSin.st = Math.sin(theta);
    globe.update({ phi, theta });

    const half = size / 2;
    const k = half * SCALE;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    // Destination (marker centre, elevation 0)
    projectInto(destVec[0] * SPHERE, destVec[1] * SPHERE, destVec[2] * SPHERE, dest);
    const dx = half + dest.x * k;
    const dy = half - dest.y * k;
    const dVis = visibility(dest.z, dest.r2);

    // Arcs
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const arc of arcs) {
      const reveal = arcReveal(arc);
      if (reveal <= 0) continue;
      const n = arc.segments + 1;
      let cum = 0;
      for (let i = 0; i < n; i++) {
        projectInto(arc.pts[i * 3], arc.pts[i * 3 + 1], arc.pts[i * 3 + 2], tmp);
        arc.sx[i] = half + tmp.x * k;
        arc.sy[i] = half - tmp.y * k;
        arc.vis[i] = visibility(tmp.z, tmp.r2);
        if (i > 0) cum += Math.hypot(arc.sx[i] - arc.sx[i - 1], arc.sy[i] - arc.sy[i - 1]);
        arc.cum[i] = cum;
      }
      const ends = 0.25 + 0.75 * Math.min(arc.vis[0], arc.vis[arc.segments]);
      const upto = reveal * arc.segments;

      ctx.strokeStyle = `rgb(${RED_CSS})`;
      if (arc.long) {
        ctx.lineWidth = 1;
        strokeArc(arc, upto, 0.28 * ends, null, 0);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = `rgb(${RED_LIGHT_CSS})`;
        strokeArc(arc, upto, 0.95 * ends, [2.5, 5.5], reducedMotion ? 0 : clock * 0.012);
      } else {
        ctx.lineWidth = 1.4;
        strokeArc(arc, upto, 0.9 * ends, null, 0);
      }

      // Pen dot while drawing on, then a travelling dot that loops origin → Thalwil
      if (reducedMotion) continue;
      const dotR = arc.long ? 2.6 : 2;
      if (reveal < 1) {
        const p = pointAt(arc, upto);
        drawDot(p.x, p.y, p.v * ends * (1 - smoothstep(0.86, 1, reveal)), dotR);
      } else {
        const t = clock - introAt - arc.revealAt - arc.revealMs;
        const u = (((t / arc.dotPeriod) % 1) + 1) % 1;
        const p = pointAt(arc, easeInOutSine(u) * arc.segments);
        drawDot(p.x, p.y, p.v * ends * Math.sin(Math.PI * u) ** 0.5, dotR);
      }
    }
    ctx.setLineDash([]);

    // Hero marker: light core on cobe's red disc + pulse rings foreshortened onto the surface
    if (dVis > 0.01) {
      const mr = (MARKER_DEST * size) / 4;
      ctx.globalAlpha = dVis;
      ctx.fillStyle = "rgb(255, 236, 232)";
      ctx.beginPath();
      ctx.arc(dx, dy, Math.max(1, mr * 0.34), 0, Math.PI * 2);
      ctx.fill();
      const rot = Math.atan2(-dest.y, dest.x);
      const squash = clamp(dest.z / SPHERE, 0.12, 1);
      ctx.strokeStyle = `rgb(${RED_LIGHT_CSS})`;
      ctx.lineWidth = 1;
      const rings = reducedMotion ? [0.42] : [(clock / 2600) % 1, (clock / 2600 + 0.5) % 1];
      for (const u of rings) {
        const rr = mr * (1.5 + 2.6 * u);
        ctx.globalAlpha = dVis * (reducedMotion ? 0.45 : 0.7 * (1 - u) ** 1.5);
        ctx.beginPath();
        ctx.ellipse(dx, dy, rr * squash, rr, rot, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // HTML tag (transform only — no layout)
    if (label) {
      // the tag arrives with Thalwil: hidden near the limb, full once well on the front
      const o = Math.round(smoothstep(0.12, 0.5, dest.z / SPHERE) * 100) / 100;
      if (Math.abs(dx - labelX) > 0.1 || Math.abs(dy - labelY) > 0.1 || o !== labelO) {
        labelX = dx;
        labelY = dy;
        labelO = o;
        label.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
        label.style.opacity = String(o);
      }
    }
  }

  /* --- motion ------------------------------------------------------------- */
  function startTween(to: { phi: number; theta: number }, ms: number) {
    tween = { from: { phi, theta }, to: { phi: phi + wrap(to.phi - phi), theta: to.theta }, at: clock, ms };
    mode = "tween";
  }

  function enterIdle() {
    mode = "idle";
    sway = { phi, theta, at: clock };
  }

  function maybeStartIntro() {
    if (reducedMotion || !ready || !introRequested || introAt !== Infinity) return;
    introAt = clock;
    wasOut = false;
    startTween(focus, INTRO_MS); // USA → across the Atlantic → Thalwil
    schedule();
  }

  function step(dt: number) {
    clock += dt;
    switch (mode) {
      case "pre":
        phi += 0.00001 * dt;
        break;
      case "tween": {
        const t = clamp((clock - tween.at) / tween.ms, 0, 1);
        const e = easeInOutCubic(t);
        phi = lerp(tween.from.phi, tween.to.phi, e);
        theta = lerp(tween.from.theta, tween.to.theta, e);
        if (t >= 1) enterIdle();
        break;
      }
      case "inertia": {
        phi += vx * dt;
        theta = clamp(theta + vy * dt, THETA_MIN, THETA_MAX);
        const decay = Math.exp(-dt / 380);
        vx *= decay;
        vy *= decay;
        if (Math.abs(vx) < 0.00002 && Math.abs(vy) < 0.00002) enterIdle();
        break;
      }
      case "idle": {
        if (reducedMotion) break;
        const t = clock - sway.at;
        const ramp = smoothstep(0, 6000, t);
        phi = sway.phi + SWAY_PHI * Math.sin((t / SWAY_PERIOD) * Math.PI * 2) * ramp;
        theta = sway.theta + 0.03 * Math.sin((t / (SWAY_PERIOD * 0.77)) * Math.PI * 2) * ramp;
        break;
      }
      case "drag":
        break;
    }
  }

  function active() {
    return !destroyed && inView && pageVisible && !reducedMotion;
  }

  function loop(now: number) {
    raf = 0;
    if (!active()) {
      lastTick = 0;
      return;
    }
    raf = requestAnimationFrame(loop);
    const elapsed = lastTick ? now - lastTick : 16.7;
    if (elapsed < 14) return; // cap at ~60 fps on high-refresh displays
    lastTick = now;
    step(Math.min(elapsed, 50));
    render();
  }

  /** Reduced motion: render on demand only. Otherwise (re)start the loop. */
  function schedule() {
    if (destroyed || raf) return;
    if (reducedMotion) {
      raf = requestAnimationFrame(() => {
        raf = 0;
        render();
      });
      return;
    }
    if (active()) raf = requestAnimationFrame(loop);
  }

  /* --- input -------------------------------------------------------------- */
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp, touch: e.pointerType !== "mouse" };
    try {
      surface.setPointerCapture(e.pointerId);
    } catch {
      /* not capturable — dragging still works while over the globe */
    }
    surface.dataset.dragging = "";
    mode = "drag";
    vx = vy = 0;
  };
  const onMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const rpx = SPHERE * SCALE * (size / 2);
    const dphi = (e.clientX - drag.x) / rpx;
    const dtheta = drag.touch ? 0 : (e.clientY - drag.y) / rpx;
    phi += dphi;
    theta = clamp(theta + dtheta, THETA_MIN, THETA_MAX);
    const dtm = Math.max(1, e.timeStamp - drag.t);
    vx = lerp(vx, dphi / dtm, 0.6);
    vy = lerp(vy, dtheta / dtm, 0.6);
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.t = e.timeStamp;
    if (reducedMotion) schedule();
  };
  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const idleFor = e.timeStamp - drag.t;
    const cancelled = e.type === "pointercancel";
    drag = null;
    delete surface.dataset.dragging;
    if (reducedMotion || cancelled || idleFor > 90) {
      vx = vy = 0;
      enterIdle();
    } else {
      vx = clamp(vx, -0.006, 0.006);
      vy = clamp(vy, -0.004, 0.004);
      mode = "inertia";
    }
  };
  surface.addEventListener("pointerdown", onDown);
  surface.addEventListener("pointermove", onMove);
  surface.addEventListener("pointerup", onUp);
  surface.addEventListener("pointercancel", onUp);

  const onVisibility = () => {
    pageVisible = document.visibilityState !== "hidden";
    schedule();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const ro = new ResizeObserver(() => {
    const next = Math.max(1, surface.clientWidth);
    if (Math.abs(next - size) < 0.5) return;
    size = next;
    globe.update({ width: size, height: size });
    sizeOverlay();
    labelX = -1;
    if (reducedMotion || !active()) render();
    schedule();
  });
  ro.observe(surface);

  render();

  return {
    setVisibility(nextInView, ratio) {
      if (!nextInView) wasOut = true;
      inView = nextInView;
      if (nextInView && ratio >= 0.3) {
        introRequested = true;
        if (introAt === Infinity) {
          maybeStartIntro();
        } else if (wasOut && mode === "idle" && !reducedMotion) {
          // Coming back: ease home to Thalwil if the globe drifted or was dragged away.
          wasOut = false;
          if (Math.abs(wrap(focus.phi - phi)) > 0.25 || Math.abs(focus.theta - theta) > 0.2) startTween(focus, RETURN_MS);
        }
      }
      schedule();
    },
    destroy() {
      destroyed = true;
      timers.forEach((t) => window.clearTimeout(t));
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      surface.removeEventListener("pointerdown", onDown);
      surface.removeEventListener("pointermove", onMove);
      surface.removeEventListener("pointerup", onUp);
      surface.removeEventListener("pointercancel", onUp);
      document.removeEventListener("visibilitychange", onVisibility);
      delete surface.dataset.dragging;
      globe.destroy();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      host.replaceChildren();
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    },
  };
}
