# Pass 01B — Homepage Vertical Hero (Full-Width Diagram)

```
IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_HOMEPAGE_REVIEW
```

| Field | Value |
| --- | --- |
| Starting staging HEAD | `a0f5e043a78668ade986aeee6e45574b21df6360` |
| Final implementation commit | `b772178bd171f9316556eb5a56f4cbefc528d5af` |
| Preview port | `4342` |
| Status | `IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_HOMEPAGE_REVIEW` |
| Approved PNG modified | **No** |
| Main changed | **No** |
| Production deployed | **No** |

## Side-by-side defects

- Architecture image compressed in a ~600px column
- Diagram labels too small at normal desktop zoom
- Headline and diagram competed for horizontal space
- Outer hero panel read as a dashboard widget

## Vertical structure

1. Eyebrow  
2. H1 (two explicit lines)  
3. Explanatory paragraph  
4. Proof statement  
5. Two CTAs  
6. Full-width approved diagram  

Markup: `.enterprise-hero` → `.enterprise-hero-copy` + `.enterprise-hero-diagram`

## Text alignment

All hero copy left-aligned (`text-align: left`; CTA `justify-content: flex-start`).

## Copy width

- Copy block max-width: **820px**
- Paragraph / proof max-width: **760px**
- H1 max-width: **900px**

## Diagram rendered widths

| Viewport | Diagram width |
| --- | --- |
| 1440 | **1200px** |
| 1920 | **1200px** |
| 1280 | **1200px** |
| 1024 | **963px** |
| 390 | content width |

## Hero border removal

No outer border, radius, box-shadow, or elevated panel on `.enterprise-hero`.

## CTA reduction

Hero: Request Controlled Evaluation + See How It Works only. Explore Verification remains in the Verification band.

## PNG SHA-256

| | Hash |
| --- | --- |
| Before | `1F3B5EC10431787D1D51C65AF88B94AF82838E7E0C1746F1FA7EFB1932616371` |
| After | `1F3B5EC10431787D1D51C65AF88B94AF82838E7E0C1746F1FA7EFB1932616371` |

## Files changed

- `src/pages/index.astro`
- `src/styles/global.css`
- `src/pages/staging-approved-homepage-diagram.astro`
- `public/images/review/homepage-hero-side-by-side-1440.png`
- `scripts/validate-homepage-hero-layout.mjs`
- `STAGING_REVIEW.md`
- `review-artifacts/LATEST_PASS.txt`
- `review-artifacts/pass-01b-homepage-vertical-hero/**`

## Validation

- Desktop: vertical stack, 1200px diagram, two-line H1, no border, no overflow
- Mobile: natural wrap, full-width diagram, no crop/overflow
- `scripts/validate-homepage-hero-layout.mjs` PASS

## Main integrity

| Check | Result |
| --- | --- |
| Branch | `main` |
| HEAD | `1b80a59261b99d3e0bf5cf1900fd8e4e8b17d810` |
| Digest | `5972a6d82362bea138d928435294edf074f8865cd7f2fa1e34c0aaa65dbb173f` |

## Screenshot inventory

- [responsive/homepage-vertical-hero-1920.png](responsive/homepage-vertical-hero-1920.png)
- [responsive/homepage-vertical-hero-1440.png](responsive/homepage-vertical-hero-1440.png)
- [responsive/homepage-vertical-hero-1280.png](responsive/homepage-vertical-hero-1280.png)
- [responsive/homepage-vertical-hero-1024.png](responsive/homepage-vertical-hero-1024.png)
- [responsive/homepage-vertical-hero-768.png](responsive/homepage-vertical-hero-768.png)
- [responsive/homepage-vertical-hero-390.png](responsive/homepage-vertical-hero-390.png)
- [crops/vertical-hero-copy-1440.png](crops/vertical-hero-copy-1440.png)
- [crops/vertical-hero-diagram-1440.png](crops/vertical-hero-diagram-1440.png)
- [crops/vertical-hero-complete-1440.png](crops/vertical-hero-complete-1440.png)
- [crops/vertical-hero-complete-390.png](crops/vertical-hero-complete-390.png)
- [comparisons/side-by-side-vs-vertical-1440.png](comparisons/side-by-side-vs-vertical-1440.png)

## Remaining visual limitations

- Diagram capped at 1200px by design (within 1000–1200 target)
- Narrative bands below hero unchanged in this pass
- Independent homepage visual review still required
- Pass 01C / Pass 02 unauthorized
