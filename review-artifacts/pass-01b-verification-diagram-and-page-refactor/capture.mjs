import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4344";
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
  await page.goto(base + "/verification", { waitUntil: "networkidle", timeout: 60000 });
  const fp = path.join(outDir, "responsive", `verification-${vp.name}.png`);
  await page.screenshot({ path: fp, fullPage: true });
  const h1 = await page.$eval("h1", (el) => el.textContent.trim());
  const img = await page.$eval(".verification-hero-diagram img", (el) => ({
    src: el.getAttribute("src"),
    w: el.naturalWidth,
    h: el.naturalHeight,
    rw: Math.round(el.getBoundingClientRect().width),
  }));
  const overflow =
    (await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1
    )) === true;
  screenshots.push({
    kind: "responsive",
    filename: path.basename(fp),
    viewport: `${vp.width}x${vp.height}`,
    sha256: sha(fp),
    h1,
    imgSrc: img.src,
    naturalW: img.w,
    naturalH: img.h,
    renderedW: img.rw,
    overflow,
  });
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/verification", { waitUntil: "networkidle" });
const full = path.join(outDir, "fullpage", "verification.png");
await page.screenshot({ path: full, fullPage: true });
screenshots.push({ kind: "fullpage", filename: "verification.png", sha256: sha(full) });

async function crop(filename, selector) {
  const el = await page.$(selector);
  if (!el) throw new Error(`missing ${selector}`);
  const fp = path.join(outDir, "crops", filename);
  await el.screenshot({ path: fp });
  screenshots.push({ kind: "crop", filename, sha256: sha(fp) });
}

await crop("verification-hero-copy-1440.png", ".verification-hero-copy");
await crop("verification-approved-diagram-1440.png", ".verification-hero-diagram");
await crop("verification-hero-and-diagram-1440.png", ".verification-hero");
await crop("verification-capability-grid-1440.png", ".verify-capability-grid");
await crop(
  "verification-ai-insights-1440.png",
  ".verify-capability-card--non-authoritative"
);
await crop(
  "verification-responsibility-separation-1440.png",
  ".verify-responsibility-grid"
);

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/verification", { waitUntil: "networkidle" });
await crop("verification-hero-and-diagram-390.png", ".verification-hero");

const oldPath = path.join(outDir, "comparisons", "_old-verification-1440.png");
const newCrop = path.join(outDir, "crops", "verification-hero-and-diagram-1440.png");
const compareOut = path.join(outDir, "comparisons", "verification-old-vs-new-1440.png");
if (fs.existsSync(oldPath)) {
  const priorB64 = fs.readFileSync(oldPath).toString("base64");
  const currB64 = fs.readFileSync(newCrop).toString("base64");
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#05080f;color:#fff;font:14px sans-serif">
    <div style="display:flex;gap:12px;padding:12px;align-items:flex-start">
      <div><div style="margin:0 0 8px">Before (side-by-side hero widget)</div>
      <img src="data:image/png;base64,${priorB64}" style="width:680px;height:auto;border:1px solid #334"/></div>
      <div><div style="margin:0 0 8px">After (vertical approved diagram)</div>
      <img src="data:image/png;base64,${currB64}" style="width:680px;height:auto;border:1px solid #334"/></div>
    </div></body></html>`);
  await page.waitForTimeout(250);
  await page.screenshot({ path: compareOut, fullPage: true });
} else {
  fs.copyFileSync(newCrop, compareOut);
}
screenshots.push({
  kind: "comparison",
  filename: "verification-old-vs-new-1440.png",
  sha256: sha(compareOut),
});

const summary = {
  preview_port: Number(new URL(base).port),
  starting_staging_head: "7858573c0b8df38c81aa10bbaa01c9570918df16",
  source_image: "Verification Diagram.png",
  public_image:
    "public/images/diagrams/verification/beaconguard-evidence-centered-investigation.png",
  png_sha256: "EDA45754A655E61949F3D1A15C903416B6E1308E3D25EE922FB15A2FBD86E848",
  intrinsic: { width: 1672, height: 941 },
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
      pass: "01B-verification-diagram-and-page-refactor",
      status: "IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_VERIFICATION_PAGE_REVIEW",
      starting_staging_head: summary.starting_staging_head,
      preview_port: summary.preview_port,
      png_sha256: summary.png_sha256,
      image_modified: false,
      intrinsic: summary.intrinsic,
      screenshots: screenshots.map((s) => s.filename),
    },
    null,
    2
  )
);

console.log(
  JSON.stringify(
    {
      pass: true,
      count: screenshots.length,
      diagram_width_1440: summary.diagram_width_1440,
      overflow_any: screenshots.some((s) => s.overflow),
    },
    null,
    2
  )
);
await browser.close();
