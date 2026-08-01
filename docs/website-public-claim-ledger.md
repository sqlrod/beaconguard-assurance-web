# BeaconGuard Website — Public Claim Ledger

**Status:** Stage 0 freeze  
**Authority:** `docs/website-current-product-truth.md`  
**Rule:** Every material public statement must map to a ledger row.

Statuses: `SUPPORTED` | `SUPPORTED_WITH_QUALIFICATION` | `INTERNAL_ONLY` | `UNVERIFIED` | `PROHIBITED`

---

## Material claims

| Claim | Status | Evidence | Allowed wording | Required qualification | Prohibited wording | Affected routes |
|---|---|---|---|---|---|---|
| Independent AI action authorization category | SUPPORTED | Product truth §6; Phase XXXVI + Gateway + tool executor | “independent authorization and verification layer for regulated AI actions” | None beyond maturity posture | “AI governance dashboard”, “model firewall”, “prompt filter” | All |
| Request Admission Authorization | SUPPORTED | Gateway path; Phase XXXV/XXXVI | “authorizes whether an application may invoke an AI provider” | Fail-closed where enforcement configured | “guarantees AI safety” | Home, Platform, How It Works, Architecture, Security, Docs |
| AI result is untrusted proposal | SUPPORTED | PHASE-XXXVI tool-proposal conformance | “AI-generated result remains an untrusted proposal” | Applies to tool proposals and declared downstream use | “BeaconGuard certifies model correctness” | All product pages |
| Result-to-Action Authorization (declared action) | SUPPORTED_WITH_QUALIFICATION | New governed authorization / tool executor / dispatch single-use | “authorizes the declared intended enterprise action” | Independent authorization; does not resume original response; not semantic response scoring | “authorizes the AI response”, “response content gate”, “two identical gates on one turn” | Home, Platform, Healthcare, Fintech, Workflow, Architecture, Security |
| Provider success ≠ enterprise authorization | SUPPORTED | PHASE-XXXVI prohibited list | Exact phrase allowed | None | Equating provider 200/OK with ALLOW | Home, Security, Proof, Docs |
| Binary ALLOW/DENY | SUPPORTED | Gateway + authority traces | “runtime outcomes are ALLOW or DENY only” | Review reasons are not a third permission | “NEEDS_REVIEW outcome”, three-way permission model | All |
| Original decision immutable / review uses new request | SUPPORTED | Review grants + consume; proof video semantics | “review does not mutate a DENY into ALLOW” | New governed request / single-use grant | “review resumes the denied request” | Proof, Sample Record, Reviewer Kit |
| Active Verified Release | SUPPORTED | Control plane release hierarchy | “Active Verified Release” | Customer activates only after their process | “automatically compliant” | All |
| Compliance Playbook | SUPPORTED | Policy authoring / release hierarchy | “Compliance Playbook” | Playbooks are governed artifacts, not legal advice | “guarantees compliance” | Platform, Policy, Healthcare |
| Fail-closed | SUPPORTED | Enforcement runtime | “fail-closed” | Where enforcement is configured | Universal HA/fail-open claims | Security, Enforcement |
| Evidence before upstream forward | SUPPORTED_WITH_QUALIFICATION | ENFORCE evidence-before-forward | “evidence recorded before forward where enforcement requires it” | Mode/config dependent | Always-on for every integration without caveat | Architecture, Enforcement, Proof |
| Evidence before enterprise effect (action path) | SUPPORTED_WITH_QUALIFICATION | Action authorization + evidence model | “unauthorized actions are hard-stopped; decisions produce evidence” | Do not invent combined dual-boundary latency | “all enterprise writes are cryptographically sealed by BeaconGuard” | Platform, Proof, Docs |
| Request–result–action correlation | SUPPORTED_WITH_QUALIFICATION | decision_id / request_hash / bindings | “related decision and evidence identifiers support investigation” | Not a named distributed correlator product | “end-to-end distributed correlation product” | Proof, Compliance, Verification |
| Replay protection (admission) | SUPPORTED_WITH_QUALIFICATION | Nonce/replay controls | “replay resistance for governed requests where shared operation is configured” | Config/deployment dependent | Absolute multi-region replay guarantees | Security, Architecture |
| Investigation replay verification | SUPPORTED_WITH_QUALIFICATION | VRI replay | “replay verification of recorded decisions for investigation” | Not Gate-06 cluster replay substitute; lab/prevalidation | “cryptographic replay of model inference” | Verification, Compliance |
| Deterministic reconstruction | SUPPORTED_WITH_QUALIFICATION | VRI engine | “deterministic reconstruction from canonical evidence” | Missing fields reported unavailable; lab-validated | “reconstructs model reasoning” | Verification, Compliance, Proof |
| Source evidence / field traceability | SUPPORTED_WITH_QUALIFICATION | VRI Source Evidence | “source evidence and field traceability” | Integrity status must be honest | Fabricated complete coverage | Verification |
| Verifiable export | SUPPORTED_WITH_QUALIFICATION | VRI export + verify | “verifiable export for investigation packages” | Lab/prevalidation; keys not browser-held | “court-admissible export” | Verification, Compliance |
| Tamper evidence / signed artifacts | SUPPORTED_WITH_QUALIFICATION | Release signing + evidence chain + export signing | “signed release artifacts”; “integrity checks on evidence/export” | Distinguish release signing vs export signing vs chain | “mathematically immutable evidence forever” | Platform, Trust, Proof |
| Provider independence | SUPPORTED_WITH_QUALIFICATION | Architecture / mediation model | “provider-independent control boundary” | Customer still selects/providers; transport constraints apply | “works with every model unchanged” | Home, Platform, Architecture |
| Tenant isolation | SUPPORTED_WITH_QUALIFICATION | Lab matrices | “tenant isolation controls” | Lab-proven; customer-live residual risk | Absolute multi-tenant guarantees | Security, Trust |
| Statelessness / horizontal scaling | UNVERIFIED / PROHIBITED as defaults | Soft deployment notes only | Prefer omit; if needed: “deployment-dependent scale characteristics” | Must not imply universal HA | “stateless gateway”, “horizontal scaling by default”, “multi-region” | Deployment docs |
| Linux OCI support | SUPPORTED_WITH_QUALIFICATION | Packaging/deployment evidence | “Linux OCI-oriented packaging paths” | Controlled qualification | “native Windows OCI” as proven | Deployment |
| Windows deployment support | SUPPORTED_WITH_QUALIFICATION | XLV-C install evidence | “Windows and Linux controlled deployment paths” | Internal qualification | “production Windows fleet proven” | Deployment, Trust |
| ~18 ms p99 | PROHIBITED as complete transaction | No dual-boundary full-path public proof in freeze | Omit from public site | If ever shown: exact path + lab only | “18 ms full AI transaction”, dual-boundary p99 | None (remove if present) |
| Enterprise-scale performance | PROHIBITED | VRI `enterprise_capacity: NOT_CLAIMED` | Omit | — | “enterprise-scale proven” | None |
| Production-ready / production-proven | PROHIBITED | PRODUCTION NOT_AUTHORIZED | “controlled internal qualification” | Always | “production-ready”, “production-proven” | All |
| Healthcare production validation | PROHIBITED | No customer healthcare production authorization | Healthcare as initial market focus / scenarios | Illustrative | “validated in healthcare production” | Healthcare |
| Independent pen-test / SOC 2 / ISO 27001 | PROHIBITED (no current public evidence) | None in freeze | Omit | — | Certification badges/claims | Trust/Security |
| BeaconGuard Verify read-only | SUPPORTED | VRI trust boundaries | Exact read-only statement required | None | Verify as enforcement plane | Verification, Trust, Docs |
| AI-assisted insights | SUPPORTED_WITH_QUALIFICATION | VRI insights NON_AUTHORITATIVE | “AI-assisted insights are non-authoritative” | Outside trusted path | Insights as evidence authority | Verification |
| Clinical / medical / legal determination | PROHIBITED as BeaconGuard function | Product boundary | Explicit non-claims required on healthcare/fintech | Customer retains judgment | “certifies clinical correctness” | Healthcare, Fintech |
| Legal admissibility of evidence | PROHIBITED | No legal opinion evidence | “supports investigation and audit review” | — | “legally admissible” | Compliance, Proof |

---

## Global prohibited phrases (public)

- production-ready / production-proven / enterprise-scale proven  
- multi-region / native Windows OCI / horizontal scaling by default  
- cryptographic replay (unless clearly investigation replay of recorded decisions)  
- Control Before AI Execution (as complete product framing)  
- policy snapshot (as current public noun)  
- evidence-grade  
- AI response authorization / response content gate  
- reconstituting model reasoning  
- AI insights as authority  

---

## Ledger freeze

```text
WEBSITE_PUBLIC_CLAIM_LEDGER_FROZEN_2026-08-01
```
