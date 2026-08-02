import { chromium } from "playwright";

const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4341";
const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 });

const report = await page.evaluate(() => {
  const h1 = document.querySelectorAll("h1");
  const hero = document.querySelector(".hero-split--home");
  const actions = [...(hero?.querySelectorAll(".page-actions a") || [])];
  const img = document.querySelector(".hero-approved-diagram img");
  const lines = [...document.querySelectorAll(".hero-split--home .hero-line")];
  const copy = document.querySelector(".hero-split-copy")?.getBoundingClientRect();
  const visual = document.querySelector(".hero-split-visual")?.getBoundingClientRect();
  const sameRow = copy && visual && copy.bottom > visual.top + 20 && copy.top < visual.bottom - 20;
  const overlap = sameRow && lines.some((el) => {
    const end = el.getBoundingClientRect().left + el.scrollWidth;
    return end > visual.left + 2;
  });
  return {
    h1Count: h1.length,
    actionCount: actions.length,
    actionHrefs: actions.map((a) => a.getAttribute("href")),
    hasVerificationInHero: actions.some((a) => (a.getAttribute("href") || "").includes("/verification")),
    imgSrc: img?.getAttribute("src") || null,
    imgW: img ? Math.round(img.getBoundingClientRect().width) : 0,
    imgH: img ? Math.round(img.getBoundingClientRect().height) : 0,
    naturalW: img?.naturalWidth || 0,
    naturalH: img?.naturalHeight || 0,
    overlap,
    pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    pageClass: document.querySelector("main#content")?.className || "",
  };
});

if (report.h1Count !== 1) errors.push(`h1=${report.h1Count}`);
if (report.actionCount !== 2) errors.push(`hero actions=${report.actionCount}`);
if (report.hasVerificationInHero) errors.push("hero still links to /verification");
if (!report.imgSrc?.includes("beaconguard-governed-transaction")) errors.push("missing approved diagram");
if (report.naturalW !== 1672 || report.naturalH !== 941) {
  errors.push(`intrinsic ${report.naturalW}x${report.naturalH}`);
}
if (report.overlap) errors.push("hero text/diagram overlap");
if (report.pageOverflow) errors.push("page overflow at 1440");
if (!report.pageClass.includes("page-home")) errors.push("missing page-home");

console.log(JSON.stringify({ pass: errors.length === 0, report, errors }, null, 2));
await browser.close();
if (errors.length) process.exit(1);
console.log("HERO_LAYOUT_PASS");
