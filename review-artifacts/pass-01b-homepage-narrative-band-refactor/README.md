# Pass 01B — Homepage Narrative Band Refactor

```
IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_HOMEPAGE_REVIEW
```

| Field | Value |
| --- | --- |
| Starting staging HEAD | `e0295e92f0a4bd5f96178e093a2b045e295c497c` |
| Final implementation commit | `3012e8965c4f603181be8ad292ab6c5eb672ad6d` |
| Preview port | `4341` |
| Status | `IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_HOMEPAGE_REVIEW` |
| Approved PNG modified | **No** |
| Main changed | **No** |
| Production deployed | **No** |

## Approved PNG

| Item | Value |
| --- | --- |
| Path | `public/images/diagrams/beaconguard-governed-transaction.png` |
| SHA-256 before | `1F3B5EC10431787D1D51C65AF88B94AF82838E7E0C1746F1FA7EFB1932616371` |
| SHA-256 after | `1F3B5EC10431787D1D51C65AF88B94AF82838E7E0C1746F1FA7EFB1932616371` |

## Files changed

- `src/pages/index.astro`
- `src/layouts/BaseLayout.astro` (`pageClass` support retained from hero geometry fix)
- `src/components/diagrams/GovernAuthorizeVerify.astro`
- `src/styles/global.css`
- `scripts/validate-homepage-hero-layout.mjs`
- `scripts/validate-homepage-narrative-layout.mjs`
- `STAGING_REVIEW.md`
- `review-artifacts/LATEST_PASS.txt`
- `review-artifacts/pass-01b-homepage-narrative-band-refactor/**`

## Outer widget classes removed / neutralized on homepage

- Removed homepage use of `homepage-block`, `marketing-section`, and `cta-band` panel chrome
- Neutralized `.page-home .homepage-block`, `.marketing-section`, `.cta-band` borders/radius/backgrounds
- Disclosure restyled as `.home-disclose` (row, not nested widget)

## Band classes introduced

- `.home-band`, `.home-band--base`, `.home-band--soft`, `.home-band--emphasis`
- `.home-band-inner` (max-width 1180px)
- `.home-auth-pair` / `.home-auth-card`
- `.home-workflow-grid` / `.home-workflow-card`
- `.home-verify-editorial`
- `.home-qualify-wrap`

## Duplicate title removal

- Page owns single H2: `Govern · Authorize · Verify`
- `GovernAuthorizeVerify` homepage variant uses `showTitle={false}` / `variant="homepage"` and does not render a second title

## Govern / Authorize / Verify hierarchy

- Desktop grid `0.85fr 1.3fr 0.85fr`
- Authorize column wider / stronger border and padding
- All three domains remain visible (no tabs)

## Hero CTA

| | Before | After |
| --- | --- | --- |
| Count | 3 | 2 |
| Actions | Controlled Evaluation, How It Works, Explore Verification | Controlled Evaluation, How It Works |

## Verification link relocation

- Removed from hero
- Placed in Verification and evidence band with Inspect Proof and Evidence

## Validation

- Desktop: bands full-bleed, inners aligned, Authorize dominant, no widget radius on major bands, no overflow
- Mobile: stacked grids, no overflow, one GAV H2, approved image uncropped
- Scripts: `validate-homepage-hero-layout.mjs`, `validate-homepage-narrative-layout.mjs` PASS

## Main integrity

| Check | Result |
| --- | --- |
| Branch | `main` |
| HEAD | `1b80a59261b99d3e0bf5cf1900fd8e4e8b17d810` |
| Digest | `5972a6d82362bea138d928435294edf074f8865cd7f2fa1e34c0aaa65dbb173f` |

## Screenshot inventory

- [responsive/homepage-band-refactor-1920.png](responsive/homepage-band-refactor-1920.png)
- [responsive/homepage-band-refactor-1440.png](responsive/homepage-band-refactor-1440.png)
- [responsive/homepage-band-refactor-1280.png](responsive/homepage-band-refactor-1280.png)
- [responsive/homepage-band-refactor-1024.png](responsive/homepage-band-refactor-1024.png)
- [responsive/homepage-band-refactor-768.png](responsive/homepage-band-refactor-768.png)
- [responsive/homepage-band-refactor-390.png](responsive/homepage-band-refactor-390.png)
- [crops/hero-1440.png](crops/hero-1440.png)
- [crops/governed-transaction-band-1440.png](crops/governed-transaction-band-1440.png)
- [crops/govern-authorize-verify-band-1440.png](crops/govern-authorize-verify-band-1440.png)
- [crops/priority-workflows-band-1440.png](crops/priority-workflows-band-1440.png)
- [crops/verification-band-1440.png](crops/verification-band-1440.png)
- [crops/controlled-evaluation-band-1440.png](crops/controlled-evaluation-band-1440.png)
- [comparisons/homepage-widget-vs-band-1440.png](comparisons/homepage-widget-vs-band-1440.png)

## Remaining visual limitations

- Soft/emphasis bands use restrained top hairlines (not enclosing boxes)
- Workflow and domain cards retain light local borders for entry-path clarity
- Site-wide adoption of bands on other marketing pages is not authorized
- Independent homepage visual review still required
- Pass 01C / Pass 02 unauthorized
