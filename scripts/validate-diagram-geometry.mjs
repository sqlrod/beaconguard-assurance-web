/**
 * Geometry validation for pure-SVG diagram compositions.
 * Catches clipping/coordinate failures before screenshot capture.
 */
import { chromium } from "playwright";

const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4336";
const routes = ["/", "/verification", "/staging-diagram-system", "/staging-control-fabric"];
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
          if (fs > 0 && fs < 12) {
            issues.push(`${route}@${viewport}: text font-size ${fs}px below 12px (${(text.textContent || "").slice(0, 32)})`);
          }
          const tb = text.getBoundingClientRect();
          const sb = svg.getBoundingClientRect();
          if (tb.right > sb.right + 3 || tb.left < sb.left - 3 || tb.bottom > sb.bottom + 3) {
            if (tb.width > 4 && tb.height > 4) {
              issues.push(
                `${route}@${viewport}: text may extend outside SVG (${(text.textContent || "").slice(0, 40)})`
              );
            }
          }
        }

        // Owner-node containment for labeled texts
        for (const owned of svg.querySelectorAll("[data-owner-node]")) {
          const ownerId = owned.getAttribute("data-owner-node");
          const owner = svg.querySelector(`[data-node-id="${ownerId}"]`);
          if (!owner) continue;
          const ob = owner.getBoundingClientRect();
          const tb = owned.getBoundingClientRect();
          if (tb.right > ob.right + 4 || tb.left < ob.left - 4 || tb.bottom > ob.bottom + 4 || tb.top < ob.top - 4) {
            issues.push(`${route}@${viewport}: text outside owner node ${ownerId}`);
          }
        }

        // Label plate containment
        for (const plateGroup of svg.querySelectorAll('[data-label-plate="true"]')) {
          const plate = plateGroup.querySelector("rect");
          const label = plateGroup.querySelector("text");
          if (!plate || !label) continue;
          const pb = plate.getBoundingClientRect();
          const lb = label.getBoundingClientRect();
          if (lb.right > pb.right + 3 || lb.left < pb.left - 3 || lb.bottom > pb.bottom + 3 || lb.top < pb.top - 3) {
            issues.push(
              `${route}@${viewport}: label plate overflow (${(label.textContent || "").slice(0, 32)})`
            );
          }
        }
      }

      if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) {
        issues.push(`${route}@${viewport}: horizontal page overflow`);
      }

      if (document.querySelector(".psvg-gts ol, .psvg-ves ol, .psvg-cf ol, .psvg-osc ol.hero-interim-flow")) {
        issues.push(`${route}@${viewport}: ordered-list fallback detected inside diagram`);
      }

      // Control Fabric must remain graphical (no list fallback)
      if (route.includes("staging-control-fabric")) {
        const cf = document.querySelector(".psvg-cf");
        if (cf && !cf.querySelector("svg path.psvg-path")) {
          issues.push(`${route}@${viewport}: control fabric missing path geometry`);
        }
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
