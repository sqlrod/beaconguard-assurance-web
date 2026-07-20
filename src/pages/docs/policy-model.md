---
title: Policy Model
layout: /src/layouts/BaseLayout.astro
---

# Policy Model

BeaconGuard control intent is expressed as a **Compliance Playbook** that is
validated, compiled, approved, signed, and activated before runtime use.

The model is designed so that the same trusted inputs and the same
**Active Verified Release** produce the same Deterministic Decision Result.

---

## Release Hierarchy

<div class="docs-table-wrap">

| Stage | Role |
| --- | --- |
| Compliance Playbook | Authoritative control intent for a governed workflow |
| Validation and Compilation | Produces the deterministic compiled control representation |
| Signed Immutable Release Artifact | Release package binding playbook identity and compiled controls |
| Controlled Release Distribution | Distributes the signed artifact to runtime environments |
| Release Verification and Activation | Verifies required release integrity and trust conditions before activation |
| Active Verified Release | The verified release selected to govern runtime evaluation |
| Deterministic Playbook Evaluation | Evaluates normalized trusted context and returns ALLOW or DENY |

</div>

“Policy Snapshot” may appear in historical or internal material to describe a compiled deterministic control representation. It is not a separate runtime permission model and should not replace the current release-hierarchy terminology.

---

## Identities

Prefer these terms in integration and evidence:

- **playbook_identity** — identifies the Compliance Playbook lineage
- **release_identity** — identifies the Signed Immutable Release Artifact /
  Active Verified Release used for evaluation

Both identities should appear in Verifiable Decision Records so decisions can
be reconstructed against the correct release.

---

## Inputs and Normalization

Deterministic Playbook Evaluation requires **Request Validation and Context
Normalization**. Typical inputs include signed request metadata, workflow
identity, user role, source-system trust, approved-pathway status,
deterministic context tags, request IDs, timestamps, freshness windows, and
requested action.

Normalization ensures:

- Stable field names and types
- Stable ordering for deterministic hashing and audit reconstruction
- Rejection or explicit mapping of unknown or invalid inputs
- No reliance on probabilistic or model-provided interpretations

---

## Decision Outputs

Runtime permission results are binary:

- **ALLOW** — governed execution may proceed
- **DENY** — Execution Prevented; no downstream execution

When required approval is absent, the result is **DENY** with a deterministic
reason indicating that approval is required. An illustrative reason style is
`APPROVAL_REQUIRED`. Any governance or human-review obligation remains
separate from the runtime permission result; **review does not permit
execution**.

Outputs also include:

- Deterministic reasons or reason codes
- playbook_identity and release_identity
- Optional obligations (notification or review workflow only)

Runtime permission results do not include a review-as-permission state.

---

## Provenance and Integrity

- Releases are signed before use (Signed Immutable Release Artifact)
- The Runtime Control Boundary accepts only an Active Verified Release
- release_identity is recorded on every Verifiable Decision Record
- Rollback and activation are explicit (no silent edits to active controls)

---

## Failure Semantics

Evaluation is **fail closed**.

If required release artifacts are missing, invalid, or unverifiable, or if
Trust, Freshness, or Replay Checks fail:

- The system must return **DENY**
- The Verifiable Decision Record must show the failure category and
  release_identity when known

No permissive fallback is allowed.

---

## Related Sections

- [Overview](/docs/overview)
- [Enforcement Runtime](/docs/enforcement-runtime)
- [System Architecture](/docs/architecture)
