import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4341";
const outDir = __dirname;
const dirs = ["fullpage", "responsive", "crops", "comparisons"].map((d) =>
  path.join(outDir, d)
);
for (const d of dirs) fs.mkdirSync(d, { recursive: true });
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 900 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const screenshots = [];
const browser = await chromium.launch();
const page = await browser.newPage();

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 });
  const fp = path.join(outDir, "responsive", `homepage-band-refactor-${vp.name}.png`);
  await page.screenshot({ path: fp, fullPage: true });
  screenshots.push({ kind: "responsive", filename: path.basename(fp), viewport: `${vp.width}x${vp.height}`, sha256: sha(fp) });
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/", { waitUntil: "networkidle" });
const full = path.join(outDir, "fullpage", "home.png");
await page.screenshot({ path: full, fullPage: true });
screenshots.push({ kind: "fullpage", filename: "home.png", sha256: sha(full) });

async function crop(filename, selector) {
  const el = await page.$(selector);
  if (!el) throw new Error(`missing ${selector}`);
  const fp = path.join(outDir, "crops", filename);
  await el.screenshot({ path: fp });
  screenshots.push({ kind: "crop", filename, sha256: sha(fp) });
}

await crop("hero-1440.png", ".home-hero-shell");
await crop("governed-transaction-band-1440.png", '[data-home-band="governed-transaction"]');
await crop("govern-authorize-verify-band-1440.png", '[data-home-band="gav"]');
await crop("priority-workflows-band-1440.png", '[data-home-band="workflows"]');
await crop("verification-band-1440.png", '[data-home-band="verification"]');
await crop("controlled-evaluation-band-1440.png", '[data-home-band="controlled-evaluation"]');

// Comparison: prior widget homepage crop if available, else label-only collage note
const priorHero = path.resolve(
  outDir,
  "../pass-01b-approved-diagram-homepage-integration/crops/homepage-hero-approved-diagram-1440.png"
);
const priorFull = path.resolve(
  outDir,
  "../pass-01b-approved-diagram-homepage-integration/responsive/homepage__1440x900.png"
);
const compareOut = path.join(outDir, "comparisons", "homepage-widget-vs-band-1440.png");
if (fs.existsSync(priorFull)) {
  // Side-by-side via canvas in page
  const priorB64 = fs.readFileSync(priorFull).toString("base64");
  const currB64 = fs.readFileSync(path.join(outDir, "responsive", "homepage-band-refactor-1440.png")).toString("base64");
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#000">
    <div style="display:flex;gap:8px;padding:8px;align-items:flex-start">
      <div><div style="color:#fff;font:14px sans-serif;margin:0 0 6px">Before (widget sections)</div>
      <img id="a" src="data:image/png;base64,${priorB64}" style="width:700px;height:auto"/></div>
      <div><div style="color:#fff;font:14px sans-serif;margin:0 0 6px">After (narrative bands)</div>
      <img id="b" src="data:image/png;base64,${currB64}" style="width:700px;height:auto"/></div>
    </div></body></html>`);
  await page.waitForTimeout(200);
  await page.screenshot({ path: compareOut, fullPage: true });
} else {
  fs.copyFileSync(path.join(outDir, "responsive", "homepage-band-refactor-1440.png"), compareOut);
}
screenshots.push({ kind: "comparison", filename: "homepage-widget-vs-band-1440.png", sha256: sha(compareOut), prior_used: fs.existsSync(priorFull) });

const summary = {
  preview_port: 4341,
  starting_staging_head: "e0295e92f0a4bd5f96178e093a2b045e295c497c",
  png_sha256: "1F3B5EC10431787D1D51C65AF88B94AF82838E7E0C1746F1FA7EFB1932616371",
  screenshots,
};
fs.writeFileSync(path.join(outDir, "capture-summary.json"), JSON.stringify(summary, null, 2));
fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      pass: "01B-homepage-narrative-band-refactor",
      status: "IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_HOMEPAGE_REVIEW",
      starting_staging_head: summary.starting_staging_head,
      preview_port: 4341,
      png_sha256: summary.png_sha256,
      image_modified: false,
      screenshots,
    },
    null,
    2
  )
);
console.log(JSON.stringify({ ok: true, counts: {
  responsive: screenshots.filter((s) => s.kind === "responsive").length,
  crops: screenshots.filter((s) => s.kind === "crop").length,
} }, null, 2));
await browser.close();
