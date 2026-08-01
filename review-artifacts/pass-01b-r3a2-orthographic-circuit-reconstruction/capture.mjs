import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4338";
const outDir = __dirname;
const fullpageDir = path.join(outDir, "fullpage");
const responsiveDir = path.join(outDir, "responsive");
const cropsDir = path.join(outDir, "crops");
const compareDir = path.join(outDir, "comparisons");
for (const d of [fullpageDir, responsiveDir, cropsDir, compareDir]) fs.mkdirSync(d, { recursive: true });

const prior1440 = path.resolve(
  __dirname,
  "../pass-01b-r3a1-control-fabric-geometry-correction/crops/control-fabric-corrected-1440.png"
);
const prior390 = path.resolve(
  __dirname,
  "../pass-01b-r3a1-control-fabric-geometry-correction/crops/control-fabric-corrected-390.png"
);

const publicRoutes = [
  { route: "/", filename: "home.png" },
  { route: "/platform", filename: "platform.png" },
  { route: "/healthcare", filename: "healthcare.png" },
  { route: "/fintech", filename: "financial-services.png" },
  { route: "/verification", filename: "verification.png" },
  { route: "/security", filename: "security.png" },
  { route: "/design-partner-program", filename: "controlled-evaluation.png" },
  { route: "/docs", filename: "documentation.png" },
  { route: "/contact", filename: "contact.png" },
  { route: "/how-it-works", filename: "how-it-works.png" },
  { route: "/proof-evidence", filename: "proof-and-evidence.png" },
  { route: "/canonical-workflow", filename: "canonical-workflow.png" },
  { route: "/trust-assurance", filename: "trust-center.png" },
  { route: "/company", filename: "company.png" },
  { route: "/reviewer-kit", filename: "reviewer-kit.png" },
  { route: "/control-responsibility-matrix", filename: "control-responsibility-matrix.png" },
  { route: "/deployment", filename: "deployment.png" },
  { route: "/use-cases", filename: "use-cases.png" },
  { route: "/sample-decision-record", filename: "sample-decision-record.png" },
  { route: "/docs/overview", filename: "docs-overview.png" },
  { route: "/docs/architecture", filename: "docs-architecture.png" },
  { route: "/docs/policy-model", filename: "docs-policy-model.png" },
  { route: "/docs/enforcement-runtime", filename: "docs-enforcement-runtime.png" },
  { route: "/docs/compliance-audit", filename: "docs-compliance-audit.png" },
  { route: "/docs/deployment-integration", filename: "docs-deployment-integration.png" },
  { route: "/docs/threat-model", filename: "docs-threat-model.png" },
  { route: "/docs/dfd-threat-flow", filename: "docs-dfd-threat-flow.png" },
];

const viewports = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const stagingRoute = "/staging-control-fabric";
const screenshots = [];
const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage();

for (const item of [...publicRoutes, { route: stagingRoute }]) {
  const resp = await page.goto(base + item.route + (item.route.endsWith("/") ? "" : "/"), {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  const status = resp?.status() ?? 0;
  const checks = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    robots: document.querySelector('meta[name="robots"]')?.content || null,
    navHasStaging: /staging-control-fabric|staging-diagram/i.test(
      document.querySelector(".header-nav")?.innerText || ""
    ),
    footerHasStaging: /staging-control-fabric|staging-diagram/i.test(
      document.querySelector("footer")?.innerText || ""
    ),
  }));
  if (status !== 200) errors.push(`${item.route} ${status}`);
  if (checks.h1 !== 1) errors.push(`${item.route} h1=${checks.h1}`);
  if (item.route === stagingRoute) {
    if (checks.navHasStaging || checks.footerHasStaging || checks.robots !== "noindex, nofollow") {
      errors.push("staging route policy failure");
    }
  }
}

const sitemapText = await (await page.goto(base + "/sitemap.xml")).text();
const sitemapHasStaging = /staging-control-fabric|staging-diagram/.test(sitemapText);
const sitemapUrlCount = (sitemapText.match(/<loc>/g) || []).length;
if (sitemapHasStaging) errors.push("sitemap includes staging");
if (sitemapUrlCount !== 27) errors.push(`sitemap count ${sitemapUrlCount}`);

