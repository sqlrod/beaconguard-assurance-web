# BeaconGuard Website — Current Product Truth

**Status:** Stage 0 freeze for public website reframe  
**Repository:** `D:\beaconguard-web`  
**Evidence root (read-only):** `C:\beaconguard`  
**Frozen against HEAD:** `1b80a59261b99d3e0bf5cf1900fd8e4e8b17d810`  
**Date:** 2026-08-01  

Internal phase names and initiative IDs in this document are **not** for public pages.

---

## 1. Evidence conflict (must govern public framing)

Requested marketing framing described a symmetric dual gate:

1. Request Admission Authorization  
2. Result-to-action authorization of the AI-generated result itself  

**Implementation evidence does not support equal “response authorization” of model content.**

Verified model (`PHASE-XXXVI` tool-proposal conformance + runtime gateway + tool executor):

```text
TOOL_CALLS = NON_EXECUTED_PROPOSALS_REQUIRING_NEW_AUTHORIZATION
```

- Gateway returns binary **ALLOW** or **DENY** for request admission before upstream provider invocation (where enforcement is configured).
- Provider/tool proposals are **non-executed** and require a **new** governed authorization with new request identity.
- Approving a proposal **does not resume** the original AI response.
- Using the AI response as authorization is **prohibited and not implemented**.
- Semantic / probabilistic response-content governance is **not supported**.

**Public source of truth for this reframe:**

BeaconGuard authorizes whether an enterprise application may invoke an AI provider, and whether a later declared enterprise action (including tool execution) may proceed under the Active Verified Release. An AI-generated result remains an untrusted proposal. Provider success is not enterprise authorization. BeaconGuard authorizes; the enterprise application executes.

“Result-to-Action Authorization” on the public site means **authorization of the declared intended enterprise action**, typically as an independent governed authorization — **not** authorization of model-output content as such.

---

## 2. Verified operating model (public-safe)

```text
Enterprise Application
        │
        ▼
Request Admission Authorization  →  ALLOW | DENY
        │
        ├── DENY → record decision → no provider invocation
        │
        └── ALLOW
              │
              ▼
          AI Provider
              │
              ▼
       AI-Generated Result / Tool Proposal
              Untrusted
              │
              ▼
 Enterprise Application declares
   Intended Enterprise Action
              │
              ▼
 Independent Action Authorization  →  ALLOW | DENY
   (new governed authorization where required)
        │
        ├── DENY → record decision → no enterprise effect
        │
        └── ALLOW
              │
              ▼
 Enterprise Application Executes Authorized Action
              │
              ▼
 Enterprise System of Record (authoritative)
```

Verification path (out-of-band, read-only):

```text
Verifiable Decision Records
        │
        ▼
BeaconGuard Verify
        ├── Executive Reporting
        ├── Decision Explorer
        ├── Deterministic Reconstruction
        ├── Source Evidence / field traceability
        ├── Replay Verification (investigation)
        └── Verifiable Export
```

AI-Assisted Insights are a **separate non-authoritative** side capability. They must not appear inside the trusted reconstruction or runtime authorization path.

---

## 3. Capability truth table

