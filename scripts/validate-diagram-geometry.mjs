/**
 * Geometry validation for pure-SVG diagram compositions.
 * Pass 01B-R3A2: Control Fabric orthographic circuit assertions.
 */
import { chromium } from "playwright";

const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4338";
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
      const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;
      const overlaps = (a, b, pad = 1) =>
        !(a.right < b.left + pad || a.left > b.right - pad || a.bottom < b.top + pad || a.top > b.bottom - pad);

      const svgs = [...document.querySelectorAll(".psvg svg")].filter((svg) => {
        const style = getComputedStyle(svg);
        return style.display !== "none" && style.visibility !== "hidden";
      });

      const ids = [];
      for (const svg of svgs) {
        if (!svg.getAttribute("viewBox")) issues.push(`${route}@${viewport}: missing viewBox`);
        const box = svg.getBoundingClientRect();
        if (box.width < 8 || box.height < 8) issues.push(`${route}@${viewport}: zero/near-zero SVG size`);
        if (svg.querySelector("foreignObject")) issues.push(`${route}@${viewport}: foreignObject present`);

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
            issues.push(`${route}@${viewport}: text font-size ${fs}px below 12px`);
          }
          const tb = text.getBoundingClientRect();
          const sb = svg.getBoundingClientRect();
          if (tb.width > 4 && (tb.right > sb.right + 3 || tb.left < sb.left - 3 || tb.bottom > sb.bottom + 3)) {
            issues.push(`${route}@${viewport}: text may extend outside SVG (${(text.textContent || "").slice(0, 36)})`);
          }
        }

        // Plate containment is meaningful only at near-desktop rendered widths;
        // CSS px text on a downscaled SVG will intentionally exceed user-unit plates.
        if (box.width >= 700) {
          for (const plateGroup of svg.querySelectorAll('[data-label-plate="true"]')) {
            const plate = plateGroup.querySelector("rect");
            const label = plateGroup.querySelector("text");
            if (!plate || !label) continue;
            const pb = plate.getBoundingClientRect();
            const lb = label.getBoundingClientRect();
            if (lb.right > pb.right + 4 || lb.left < pb.left - 4 || lb.bottom > pb.bottom + 4 || lb.top < pb.top - 4) {
              issues.push(
                `${route}@${viewport}: label plate overflow (${(label.textContent || "").slice(0, 24)})`
              );
            }
          }
        }

        if (svg.classList.contains("psvg-desktop") && svg.closest(".psvg-cf--r3a2, .psvg-cf")) {
          const gates = [...svg.querySelectorAll('[data-cf-role="auth-gate"]')];
          if (gates.length >= 2) {
            const a = gates[0].querySelector("rect")?.getBBox();
            const b = gates[1].querySelector("rect")?.getBBox();
            if (a && b && (!near(a.width, b.width, 1) || !near(a.height, b.height, 1))) {
              issues.push(`${route}@${viewport}: auth gates unequal size`);
            }
          }

          const states = [...svg.querySelectorAll('[data-cf-role="app-state"] > rect')];
          if (states.length >= 3) {
            const boxes = states.map((r) => r.getBBox());
            if (
              !near(boxes[0].width, boxes[1].width, 1) ||
              !near(boxes[1].width, boxes[2].width, 1) ||
              !near(boxes[0].height, boxes[1].height, 1) ||
              !near(boxes[1].height, boxes[2].height, 1)
            ) {
              issues.push(`${route}@${viewport}: app states unequal size`);
            }
            const gap1 = boxes[1].y - (boxes[0].y + boxes[0].height);
            const gap2 = boxes[2].y - (boxes[1].y + boxes[1].height);
            if (!near(gap1, gap2, 2)) {
              issues.push(`${route}@${viewport}: app state gaps unequal`);
            }
          }

          // DENY terminals / barriers must not overlap gates or app/provider/sor nodes
          const terminals = [...svg.querySelectorAll("[data-terminal]")];
          const majorNodes = [
            ...gates,
            ...svg.querySelectorAll(
              '[data-node-id="enterprise-app"], [data-node-id="ai-provider"], [data-node-id="sor"], [data-cf-role="app-state"]'
            ),
          ];
          for (const t of terminals) {
            const texts = [...t.querySelectorAll("text")];
            const barriers = [...t.querySelectorAll("[data-barrier], line.psvg-cf-barrier")];
            const tbBoxes = [...texts, ...barriers].map((el) => el.getBoundingClientRect());
            for (const node of majorNodes) {
              const nb = node.getBoundingClientRect();
              for (const tb of tbBoxes) {
                if (overlaps(tb, nb, 2)) {
                  issues.push(`${route}@${viewport}: DENY label/barrier intersects node/gate`);
                }
              }
            }
          }

          const purposes = new Set(
            [...svg.querySelectorAll("[data-path-purpose]")].map((p) => p.getAttribute("data-path-purpose"))
          );
          for (const need of [
            "request-out",
            "request-allow",
            "request-deny",
            "provider-return",
            "action-out",
            "action-allow",
            "action-deny",
            "system-effect",
          ]) {
            if (!purposes.has(need)) issues.push(`${route}@${viewport}: missing path ${need}`);
          }

          const receive = svg.querySelector('[data-node-id="receive"]');
          const execute = svg.querySelector('[data-node-id="execute"]');
          const sor = svg.querySelector('[data-node-id="sor"]');
          const providerReturn = svg.querySelector('[data-path-purpose="provider-return"]');
          const actionAllow = svg.querySelector('[data-path-purpose="action-allow"]');
          const systemEffect = svg.querySelector('[data-path-purpose="system-effect"]');

          const hits = (path, node) => {
            if (!path || !node) return false;
            const pb = path.getBBox();
            const nb = node.getBBox();
            return pb.x < nb.x + nb.width + 4 && pb.x + pb.width > nb.x - 4 &&
              pb.y < nb.y + nb.height + 4 && pb.y + pb.height > nb.y - 4;
          };

          if (!hits(providerReturn, receive)) {
            issues.push(`${route}@${viewport}: provider-return does not reach Receive`);
          }
          if (!hits(actionAllow, execute)) {
            issues.push(`${route}@${viewport}: action-allow does not reach Execute`);
          }
          if (!hits(systemEffect, execute) || !hits(systemEffect, sor)) {
            issues.push(`${route}@${viewport}: system-effect does not connect Execute to SoR`);
          }

          // No SHIELD labels
          const allText = (svg.textContent || "").toUpperCase();
          if (allText.includes("SHIELD 1") || allText.includes("SHIELD 2")) {
            issues.push(`${route}@${viewport}: forbidden SHIELD label present`);
          }
        }
      }

      if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) {
        issues.push(`${route}@${viewport}: horizontal page overflow`);
      }
      if (document.querySelector(".psvg-cf ol, .psvg-gts ol")) {
        issues.push(`${route}@${viewport}: ordered-list fallback detected`);
      }

      return { route, viewport, visibleSvgCount: svgs.length, issues };
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
