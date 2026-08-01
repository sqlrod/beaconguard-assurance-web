# BeaconGuard Website — Route Claim Matrix

**Status:** Stage 0 freeze  
**Inventory source:** `src/pages` (27 routes) as of HEAD `1b80a59`  
**Required actions:** REWRITE | RESTRUCTURE | PATCH | RETAIN | REMOVE | REDIRECT

Primary nav target:

```text
Platform | Healthcare | Verification | Security | Controlled Evaluation | Documentation | Contact
```

Secondary / footer / related: Financial Services, Proof and Evidence, Trust Center, Company, Reviewer Kit, Deployment, Responsibility Matrix, Threat Model, How It Works, Canonical Workflow, etc.

---

## Route matrix

| Route | Source | Current primary claim | Diagram | Required action | New primary claim (target) |
|---|---|---|---|---|---|
| `/` | `index.astro` | Policy control before governed execution | ControlBoundaryOverview | **REWRITE** | Independent AI action authorization; complete governed transaction |
| `/platform` | `platform.astro` | Deterministic runtime control capabilities | ReleaseLifecycle + RuntimeTrustEnforcement | **RESTRUCTURE** | Govern → Authorize → Verify |
| `/healthcare` | `healthcare.astro` | PHI-sensitive AI workflows | IndustryControlFlow | **REWRITE** | Healthcare transaction scenarios + non-claims |
| `/fintech` | `fintech.astro` | Regulated financial workflows | IndustryControlFlow | **REWRITE** | Expansion vertical; proposed-action scenarios |
| `/verification` | *(missing)* | — | — | **REWRITE** (create) | BeaconGuard Verify read-only domain |
| `/how-it-works` | `how-it-works.astro` | Evaluate before governed execution | RuntimeDecisionSequence | **REWRITE** | 6-step governed transaction lifecycle |
| `/security` | `security.astro` | Runtime admission / fail-closed | FailClosedSecurityGate | **REWRITE** | Dual-point threats + fail-closed |
| `/proof-evidence` | `proof-evidence.astro` | Verifiable Decision Records | ReviewAuthorizationFlow | **REWRITE** | Complete transaction example + review video scope |
| `/canonical-workflow` | `canonical-workflow.astro` | Workflow examples (request-centric) | ControlBoundaryOverview | **REWRITE** | Complete governed transaction examples |
| `/design-partner-program` | `design-partner-program.astro` | Controlled Evaluation | ControlledEvaluationFlow | **REWRITE** | Expanded evaluation inputs/outputs |
| `/trust-assurance` | `trust-assurance.astro` | Trust Center | TrustResponsibilityMap | **REWRITE** | Verify boundary + responsibility |
| `/company` | `company.astro` | Company | — | **PATCH** | Mission + healthcare wedge |
| `/contact` | `contact.astro` | Controlled architecture evaluation | — | **REWRITE** | Expanded intake prompts |
| `/reviewer-kit` | `reviewer-kit.astro` | Due diligence materials | — | **REWRITE** | 12-step reviewer sequence |
| `/control-responsibility-matrix` | `control-responsibility-matrix.astro` | Responsibility matrix | — | **REWRITE** | Provider/app/BG/SoR/governance split |
| `/deployment` | `deployment.astro` | Controlled deployment qualification | DeploymentTopology | **REWRITE** | Three integration contracts + bypass prevention |
| `/use-cases` | `use-cases.astro` | Use cases | — | **PATCH** / align with workflow | Point to complete transaction scenarios |
| `/sample-decision-record` | `sample-decision-record.astro` | Sample VDR | RecordAnatomy | **REWRITE** | Dual-decision transaction sample |
| `/docs` | `docs/index.astro` | Documentation index | — | **PATCH** | Add Verification + updated blurbs |
| `/docs/overview` | `docs/overview.md` | Overview | — | **REWRITE** | Dual authorization model |
| `/docs/architecture` | `docs/architecture.astro` | System architecture | ArchitecturePlanes | **REWRITE** | Management + runtime + verify domains |
| `/docs/policy-model` | `docs/policy-model.astro` | Policy model | ReleaseLifecycle | **REWRITE** | Request / action / shared / evidence scopes |
| `/docs/enforcement-runtime` | `docs/enforcement-runtime.astro` | Enforcement runtime | FailClosedSecurityGate | **REWRITE** | Remove stale request-only framing |
| `/docs/compliance-audit` | `docs/compliance-audit.astro` | Compliance and audit | EvidenceLifecycle | **REWRITE** | Transaction IDs + VRI obligations |
| `/docs/threat-model` | `docs/threat-model.astro` | Threat model | — | **REWRITE** | Result-binding + VRI threats |
| `/docs/deployment-integration` | `docs/deployment-integration.astro` | Deployment and integration | DeploymentTopology | **REWRITE** | Three contracts |
| `/docs/dfd-threat-flow` | `docs/dfd-threat-flow.astro` | DFD threat analysis | DataFlowThreatDiagram | **REWRITE** | 18-step numbered flow |

**REMOVE:** none in this freeze (preserve routes; reframe content).  
**REDIRECT:** none required yet (`/verification` is additive).

---

## Shared dependency note

Diagrams reused across marketing + docs must be updated once in shared components, then verified on every consumer route.

---

## Freeze

```text
WEBSITE_ROUTE_CLAIM_MATRIX_FROZEN_2026-08-01
```
