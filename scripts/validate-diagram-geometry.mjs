/**
 * Geometry validation for pure-SVG diagram compositions.
 * Pass 01B-R3A1: includes Control Fabric equal-dimension and path-purpose checks.
 */
import { chromium } from "playwright";

const base = process.env.PREVIEW_BASE || "http://127.0.0.1:4337";
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
      const near = (a, b, tol = 2) => Math.abs(a - b) <= tol;

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

        // Control Fabric equal-dimension + purpose checks (desktop SVG only)
        if (svg.classList.contains("psvg-desktop") && svg.closest(".psvg-cf")) {
          const gateRects = [...svg.querySelectorAll('[data-cf-role="auth-gate"] > rect')].filter(
            (r, i, arr) => arr.indexOf(r) === i
          );
          // First rect in each gate group is the shell
          const shells = [...svg.querySelectorAll('[data-cf-role="auth-gate"]')].map((g) =>
            g.querySelector("rect")
          );
          if (shells.length >= 2) {
            const a = shells[0].getBBox();
            const b = shells[1].getBBox();
            if (!near(a.width, b.width, 1) || !near(a.height, b.height, 1)) {
              issues.push(`${route}@${viewport}: auth gates unequal size`);
            }
          }

          const denyRects = [...svg.querySelectorAll('[data-cf-role="deny-terminal"] > rect')];
          if (denyRects.length >= 2) {
            const a = denyRects[0].getBBox();
            const b = denyRects[1].getBBox();
            if (!near(a.width, b.width, 1) || !near(a.height, b.height, 1)) {
              issues.push(`${route}@${viewport}: DENY terminals unequal size`);
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
              issues.push(`${route}@${viewport}: app internal states unequal size`);
            }
            const gap1 = boxes[1].y - (boxes[0].y + boxes[0].height);
            const gap2 = boxes[2].y - (boxes[1].y + boxes[1].height);
            if (!near(gap1, gap2, 2)) {
              issues.push(`${route}@${viewport}: app state vertical gaps unequal (${gap1.toFixed(1)} vs ${gap2.toFixed(1)})`);
            }
          }

          // Terminal must not overlap gate shells
          const gates = [...svg.querySelectorAll('[data-cf-role="auth-gate"]')];
          const terminals = [...svg.querySelectorAll('[data-cf-role="deny-terminal"]')];
          for (const t of terminals) {
            const tb = t.getBoundingClientRect();
            for (const g of gates) {
              const gb = g.getBoundingClientRect();
              const overlap = !(tb.right < gb.left + 2 || tb.left > gb.right - 2 || tb.bottom < gb.top + 2 || tb.top > gb.bottom - 2);
              if (overlap) {
                issues.push(`${route}@${viewport}: DENY terminal overlaps auth gate`);
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
            if (!purposes.has(need)) {
              issues.push(`${route}@${viewport}: missing path purpose ${need}`);
            }
          }

          // ALLOW must end at Execute (leftward into app), system-effect from Execute to SoR
          const actionAllow = svg.querySelector('[data-path-purpose="action-allow"]');
          const execute = svg.querySelector('[data-node-id="execute"]');
          const receive = svg.querySelector('[data-node-id="receive"]');
          const providerReturn = svg.querySelector('[data-path-purpose="provider-return"]');
          if (actionAllow && execute) {
            const d = actionAllow.getAttribute("d") || "";
            const eb = execute.getBBox();
            // Path should include a horizontal segment ending near execute left
            if (!/H\s*\d+/i.test(d) || !d.includes(String(Math.round(eb.x))) && !/H80|H\s*80/.test(d)) {
              // soft: ensure path bbox intersects execute
              const pb = actionAllow.getBBox();
              const hit =
                pb.x < eb.x + eb.width &&
                pb.x + pb.width > eb.x &&
                pb.y < eb.y + eb.height &&
                pb.y + pb.height > eb.y;
              if (!hit) issues.push(`${route}@${viewport}: action-allow does not reach Execute`);
            } else {
              const pb = actionAllow.getBBox();
              const hit =
                pb.x < eb.x + eb.width &&
                pb.x + pb.width > eb.x - 4 &&
                pb.y < eb.y + eb.height &&
                pb.y + pb.height > eb.y;
              if (!hit) issues.push(`${route}@${viewport}: action-allow does not reach Execute`);
            }
          }
          if (providerReturn && receive) {
            const pb = providerReturn.getBBox();
            const rb = receive.getBBox();
            const hit =
              pb.x < rb.x + rb.width &&
              pb.x + pb.width > rb.x - 4 &&
              pb.y < rb.y + rb.height &&
              pb.y + pb.height > rb.y;
            if (!hit) issues.push(`${route}@${viewport}: provider-return does not reach Receive`);
          }
        }
      }

      if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 2) {
        issues.push(`${route}@${viewport}: horizontal page overflow`);
      }

      if (document.querySelector(".psvg-gts ol, .psvg-ves ol, .psvg-cf ol, .psvg-osc ol.hero-interim-flow")) {
        issues.push(`${route}@${viewport}: ordered-list fallback detected inside diagram`);
      }

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
