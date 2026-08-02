import { chromium } from "playwright";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4344";
const expectedPngSha =
  "EDA45754A655E61949F3D1A15C903416B6E1308E3D25EE922FB15A2FBD86E848";
const sourcePath = path.join(root, "Verification Diagram.png");
const publicPath = path.join(
  root,
  "public/images/diagrams/verification/beaconguard-evidence-centered-investigation.png"
);

const sha = (p) =>
  crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex").toUpperCase();

const sourceSha = fs.existsSync(sourcePath) ? sha(sourcePath) : null;
const publicSha = sha(publicPath);
const errors = [];
const metrics = [];

if (publicSha !== expectedPngSha) {
  errors.push(`public hash mismatch ${publicSha}`);
}
if (sourceSha && sourceSha !== publicSha) {
  errors.push(`source/public hash mismatch source=${sourceSha} public=${publicSha}`);
}

const browser = await chromium.launch();
const page = await browser.newPage();

const httpChecks = [];
for (const route of [
  "/verification",
  "/images/diagrams/verification/beaconguard-evidence-centered-investigation.png",
]) {
  const res = await page.request.get(base + route);
  httpChecks.push({ route, status: res.status() });
  if (res.status() !== 200) errors.push(`HTTP ${res.status()} for ${route}`);
}

