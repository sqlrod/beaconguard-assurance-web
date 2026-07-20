---
title: Enforcement Runtime
layout: /src/layouts/BaseLayout.astro
---

# Enforcement Runtime

The BeaconGuard **Runtime Control Boundary** (enforcement runtime) evaluates
trusted request context against the **Active Verified Release** and produces a
Deterministic Decision Result—**ALLOW** or **DENY**—before governed execution.

It is designed to be:

- Deterministic
- Fail closed
- Independently deployable on the runtime data plane
- Auditable by construction via Verifiable Decision Records

---

## Role in the System

The Runtime Control Boundary sits on the path to a **Governed AI / API /
Automated System**. Its responsibility is to decide whether governed execution
is permitted or prevented under the Active Verified Release, and to emit a
Verifiable Decision Record.

It does not:

- Modify prompts or rewrite application payloads as a product function
- Inspect model internals
- Perform heuristic or probabilistic authorization
- Replace systems of record or workflow applications
- Treat human review as a permission to execute

### Optional System Connector

Some applications do not natively produce the required request format. The
optional **System Connector** maps source protocols and context into the
required structure before Request Validation and Context Normalization.

The System Connector does not evaluate controls, activate releases, or bypass
enforcement.

---

## Evaluation Path

1. **Request Validation and Context Normalization**
2. **Trust, Freshness, and Replay Checks**
3. **Deterministic Playbook Evaluation** against the Active Verified Release
4. **Deterministic Decision Result** — ALLOW or DENY
5. **Verifiable Decision Record** emission for Evidence, Replay, and Verification

Given the same Active Verified Release and the same trusted normalized inputs,
the runtime produces the same decision.

---

## Runtime Source of Truth

At evaluation time, the **Active Verified Release** is the source of truth for
control semantics. Management-plane playbook drafts and unsigned artifacts do
not govern runtime decisions until they pass Release Verification and
Activation.

---

## Decision Contract

<div class="docs-table-wrap">

| Result | Meaning |
| --- | --- |
| ALLOW | Required controls are satisfied; governed execution may proceed. |
| DENY | Execution is prevented; no downstream execution occurs. |

</div>

When required approval is absent, BeaconGuard returns DENY with a deterministic reason indicating that approval is required. An illustrative reason style is `APPROVAL_REQUIRED`. Any governance or human-review obligation remains separate from the runtime permission result.

---

## Failure Semantics

The runtime operates under **fail-closed** semantics.

If any of the following occur:

- Active Verified Release cannot be verified or is not activated
- Required artifacts or trust signals are missing or invalid
- Approved-pathway status is missing or invalid when required
- Freshness or replay checks fail
- Input normalization fails
- Internal evaluation error occurs

The runtime must:

- Return **DENY**
- Emit a Verifiable Decision Record describing the failure category

Silent fallback or permissive behavior is prohibited.

---

## Evidence Emission

For every evaluation the runtime emits integrity-protected decision evidence
designed for replay and verification. Records preserve release identity,
playbook identity, decision context, check outcomes, and the ALLOW or DENY
result. Storage durability and append-only behavior depend on the configured
evidence provider and shared customer deployment responsibilities.

---

## Related Sections

- [Overview](/docs/overview)
- [Policy Model](/docs/policy-model)
- [Compliance and Audit](/docs/compliance-audit)
- [System Architecture](/docs/architecture)
- [How It Works](/how-it-works)
