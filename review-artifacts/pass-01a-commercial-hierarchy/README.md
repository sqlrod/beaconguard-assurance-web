# Pass 01A — Commercial hierarchy and high-fidelity diagram foundation

| Field | Value |
| --- | --- |
| Pass | 01A |
| Starting staging HEAD | `5bd8e05f0f77c663c2bc33e5c1fb8762915afefb` |
| Final implementation commit | `7c661ed94e17555c3f1d319a3ee9e54c567dab83` |
| Preview port | `4331` |
| Build result | Pass (27 pages) |
| Route count | 27 |
| Full-page screenshots | 27 |
| Responsive screenshots | 25 |
| Production deployment | Not authorized |
| Merge to main | Not authorized |

## Decisions from independent evaluation

Accepted:

- Programmatic code-based diagram framework.
- Strong semantic pathing.
- Dominant labeled trust boundaries.
- Vendor-neutral entity iconography.
- Diagram typography hierarchy.
- Progressive disclosure.
- Single primary homepage conversion.
- Downloadable procurement artifacts as later work.

Modified:

- Layered or 2.5D treatment is limited to high-level functional-domain visuals.
- Technical topology and transaction diagrams remain orthographic.
- Core transaction summary remains visible.
- Native disclosure is preferred over modals.
- Spacing is scoped rather than globally fixed at 120 px.
- Tables remain semantic HTML.

Rejected:

- Physical separation claims unsupported by topology.
- Financial Services subordination.
- Public healthcare-first commitment.
- Unvalidated latency publication.
- Hiding the differentiator from the initial viewport.
- Agency expenditure before customer validation.

## Exact files changed (pre-commit working set)

```
src/components/diagrams/GovernAuthorizeVerify.astro
src/components/diagrams/GovernedTransactionLoop.astro
src/pages/canonical-workflow.astro
src/pages/how-it-works.astro
src/pages/index.astro
src/pages/verification.astro
src/styles/global.css
.github/
review-artifacts/ARTIFACT_POLICY.md
review-artifacts/pass-01a-commercial-hierarchy/
src/components/diagrams/GovernedTransactionSummary.astro
src/components/diagrams/primitives/
```

## Homepage hero correction

- Left-aligned two-column desktop hero.
- H1 exactly two visual lines at 1440 (validated; each sentence one line).
- Primary CTA only: Request Controlled Evaluation.
- Compact GovernedTransactionSummary on the right.

## Verification hero correction

- Left-aligned two-column hero.
- Exactly two hero buttons.
- Read-only verification hierarchy paired on the right.

## CTA hierarchy

Primary: Controlled Evaluation. Secondary: How It Works. Text: Verification.

## Transaction-loop geometry

- GovernedTransactionLoop uses HTML nodes + SVG connector layer.
- Returned result enters Enterprise Application RECEIVE AND DECLARE.
- ALLOW permits application execution (no returns-authority wording).
- Dual DENY hard stops terminate independently.
- Six lifecycle stages only.

## Trust-boundary / iconography / semantic pathing / typography

- Labeled trust boundaries with CSS tokens.
- Vendor-neutral DiagramIcon primitives.
- DENY orange/red, ALLOW green, evidence teal, neutral blue.
- Title / role / description hierarchy inside diagram nodes.

## Platform hierarchy

- Layered Govern-Authorize-Verify with Authorize emphasized.
- Functional-domain wording; no physical-plane claims.

## Footer and header

- footer-inner--pass01 .footer-center forced static/left.
- Desktop logo height reduced to 68 px.

## Deferred items

Proof progressive disclosure, JSON viewer, matrix interactivity, sticky docs nav, Security/Trust condensation, docs IA, Architecture/DFD/Deployment redesigns, Reviewer Kit/Matrix PDFs, latency publication.

## Full-page screenshots

