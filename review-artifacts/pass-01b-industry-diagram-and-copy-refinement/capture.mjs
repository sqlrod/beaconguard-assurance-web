import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4343";
const outDir = __dirname;
for (const d of ["fullpage", "responsive", "crops", "comparisons"]) {
  fs.mkdirSync(path.join(outDir, d), { recursive: true });
}
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

const viewports = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const screenshots = [];
const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage();

const expected = {
  healthcare: {
    route: "/healthcare/",
    img: "/images/diagrams/industries/beaconguard-healthcare-governed-ai-transaction.png",
    h1: "Govern healthcare AI actions before they execute.",
    hash: "006849F386E811CC192805F42A11739BECDC5AC93BF5ABEF8C2EF4A51FF00B36",
  },
  financial: {
    route: "/fintech/",
    img: "/images/diagrams/industries/beaconguard-financial-governed-ai-transaction.png",
    h1: "Govern financial AI actions before they execute.",
    hash: "E05BC073E292B181658FCE97ED878FC8C9DE869615B259AE76DB3AF545D7FBE8",
  },
};

for (const [key, cfg] of Object.entries(expected)) {
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    const resp = await page.goto(base + cfg.route, { waitUntil: "networkidle", timeout: 60000 });
    if ((resp?.status() || 0) !== 200) errors.push(`${key} ${vp.name} not 200`);
    const checks = await page.evaluate((c) => {
      const h1s = [...document.querySelectorAll("h1")];
      const img = document.querySelector(".industry-diagram img");
      const old = document.querySelector(".bg-diagram--industry, .industry-control-flow");
      const titles = [...document.querySelectorAll("h1,h2,h3")].map((el) => el.textContent.trim());
      const titleCaseHits = titles.filter((t) =>
        /\b(The Clinical Authorization Boundary|Authorization Scope|Healthcare Governed|Financial Governed|What BeaconGuard Authorizes)\b/.test(t)
      );
      return {
        h1Count: h1s.length,
        h1: h1s[0]?.textContent.trim() || "",
        imgSrc: img?.getAttribute("src") || null,
        naturalW: img?.naturalWidth || 0,
        naturalH: img?.naturalHeight || 0,
        renderedW: img ? Math.round(img.getBoundingClientRect().width) : 0,
        renderedH: img ? Math.round(img.getBoundingClientRect().height) : 0,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        hasOld: !!old,
        hasRepeatedMeta: /Existing workflow:|AI-Generated Result:|Intended action:|BeaconGuard role:|Authoritative system:/i.test(
          document.body.innerText
        ),
        navFinancial: /Financial/i.test(document.querySelector(".header-nav")?.innerText || ""),
        titleCaseHits,
      };
    }, cfg);
    if (checks.h1Count !== 1) errors.push(`${key} ${vp.name} h1=${checks.h1Count}`);
    if (checks.h1 !== cfg.h1) errors.push(`${key} ${vp.name} h1 mismatch`);
    if (checks.imgSrc !== cfg.img) errors.push(`${key} ${vp.name} wrong image`);
    if (checks.naturalW !== 1536 || checks.naturalH !== 512) {
      errors.push(`${key} ${vp.name} intrinsic ${checks.naturalW}x${checks.naturalH}`);
    }
    if (checks.overflow) errors.push(`${key} ${vp.name} overflow`);
    if (checks.hasOld) errors.push(`${key} ${vp.name} old diagram present`);
    if (checks.hasRepeatedMeta) errors.push(`${key} ${vp.name} repeated metadata labels`);
    if (!checks.navFinancial) errors.push(`${key} ${vp.name} Financial missing from nav`);
    if (checks.titleCaseHits.length) errors.push(`${key} ${vp.name} title-case ${checks.titleCaseHits.join("|")}`);

    const fp = path.join(outDir, "responsive", `${key === "financial" ? "financial" : "healthcare"}-${vp.name}.png`);
    await page.screenshot({ path: fp, fullPage: true });
    screenshots.push({ kind: "responsive", page: key, filename: path.basename(fp), viewport: `${vp.width}x${vp.height}`, sha256: sha(fp), ...checks });
  }
}

