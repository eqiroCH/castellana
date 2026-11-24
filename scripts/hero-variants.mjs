#!/usr/bin/env node
/**
 * Derived hero layers for the home intro (src/components/intro).
 *
 *   node scripts/hero-variants.mjs
 *
 * Writes NEW files only — the original hero photos are never touched:
 *   public/images/opt/hero-911-gt3rs-lights-{960,1920}.webp
 *   public/images/opt/hero-911-gt3rs-lights-portrait-{540,1080}.webp
 *
 * A "lights" layer keeps only the light-emitting, near-white parts of the photo (headlight
 * lenses, beams, DRL strip, the reflections they throw on the body) on pure black. It is
 * screen-blended over the darkened photo so the real headlights can flash before the car
 * appears. Same framing as the original → it stays glued with identical object-fit/position.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const opt = path.join(root, "public/images/opt");
const cached = path.join(root, ".cache/images/8RBH1GD0VkI.jpg");
const source = existsSync(cached) ? cached : path.join(opt, "hero-911-gt3rs-2560.webp");

/** Same crop as `hero-911-gt3rs-portrait` in scripts/image-manifest.mjs (3:4, focusX 0.6). */
function portraitRegion(width, height) {
  const w = Math.round(height * (3 / 4));
  const left = Math.min(Math.max(Math.round(0.6 * width - w / 2), 0), width - w);
  return { left, top: 0, width: w, height };
}

const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/**
 * Keeps near-white light (min channel high) and fades everything else to black. A spatial
 * weight limits it to the front of the car (lamps, beams, DRL, fender spill) so studio
 * reflections in the cabin glass do not flash with the headlights.
 */
async function lightsOnly() {
  const { data, info } = await sharp(source).rotate().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 3);
  for (let y = 0, o = 0; y < height; y++) {
    const wy = smoothstep(0.31, 0.39, y / height);
    for (let x = 0; x < width; x++, o += 3) {
      const i = (y * width + x) * channels;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const wx = 1 - smoothstep(0.55, 0.63, x / width);
      const m = smoothstep(0.3, 0.9, Math.min(r, g, b) / 255) ** 1.35 * wx * wy;
      out[o] = Math.round(r * m);
      out[o + 1] = Math.round(g * m);
      out[o + 2] = Math.round(b * m);
    }
  }
  return sharp(out, { raw: { width, height, channels: 3 } }).png().toBuffer();
}

const meta = await sharp(source).rotate().metadata();
const full = await lightsOnly();
const jobs = [
  { slug: "hero-911-gt3rs-lights", region: { left: 0, top: 0, width: meta.width, height: meta.height }, widths: [960, 1920] },
  { slug: "hero-911-gt3rs-lights-portrait", region: portraitRegion(meta.width, meta.height), widths: [540, 1080] },
];

for (const job of jobs) {
  for (const w of job.widths) {
    const file = path.join(opt, `${job.slug}-${w}.webp`);
    const info = await sharp(full).extract(job.region).resize({ width: w }).webp({ quality: 70, effort: 6 }).toFile(file);
    console.log(`  ✓ ${path.relative(root, file)}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
  }
}
