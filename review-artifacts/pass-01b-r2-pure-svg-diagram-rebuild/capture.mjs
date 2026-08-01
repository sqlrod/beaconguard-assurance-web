import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4335";
const outDir = __dirname;
const fullpageDir = path.join(outDir, "fullpage");
const responsiveDir = path.join(outDir, "responsive");
const cropsDir = path.join(outDir, "crops");
const compareDir = path.join(outDir, "compare");
for (const d of [fullpageDir, responsiveDir, cropsDir, compareDir]) fs.mkdirSync(d, { recursive: true });

const prior = path.resolve(
  __dirname,
  "../pass-01b-r1-enterprise-diagram-refinement/crops"
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

async function sideBySide(leftPath, rightPath, outPath, labelL = "R1", labelR = "R2") {
  // Create a simple comparison by writing a tiny HTML and screenshotting, or stitch via canvas in page
  const html = `<!doctype html><html><body style="margin:0;background:#0b1220;display:flex;gap:8px;padding:8px;font-family:sans-serif;color:#fff">
  <div><div style="margin-bottom:4px">${labelL}</div><img id="a" src="file:///${leftPath.replace(/\\/g, "/")}" style="max-width:720px;height:auto;border:1px solid #334"/></div>
  <div><div style="margin-bottom:4px">${labelR}</div><img id="b" src="file:///${rightPath.replace(/\\/g, "/")}" style="max-width:720px;height:auto;border:1px solid #334"/></div>
  </body></html>`;
  const tmp = path.join(compareDir, `_tmp-${path.basename(outPath)}.html`);
  fs.writeFileSync(tmp, html);
  return tmp;
}

const browser = await chromium.launch();
const page = await browser.newPage();
const screenshots = [];
const errors = [];
const stagingRoute = "/staging-diagram-system";

for (const item of [...publicRoutes, { route: stagingRoute }]) {
  const resp = await page.goto(base + item.route + (item.route.endsWith("/") ? "" : "/"), {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  const status = resp?.status() ?? 0;
  const checks = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    robots: document.querySelector('meta[name="robots"]')?.content || null,
    navHasStaging: /staging-diagram/i.test(document.querySelector(".header-nav")?.innerText || ""),
    footerHasStaging: /staging-diagram/i.test(document.querySelector("footer")?.innerText || ""),
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    listFallback: !!document.querySelector(".psvg-gts ol:not(.visually-hidden), .psvg-ves ol:not(.visually-hidden)"),
  }));
  if (status !== 200) errors.push(`${item.route} ${status}`);
  if (checks.h1 !== 1) errors.push(`${item.route} h1=${checks.h1}`);
  if (checks.listFallback) errors.push(`${item.route} list fallback`);
  if (item.route === stagingRoute && (checks.navHasStaging || checks.footerHasStaging || checks.robots !== "noindex, nofollow")) {
    errors.push("staging route policy failure");
  }
}

const sitemapText = await (await page.goto(base + "/sitemap.xml")).text();
const sitemapHasStaging = /staging-diagram/.test(sitemapText);
const sitemapUrlCount = (sitemapText.match(/<loc>/g) || []).length;
if (sitemapHasStaging) errors.push("sitemap includes staging");

await page.setViewportSize({ width: 1440, height: 900 });
for (const item of publicRoutes) {
  await page.goto(base + item.route + (item.route === "/" ? "" : "/"), { waitUntil: "networkidle", timeout: 60000 });
  const fp = path.join(fullpageDir, item.filename);
  await page.screenshot({ path: fp, fullPage: true });
  screenshots.push({ route: item.route, filename: item.filename, kind: "fullpage", viewport: "1440x900", sha256: sha(fp) });
}

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(base + stagingRoute + "/", { waitUntil: "networkidle", timeout: 60000 });
  const filename = `staging-diagram-system__${vp.name}.png`;
  const fp = path.join(responsiveDir, filename);
  await page.screenshot({ path: fp, fullPage: true });
  screenshots.push({ route: stagingRoute, filename, kind: "responsive", viewport: vp.name, sha256: sha(fp) });
}

async function crop(route, selector, filename, w, h) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(base + route + (route === "/" ? "" : "/"), { waitUntil: "networkidle", timeout: 60000 });
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  const fp = path.join(cropsDir, filename);
  await loc.screenshot({ path: fp });
  screenshots.push({ route, filename, kind: "crop", viewport: `${w}x${h}`, sha256: sha(fp) });
  return fp;
}

