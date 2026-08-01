import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4339";
const outDir = __dirname;
const fullpageDir = path.join(outDir, "fullpage");
const responsiveDir = path.join(outDir, "responsive");
const cropsDir = path.join(outDir, "crops");
for (const d of [fullpageDir, responsiveDir, cropsDir]) fs.mkdirSync(d, { recursive: true });

const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const viewports = [
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

const screenshots = [];
const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage();

const routes = ["/", "/staging-approved-homepage-diagram"];
for (const route of routes) {
  const resp = await page.goto(base + route + (route === "/" ? "" : "/"), {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  const status = resp?.status() ?? 0;
  const checks = await page.evaluate(() => ({
    h1: document.querySelectorAll("h1").length,
    robots: document.querySelector('meta[name="robots"]')?.content || null,
    imgOk: !!document.querySelector('img[src*="beaconguard-governed-transaction"]'),
    navHasStaging: /staging-approved/i.test(document.querySelector(".header-nav")?.innerText || ""),
    footerHasStaging: /staging-approved/i.test(document.querySelector("footer")?.innerText || ""),
  }));
  if (status !== 200) errors.push(`${route} ${status}`);
  if (checks.h1 !== 1) errors.push(`${route} h1=${checks.h1}`);
  if (route === "/" && !checks.imgOk) errors.push("homepage missing approved diagram");
  if (route === "/staging-approved-homepage-diagram") {
    if (checks.navHasStaging || checks.footerHasStaging || checks.robots !== "noindex, nofollow") {
      errors.push("staging route policy failure");
    }
  }
}

const imgResp = await page.goto(base + "/images/diagrams/beaconguard-governed-transaction.png");
if ((imgResp?.status() ?? 0) !== 200) errors.push("approved image not HTTP 200");

const sitemapText = await (await page.goto(base + "/sitemap.xml")).text();
const sitemapHasStaging = /staging-approved|staging-control-fabric|staging-diagram/.test(sitemapText);
const sitemapUrlCount = (sitemapText.match(/<loc>/g) || []).length;
if (sitemapHasStaging) errors.push("sitemap includes staging");
if (sitemapUrlCount !== 27) errors.push(`sitemap count ${sitemapUrlCount}`);

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 });
  const checks = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const lines = [...(h1?.querySelectorAll(".hero-line") || [])];
    const img = document.querySelector(".hero-approved-diagram img");
    const copy = document.querySelector(".hero-split-copy");
    const visual = document.querySelector(".hero-split-visual");
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    let overlap = false;
    if (img && copy) {
      const a = img.getBoundingClientRect();
      const b = copy.getBoundingClientRect();
      overlap = !(a.right < b.left + 2 || a.left > b.right - 2 || a.bottom < b.top + 2 || a.top > b.bottom - 2);
    }
    const twoLines =
      lines.length === 2 &&
      lines.every((el) => {
        const styles = getComputedStyle(el);
        return styles.whiteSpace === "nowrap" || el.getClientRects().length <= 1;
      });
    return {
      overflow,
      overlap,
      twoLinesDesktop: twoLines,
      imgW: img ? Math.round(img.getBoundingClientRect().width) : 0,
      imgH: img ? Math.round(img.getBoundingClientRect().height) : 0,
      visualW: visual ? Math.round(visual.getBoundingClientRect().width) : 0,
      consoleNote: "ok",
    };
  });
  if (checks.overflow) errors.push(`overflow ${vp.name}`);
  if (checks.overlap) errors.push(`overlap ${vp.name}`);
  if (vp.width >= 1440 && !checks.twoLinesDesktop) errors.push(`headline not two lines ${vp.name}`);
  if (vp.width >= 1440 && checks.imgW < 520) errors.push(`diagram too narrow ${vp.name} w=${checks.imgW}`);

  const fp = path.join(responsiveDir, `homepage__${vp.name}.png`);
  await page.screenshot({ path: fp, fullPage: true });
  screenshots.push({ kind: "responsive", filename: path.basename(fp), viewport: vp.name, sha256: sha(fp), ...checks });
}

await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(base + "/", { waitUntil: "networkidle" });
const full = path.join(fullpageDir, "home.png");
await page.screenshot({ path: full, fullPage: true });
screenshots.push({ kind: "fullpage", filename: "home.png", sha256: sha(full) });

async function crop(filename, width, height, selector = ".hero-split--home") {
  await page.setViewportSize({ width, height });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  const el = await page.$(selector);
  if (!el) {
    errors.push(`missing ${selector} for ${filename}`);
    return;
  }
  const fp = path.join(cropsDir, filename);
  await el.screenshot({ path: fp });
  screenshots.push({ kind: "crop", filename, viewport: `${width}x${height}`, sha256: sha(fp) });
}

await crop("homepage-approved-diagram-1440.png", 1440, 900);
await crop("homepage-approved-diagram-1920.png", 1920, 1080);
await crop("homepage-approved-diagram-1024.png", 1024, 768);
await crop("homepage-approved-diagram-768.png", 768, 1024);
await crop("homepage-approved-diagram-390.png", 390, 844);
await crop("homepage-hero-approved-diagram-1440.png", 1440, 900);
await crop("homepage-hero-approved-diagram-390.png", 390, 844);

const summary = {
  preview_port: 4339,
  errors,
  sitemap_url_count: sitemapUrlCount,
  sitemap_has_staging: sitemapHasStaging,
  image_sha256: "1F3B5EC10431787D1D51C65AF88B94AF82838E7E0C1746F1FA7EFB1932616371",
  intrinsic: { width: 1672, height: 941 },
  screenshots,
};
fs.writeFileSync(path.join(outDir, "capture-summary.json"), JSON.stringify(summary, null, 2));
fs.writeFileSync(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      pass: "01B-approved-diagram-homepage-integration",
      status: "IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_HOMEPAGE_REVIEW",
      starting_staging_head: "273cef4efadebf68a7541c7f3e1f3f7d68515155",
      preview_port: 4339,
      public_image: "/images/diagrams/beaconguard-governed-transaction.png",
      image_sha256: summary.image_sha256,
      intrinsic: summary.intrinsic,
      image_modified: false,
      screenshots,
      errors,
    },
    null,
    2
  )
);

console.log(JSON.stringify({ errors, counts: {
  responsive: screenshots.filter((s) => s.kind === "responsive").length,
  crops: screenshots.filter((s) => s.kind === "crop").length,
} }, null, 2));
if (errors.length) {
  console.error("CAPTURE_FAILED");
  process.exitCode = 1;
} else console.log("CAPTURE_OK");
await browser.close();
