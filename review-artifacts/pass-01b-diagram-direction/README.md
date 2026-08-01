# Pass 01B — Enterprise Diagram Visual-Direction Gate

**No visual direction is approved yet.** This pass creates three materially different, high-fidelity, code-based candidates for comparison only. Do not treat any direction as the final site-wide diagram style.

| Field | Value |
| --- | --- |
| Starting staging HEAD | `62de5e91576bb5d727a4d976bfb1032de25fd1f9` |
| Final staging commit | `a0af658ebc388226a793109afabc365ce1475ef1` |
| Preview port | `4332` |
| Build result | Pass (`npm run build`, 28 pages including staging route) |
| Public route count | 27 (sitemap unchanged) |
| Staging comparison route | `/staging-diagram-direction` (noindex, nofollow, not in nav/footer/sitemap) |
| Production deployment | Not authorized |
| Merge to main | Not authorized |

## Pass 01A defects driving this gate

Recorded from Pass 01A hero evidence before continuing Pass 01B:

### Homepage

- Headline collides with or is clipped by the diagram column.
- Compact diagram is too narrow for its content.
- Nested boxes create excessive density.
- Connector geometry is unclear.
- Trust boundaries are visually weak.
- ALLOW and DENY are represented more strongly as cards than as paths.
- The diagram attempts to contain too much technical detail for a hero.

### Verification

- Hierarchy appears as a collection of menu tiles.
- All capabilities carry equivalent weight.
- No visible selected-decision-to-source-evidence relationship.
- No implemented interface evidence.
- The read-only boundary is accurate but visually weak.
- The visual resembles documentation rather than a product surface.

## Framework decision

Use Astro, semantic HTML, CSS, inline/authored SVG, vendor-neutral icon primitives, and native `<details>`/`<summary>` disclosure.

Do **not** install or use React Flow / `@xyflow/react`, Mermaid (for these visuals), D3, Apache ECharts, Dagre, ELK/elkjs, canvas diagram libraries, or a general-purpose graph editor.

**Confirmation:** No graph editor library was installed for Pass 01B. Diagrams remain text-searchable, accessible, responsive, printable, server-rendered, deterministic, and maintainable without a client-side graph runtime.

Note: the repository already includes `astro-mermaid` for unrelated documentation; Pass 01B direction visuals do not use Mermaid.

## Design grid

8-point diagram tokens:

- `--diagram-space-1` … `--diagram-space-8` (8–64px)
- Node padding, spacing, radii, and trust-boundary padding use multiples of 8
- Direction A desktop node coordinates are expressed as percentages of a 1120×640 viewBox aligned to that grid

**Documented exception:** SVG stroke widths use 2.5 / 3.5 / 4 for path hierarchy (not multiples of 8).

## Semantic color system

Tokens added/aligned for Pass 01B:

- `--diagram-neutral`, `--diagram-neutral-surface`
- `--diagram-boundary-enterprise|runtime|provider|verify`
- `--decision-deny|allow|evidence` (+ surface/border)
- `--diagram-text-primary|secondary|label`

DENY uses highest-alert contrast and visible terminal barriers. ALLOW uses muted secure green as continuous path emphasis. Evidence uses teal and remains outside the runtime path.

## Direction A — Orthographic Security Circuit

Security-infrastructure closed transaction:

- One Enterprise Application boundary with PREPARE / RECEIVE+DECLARE / EXECUTE
- Request Admission and Result-to-Action checkpoints
- AI Provider outside as untrusted external
- Result visibly returns into the same application
- REQUEST DENY and ACTION DENY terminate visibly
- ALLOW returns to EXECUTE then System of Record
- Evidence rail to BeaconGuard Verify (read-only)

**Intended pages:** Homepage summary, How It Works, Canonical Workflow, industry transaction diagrams.

**Known tradeoffs:** Dense path labels at mid widths; desktop orthographic composition must stack on mobile rather than shrink.

## Direction B — Layered Control Architecture

Restrained layered functional domains:

- Govern → Verified release into Authorize
- Authorize foregrounded (runtime prevention)
- Evidence outward to Verify
- Explicit note that Verify does not return permission
- Functional domains only — no physical host/network/air-gap implication

**Intended pages:** Platform, executive architecture, company overview, pitch-deck summary.

**Known tradeoffs:** Does not communicate full transaction geometry.

## Direction C — Evidence-Centered Investigation

Governed investigation surface (not a menu grid):

- Decision context → canonical evidence spine → review outputs
- Canonical evidence dominates
- AI-Assisted Insights separated and non-authoritative
- Read-only Verify boundary
- “Illustrative verification model” label
- No path back to runtime authority

**Intended pages:** Verification, Proof and Evidence, Compliance and Audit, Reviewer Kit.

**Known tradeoffs:** Illustrative only; not a live product screenshot.

## Comparison matrix (qualitative cues only — no winner)

| Criterion | Direction A | Direction B | Direction C |
| --- | --- | --- | --- |
| Precision | High | Medium | High for evidence provenance |
| Executive comprehension | Medium–High | High | High for reviewers |
| Trust-boundary clarity | High | Medium–High | High (read-only) |
| Transaction clarity | Highest | Not primary | Assumed upstream |
| Evidence clarity | Medium–High | Medium | Highest |
| Mobile behavior | Vertical circuit | Stacked domains | Stacked investigation |
| Intended pages | Home / How It Works / Canonical | Platform / overview | Verify / Proof / Audit |
| Known limitations | Dense labels | No full loop | Illustrative only |

## Homepage interim correction

- Left-aligned hero preserved
- Controlled Evaluation remains sole primary CTA
- Interim simplified vertical transaction replaces dense Pass 01A summary in the hero
- Headline fully visible at 1440×900; both sentences remain two lines; no overlap with the right column
- Interim visual is **not** the final direction

## Verification interim correction

- Left-aligned hero preserved
- Interim stack: canonical evidence first, read-only Verify second, grouped investigation outputs, separated AI insights
- Direction C is **not** deployed as final

## Route validation

- `/staging-diagram-direction` → HTTP 200, one H1, `noindex, nofollow`
- Absent from sitemap (27 public URLs unchanged)
- Absent from primary navigation and footer
- No horizontal overflow on validated routes
- Unique SVG marker IDs across Direction A instances (`cmp-a-*`, `cmp-a-c-*`)
- Native disclosures used for progressive disclosure (no modals)

## Screenshot index

### Full page (27 public routes @ 1440×900)

See `fullpage/`.

### Comparison responsive (`/staging-diagram-direction`)

- `responsive/staging-diagram-direction__390x844.png`
- `responsive/staging-diagram-direction__768x1024.png`
- `responsive/staging-diagram-direction__1024x768.png`
- `responsive/staging-diagram-direction__1440x900.png`
- `responsive/staging-diagram-direction__1920x1080.png`

### Crops

- `crops/direction-a-1440.png`
- `crops/direction-b-1440.png`
- `crops/direction-c-1440.png`
- `crops/direction-a-390.png`
- `crops/direction-b-390.png`
- `crops/direction-c-390.png`
- `crops/home-interim-1440.png`
- `crops/verification-interim-1440.png`

## Main-integrity result

Main worktree left untouched. Preflight confirmed:

- Branch `main`
- HEAD `1b80a59261b99d3e0bf5cf1900fd8e4e8b17d810`
- Status digest `5972a6d82362bea138d928435294edf074f8865cd7f2fa1e34c0aaa65dbb173f`

## Explicit non-approval

**No visual direction is approved yet.** Pass 02 / site-wide diagram deployment is not authorized by this gate.
