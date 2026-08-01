# BeaconGuard Website — Canonical Terminology

**Status:** Stage 0 freeze  
**Authority:** `docs/website-current-product-truth.md` + `docs/website-public-claim-ledger.md`

Internal phase names (`PHASE-XXXVI`, `VRI`, etc.) are **never** published on public pages.

---

## Preferred public terms

| Term | Meaning | Notes |
|---|---|---|
| Independent AI action authorization | Company-level category | Default definition |
| Governed AI transaction | End-to-end request → (optional) provider → declared action → effect/evidence | Prefer over “request-only control” |
| Request Admission Authorization | Decision whether application may invoke AI provider | Binary ALLOW/DENY |
| AI-Generated Result | Provider-returned payload | Not enterprise authority |
| Untrusted Proposal | Result/tool proposal pending independent authorization | Required framing |
| Intended Enterprise Action | Action declared by enterprise application | Customer-owned declaration |
| Result-to-Action Authorization | Authorization of the declared intended action | Not semantic response scoring |
| Active Verified Release | Currently active governed release | Public noun |
| Compliance Playbook | Governed control content packaged in releases | Public noun |
| Verifiable Decision Record | Decision evidence artifact | Public noun |
| BeaconGuard Verify | Read-only verification surface | Functional domain, not assumed network plane |
| Decision Explorer | Investigation UI over decisions | Lab/prevalidation qualification as needed |
| Deterministic Reconstruction | Reconstruction from canonical evidence | Report missing fields honestly |
| Source Evidence | Underlying artifacts/fields used in reconstruction | |
| Replay Verification | Investigation replay of recorded decision | Distinct from admission replay protection |
| Verifiable Export | Signed/exportable investigation package | |
| AI-Assisted Insights | Non-authoritative assistance | Outside trusted path |
| Govern / Authorize / Verify | Functional domains | Do not auto-label as three network planes |

---

## Deprecated / avoid on public pages

| Avoid | Prefer |
|---|---|
| Control Before AI Execution (complete framing) | Governed AI transaction / dual authorization points |
| before model execution / before AI execution | before provider invocation / before governed action |
| request boundary (alone) | Request Admission Authorization / runtime control boundary |
| policy snapshot | Active Verified Release / Compliance Playbook hierarchy |
| evidence-grade | Verifiable Decision Record / investigation evidence |
| downstream system (ambiguous) | AI provider **or** enterprise system of record (explicit) |
| only ALLOW reaches the model (as complete outcome) | ALLOW may invoke provider; enterprise effect still requires action authorization where configured |
| governed AI/API (vague mashup) | governed AI, APIs, or automated systems — or specific actor |
| NEEDS_REVIEW as permission | REVIEW_REQUIRED as DENY reason only if used |
| production-ready | controlled internal qualification |

---

## Outcome vocabulary

- Runtime permission outcomes: **ALLOW** or **DENY** only.
- Review may produce obligations/grants; it does **not** convert a recorded DENY into ALLOW.
- Later authorization uses a **new** governed request/transaction where applicable.

---

## Responsibility vocabulary

| Actor | Public role |
|---|---|
| AI Provider | Produces the model result |
| Enterprise Application | Declares intended action; provides required context; executes only authorized actions |
| BeaconGuard | Authorizes or denies under Active Verified Release; records evidence; provides Verify |
| Enterprise System of Record | Remains authoritative for resulting business state |
| Customer Governance | Retains clinical, legal, operational, compliance, and business judgment |

---

## Freeze

```text
WEBSITE_CANONICAL_TERMINOLOGY_FROZEN_2026-08-01
```
