/**
 * Geometry validation for pure-SVG diagram compositions.
 * Catches clipping/coordinate failures before screenshot capture.
 */
import { chromium } from "playwright";

const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4335";
const routes = ["/", "/verification", "/staging-diagram-system"];
const viewports = [
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1024, h: 768 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];

const browser = await chromium.launch();
const page = await browser.newPage();
const failures = [];
const results = [];

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.w, height: vp.h });
  for (const route of routes) {
    await page.goto(base + route + (route === "/" ? "" : "/"), {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    const report = await page.evaluate(({ route, viewport }) => {
      const issues = [];
      const svgs = [...document.querySelectorAll(".psvg svg")].filter((svg) => {
        const style = getComputedStyle(svg);
        return style.display !== "none" && style.visibility !== "hidden";
      });

      const ids = [];
      for (const svg of svgs) {
        const viewBox = svg.getAttribute("viewBox");
        if (!viewBox) issues.push(`${route}@${viewport}: missing viewBox`);
        const box = svg.getBoundingClientRect();
        if (box.width < 8 || box.height < 8) {
          issues.push(`${route}@${viewport}: zero/near-zero SVG size`);
        }
        if (svg.querySelector("foreignObject")) {
          issues.push(`${route}@${viewport}: foreignObject present`);
        }
        for (const path of svg.querySelectorAll("path[d]")) {
          if (/NaN|undefined/i.test(path.getAttribute("d") || "")) {
            issues.push(`${route}@${viewport}: NaN path`);
          }
        }
        for (const el of svg.querySelectorAll("[id]")) {
          const id = el.getAttribute("id");
          if (!id) continue;
          if (ids.includes(id)) issues.push(`${route}@${viewport}: duplicate id ${id}`);
          ids.push(id);
        }
        for (const text of svg.querySelectorAll("text")) {
          const fs = parseFloat(getComputedStyle(text).fontSize || "0");
          // SVG CSS font sizes may be absolute; skip tiny port labels intentionally under 12
          if (fs > 0 && fs < 11) {
            issues.push(`${route}@${viewport}: text font-size ${fs}px below threshold`);
          }
          const tb = text.getBoundingClientRect();
          const sb = svg.getBoundingClientRect();
          if (tb.right > sb.right + 2 || tb.left < sb.left - 2 || tb.bottom > sb.bottom + 2) {
            // soft warn only for major overflow
            if (tb.width > 4 && tb.height > 4) {
              issues.push(
                `${route}@${viewport}: text may extend outside SVG (${(text.textContent || "").slice(0, 40)})`
              );
            }
          }
        }
      }

      if (document.querySelector(".psvg-gts ol, .psvg-ves ol, .psvg-osc ol.hero-interim-flow")) {
        issues.push(`${route}@${viewport}: ordered-list fallback detected inside diagram`);
      }

      return {
        route,
        viewport,
        visibleSvgCount: svgs.length,
        issues,
      };
    }, { route, viewport: `${vp.w}x${vp.h}` });

    results.push(report);
    failures.push(...report.issues);
  }
}

console.log(JSON.stringify({ results, failures }, null, 2));
if (failures.length) {
  console.error(`GEOMETRY_VALIDATION_FAILED (${failures.length})`);
  process.exitCode = 1;
} else {
  console.log("GEOMETRY_VALIDATION_OK");
}
await browser.close();
