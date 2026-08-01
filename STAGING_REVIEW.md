# BeaconGuard Website Staging Review

**WARNING: DO NOT MERGE WITHOUT RODNEY'S APPROVAL.**

This staging branch holds the current website reframe snapshot and subsequent visual redesign passes. It is not a production branch.

| Field | Value |
| --- | --- |
| Staging branch | `staging/website-visual-redesign-20260801` |
| Current / latest pass | **01 — visual foundation** |
| Source website HEAD (baseline) | `1b80a59261b99d3e0bf5cf1900fd8e4e8b17d810` |
| Preview port (Pass 01) | `4330` |
| Production deployment | Not authorized |
| Merge to main | Not authorized |

## Pass history

| Pass | Purpose | Commit | Artifacts |
| --- | --- | --- | --- |
| 00 | Pre-redesign visual baseline | `da49187fc8b513a10df447bce188790887198c0b` (index update `1de043d92e1d6e5d410dbf38a31bae5ade3fd12e`) | [pass-00-baseline](review-artifacts/pass-00-baseline/README.md) |
| 01 | Transaction cycle and visual foundation | *(pending Pass 01 commit)* | [pass-01-foundation](review-artifacts/pass-01-foundation/README.md) |

## Pass 01 screenshot index

- [`/`](review-artifacts/pass-01-foundation/fullpage/home.png)
- [`/platform`](review-artifacts/pass-01-foundation/fullpage/platform.png)
- [`/healthcare`](review-artifacts/pass-01-foundation/fullpage/healthcare.png)
- [`/fintech`](review-artifacts/pass-01-foundation/fullpage/financial-services.png)
- [`/verification`](review-artifacts/pass-01-foundation/fullpage/verification.png)
- [`/security`](review-artifacts/pass-01-foundation/fullpage/security.png)
- [`/design-partner-program`](review-artifacts/pass-01-foundation/fullpage/controlled-evaluation.png)
- [`/docs`](review-artifacts/pass-01-foundation/fullpage/documentation.png)
- [`/contact`](review-artifacts/pass-01-foundation/fullpage/contact.png)
- [`/how-it-works`](review-artifacts/pass-01-foundation/fullpage/how-it-works.png)
- [`/proof-evidence`](review-artifacts/pass-01-foundation/fullpage/proof-and-evidence.png)
- [`/canonical-workflow`](review-artifacts/pass-01-foundation/fullpage/canonical-workflow.png)
- [`/trust-assurance`](review-artifacts/pass-01-foundation/fullpage/trust-center.png)
- [`/company`](review-artifacts/pass-01-foundation/fullpage/company.png)
- [`/reviewer-kit`](review-artifacts/pass-01-foundation/fullpage/reviewer-kit.png)
- [`/control-responsibility-matrix`](review-artifacts/pass-01-foundation/fullpage/control-responsibility-matrix.png)
- [`/deployment`](review-artifacts/pass-01-foundation/fullpage/deployment.png)
- [`/use-cases`](review-artifacts/pass-01-foundation/fullpage/use-cases.png)
- [`/sample-decision-record`](review-artifacts/pass-01-foundation/fullpage/sample-decision-record.png)
- [`/docs/overview`](review-artifacts/pass-01-foundation/fullpage/docs-overview.png)
- [`/docs/architecture`](review-artifacts/pass-01-foundation/fullpage/docs-architecture.png)
- [`/docs/policy-model`](review-artifacts/pass-01-foundation/fullpage/docs-policy-model.png)
- [`/docs/enforcement-runtime`](review-artifacts/pass-01-foundation/fullpage/docs-enforcement-runtime.png)
- [`/docs/compliance-audit`](review-artifacts/pass-01-foundation/fullpage/docs-compliance-audit.png)
- [`/docs/deployment-integration`](review-artifacts/pass-01-foundation/fullpage/docs-deployment-integration.png)
- [`/docs/threat-model`](review-artifacts/pass-01-foundation/fullpage/docs-threat-model.png)
- [`/docs/dfd-threat-flow`](review-artifacts/pass-01-foundation/fullpage/docs-dfd-threat-flow.png)

## Known baseline defects (Pass 00)

1. Transaction diagrams are overly vertical.
2. The governed transaction does not clearly appear as a closed loop returning to the same enterprise application.
3. The same full transaction diagram is repeated too broadly.
4. Footer is crowded.
5. Financial Services is missing from primary navigation.
6. Healthcare is incorrectly presented as the locked initial market.
7. Marketing pages are too long and narrow.
8. Product pages resemble technical documentation.
9. Proof and Evidence is excessively long.
10. Trust Center and Security contain too much detail for their page roles.
11. Documentation lacks a sufficiently distinct information architecture.
12. The visual hierarchy has regressed despite improved product accuracy.

## Pass 01 status against baseline defects

| Defect | Status |
| --- | --- |
| 1 Overly vertical transaction | Addressed with closed-loop component (desktop circuit / mobile ordered stack) |
| 2 Closed loop returning to application | Addressed |
| 3 Diagram repeated too broadly | Partially addressed (Platform uses product map; Architecture/DFD deferred) |
| 4 Crowded footer | Addressed |
| 5 Financial missing from nav | Addressed |
| 6 Healthcare locked as initial market | Addressed |
| 7–12 Length / docs / Trust / Security / hierarchy | Intentionally deferred |