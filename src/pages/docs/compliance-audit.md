---
title: Compliance and Audit
layout: /src/layouts/BaseLayout.astro
---

# Compliance and Audit

BeaconGuard is designed to support **auditability, governance review, and
decision reconstruction** for high-risk enterprise workflows. It produces
**Verifiable Decision Records** from deterministic ALLOW or DENY results.

BeaconGuard does not make legal compliance guarantees and does not replace
customer privacy, security, clinical, AML, fraud, SIEM, IAM, or GRC programs.

---

## Compliance Support Objectives

BeaconGuard is designed to support common review needs:

- Deterministic Decision Results: **ALLOW** or **DENY** before governed execution
- Explicit reason codes (for example `APPROVAL_REQUIRED` when approval is absent)
- Signed request metadata, workflow identity, trust signals, freshness windows,
  and replay-related inputs where configured
- Explicit, versioned Compliance Playbook intent via release identity
- Integrity-protected decision evidence designed for replay and verification
- Separation of management plane (playbook lifecycle) from runtime data plane

These properties support post-hoc verification without probabilistic
authorization explanations.

---

## Verifiable Decision Record

Every evaluation produces a structured Verifiable Decision Record containing,
at minimum:

- Timestamp and request / correlation identifiers
- Decision outcome (**ALLOW** or **DENY**) and reason codes
- **release_identity** and **playbook_identity**
- Normalized decision context
- Trust, Freshness, and Replay Check outcomes where applicable
- Optional review obligations that do **not** change the permission result

Records preserve release identity and decision context so reviewers can
reconstruct what was evaluated.

---

## Evidence Claims (qualified)

BeaconGuard treats decision output as **evidence for governance and audit
support**, with these qualified properties:

- Evidence is **integrity-protected decision evidence**
- It is **designed for replay and verification**
- It **preserves release identity and decision context**
- It **supports audit and governance review**
- It **supports append-only retention when configured** with a required
  evidence provider
- Retention, durability, and storage integrity controls are
  **deployment-dependent** and shared with the customer

Do not assume universal append-only, immutable, or tamper-evident storage
without the configured evidence provider and operational controls.

---

## Deterministic Replay

When release artifacts and recorded normalized inputs are available, replay
supports:

- Re-evaluating a historical request against the recorded Active Verified
  Release / release identity
- Obtaining the same Deterministic Decision Result
- Supporting incident investigation and third-party technical review

Replay quality depends on preserved evidence, release availability, and
environment configuration.

---

## Failure Visibility

Failure conditions are explicitly recorded.

If evaluation fails due to missing artifacts, verification errors, trust or
freshness failures, or internal faults:

- The decision fails closed as **DENY**
- The failure category is recorded
- No permissive fallback is allowed

---

## Scope Boundaries

BeaconGuard control assertions apply to:

- Authorization decisions at the Runtime Control Boundary
- Deterministic Playbook Evaluation
- Verifiable Decision Record generation

They do not extend to:

- Model training data or model internal reasoning
- Downstream application behavior beyond respecting ALLOW / DENY
- Replacement of EHR, AML, fraud, SIEM, IAM, GRC, case-management, or
  workflow systems of record

---

## Intended Reviewers

- Compliance and risk teams
- Internal and external auditors
- Security and architecture reviewers
- Governance stakeholders

---

## Related Sections

- [Policy Model](/docs/policy-model)
- [Enforcement Runtime](/docs/enforcement-runtime)
- [Threat Model](/docs/threat-model)
- [Proof and Evidence samples](/proof-evidence)
