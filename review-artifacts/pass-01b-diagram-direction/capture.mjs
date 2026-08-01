import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4332";
const outDir = __dirname;
const fullpageDir = path.join(outDir, "fullpage");
const responsiveDir = path.join(outDir, "responsive");
const cropsDir = path.join(outDir, "crops");

for (const d of [fullpageDir, responsiveDir, cropsDir]) {
  fs.mkdirSync(d, { recursive: true });
}

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

const comparisonViewports = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

async function shotMeta(page, filePath) {
  const box = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  const stat = fs.statSync(filePath);
  return {
    ...box,
    bytes: stat.size,
    sha256: sha256File(filePath),
  };
}

const browser = await chromium.launch();
const page = await browser.newPage();
const validation = [];
const screenshots = [];
const errors = [];

// Validate routes
for (const item of [...publicRoutes, { route: "/staging-diagram-direction", filename: null }]) {
  const url = base + item.route + (item.route.endsWith("/") ? "" : "/");
  const resp = await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  const status = resp?.status() ?? 0;
  const checks = await page.evaluate(() => {
    const h1 = document.querySelectorAll("h1").length;
    const robots = document.querySelector('meta[name="robots"]')?.content || null;
    const navText = document.querySelector("nav.header-nav, .header-nav")?.innerText || "";
    const footerText = document.querySelector("footer")?.innerText || "";
    const logs = [];
    return {
      h1,
      robots,
      navHasStaging: /staging-diagram/i.test(navText),
      footerHasStaging: /staging-diagram/i.test(footerText),
      overflowX:
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      markerIds: [...document.querySelectorAll("marker[id]")].map((m) => m.id),
      svgIds: [...document.querySelectorAll("svg [id]")].map((n) => n.id),
    };
  });
  const dupMarkers = checks.markerIds.filter((id, i, a) => a.indexOf(id) !== i);
  const dupSvg = checks.svgIds.filter((id, i, a) => a.indexOf(id) !== i);
  validation.push({
    route: item.route,
    status,
    ...checks,
    dupMarkers,
    dupSvg,
  });
  if (status !== 200) errors.push(`${item.route} status ${status}`);
  if (checks.h1 !== 1) errors.push(`${item.route} h1 count ${checks.h1}`);
}

// Sitemap check
const sitemapResp = await page.goto(base + "/sitemap.xml", { waitUntil: "networkidle" });
const sitemapText = await page.locator("body").innerText();
const sitemapHasStaging = /staging-diagram-direction/.test(sitemapText);
const sitemapUrlCount = (sitemapText.match(/<loc>/g) || []).length;

// Fullpage public captures @ 1440x900
await page.setViewportSize({ width: 1440, height: 900 });
for (const item of publicRoutes) {
  const url = base + item.route + (item.route === "/" ? "" : "/");
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  const filePath = path.join(fullpageDir, item.filename);
  await page.screenshot({ path: filePath, fullPage: true });
  const meta = await shotMeta(page, filePath);
  screenshots.push({
    route: item.route,
    filename: item.filename,
    viewport: "1440x900",
    kind: "fullpage",
    image_width: 1440,
    image_height: Math.round(
      (await page.evaluate(() => document.documentElement.scrollHeight))
    ),
    ...meta,
  });
}

// Comparison responsive captures
for (const vp of comparisonViewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(base + "/staging-diagram-direction/", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  const filename = `staging-diagram-direction__${vp.name}.png`;
  const filePath = path.join(responsiveDir, filename);
  await page.screenshot({ path: filePath, fullPage: true });
  const meta = await shotMeta(page, filePath);
  screenshots.push({
    route: "/staging-diagram-direction",
    filename,
    viewport: vp.name,
    kind: "responsive",
    image_width: vp.width,
    ...meta,
  });
}

// Crops
async function crop(selector, filename, width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(base + "/staging-diagram-direction/", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  const loc = page.locator(selector).first();
  await loc.scrollIntoViewIfNeeded();
  const filePath = path.join(cropsDir, filename);
  await loc.screenshot({ path: filePath });
  screenshots.push({
    route: "/staging-diagram-direction",
    filename,
    viewport: `${width}x${height}`,
    kind: "crop",
    sha256: sha256File(filePath),
    bytes: fs.statSync(filePath).size,
  });
}

await crop('#direction-a [data-diagram-direction="A"]', "direction-a-1440.png", 1440, 900);
await crop('#direction-b [data-diagram-direction="B"]', "direction-b-1440.png", 1440, 900);
await crop('#direction-c [data-diagram-direction="C"]', "direction-c-1440.png", 1440, 900);
await crop('#direction-a [data-diagram-direction="A"]', "direction-a-390.png", 390, 844);
await crop('#direction-b [data-diagram-direction="B"]', "direction-b-390.png", 390, 844);
await crop('#direction-c [data-diagram-direction="C"]', "direction-c-390.png", 390, 844);

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.locator(".hero-split--home").screenshot({
  path: path.join(cropsDir, "home-interim-1440.png"),
});
screenshots.push({
  route: "/",
  filename: "home-interim-1440.png",
  viewport: "1440x900",
  kind: "crop",
  sha256: sha256File(path.join(cropsDir, "home-interim-1440.png")),
});

await page.goto(base + "/verification/", { waitUntil: "networkidle" });
await page.locator(".hero-split--verify").screenshot({
  path: path.join(cropsDir, "verification-interim-1440.png"),
});
screenshots.push({
  route: "/verification",
  filename: "verification-interim-1440.png",
  viewport: "1440x900",
  kind: "crop",
  sha256: sha256File(path.join(cropsDir, "verification-interim-1440.png")),
});

// Staging page specific checks
const staging = validation.find((v) => v.route === "/staging-diagram-direction");

const summary = {
  pass: "01b",
  preview_base: base,
  preview_port: "4332",
  public_fullpage_count: screenshots.filter((s) => s.kind === "fullpage").length,
  responsive_count: screenshots.filter((s) => s.kind === "responsive").length,
  crop_count: screenshots.filter((s) => s.kind === "crop").length,
  sitemap_has_staging: sitemapHasStaging,
  sitemap_status: sitemapResp?.status(),
  sitemap_url_count: sitemapUrlCount,
  staging_checks: staging,
  validation_errors: errors,
  overflow_routes: validation.filter((v) => v.overflowX).map((v) => v.route),
  nav_footer_staging_leak: validation.some((v) => v.navHasStaging || v.footerHasStaging),
  captured_at: new Date().toISOString(),
};

fs.writeFileSync(path.join(outDir, "capture-summary.json"), JSON.stringify(summary, null, 2));
fs.writeFileSync(
  path.join(outDir, "_screenshots-raw.json"),
  JSON.stringify(screenshots, null, 2)
);

console.log(JSON.stringify(summary, null, 2));
if (errors.length || sitemapHasStaging || summary.nav_footer_staging_leak) {
  console.error("VALIDATION_FAILED");
  process.exitCode = 1;
} else {
  console.log("VALIDATION_OK");
}

await browser.close();
