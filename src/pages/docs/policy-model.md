---
title: Policy Model
layout: /src/layouts/BaseLayout.astro
---

# Policy Model

BeaconGuard policy is expressed as **explicit authorization intent** that is:

- **Deterministic**
- **Versioned**
- **Signed**
- **Replayable**

The policy model is designed to produce the same decision outcome given the same inputs and the same policy snapshot.

---

## Policy Snapshot

A **Policy Snapshot** is the immutable unit of evaluation.

A snapshot includes:

- Policy definitions (rules, constraints, decision semantics)
- Policy metadata (version, identifiers)
- Cryptographic signatures (integrity and provenance)
- References to required reference artifacts (if applicable)

A snapshot is treated as read-only once published.

---

## Inputs and Normalization

Authorization decisions must be evaluated on **normalized inputs**.

Normalization ensures:

- Stable field names and types
- Stable ordering for deterministic hashing/audit
- Rejection or explicit mapping of unknown/invalid inputs
- No reliance on model-provided interpretations

---

## Decision Outputs

A decision output is a minimal, structured result:

- **ALLOW** or **DENY** (and optionally a bounded degraded mode if explicitly defined)
- Deterministic reason codes
- Policy identifier and version
- Optional obligations (if required by policy)

Outputs are designed for auditability and deterministic replay, not human storytelling.

---

## Policy Provenance and Integrity

BeaconGuard treats policy as a governed artifact.

The following are non-negotiable:

- Policy snapshots are signed before use
- Enforcement accepts only verified snapshots
- Snapshot identity is recorded in every audit record
- Rollback is explicit and versioned (no silent edits)

This prevents policy drift and creates evidence-grade traceability.

---

## Failure Semantics

Policy evaluation is **fail-closed** by default.

If required policy artifacts are missing, invalid, or unverifiable:

- The system must return **DENY**
- The audit record must show the failure category and policy identity (if known)

No permissive fallback behavior is allowed.

---

## Related Sections

- [Overview](/docs/overview)
- [System Architecture](/docs/architecture)