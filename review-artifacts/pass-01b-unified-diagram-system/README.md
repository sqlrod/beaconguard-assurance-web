# Pass 01B — Unified Enterprise Diagram System Validation

**All three views are required specialized architecture views. No universal winner was selected.**

**No site-wide diagram deployment was performed in Pass 01B.**

| Field | Value |
| --- | --- |
| Starting staging HEAD | `4f6f09b767a7ddd79cbc662a146f42a34c2e9ec4` |
| Final staging commit | *(filled after commit)* |
| Preview port | `4333` |
| Build result | Pass (`npm run build`; public sitemap remains 27 URLs) |
| Staging review route | `/staging-diagram-system` (noindex, nofollow, not in nav/footer/sitemap) |
| Production deployment | Not authorized |
| Merge to main | Not authorized |

## Pass 01A defects recorded before implementation

### Homepage

- Hero headline or diagram collision risk.
- Transaction summary is too narrow and too dense.
- Nested panels resemble a form rather than infrastructure.
- Paths are visually secondary to boxes.
- Request and action outcomes are presented as cards instead of path behavior.
- The diagram attempts to explain too much in the hero.

### Verification

- Equal-weight menu-tile appearance.
- Canonical evidence is not visually dominant.
- Decision-to-evidence-to-reconstruction relationships are weak.
- The visual resembles documentation rather than a verification product surface.

### Governed transaction

- Application return geometry remains difficult to understand.
- Excessive nested bounding boxes.
- Trust boundaries and connectors lack enterprise-level visual authority.

## Classification correction

Views A, B, and C are **specialized architectural views** in one BeaconGuard visual language.

They are **not** competing alternatives for a single universal website diagram.

Evaluation answers two separate questions:

1. Does each view communicate its assigned architecture accurately?
2. Do all three look like parts of one enterprise product system?

## Framework decision

Use Astro, semantic HTML, CSS, authored SVG, vendor-neutral icons, and native `<details>`/`<summary>`.

**Confirmation:** No graph editor library was installed for Pass 01B (no React Flow / `@xyflow/react` / Mermaid-for-these-views / D3 / ECharts / Dagre / ELK).

Note: the repository already includes `astro-mermaid` for unrelated documentation; Views A–C do not use Mermaid.

## Unified visual-system standards

- 8-point grid tokens `--diagram-space-1` … `--diagram-space-8`
- Surfaces, borders, boundary colors, text hierarchy
- Connector tokens `--connector-neutral|allow|deny|evidence`
- Shared icon size (`--diagram-icon-size: 24px`) and connector widths
- Explicit trust-boundary labels:
  - ENTERPRISE CONTROLLED BOUNDARY
  - BEACONGUARD RUNTIME AUTHORIZATION BOUNDARY
  - AI PROVIDER — UNTRUSTED EXTERNAL BOUNDARY
  - READ-ONLY VERIFICATION BOUNDARY
  - ENTERPRISE SYSTEM-OF-RECORD BOUNDARY

## View A — Orthographic Security Circuit

**Purpose:** Transaction authorization and fail-closed control.

**Intended pages:** Homepage compact transaction visual, How It Works, Canonical Workflow, Healthcare, Financial Services, Use Cases, Controlled Evaluation transaction summary.

## View B — Layered Control Architecture

**Purpose:** Functional platform architecture.

**Intended pages:** Platform, executive system architecture, company overview where appropriate, pitch-deck architecture summary.

Not automatic detailed deployment topology.

## View C — Evidence-Centered Investigation

**Purpose:** Verification, investigation, audit, and evidence.

**Intended pages:** Verification, Proof and Evidence, Compliance and Audit, Reviewer Kit, Sample Decision Record, Trust Center evidence summary where appropriate.

## Separate technical diagram classes

Not redesigned in Pass 01B; later inherit the visual system:

- DFD and Threat Flow
- Threat Model
- Deployment and Integration
- Enforcement Runtime
- Fail-Closed Security Gate
- Release Lifecycle
- Responsibility Matrix
- Record Anatomy
- Review Authorization Flow

## Family-consistency validation

| Shared standard | View A | View B | View C |
| --- | --- | --- | --- |
| 8-point grid | PASS | PASS | PASS |
| Typography | PASS | PASS | PASS |
| Iconography | PASS | PASS | PASS |
| Semantic colors | PASS | PASS | PASS |
| Connector weights | PASS | PASS | PASS |
| Boundary language | PASS | PASS | PASS |
| Responsive behavior | PASS | PASS | PASS |
| Text equivalent | PASS | PASS | PASS |

## Homepage interim correction

- Headline fully visible; exactly two lines at 1440; no right-column overlap
- Simplified interim transaction visual (not final)
- Left alignment preserved; Controlled Evaluation sole primary CTA

## Verification interim correction

- Canonical evidence → read-only Verify → grouped review capabilities
- AI-assisted insights separate
- Direction C not deployed as final
- Left-aligned hero preserved

## Route validation

- `/staging-diagram-system` → HTTP 200, one H1, `noindex, nofollow`
- Absent from sitemap (27 public URLs unchanged)
- Absent from primary navigation and footer
- Unique SVG marker IDs; no horizontal overflow on validated routes

## Screenshot index

### Full page (27 @ 1440×900)

See `fullpage/`.

### Staging responsive (`/staging-diagram-system`)

- `responsive/staging-diagram-system__390x844.png`
- `responsive/staging-diagram-system__768x1024.png`
- `responsive/staging-diagram-system__1024x768.png`
- `responsive/staging-diagram-system__1440x900.png`
- `responsive/staging-diagram-system__1920x1080.png`

### Crops

- `crops/direction-a-1440.png` / `direction-a-390.png`
- `crops/direction-b-1440.png` / `direction-b-390.png`
- `crops/direction-c-1440.png` / `direction-c-390.png`
- `crops/home-interim-1440.png`
- `crops/verification-interim-1440.png`

## Main-integrity result

Main worktree untouched. Confirmed:

- Branch `main`
- HEAD `1b80a59261b99d3e0bf5cf1900fd8e4e8b17d810`
- Status digest `5972a6d82362bea138d928435294edf074f8865cd7f2fa1e34c0aaa65dbb173f`