await page.setViewportSize({ width: 1440, height: 900 });
for (const item of publicRoutes) {
  await page.goto(base + item.route + (item.route === "/" ? "" : "/"), {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  const fp = path.join(fullpageDir, item.filename);
  await page.screenshot({ path: fp, fullPage: true });
  screenshots.push({ route: item.route, filename: item.filename, kind: "fullpage", sha256: sha(fp) });
}

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(base + stagingRoute + "/", { waitUntil: "networkidle", timeout: 60000 });
  const filename = `staging-control-fabric__${vp.name}.png`;
  const fp = path.join(responsiveDir, filename);
  await page.screenshot({ path: fp, fullPage: true });
  screenshots.push({ route: stagingRoute, filename, kind: "responsive", viewport: vp.name, sha256: sha(fp) });
}

async function crop(selector, filename, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(base + stagingRoute + "/", { waitUntil: "networkidle", timeout: 60000 });
  const el = await page.$(selector);
  if (!el) {
    errors.push(`missing crop ${selector}`);
    return null;
  }
  const fp = path.join(cropsDir, filename);
  await el.screenshot({ path: fp });
  screenshots.push({ filename, kind: "crop", viewport: `${width}x${height}`, sha256: sha(fp) });
  return fp;
}

const c1440 = await crop('[data-crop="control-fabric"]', "control-fabric-r3a2-1440.png", 1440, 900);
await crop('[data-crop="control-fabric"]', "control-fabric-r3a2-1920.png", 1920, 1080);
await crop('[data-crop="control-fabric"]', "control-fabric-r3a2-1024.png", 1024, 768);
await crop('[data-crop="control-fabric"]', "control-fabric-r3a2-768.png", 768, 1024);
const c390 = await crop('[data-crop="control-fabric-mobile"]', "control-fabric-r3a2-390.png", 390, 844);
await crop('[data-crop="control-fabric-hero-size"]', "control-fabric-r3a2-hero-size-1440.png", 1440, 900);
await crop('[data-crop="control-fabric-hero-size"]', "control-fabric-r3a2-hero-size-390.png", 390, 844);

async function compare(leftPath, rightPath, outName, labelL, labelR) {
  if (!leftPath || !rightPath || !fs.existsSync(leftPath) || !fs.existsSync(rightPath)) {
    errors.push(`compare missing ${outName}`);
    return;
  }
  const html = `<!doctype html><html><body style="margin:0;background:#0b1220;display:flex;gap:8px;padding:8px;font-family:sans-serif;color:#fff">
  <div><div style="margin-bottom:4px">${labelL}</div><img src="file:///${leftPath.replace(/\\/g, "/")}" style="max-width:720px;height:auto;border:1px solid #334"/></div>
  <div><div style="margin-bottom:4px">${labelR}</div><img src="file:///${rightPath.replace(/\\/g, "/")}" style="max-width:720px;height:auto;border:1px solid #334"/></div>
  </body></html>`;
  const tmp = path.join(compareDir, `_tmp-${outName}.html`);
  fs.writeFileSync(tmp, html);
  const cpage = await browser.newPage({ viewport: { width: 1500, height: 900 } });
  await cpage.goto("file:///" + tmp.replace(/\\/g, "/"));
  await cpage.waitForTimeout(200);
  const out = path.join(compareDir, outName);
  await cpage.screenshot({ path: out, fullPage: true });
  await cpage.close();
  screenshots.push({ filename: outName, kind: "compare", sha256: sha(out) });
  fs.unlinkSync(tmp);
}

await compare(prior1440, c1440, "r3a1-vs-r3a2-1440.png", "R3A1", "R3A2");
await compare(prior390, c390, "r3a1-vs-r3a2-390.png", "R3A1", "R3A2");

const summary = {
  preview_port: 4338,
  errors,
  sitemap_url_count: sitemapUrlCount,
  sitemap_has_staging: sitemapHasStaging,
  public_fullpage_count: screenshots.filter((s) => s.kind === "fullpage").length,
  responsive_count: screenshots.filter((s) => s.kind === "responsive").length,
  crop_count: screenshots.filter((s) => s.kind === "crop").length,
  compare_count: screenshots.filter((s) => s.kind === "compare").length,
  screenshots,
};
fs.writeFileSync(path.join(outDir, "capture-summary.json"), JSON.stringify(summary, null, 2));
fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      pass: "01B-R3A2",
      title: "Orthographic Closed-Loop Circuit Reconstruction",
      status: "IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_VISUAL_REVIEW",
      starting_staging_head: "3626bd3ac2b2d9b6b8b14df92350f12a681ec4d7",
      preview_port: 4338,
      george_code_copied: false,
      screenshots,
      errors,
    },
    null,
    2
  )
);

console.log(JSON.stringify({ errors, counts: {
  fullpage: summary.public_fullpage_count,
  responsive: summary.responsive_count,
  crops: summary.crop_count,
  compares: summary.compare_count,
} }, null, 2));
if (errors.length) {
  console.error("CAPTURE_FAILED");
  process.exitCode = 1;
} else console.log("CAPTURE_OK");
await browser.close();