| Capability | Status | Public stance |
|---|---|---|
| Request admission ALLOW/DENY | IMPLEMENTED_AND_VALIDATED | SUPPORTED |
| Fail-closed enforcement path | IMPLEMENTED_AND_VALIDATED | SUPPORTED |
| Active Verified Release / Compliance Playbooks | IMPLEMENTED_AND_VALIDATED | SUPPORTED |
| Binary runtime outcomes only | IMPLEMENTED_AND_VALIDATED | SUPPORTED |
| Review grant ≠ ALLOW; original decision immutable | IMPLEMENTED_AND_VALIDATED | SUPPORTED |
| Tool/action proposals untrusted; need new auth | IMPLEMENTED_AND_VALIDATED | SUPPORTED_WITH_QUALIFICATION |
| Independent authorization of declared enterprise action | IMPLEMENTED_AND_VALIDATED | SUPPORTED_WITH_QUALIFICATION |
| Semantic AI-response content authorization | DESIGNED_NOT_IMPLEMENTED / NOT_SUPPORTED | PROHIBITED |
| Evidence before forward (ENFORCE) | IMPLEMENTED_AND_VALIDATED | SUPPORTED_WITH_QUALIFICATION |
| Decision Explorer | IMPLEMENTED_AND_VALIDATED (lab/prevalidation) | SUPPORTED_WITH_QUALIFICATION |
| Deterministic reconstruction | IMPLEMENTED_AND_VALIDATED (lab) | SUPPORTED_WITH_QUALIFICATION |
| Source evidence traceability (VRI) | IMPLEMENTED_AND_VALIDATED (lab) | SUPPORTED_WITH_QUALIFICATION |
| Investigation replay verification | IMPLEMENTED_AND_VALIDATED (lab) | SUPPORTED_WITH_QUALIFICATION |
| Executive reports (VRI) | IMPLEMENTED_AND_VALIDATED (lab) | SUPPORTED_WITH_QUALIFICATION |
| Verifiable export | IMPLEMENTED_AND_VALIDATED (lab) | SUPPORTED_WITH_QUALIFICATION |
| AI-assisted insights (non-authoritative) | IMPLEMENTED_AND_VALIDATED with containment | SUPPORTED_WITH_QUALIFICATION |
| Verify read-only / cannot grant runtime authority | IMPLEMENTED_AND_VALIDATED | SUPPORTED |
| Evidence Explorer demo surfaces | LEGACY / demo-backed | SUPPORTED_WITH_QUALIFICATION as demo only; not production evidence browser |
| Tenant isolation (lab) | IMPLEMENTED_AND_VALIDATED in lab | SUPPORTED_WITH_QUALIFICATION |
| Horizontal scaling / multi-region / HA defaults | Not validated as universal product claims | PROHIBITED / DEFERRED |
| ~18 ms p99 as full AI transaction | Not validated for dual-boundary / provider inference | PROHIBITED as complete-transaction claim |
| Customer production deployment authorized | Explicitly NOT_AUTHORIZED | PROHIBITED to claim ready; SUPPORTED to disclose controlled internal qualification |
| Healthcare clinical correctness | Not a BeaconGuard function | PROHIBITED |
| SOC 2 / ISO / pen-test as current certifications | No current public certification evidence found in this freeze | PROHIBITED unless separate evidence appears |

---

## 4. Functional domains (not automatic network planes)

Present BeaconGuard as three **functional domains**:

### Govern
Environment/integration configuration, Integration Policy, System Connector (where applicable), Runtime Topology and Trust, Compliance Playbooks, validation, approval, signing, distribution, Active Verified Release.

### Authorize
- **Request Admission Authorization** — may the application invoke the AI provider?
- **Independent Action Authorization** (public label: Result-to-Action Authorization) — may the declared intended enterprise action proceed?

Do **not** claim identical playbooks, identical latency, or separately deployed gateways at both points unless specifically verified for a given deployment.

### Verify
Executive Reporting, Decision Explorer, Deterministic Reconstruction, Source Evidence, field traceability, Replay Verification, Verifiable Export, AI-Assisted Insights (non-authoritative).

Required public statement:

> BeaconGuard Verify is read-only. It cannot modify evidence, change a historical decision, activate a release, alter a Compliance Playbook, grant runtime authority, or authorize an enterprise action.

---

## 5. Maturity and deployment truth

- Product remains under **controlled internal qualification / release-candidate** posture for customer production use.
- Public site must retain accurate qualification language.
- Do not claim production-ready, customer deployments, design-partner endorsements, or healthcare-system sponsorships without formal evidence.

---

## 6. Primary public definition (approved)

**Category:**

> BeaconGuard is the independent authorization and verification layer for regulated AI actions.

**Supporting:**

> BeaconGuard governs whether an enterprise application may invoke AI and whether a declared enterprise action based on an AI-generated result may proceed. AI output is treated as an untrusted proposal until its intended use is authorized under the Active Verified Release.

**Hero technical line:**

> Govern the request. Authorize the action. Verify the decision.

**Supporting technical statements:**

- Provider success is not enterprise authorization.
- An AI-generated result remains an untrusted proposal until BeaconGuard authorizes its intended use.
- BeaconGuard authorizes the action. The enterprise application executes it.

---

## 7. Evidence limitations

1. VRI is out-of-band investigation capability; formal phase number unassigned; customer-workflow validation pending.
2. Live external AI vendor qualification for insights is pending; simulator default.
3. Evidence Explorer in AssuranceUI still includes demonstration/scenario surfaces — do not present as production evidence browser.
4. Loop/phase JSON in the product repo can be mixed/stale relative to later review folders; prefer newest review finals and active code.
5. No public claim may invent API enums, DB entities, or deployment topology beyond verified patterns.

---

## 8. Freeze token

```text
WEBSITE_PRODUCT_TRUTH_FROZEN_2026-08-01
```