const a1440 = await crop(stagingRoute, '#direction-a [data-diagram-direction="A"]', "direction-a-r2-1440.png", 1440, 900);
const a390 = await crop(stagingRoute, '#direction-a [data-diagram-direction="A"]', "direction-a-r2-390.png", 390, 844);
const b1440 = await crop(stagingRoute, '#direction-b [data-diagram-direction="B"]', "direction-b-r2-1440.png", 1440, 900);
const b390 = await crop(stagingRoute, '#direction-b [data-diagram-direction="B"]', "direction-b-r2-390.png", 390, 844);
const c1440 = await crop(stagingRoute, '#direction-c [data-diagram-direction="C"]', "direction-c-r2-1440.png", 1440, 900);
const c390 = await crop(stagingRoute, '#direction-c [data-diagram-direction="C"]', "direction-c-r2-390.png", 390, 844);
const h1440 = await crop("/", ".hero-split--home", "home-pure-svg-1440.png", 1440, 900);
const h390 = await crop("/", ".hero-split--home", "home-pure-svg-390.png", 390, 844);
const v1440 = await crop("/verification", ".hero-split--verify", "verification-pure-svg-1440.png", 1440, 900);
const v390 = await crop("/verification", ".hero-split--verify", "verification-pure-svg-390.png", 390, 844);

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/", { waitUntil: "networkidle" });
const overlap = await page.evaluate(() => {
  const lines = [...document.querySelectorAll(".hero-split--home .hero-line")];
  const visual = document.querySelector(".hero-split--home .hero-split-visual");
  const vr = visual.getBoundingClientRect();
  return lines.map((l) => {
    const r = l.getBoundingClientRect();
    return { text: l.textContent, overlaps: r.right > vr.left - 2 };
  });
});
if (overlap.some((o) => o.overlaps)) errors.push("homepage headline overlap");

const pairs = [
  ["direction-a-r1-1440.png", a1440, "direction-a-r1-vs-r2-1440.png"],
  ["direction-a-r1-390.png", a390, "direction-a-r1-vs-r2-390.png"],
  ["direction-b-r1-1440.png", b1440, "direction-b-r1-vs-r2-1440.png"],
  ["direction-b-r1-390.png", b390, "direction-b-r1-vs-r2-390.png"],
  ["direction-c-r1-1440.png", c1440, "direction-c-r1-vs-r2-1440.png"],
  ["direction-c-r1-390.png", c390, "direction-c-r1-vs-r2-390.png"],
  ["home-executive-1440.png", h1440, "home-r1-vs-r2-1440.png"],
  ["home-executive-390.png", h390, "home-r1-vs-r2-390.png"],
  ["verification-executive-1440.png", v1440, "verification-r1-vs-r2-1440.png"],
  ["verification-executive-390.png", v390, "verification-r1-vs-r2-390.png"],
];

for (const [leftName, rightPath, outName] of pairs) {
  const leftPath = path.join(prior, leftName);
  if (!fs.existsSync(leftPath)) continue;
  const tmp = await sideBySide(leftPath, rightPath, path.join(compareDir, outName));
  await page.goto("file:///" + tmp.replace(/\\/g, "/"));
  await page.waitForTimeout(200);
  const out = path.join(compareDir, outName);
  await page.screenshot({ path: out, fullPage: true });
  screenshots.push({ route: "compare", filename: outName, kind: "compare", sha256: sha(out) });
  fs.unlinkSync(tmp);
}

const summary = {
  pass: "01b-r2-pure-svg-diagram-rebuild",
  preview_port: "4335",
  public_fullpage_count: screenshots.filter((s) => s.kind === "fullpage").length,
  responsive_count: screenshots.filter((s) => s.kind === "responsive").length,
  crop_count: screenshots.filter((s) => s.kind === "crop").length,
  compare_count: screenshots.filter((s) => s.kind === "compare").length,
  sitemap_url_count: sitemapUrlCount,
  sitemap_has_staging: sitemapHasStaging,
  home_overlap: overlap,
  validation_errors: errors,
  visual_acceptance: "IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_VISUAL_REVIEW",
  captured_at: new Date().toISOString(),
};

fs.writeFileSync(path.join(outDir, "capture-summary.json"), JSON.stringify(summary, null, 2));
fs.writeFileSync(path.join(outDir, "_screenshots-raw.json"), JSON.stringify(screenshots, null, 2));
console.log(JSON.stringify(summary, null, 2));
process.exitCode = errors.length ? 1 : 0;
console.log(errors.length ? "VALIDATION_FAILED" : "VALIDATION_OK");
await browser.close();