| Route | Screenshot |
| --- | --- |
| `/` | [home.png](./fullpage/home.png) |
| `/platform` | [platform.png](./fullpage/platform.png) |
| `/healthcare` | [healthcare.png](./fullpage/healthcare.png) |
| `/fintech` | [financial-services.png](./fullpage/financial-services.png) |
| `/verification` | [verification.png](./fullpage/verification.png) |
| `/security` | [security.png](./fullpage/security.png) |
| `/design-partner-program` | [controlled-evaluation.png](./fullpage/controlled-evaluation.png) |
| `/docs` | [documentation.png](./fullpage/documentation.png) |
| `/contact` | [contact.png](./fullpage/contact.png) |
| `/how-it-works` | [how-it-works.png](./fullpage/how-it-works.png) |
| `/proof-evidence` | [proof-and-evidence.png](./fullpage/proof-and-evidence.png) |
| `/canonical-workflow` | [canonical-workflow.png](./fullpage/canonical-workflow.png) |
| `/trust-assurance` | [trust-center.png](./fullpage/trust-center.png) |
| `/company` | [company.png](./fullpage/company.png) |
| `/reviewer-kit` | [reviewer-kit.png](./fullpage/reviewer-kit.png) |
| `/control-responsibility-matrix` | [control-responsibility-matrix.png](./fullpage/control-responsibility-matrix.png) |
| `/deployment` | [deployment.png](./fullpage/deployment.png) |
| `/use-cases` | [use-cases.png](./fullpage/use-cases.png) |
| `/sample-decision-record` | [sample-decision-record.png](./fullpage/sample-decision-record.png) |
| `/docs/overview` | [docs-overview.png](./fullpage/docs-overview.png) |
| `/docs/architecture` | [docs-architecture.png](./fullpage/docs-architecture.png) |
| `/docs/policy-model` | [docs-policy-model.png](./fullpage/docs-policy-model.png) |
| `/docs/enforcement-runtime` | [docs-enforcement-runtime.png](./fullpage/docs-enforcement-runtime.png) |
| `/docs/compliance-audit` | [docs-compliance-audit.png](./fullpage/docs-compliance-audit.png) |
| `/docs/deployment-integration` | [docs-deployment-integration.png](./fullpage/docs-deployment-integration.png) |
| `/docs/threat-model` | [docs-threat-model.png](./fullpage/docs-threat-model.png) |
| `/docs/dfd-threat-flow` | [docs-dfd-threat-flow.png](./fullpage/docs-dfd-threat-flow.png) |

## Responsive screenshots

| Screenshot |
| --- |
| [canonical-workflow-1024.png](./responsive/canonical-workflow-1024.png) |
| [canonical-workflow-1440.png](./responsive/canonical-workflow-1440.png) |
| [canonical-workflow-1920.png](./responsive/canonical-workflow-1920.png) |
| [canonical-workflow-390.png](./responsive/canonical-workflow-390.png) |
| [canonical-workflow-768.png](./responsive/canonical-workflow-768.png) |
| [home-1024.png](./responsive/home-1024.png) |
| [home-1440.png](./responsive/home-1440.png) |
| [home-1920.png](./responsive/home-1920.png) |
| [home-390.png](./responsive/home-390.png) |
| [home-768.png](./responsive/home-768.png) |
| [how-it-works-1024.png](./responsive/how-it-works-1024.png) |
| [how-it-works-1440.png](./responsive/how-it-works-1440.png) |
| [how-it-works-1920.png](./responsive/how-it-works-1920.png) |
| [how-it-works-390.png](./responsive/how-it-works-390.png) |
| [how-it-works-768.png](./responsive/how-it-works-768.png) |
| [platform-1024.png](./responsive/platform-1024.png) |
| [platform-1440.png](./responsive/platform-1440.png) |
| [platform-1920.png](./responsive/platform-1920.png) |
| [platform-390.png](./responsive/platform-390.png) |
| [platform-768.png](./responsive/platform-768.png) |
| [verification-1024.png](./responsive/verification-1024.png) |
| [verification-1440.png](./responsive/verification-1440.png) |
| [verification-1920.png](./responsive/verification-1920.png) |
| [verification-390.png](./responsive/verification-390.png) |
| [verification-768.png](./responsive/verification-768.png) |