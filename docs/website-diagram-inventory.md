# BeaconGuard Website — Diagram Inventory

**Status:** Stage 0 freeze + Stage 1 redesign targets  
**Visual system:** retain dark enterprise theme; blue/teal control; orange/red DENY hard-stop.

---

## Existing diagrams (pre-reframe)

| Component | Current routes | Pre-reframe model | Required action |
|---|---|---|---|
| `ControlBoundaryOverview` | `/`, `/canonical-workflow` | Request-centric boundary | **Replace** with Complete Governed AI Transaction |
| `RuntimeDecisionSequence` | `/how-it-works` | Request evaluation sequence | **Replace** with 6-step transaction lifecycle |
| `RuntimeTrustEnforcement` | `/platform` | Runtime trust | **Update** to Authorize domain (request + action) |
| `ReleaseLifecycle` | `/platform`, `/docs/policy-model` | Govern release | **Retain/Patch** for Govern domain |
| `FailClosedSecurityGate` | `/security`, `/docs/enforcement-runtime` | Request fail-closed | **Update** captions/semantics; keep shared fail-closed path |
| `IndustryControlFlow` | `/healthcare`, `/fintech` | Model pathway + ALLOW | **Replace** with industry transaction variants |
| `ArchitecturePlanes` | `/docs/architecture` | Plane layout | **Rewrite** for domains + provider/result/action |
| `DataFlowThreatDiagram` | `/docs/dfd-threat-flow` | Older DFD | **Rewrite** to 18-step flow |
| `DeploymentTopology` | `/deployment`, `/docs/deployment-integration` | Topology | **Update** bypass prevention + return-path control |
| `EvidenceLifecycle` | `/docs/compliance-audit` | Evidence path | **Update** for Verify hierarchy |
| `ReviewAuthorizationFlow` | `/proof-evidence` | Review/new request | **Retain** (accurate for review) + add transaction example diagram |
| `RecordAnatomy` | `/sample-decision-record` | Single VDR anatomy | **Update** for related request+action decisions |
| `ControlledEvaluationFlow` | `/design-partner-program` | Evaluation flow | **Update** expanded inputs |
| `TrustResponsibilityMap` | `/trust-assurance` | Responsibilities | **Update** Verify + non-authority of insights |
| `DiagramShell` / `OutcomeFork` | shared | Shell / ALLOW-DENY | **Retain**; ensure DENY hard-stop clarity |

---

## Required new / redesigned shared diagrams

| Diagram | Proposed component | Primary routes |
|---|---|---|
| Complete Governed AI Transaction | `GovernedAITransaction.astro` | `/`, `/canonical-workflow`, `/how-it-works` |
| Govern–Authorize–Verify Functional Model | `GovernAuthorizeVerify.astro` | `/platform`, `/` |
| Request Admission Boundary | `RequestAdmissionBoundary.astro` | `/security`, `/docs/enforcement-runtime` |
| Result-to-Action Boundary | `ResultToActionBoundary.astro` | `/security`, `/platform`, healthcare/fintech |
| Healthcare Transaction | extend `IndustryControlFlow` or `HealthcareTransaction.astro` | `/healthcare` |
| Financial Transaction | extend industry component | `/fintech` |
| Verification Hierarchy | `VerificationHierarchy.astro` | `/verification`, `/docs/compliance-audit` |
| Evidence and Reconstruction Flow | update `EvidenceLifecycle` | verification + compliance |
| Threat-Boundary DFD | rewrite `DataFlowThreatDiagram` | `/docs/dfd-threat-flow` |
| Deployment and Bypass Prevention | update `DeploymentTopology` | deployment routes |
| Controlled Evaluation Workflow | update `ControlledEvaluationFlow` | controlled evaluation |
| Responsibility Separation | update `TrustResponsibilityMap` | trust + matrix |
| ALLOW/DENY Outcome Model | `OutcomeFork` / dedicated callout | shared |

---

## Diagram rules (mandatory)

1. Distinguish enterprise application, BeaconGuard controls, AI provider, AI-generated result, intended action, enterprise system/SoR, evidence, Verify, insights.
2. Never use one “downstream system” box for both provider and enterprise SoR.
3. DENY = explicit hard stop.
4. Authorization ≠ execution.
5. Insights outside trusted evidence chain.
6. Desktop/tablet/mobile readable; text equivalent required.
7. Prefer Astro/HTML/CSS; no Mermaid on public pages unless already approved in visual system (integration exists but unused — do not introduce Mermaid diagrams for this reframe).

---

## Freeze

```text
WEBSITE_DIAGRAM_INVENTORY_FROZEN_2026-08-01
```