const requiredCapabilities = [
  "Decision Explorer",
  "Executive Reporting",
  "Deterministic Reconstruction",
  "Source Evidence",
  "Replay Verification",
  "Verifiable Export",
  "AI-Assisted Insights",
];

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
  await page.goto(base + "/verification", {
    waitUntil: "networkidle",
    timeout: 60000,
  });

  const m = await page.evaluate((viewport) => {
    const hero = document.querySelector(".verification-hero");
    const copy = document.querySelector(".verification-hero-copy");
    const diagram = document.querySelector(".verification-hero-diagram");
    const img = document.querySelector(".verification-hero-diagram img");
    const h1 = document.querySelector(".verification-hero h1");
    const actions = [...(copy?.querySelectorAll(".verification-hero-actions a") || [])];
    const ctaRow = document.querySelector(".verification-hero-actions");
    const cs = hero ? getComputedStyle(hero) : null;
    const cr = copy?.getBoundingClientRect();
    const dr = diagram?.getBoundingClientRect();
    const ir = img?.getBoundingClientRect();
    const ctaR = ctaRow?.getBoundingClientRect();
    const intersect =
      cr && dr
        ? !(cr.bottom <= dr.top + 1 || cr.top >= dr.bottom - 1)
        : true;
    const gapFromCta = ctaR && dr ? dr.top - ctaR.bottom : null;
    const bodyText = document.body.innerText || "";
    const caps = [
      "Decision Explorer",
      "Executive Reporting",
      "Deterministic Reconstruction",
      "Source Evidence",
      "Replay Verification",
      "Verifiable Export",
      "AI-Assisted Insights",
    ];
    const aiCard = document.querySelector(
      ".verify-capability-card--non-authoritative"
    );
    const naturalRatio = img?.naturalHeight
      ? img.naturalWidth / img.naturalHeight
      : null;
    const renderedRatio = ir && ir.height ? ir.width / ir.height : null;
    return {
      viewport,
      hasHero: !!hero,
      hasSplitVisual: !!document.querySelector(".hero-split-visual"),
      hasOldComponent:
        !!document.querySelector(".psvg-ves") ||
        !!document.querySelector("verification-executive-summary") ||
        bodyText.includes("VerificationExecutiveSummary"),
      h1Count: document.querySelectorAll("h1").length,
      h1Text: h1?.textContent?.trim() || "",
      copyTop: cr ? Math.round(cr.top) : null,
      copyBottom: cr ? Math.round(cr.bottom) : null,
      diagramTop: dr ? Math.round(dr.top) : null,
      diagramWidth: dr ? Math.round(dr.width) : null,
      imgWidth: ir ? Math.round(ir.width) : null,
      imgHeight: ir ? Math.round(ir.height) : null,
      ctaBottom: ctaR ? Math.round(ctaR.bottom) : null,
      gapFromCtaPx: gapFromCta != null ? Math.round(gapFromCta) : null,
      intersect,
      copyAboveDiagram: cr && dr ? cr.bottom <= dr.top + 1 : false,
      border: cs ? `${cs.borderTopWidth} ${cs.borderTopStyle}` : null,
      radius: cs?.borderRadius || null,
      boxShadow: cs?.boxShadow || null,
      actionCount: actions.length,
      actionHrefs: actions.map((a) => a.getAttribute("href")),
      textAlignCopy: copy ? getComputedStyle(copy).textAlign : null,
      textAlignH1: h1 ? getComputedStyle(h1).textAlign : null,
      actionsJustify: ctaRow
        ? getComputedStyle(ctaRow).justifyContent
        : null,
      naturalW: img?.naturalWidth || 0,
      naturalH: img?.naturalHeight || 0,
      naturalRatio,
      renderedRatio,
      overflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      hasCapabilitySection: !!document.querySelector(".verify-capability-grid"),
      capabilityHits: caps.filter((c) => bodyText.includes(c)),
      aiNonAuthoritative:
        !!aiCard &&
        (aiCard.textContent || "").includes("Non-authoritative"),
      gridColumns: document.querySelector(".verify-capability-grid")
        ? getComputedStyle(
            document.querySelector(".verify-capability-grid")
          ).gridTemplateColumns
        : null,
    };
  }, vp);

  metrics.push(m);

  if (!m.hasHero) errors.push(`${vp.w}: missing verification-hero`);
  if (m.hasSplitVisual) errors.push(`${vp.w}: hero-split-visual still present`);
  if (m.hasOldComponent) errors.push(`${vp.w}: old diagram component rendered`);
  if (m.h1Count !== 1) errors.push(`${vp.w}: h1 count ${m.h1Count}`);
  if (m.h1Text !== "Investigate decisions without changing authority.") {
    errors.push(`${vp.w}: unexpected H1 "${m.h1Text}"`);
  }
  if (!m.copyAboveDiagram) errors.push(`${vp.w}: copy not above diagram`);
  if (m.intersect) errors.push(`${vp.w}: copy/diagram intersect`);
  if (vp.w >= 1280 && (m.gapFromCtaPx == null || m.gapFromCtaPx < 40)) {
    errors.push(`${vp.w}: CTA-to-diagram gap ${m.gapFromCtaPx} < 40`);
  }
  if (vp.w === 1440 && m.diagramWidth < 1000) {
    errors.push(`${vp.w}: diagram width ${m.diagramWidth} < 1000`);
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
  if (m.actionCount !== 2) errors.push(`${vp.w}: CTA count ${m.actionCount}`);
  if (m.border && !m.border.startsWith("0px")) {
    errors.push(`${vp.w}: hero border ${m.border}`);
  }
  if (m.radius && m.radius !== "0px") {
    errors.push(`${vp.w}: hero radius ${m.radius}`);
  }
  if (m.boxShadow && m.boxShadow !== "none") {
    errors.push(`${vp.w}: hero shadow`);
  }
  if (m.overflow) errors.push(`${vp.w}: horizontal overflow`);
  if (m.naturalW !== 1672 || m.naturalH !== 941) {
    errors.push(`${vp.w}: intrinsic ${m.naturalW}x${m.naturalH}`);
  }
  if (m.textAlignCopy && m.textAlignCopy !== "left" && m.textAlignCopy !== "start") {
    errors.push(`${vp.w}: copy text-align ${m.textAlignCopy}`);
  }
  if (m.textAlignH1 && m.textAlignH1 !== "left" && m.textAlignH1 !== "start") {
    errors.push(`${vp.w}: h1 text-align ${m.textAlignH1}`);
  }
  if (
    m.actionsJustify &&
    m.actionsJustify !== "flex-start" &&
    m.actionsJustify !== "start" &&
    m.actionsJustify !== "left"
  ) {
    errors.push(`${vp.w}: CTA justify ${m.actionsJustify}`);
  }
  if (!m.hasCapabilitySection) errors.push(`${vp.w}: missing capability grid`);
  if (m.capabilityHits.length !== requiredCapabilities.length) {
    errors.push(
      `${vp.w}: capabilities ${m.capabilityHits.length}/${requiredCapabilities.length}`
    );
  }
  if (!m.aiNonAuthoritative) {
    errors.push(`${vp.w}: AI-Assisted Insights missing Non-authoritative`);
  }
}

const result = {
  pass: errors.length === 0,
  sourceSha,
  publicSha,
  expectedPngSha,
  httpChecks,
  errors,
  metrics,
};

console.log(JSON.stringify(result, null, 2));
await browser.close();

if (errors.length) {
  console.error("VERIFICATION_LAYOUT_FAIL");
  process.exit(1);
}
console.log("VERIFICATION_LAYOUT_PASS");
