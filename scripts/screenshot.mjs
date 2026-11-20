#!/usr/bin/env node
/**
 * Full-page screenshots of every route at mobile (390×844) and desktop (1440×900).
 *
 *   npm run build && npm run screenshots                 # serves ./out on :4173
 *   BASE_URL=http://localhost:3000 npm run screenshots    # against a running server
 *   SHOTS_DIR=/tmp/shots ROUTES=/,/kontakt/ npm run screenshots
 *
 * Output: $SHOTS_DIR (default ./screenshots, git-ignored) — <route>-<viewport>.png
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.resolve(process.env.SHOTS_DIR ?? path.join(root, "screenshots"));
const defaultRoutes = [
  "/",
  "/fahrzeuge/",
  "/ueber-uns/",
  "/showroom/",
  "/import/",
  "/kommission/",
  "/partner/",
  "/kontakt/",
  "/impressum/",
  "/datenschutz/",
  "/404.html",
];
const routes = process.env.ROUTES ? process.env.ROUTES.split(",") : defaultRoutes;
const viewports = (process.env.VIEWPORTS ?? "mobile,desktop").split(",");
const sizes = {
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
};

/** Minimal static server for ./out (trailingSlash export → dir/index.html). */
function serveOut(port) {
  const base = path.join(root, "out");
  if (!existsSync(base)) throw new Error("./out not found — run `npm run build` first or set BASE_URL.");
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    let file = path.join(base, url);
    if (!file.startsWith(base)) return res.writeHead(403).end();
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!existsSync(file)) {
      res.writeHead(404, { "Content-Type": types[".html"] });
      return createReadStream(path.join(base, "404.html")).pipe(res);
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

/** Scrolls through the page so lazy images load and <Reveal> elements animate in. */
async function settle(page) {
  // Wait until React has hydrated (Reveal sets data-revealed on mount/intersection).
  await page.waitForFunction(() => document.readyState === "complete");
  await page.waitForTimeout(800);
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const port = Number(process.env.PORT ?? 4173);
  const server = process.env.BASE_URL ? null : await serveOut(port);
  const baseUrl = process.env.BASE_URL ?? `http://localhost:${port}`;
  const browser = await chromium.launch();

  try {
    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: { width: sizes[vp].width, height: sizes[vp].height }, ...sizes[vp] });
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto(baseUrl + route, { waitUntil: "networkidle" });
        await settle(page);
        const name = route === "/" ? "home" : route.replace(/^\/|\/$|\.html$/g, "").replace(/\//g, "-");
        const file = path.join(outDir, `${name}-${vp}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`  ✓ ${file}`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
    server?.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
