#!/usr/bin/env node
/**
 * Generates the favicon set and the Open Graph image into src/app (Next.js file conventions):
 *   icon.svg, favicon.ico (16+32), apple-icon.png (180), opengraph-image.jpg (1200×630)
 *
 * The OG image is rendered with Playwright so it uses the real site fonts — run
 * `npm run build` first (fonts are read from ./out), then `npm run icons`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = path.join(root, "src/app");
const RED = "#E30613";
const INK = "#0B0B0D";

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${INK}"/>
  <rect x="18" y="18" width="28" height="28" fill="${RED}"/>
</svg>
`;

/** ICO container with embedded PNGs (supported by all current browsers). */
function toIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function icons() {
  await writeFile(path.join(app, "icon.svg"), iconSvg);
  const svg = Buffer.from(iconSvg);
  const pngs = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, data: await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer() })),
  );
  await writeFile(path.join(app, "favicon.ico"), toIco(pngs));
  // Apple touch icon: no transparency, square corners (iOS rounds them itself).
  const apple = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" fill="${INK}"/><rect x="52" y="52" width="76" height="76" fill="${RED}"/></svg>`;
  await sharp(Buffer.from(apple)).png().toFile(path.join(app, "apple-icon.png"));
}

function siteCss() {
  const dir = path.join(root, "out/_next/static/chunks");
  const css = readdirSync(dir).find((f) => f.endsWith(".css") && readFileSync(path.join(dir, f), "utf8").includes("Instrument Serif"));
  if (!css) throw new Error("Built CSS with fonts not found — run `npm run build` first.");
  return pathToFileURL(path.join(dir, css)).href;
}

async function ogImage() {
  const hero = pathToFileURL(path.join(root, "public/images/opt/hero-911-gt3rs-1920.webp")).href;
  const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${siteCss()}">
  <style>
    html,body{margin:0;background:${INK}}
    .og{position:relative;width:1200px;height:630px;overflow:hidden;color:#F4F2EE;font-family:"Instrument Sans",sans-serif}
    .og img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:70% 50%}
    .shade{position:absolute;inset:0;background:linear-gradient(90deg,${INK} 0%,rgba(11,11,13,.82) 38%,rgba(11,11,13,.1) 75%),linear-gradient(0deg,rgba(11,11,13,.9) 0%,transparent 45%)}
    .content{position:absolute;left:72px;right:72px;top:64px;bottom:60px;display:flex;flex-direction:column;justify-content:space-between}
    .logo{display:flex;align-items:center;gap:16px;font-weight:700;font-style:italic;font-size:30px;letter-spacing:.01em}
    .logo i{display:block;width:26px;height:26px;background:${RED}}
    .logo span{font-weight:400;opacity:.62}
    h1{margin:0;font-family:"Instrument Serif",serif;font-weight:400;font-size:96px;line-height:.95;letter-spacing:-.02em}
    h1 em{color:rgba(244,242,238,.7)}
    .meta{display:flex;gap:28px;font-size:20px;color:#AEABA5;letter-spacing:.02em}
    .meta b{color:#F4F2EE;font-weight:600}
  </style></head><body>
  <div class="og"><img src="${hero}" alt=""><div class="shade"></div>
    <div class="content">
      <div class="logo"><i></i><div>CASTELLANA<span>.CH</span></div></div>
      <div>
        <h1>Automobile<br>Leidenschaft. <em>Seit 1983.</em></h1>
        <div class="meta" style="margin-top:28px"><span><b>Thalwil</b> am Zürichsee</span><span><b>4.6 ★</b> 391 Google-Bewertungen</span><span><b>175</b> Fahrzeuge</span></div>
      </div>
    </div>
  </div></body></html>`;

  // Rendered from a file:// page so the local CSS, fonts and photo may load.
  const tmp = path.join(root, ".cache/og.html");
  await mkdir(path.dirname(tmp), { recursive: true });
  await writeFile(tmp, html);
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const png = await page.locator(".og").screenshot();
    await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(app, "opengraph-image.jpg"));
  } finally {
    await browser.close();
    await rm(tmp, { force: true });
  }
  await writeFile(
    path.join(app, "opengraph-image.alt.txt"),
    "Castellana Automobile AG – Automobile Leidenschaft seit 1983, Thalwil am Zürichsee",
  );
}

await icons();
await ogImage();
console.log("Icons and Open Graph image written to src/app");
