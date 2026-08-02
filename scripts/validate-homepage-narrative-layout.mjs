import { chromium } from "playwright";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4341";
const expectedPngSha =
  "1F3B5EC10431787D1D51C65AF88B94AF82838E7E0C1746F1FA7EFB1932616371";
const pngPath = path.join(
  root,
  "public/images/diagrams/beaconguard-governed-transaction.png"
);
const pngSha = crypto.createHash("sha256").update(fs.readFileSync(pngPath)).digest("hex").toUpperCase();

const errors = [];
const measures = [];
const browser = await chromium.launch();
const page = await browser.newPage();

if (pngSha !== expectedPngSha) errors.push(`png hash mismatch ${pngSha}`);

const viewports = [
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1280, h: 900 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.w, height: vp.h });
  const resp = await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 });
  if ((resp?.status() || 0) !== 200) errors.push(`${vp.w} homepage not 200`);

  const m = await page.evaluate((viewport) => {
    const text = (el) => (el?.textContent || "").replace(/\s+/g, " ").trim();
    const h1 = document.querySelectorAll("h1");
    const h2s = [...document.querySelectorAll("h2")].map((el) => text(el));
    const gavVisible = h2s.filter((t) => t === "Govern · Authorize · Verify");
    const hero = document.querySelector(".hero-split--home");
    const heroActions = [...(hero?.querySelectorAll(".page-actions a") || [])];
    const bands = [...document.querySelectorAll(".home-band")];
    const inners = bands.map((b) => {
      const inner = b.querySelector(".home-band-inner");
      const r = inner?.getBoundingClientRect();
      const cs = inner ? getComputedStyle(b) : null;
      return {
        band: b.getAttribute("data-home-band"),
        innerLeft: r ? Math.round(r.left) : null,
        innerWidth: r ? Math.round(r.width) : null,
        border: cs?.borderTopWidth + " " + cs?.borderTopStyle,
        radius: cs?.borderRadius,
        boxShadow: cs?.boxShadow,
      };
    });
    const auth = document.querySelector(".bg-gav-column--authorize")?.getBoundingClientRect();
    const govern = document.querySelector(".bg-gav-column--govern")?.getBoundingClientRect();
    const verify = document.querySelector(".bg-gav-column--verify")?.getBoundingClientRect();
    const verifyBand = document.querySelector('[data-home-band="verification"]');
    const verifyLinks = [...(verifyBand?.querySelectorAll('a[href="/verification"]') || [])];
    const nav = document.querySelector(".header-nav")?.innerText || "";
    const img = document.querySelector(".hero-approved-diagram img");
    const ratio = img && img.naturalHeight ? img.naturalWidth / img.naturalHeight : null;
    const renderedRatio = img && img.getBoundingClientRect().height
      ? img.getBoundingClientRect().width / img.getBoundingClientRect().height
      : null;
    const order = bands.map((b) => b.getAttribute("data-home-band"));
    return {
      viewport,
      h1: h1.length,
      h2s,
      gavCount: gavVisible.length,
      heroActionCount: heroActions.length,
      heroHrefs: heroActions.map((a) => a.getAttribute("href")),
      heroHasVerification: heroActions.some((a) => (a.getAttribute("href") || "").includes("verification")),
      verifyBandHasVerification: verifyLinks.length > 0,
      bands: inners,
      order,
      authWider:
        auth && govern && verify
          ? auth.width + 8 >= govern.width && auth.width + 8 >= verify.width
          : viewport.w < 1100,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      navHasFinancial: /Financial/i.test(nav),
      naturalRatio: ratio,
      renderedRatio,
      hasRequiredSections: [
        "governed-transaction",
        "gav",
        "workflows",
        "verification",
        "controlled-evaluation",
      ].every((id) => order.includes(id)),
    };
  }, vp);

  measures.push(m);
  if (m.h1 !== 1) errors.push(`${vp.w}: h1=${m.h1}`);
  if (m.gavCount !== 1) errors.push(`${vp.w}: GAV heading count=${m.gavCount}`);
  if (m.heroActionCount !== 2) errors.push(`${vp.w}: hero actions=${m.heroActionCount}`);
  if (m.heroHasVerification) errors.push(`${vp.w}: hero has verification link`);
  if (!m.verifyBandHasVerification) errors.push(`${vp.w}: verification band missing /verification`);
  if (!m.hasRequiredSections) errors.push(`${vp.w}: missing required bands`);
  if (m.overflow) errors.push(`${vp.w}: horizontal overflow`);
  if (!m.navHasFinancial) errors.push(`${vp.w}: Financial missing from nav`);
  if (m.naturalRatio && m.renderedRatio && Math.abs(m.naturalRatio - m.renderedRatio) > 0.03) {
    errors.push(`${vp.w}: image aspect drift`);
  }
  for (const b of m.bands) {
    if (b.radius && b.radius !== "0px") errors.push(`${vp.w}: band ${b.band} radius ${b.radius}`);
    if (b.boxShadow && b.boxShadow !== "none") errors.push(`${vp.w}: band ${b.band} shadow`);
    // soft/emphasis may have border-top only; reject full enclosing borders
    if (b.border && /[2-9]px/.test(b.border.split(" ")[0]) && !b.border.includes("solid")) {
      errors.push(`${vp.w}: band ${b.band} heavy border ${b.border}`);
    }
  }
  if (vp.w >= 1280 && !m.authWider) errors.push(`${vp.w}: Authorize not wider`);
  if (vp.w >= 1280) {
    const lefts = m.bands.map((b) => b.innerLeft).filter((v) => v != null);
    const widths = m.bands.map((b) => b.innerWidth).filter((v) => v != null);
    const leftSpread = Math.max(...lefts) - Math.min(...lefts);
    const widthSpread = Math.max(...widths) - Math.min(...widths);
    if (leftSpread > 2) errors.push(`${vp.w}: inner left misalignment ${leftSpread}`);
    if (widthSpread > 2) errors.push(`${vp.w}: inner width misalignment ${widthSpread}`);
  }
}

// sitemap unchanged public count
const sitemap = await (await page.goto(base + "/sitemap.xml")).text();
const sitemapCount = (sitemap.match(/<loc>/g) || []).length;
if (sitemapCount !== 27) errors.push(`sitemap count ${sitemapCount}`);
if (/staging-/.test(sitemap)) errors.push("sitemap includes staging");

console.log(
  JSON.stringify(
    {
      pass: errors.length === 0,
      pngSha,
      expectedPngSha,
      sitemapCount,
      errors,
      measures,
    },
    null,
    2
  )
);

await browser.close();
if (errors.length) {
  console.error("NARRATIVE_LAYOUT_FAIL");
  process.exit(1);
}
console.log("NARRATIVE_LAYOUT_PASS");
