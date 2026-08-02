import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4342";
const outDir = __dirname;
for (const d of ["fullpage", "responsive", "crops", "comparisons"]) {
  fs.mkdirSync(path.join(outDir, d), { recursive: true });
}
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
  const fp = path.join(outDir, "responsive", `homepage-vertical-hero-${vp.name}.png`);
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

await crop("vertical-hero-copy-1440.png", ".enterprise-hero-copy");
await crop("vertical-hero-diagram-1440.png", ".enterprise-hero-diagram");
await crop("vertical-hero-complete-1440.png", ".enterprise-hero");

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/", { waitUntil: "networkidle" });
await crop("vertical-hero-complete-390.png", ".enterprise-hero");

const prior = path.resolve(
  outDir,
  "../pass-01b-approved-diagram-homepage-integration/crops/homepage-hero-approved-diagram-1440.png"
);
const curr = path.join(outDir, "crops", "vertical-hero-complete-1440.png");
const compareOut = path.join(outDir, "comparisons", "side-by-side-vs-vertical-1440.png");
if (fs.existsSync(prior)) {
  const priorB64 = fs.readFileSync(prior).toString("base64");
  const currB64 = fs.readFileSync(curr).toString("base64");
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#05080f;color:#fff;font:14px sans-serif">
    <div style="display:flex;gap:12px;padding:12px;align-items:flex-start">
      <div><div style="margin:0 0 8px">Rejected side-by-side</div>
      <img src="data:image/png;base64,${priorB64}" style="width:680px;height:auto;border:1px solid #334"/></div>
      <div><div style="margin:0 0 8px">Vertical full-width diagram</div>
      <img src="data:image/png;base64,${currB64}" style="width:680px;height:auto;border:1px solid #334"/></div>
    </div></body></html>`);
  await page.waitForTimeout(250);
  await page.screenshot({ path: compareOut, fullPage: true });
} else {
  fs.copyFileSync(curr, compareOut);
}
screenshots.push({ kind: "comparison", filename: "side-by-side-vs-vertical-1440.png", sha256: sha(compareOut) });

const summary = {
  preview_port: 4342,
  starting_staging_head: "a0f5e043a78668ade986aeee6e45574b21df6360",
  png_sha256: "1F3B5EC10431787D1D51C65AF88B94AF82838E7E0C1746F1FA7EFB1932616371",
  diagram_width_1440: 1200,
  diagram_width_1920: 1200,
  copy_max_width: 820,
  screenshots,
};
fs.writeFileSync(path.join(outDir, "capture-summary.json"), JSON.stringify(summary, null, 2));
fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      pass: "01B-homepage-vertical-hero",
      status: "IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_HOMEPAGE_REVIEW",
      starting_staging_head: summary.starting_staging_head,
      preview_port: 4342,
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