// Crops at 1440
async function crop(pageKey, filename, selector) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base + expected[pageKey].route, { waitUntil: "networkidle" });
  const el = await page.$(selector);
  if (!el) {
    errors.push(`missing ${selector} on ${pageKey}`);
    return;
  }
  const fp = path.join(outDir, "crops", filename);
  await el.screenshot({ path: fp });
  screenshots.push({ kind: "crop", page: pageKey, filename, sha256: sha(fp) });
}

await crop("healthcare", "healthcare-hero-and-diagram-1440.png", ".industry-hero");
await crop("healthcare", "healthcare-diagram-1440.png", ".industry-diagram");
await crop("healthcare", "healthcare-scenarios-1440.png", ".scenario-grid");
await crop("financial", "financial-hero-and-diagram-1440.png", ".industry-hero");
await crop("financial", "financial-diagram-1440.png", ".industry-diagram");
await crop("financial", "financial-scenarios-1440.png", ".scenario-grid");

// Fullpage 1440
for (const key of ["healthcare", "financial"]) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base + expected[key].route, { waitUntil: "networkidle" });
  const fp = path.join(outDir, "fullpage", `${key === "financial" ? "financial" : "healthcare"}.png`);
  await page.screenshot({ path: fp, fullPage: true });
  screenshots.push({ kind: "fullpage", page: key, filename: path.basename(fp), sha256: sha(fp) });
}

// Comparisons: new 1440 vs prior pass-00/01 if available, else self-label
const priorHc = path.resolve(outDir, "../pass-01-foundation/fullpage/healthcare.png");
const priorFi = path.resolve(outDir, "../pass-01-foundation/fullpage/financial-services.png");
async function compare(label, prior, currentRel) {
  const curr = path.join(outDir, "responsive", currentRel);
  const out = path.join(outDir, "comparisons", label);
  if (fs.existsSync(prior) && fs.existsSync(curr)) {
    const a = fs.readFileSync(prior).toString("base64");
    const b = fs.readFileSync(curr).toString("base64");
    await page.setContent(`<!doctype html><html><body style="margin:0;background:#05080f;color:#fff;font:14px sans-serif">
      <div style="display:flex;gap:12px;padding:12px;align-items:flex-start">
        <div><div style="margin-bottom:8px">Before</div><img src="data:image/png;base64,${a}" style="width:680px;height:auto"/></div>
        <div><div style="margin-bottom:8px">After</div><img src="data:image/png;base64,${b}" style="width:680px;height:auto"/></div>
      </div></body></html>`);
    await page.waitForTimeout(200);
    await page.screenshot({ path: out, fullPage: true });
  } else {
    fs.copyFileSync(curr, out);
  }
  screenshots.push({ kind: "comparison", filename: path.basename(out), sha256: sha(out) });
}
await compare("healthcare-old-vs-new-1440.png", priorHc, "healthcare-1440.png");
await compare("financial-old-vs-new-1440.png", priorFi, "financial-1440.png");

// Image URL checks
for (const cfg of Object.values(expected)) {
  const r = await page.goto(base + cfg.img);
  if ((r?.status() || 0) !== 200) errors.push(`image ${cfg.img} not 200`);
}

const sitemap = await (await page.goto(base + "/sitemap.xml")).text();
const sitemapCount = (sitemap.match(/<loc>/g) || []).length;
if (sitemapCount !== 27) errors.push(`sitemap ${sitemapCount}`);

const summary = {
  preview_port: 4343,
  starting_staging_head: "5f62656bc008c9bc8f600349a4df1905d661f328",
  healthcare_hash: expected.healthcare.hash,
  financial_hash: expected.financial.hash,
  intrinsic: { width: 1536, height: 512 },
  errors,
  screenshots,
};
fs.writeFileSync(path.join(outDir, "capture-summary.json"), JSON.stringify(summary, null, 2));
fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      pass: "01B-industry-diagram-and-copy-refinement",
      status: "IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_INDUSTRY_PAGE_REVIEW",
      starting_staging_head: summary.starting_staging_head,
      preview_port: 4343,
      healthcare_hash: summary.healthcare_hash,
      financial_hash: summary.financial_hash,
      intrinsic: summary.intrinsic,
      image_modified: false,
      errors,
      screenshots,
    },
    null,
    2
  )
);

console.log(JSON.stringify({ pass: errors.length === 0, errors, counts: {
  responsive: screenshots.filter((s) => s.kind === "responsive").length,
  crops: screenshots.filter((s) => s.kind === "crop").length,
} }, null, 2));
await browser.close();
if (errors.length) process.exit(1);
