---

title: DFD and Threat Flow

layout: /src/layouts/BaseLayout.astro

---



\# DFD and Threat Flow



This document describes the \*\*Data Flow Diagram (DFD)\*\* and associated threat

model for the BeaconGuard public website.



It translates the static architectural view into a \*\*flow-based security view\*\*

suitable for threat modeling and external security review.



This page is \*\*not marketing documentation\*\*.



---



\## Scope and Intent



This DFD applies \*\*only\*\* to:

\- The public BeaconGuard website

\- Static documentation delivery

\- A no-JavaScript, no-client-logic architecture



It does \*\*not\*\* describe:

\- BeaconGuard runtime enforcement

\- Authorization decisions

\- Policy evaluation behavior



---



\## Key Constraint: No Client-Side Logic



The website intentionally contains \*\*no client-side JavaScript\*\*.



As a result:

\- The browser acts only as a passive renderer

\- No client-side state, logic, or enforcement exists

\- All meaningful behavior occurs at the Edge or Origin layers



---



\## Trust Boundaries



\- \*\*User Agent\*\* — Untrusted client

\- \*\*Public Internet / DNS\*\* — Untrusted network

\- \*\*Edge / CDN\*\* — Semi-trusted delivery and enforcement layer

\- \*\*Origin\*\* — Static file source of truth

\- \*\*Build / CI Pipeline\*\* — Trusted but high-risk supply chain boundary

\- \*\*Source \& Artifacts\*\* — Integrity-sensitive assets



---



\## Data Flow Diagram (Security View)



```mermaid

flowchart LR

&nbsp; E1\[User Agent / Browser]:::ext

&nbsp; E2\[DNS Resolver]:::ext



&nbsp; P1\[Edge / CDN<br/>Routing + Cache]:::proc

&nbsp; D5\[(Edge Cache)]:::store



&nbsp; P2\[Origin Static Server<br/>(Immutable Files)]:::proc

&nbsp; D4\[(Origin Storage<br/>Static Bundle)]:::store



&nbsp; P3\[Build Pipeline<br/>(Astro Build)]:::proc

&nbsp; D1\[(Source Repository)]:::store

&nbsp; D2\[(Dependency Registry<br/>npm)]:::store

&nbsp; D3\[(Build Artifacts<br/>Static Output)]:::store



&nbsp; E1 -->|HTTP GET /path| P1

&nbsp; P1 -->|Cache lookup| D5

&nbsp; D5 -->|Cache hit| P1

&nbsp; P1 -->|Cache miss| P2

&nbsp; P2 -->|Read static file| D4

&nbsp; D4 -->|File bytes| P2

&nbsp; P2 -->|Response| P1

&nbsp; P1 -->|Response| E1

&nbsp; P1 -->|Store response| D5



&nbsp; D1 -->|Source files| P3

&nbsp; D2 -->|Pinned deps| P3

&nbsp; P3 -->|Static artifacts| D3

&nbsp; D3 -->|Deploy| D4



&nbsp; classDef ext fill:#ffffff,stroke:#333,stroke-width:1px;

&nbsp; classDef proc fill:#eef2ff,stroke:#333,stroke-width:1px;

&nbsp; classDef store fill:#ecfeff,stroke:#333,stroke-width:1px;





```



---



\## Primary Threat Surfaces



\### Edge / CDN Layer (Highest Risk)

\- Cache poisoning

\- Cache key manipulation

\- Incorrect variation on headers or query strings

\- Cache deception attacks



The Edge is the \*\*primary enforcement point\*\* in a static architecture.



---



\### Build / CI Pipeline

\- Supply chain compromise via build-time dependencies

\- Lockfile drift

\- Artifact tampering prior to deployment



Build integrity directly affects all delivered content.



---



\### Origin Configuration

\- Incorrect MIME types

\- Path traversal via misconfiguration

\- Serving unintended files



Origin must serve \*\*static files only\*\*, without execution.



---



\## Validation Checklist

\- Static-only origin (no SSR, no runtime execution)

\- Deterministic URL-to-file mapping

\- Deterministic cache key strategy enforced at CDN

\- Immutable build artifacts per deploy

\- Pinned dependency versions in build pipeline



If any condition fails, the security posture is invalid.



---



\## Non-Goals

\- Authentication or authorization

\- User-specific content

\- Private documentation access

\- Runtime policy enforcement



---



\## Related Sections

\- \[System Architecture](/docs/architecture)

\- \[Threat Model](/docs/threat-model)

\- \[Compliance and Audit](/docs/compliance-audit)



