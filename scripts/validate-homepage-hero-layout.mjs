import { chromium } from "playwright";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4342";
const expectedPngSha =
  "1F3B5EC10431787D1D51C65AF88B94AF82838E7E0C1746F1FA7EFB1932616371";
const pngPath = path.join(
  root,
  "public/images/diagrams/beaconguard-governed-transaction.png"
);
const pngSha = crypto
  .createHash("sha256")
  .update(fs.readFileSync(pngPath))
  .digest("hex")
  .toUpperCase();

const errors = [];
const metrics = [];
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
  await page.goto(base + "/", { waitUntil: "networkidle", timeout: 60000 });

  const m = await page.evaluate((viewport) => {
    const hero = document.querySelector(".enterprise-hero");
    const copy = document.querySelector(".enterprise-hero-copy");
    const diagram = document.querySelector(".enterprise-hero-diagram");
    const img = document.querySelector(".enterprise-hero-diagram img");
    const h1 = document.querySelector(".enterprise-hero h1");
    const lines = [...document.querySelectorAll(".enterprise-hero .hero-line")];
    const actions = [...(hero?.querySelectorAll(".page-actions a") || [])];
    const cs = hero ? getComputedStyle(hero) : null;
    const cr = copy?.getBoundingClientRect();
    const dr = diagram?.getBoundingClientRect();
    const ir = img?.getBoundingClientRect();
    const intersect =
      cr && dr
        ? !(cr.bottom <= dr.top + 1 || cr.top >= dr.bottom - 1)
        : true;
    const gap = cr && dr ? dr.top - cr.bottom : null;
    const twoLines =
      lines.length === 2 &&
      lines.every((el) => {
        const style = getComputedStyle(el);
        return style.whiteSpace === "nowrap" || el.getClientRects().length <= 1;
      });
    const textAligns = {
      hero: cs?.textAlign,
      copy: copy ? getComputedStyle(copy).textAlign : null,
      h1: h1 ? getComputedStyle(h1).textAlign : null,
      eyebrow: document.querySelector(".enterprise-hero .hero-eyebrow")
        ? getComputedStyle(document.querySelector(".enterprise-hero .hero-eyebrow")).textAlign
        : null,
      actions: document.querySelector(".enterprise-hero .page-actions")
        ? getComputedStyle(document.querySelector(".enterprise-hero .page-actions")).justifyContent
        : null,
    };
    const naturalRatio = img?.naturalHeight
      ? img.naturalWidth / img.naturalHeight
      : null;
    const renderedRatio = ir && ir.height ? ir.width / ir.height : null;
    return {
      viewport,
      hasEnterpriseHero: !!hero,
      singleColumn: !!hero && !document.querySelector(".enterprise-hero .hero-split-visual"),
      copyTop: cr ? Math.round(cr.top) : null,
      copyBottom: cr ? Math.round(cr.bottom) : null,
      copyWidth: cr ? Math.round(cr.width) : null,
      diagramTop: dr ? Math.round(dr.top) : null,
      diagramWidth: dr ? Math.round(dr.width) : null,
      imgWidth: ir ? Math.round(ir.width) : null,
      imgHeight: ir ? Math.round(ir.height) : null,
      gapPx: gap != null ? Math.round(gap) : null,
      intersect,
      copyAboveDiagram: cr && dr ? cr.bottom <= dr.top + 1 : false,
      border: cs ? `${cs.borderTopWidth} ${cs.borderTopStyle}` : null,
      radius: cs?.borderRadius || null,
      boxShadow: cs?.boxShadow || null,
      actionCount: actions.length,
      actionHrefs: actions.map((a) => a.getAttribute("href")),
      hasVerification: actions.some((a) =>
        (a.getAttribute("href") || "").includes("/verification")
      ),
      twoLinesDesktop: twoLines,
      textAligns,
      naturalW: img?.naturalWidth || 0,
      naturalH: img?.naturalHeight || 0,
      naturalRatio,
      renderedRatio,
      overflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      gridColumns: hero ? getComputedStyle(hero).gridTemplateColumns : null,
    };
  }, vp);

  metrics.push(m);

  if (!m.hasEnterpriseHero) errors.push(`${vp.w}: missing enterprise-hero`);
  if (!m.singleColumn) errors.push(`${vp.w}: not single-column vertical hero`);
  if (!m.copyAboveDiagram) errors.push(`${vp.w}: copy not above diagram`);
  if (m.intersect) errors.push(`${vp.w}: copy/diagram intersect`);
  if (vp.w >= 1280 && (m.gapPx == null || m.gapPx < 40)) {
    errors.push(`${vp.w}: diagram gap ${m.gapPx} < 40`);
  }
  if (vp.w === 1440 && m.diagramWidth < 950) {
    errors.push(`${vp.w}: diagram width ${m.diagramWidth} < 950`);
  }
  if (vp.w === 1920 && m.diagramWidth < 1100) {
    errors.push(`${vp.w}: diagram width ${m.diagramWidth} < 1100`);
  }
  if (
    m.naturalRatio &&
    m.renderedRatio &&
    Math.abs(m.naturalRatio - m.renderedRatio) / m.naturalRatio > 0.005
  ) {
    errors.push(`${vp.w}: aspect drift`);
  }
  if ((vp.w === 1440 || vp.w === 1920) && !m.twoLinesDesktop) {
    errors.push(`${vp.w}: H1 not two lines`);
  }
  if (m.actionCount !== 2) errors.push(`${vp.w}: CTA count ${m.actionCount}`);
  if (m.hasVerification) errors.push(`${vp.w}: hero has /verification`);
  if (m.border && !m.border.startsWith("0px")) {
    errors.push(`${vp.w}: hero border ${m.border}`);
  }
  if (m.radius && m.radius !== "0px") errors.push(`${vp.w}: hero radius ${m.radius}`);
  if (m.boxShadow && m.boxShadow !== "none") {
    errors.push(`${vp.w}: hero shadow`);
  }
  if (m.overflow) errors.push(`${vp.w}: horizontal overflow`);
  if (m.naturalW !== 1672 || m.naturalH !== 941) {
    errors.push(`${vp.w}: intrinsic ${m.naturalW}x${m.naturalH}`);
  }
  for (const [k, v] of Object.entries(m.textAligns)) {
    if (k === "actions") {
      if (v && v !== "flex-start" && v !== "start" && v !== "left") {
        errors.push(`${vp.w}: CTA alignment ${v}`);
      }
    } else if (v && v !== "left" && v !== "start") {
      errors.push(`${vp.w}: ${k} text-align ${v}`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      pass: errors.length === 0,
      pngSha,
      expectedPngSha,
      errors,
      metrics,
    },
    null,
    2
  )
);

await browser.close();
if (errors.length) {
  console.error("HERO_LAYOUT_FAIL");
  process.exit(1);
}
console.log("HERO_LAYOUT_PASS");
