---
title: Threat Model
layout: /src/layouts/BaseLayout.astro
---

# Threat Model

This document describes the **explicit threat model** for BeaconGuard. It
enumerates assumptions, assets, and threat categories relevant to release
lifecycle, runtime enforcement, and evidence.

The goal is not to claim absolute security, but to make **attack surfaces and
failure modes explicit and reviewable**. Mitigations listed here are product
design intents already reflected in the architecture; they are not guarantees
against every deployment-specific failure.

See also: [DFD and Threat Flow](/docs/dfd-threat-flow).

---

## Security Assumptions

BeaconGuard operates under assumptions including:

- The Runtime Control Boundary executes in a controlled customer environment
- Cryptographic primitives are correctly implemented and not broken
- Compliance Playbooks are authored and Signed Immutable Release Artifacts are
  signed by parties trusted by the customer
- Identity providers, network controls, secrets, and host hardening are
  operated by the customer
- Transport-level security (for example TLS) is provided by the deployment
  environment
- Evidence-provider configuration and operational monitoring are customer
  responsibilities when durability or append-only behavior is required

If these assumptions do not hold, BeaconGuard control assertions may not apply.

---

## Protected Assets

- Compliance Playbooks and compiled control representations
- Signed Immutable Release Artifacts and Active Verified Release integrity
- Authorization decision semantics (ALLOW / DENY)
- Verifiable Decision Records and reconstructable decision context
- Deterministic replay capability when evidence and releases are available
- Provenance via release_identity and playbook_identity

---

## Threat Categories

### Release Tampering or Unauthorized Activation

**Threat:** An attacker modifies playbook content, substitutes a release, or
activates an unverified artifact so runtime evaluation uses unapproved
controls.

**Relevant controls / design intent:**
- Signing of release packages before distribution
- Release Verification and Activation before an Active Verified Release governs
  evaluation
- recording of release_identity on Verifiable Decision Records

---

### System Connector Compromise

**Threat:** A compromised System Connector injects false context, strips
required trust signals, or presents malformed normalized inputs.

**Relevant controls / design intent:**
- Connector does not evaluate controls or activate releases
- Runtime still performs Request Validation and Context Normalization plus
  Trust, Freshness, and Replay Checks
- Fail-closed DENY when required signals are missing or invalid

Customer hardening of connector hosts and credentials remains in scope for the
deployment environment.

---

### Control-Plane Compromise

**Threat:** Compromise of the BeaconGuard Control Plane / management plane
allows unauthorized playbook changes, signing, or distribution.

**Relevant controls / design intent:**
- Separation of management plane from runtime data plane
- Runtime accepts only verified, activated releases
- Explicit activation rather than silent draft evaluation

Key management, access control, and operational monitoring of the control plane
are shared deployment responsibilities.

---

### Identity Provider (IdP) Compromise or Misbinding

**Threat:** Compromised or misconfigured identity signals cause incorrect role
or actor attributes to reach evaluation.

**Relevant controls / design intent:**
- BeaconGuard evaluates attributes as provided in trusted request context; it
  does not replace the IdP
- Missing or invalid required attributes fail closed as DENY

IdP integrity and attribute binding remain customer-owned.

---

### Replay-State Provider Failure or Manipulation

**Threat:** When a replay-state provider is used, an attacker suppresses,
forges, or desynchronizes replay state to force incorrect admission outcomes.

**Relevant controls / design intent:**
- Replay-state providers, when used, are external to core decision evaluation
  and must be configured for fail-closed operation
- Failed freshness or replay checks return DENY

Provider availability and integrity are deployment-dependent.

---

### Evidence Suppression or Alteration

**Threat:** An attacker deletes, alters, or suppresses Verifiable Decision
Records to hide DENY/ALLOW history.

**Relevant controls / design intent:**
- Integrity-protected decision evidence designed for replay and verification
- Support for append-only retention when configured with a required evidence
  provider
- release_identity and decision context embedded in records

Universal tamper-evidence is not claimed without the configured evidence
provider and customer operational controls.

---

### Signing Key Compromise

**Threat:** Compromise of release-signing or related keys allows forged
Signed Immutable Release Artifacts.

**Relevant controls / design intent:**
- Runtime verification of release signatures before activation
- Explicit rollback and re-activation processes after key events

Key custody, rotation, and HSM or KMS choices are customer / deployment
responsibilities.

---

### Unauthorized Authorization Bypass

**Threat:** An attacker attempts to force ALLOW through malformed inputs or
permissive fallbacks.

**Relevant controls / design intent:**
- Fail-closed semantics
- Explicit input normalization
- No review-as-permission path
- Deterministic evaluation with ALLOW / DENY only

---

### Downstream Bypass of the Control Boundary

**Threat:** Applications call governed systems without presenting requests to
the Runtime Control Boundary.

**Relevant controls / design intent:**
- Product placement assumes the boundary is on the governed execution path
- Network and application architecture must prevent silent bypass

Bypass prevention outside BeaconGuard’s process boundary is a customer
deployment responsibility.

---

## Non-Goals and Explicit Exclusions

BeaconGuard does **not** claim to mitigate:

- Compromise of the underlying operating system or hypervisor
- Insider threats with legitimate signing authority
- Vulnerabilities in AI model training data or model internals
- Downstream misuse of outputs after an ALLOW decision
- Replacement of SIEM, IAM, GRC, or customer security programs

---

## Residual Risk

- Misconfiguration can DENY legitimate governed execution
- Playbook authoring errors can encode incorrect intent
- Key management failures undermine release integrity assertions
- Evidence durability depends on provider configuration and operations

BeaconGuard prioritizes **visibility and determinism** over silent tolerance.

---

## Related Sections

- [System Architecture](/docs/architecture)
- [DFD and Threat Flow](/docs/dfd-threat-flow)
- [Policy Model](/docs/policy-model)
- [Compliance and Audit](/docs/compliance-audit)
- [Enforcement Runtime](/docs/enforcement-runtime)
