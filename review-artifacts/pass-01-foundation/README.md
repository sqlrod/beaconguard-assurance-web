# Pass 01 — Visual foundation

| Field | Value |
| --- | --- |
| Pass | 01 |
| Objective | Controlled visual-foundation correction (nav, footer, widths, homepage, closed-loop transaction, How It Works, Canonical Workflow, Platform, industry positioning) |
| Source commit before Pass 01 | `1de043d92e1d6e5d410dbf38a31bae5ade3fd12e` |
| Preview port | `4330` |
| Build result | Pass (27 pages) |
| Route count | 27 |
| Full-page screenshots | 27 (1440 x 900) |
| Responsive screenshots | 30 (390 / 768 / 1440 for required subset) |
| Production deployment | Not authorized |
| Merge to main | Not authorized |

## Exact files changed

```
M	src/layouts/BaseLayout.astro
M	src/pages/canonical-workflow.astro
M	src/pages/company.astro
M	src/pages/fintech.astro
M	src/pages/healthcare.astro
M	src/pages/how-it-works.astro
M	src/pages/index.astro
M	src/pages/platform.astro
M	src/styles/global.css
```

## Diagram changes

- Added `src/components/diagrams/GovernedTransactionLoop.astro` closed-loop / circuit layout.
- Homepage uses `variant=simplified`.
- How It Works uses `variant=detailed` with six-stage strip.
- Canonical Workflow uses `variant=complete`.
- Platform no longer leads with the full transaction diagram; uses Govern–Authorize–Verify product map.
- Architecture and DFD diagrams not redesigned in Pass 01.

## Navigation changes

Desktop primary nav: Platform, Healthcare, Financial, Verification, Security, Controlled Evaluation, Documentation, Contact.

Financial restored to the primary header. Collapsed accessible menu remains at <=900px.

## Footer changes

Previous: multi-column site-map style footer.

New restrained three-area footer:

- Left: BeaconGuard Assurance + product category
- Center: official slogan + proof statement
- Right: Platform, Verification, Trust Center, Contact

Stacks on narrow widths.

## Industry-positioning changes

Removed INITIAL MARKET / expansion-vertical framing. Healthcare and Financial Services use workflow labels. Company states BeaconGuard is evaluating bounded workflows across healthcare, financial services, and regulated internal automation.

## Known residual issues deferred to Pass 02+

- Architecture diagram redesign
- DFD diagram redesign
- Deployment diagram redesign
- Documentation information architecture
- Verification product screenshots / progressive disclosure on Proof
- Security and Trust Center condensation
- Further length reduction on long marketing pages

## Full-page screenshots

| Route | Full-page screenshot |
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
| [canonical-workflow-1440.png](./responsive/canonical-workflow-1440.png) |
| [canonical-workflow-390.png](./responsive/canonical-workflow-390.png) |
| [canonical-workflow-768.png](./responsive/canonical-workflow-768.png) |
| [docs-architecture-1440.png](./responsive/docs-architecture-1440.png) |
| [docs-architecture-390.png](./responsive/docs-architecture-390.png) |
| [docs-architecture-768.png](./responsive/docs-architecture-768.png) |
| [docs-dfd-threat-flow-1440.png](./responsive/docs-dfd-threat-flow-1440.png) |
| [docs-dfd-threat-flow-390.png](./responsive/docs-dfd-threat-flow-390.png) |
| [docs-dfd-threat-flow-768.png](./responsive/docs-dfd-threat-flow-768.png) |
| [fintech-1440.png](./responsive/fintech-1440.png) |
| [fintech-390.png](./responsive/fintech-390.png) |
| [fintech-768.png](./responsive/fintech-768.png) |
| [healthcare-1440.png](./responsive/healthcare-1440.png) |
| [healthcare-390.png](./responsive/healthcare-390.png) |
| [healthcare-768.png](./responsive/healthcare-768.png) |
| [home-1440.png](./responsive/home-1440.png) |
| [home-390.png](./responsive/home-390.png) |
| [home-768.png](./responsive/home-768.png) |
| [how-it-works-1440.png](./responsive/how-it-works-1440.png) |
| [how-it-works-390.png](./responsive/how-it-works-390.png) |
| [how-it-works-768.png](./responsive/how-it-works-768.png) |
| [platform-1440.png](./responsive/platform-1440.png) |
| [platform-390.png](./responsive/platform-390.png) |
| [platform-768.png](./responsive/platform-768.png) |
| [proof-evidence-1440.png](./responsive/proof-evidence-1440.png) |
| [proof-evidence-390.png](./responsive/proof-evidence-390.png) |
| [proof-evidence-768.png](./responsive/proof-evidence-768.png) |
| [verification-1440.png](./responsive/verification-1440.png) |
| [verification-390.png](./responsive/verification-390.png) |
| [verification-768.png](./responsive/verification-768.png) |
