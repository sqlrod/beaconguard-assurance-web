# Pass 01B-R3A1 — Control Fabric Geometry Correction

```
IMPLEMENTATION_COMPLETE_PENDING_INDEPENDENT_VISUAL_REVIEW
```

## Summary

| Field | Value |
| --- | --- |
| Starting staging HEAD | `95ef793abc1a6a5fcfd76b488c250fb02dd61360` |
| Final implementation commit | `9ade9606406718cf408646ab419544dec0f45576` |
| Preview port | `4337` |
| Build | Pass |
| Geometry validator | Pass |
| Main integrity | Unchanged (`1b80a59…` / digest `5972a6d8…`) |

## Exact files changed

- `src/components/diagrams/ControlFabricHero.astro`
- `src/pages/staging-control-fabric.astro`
- `src/styles/global.css`
- `scripts/validate-diagram-geometry.mjs`
- `STAGING_REVIEW.md`
- `review-artifacts/LATEST_PASS.txt`
- `review-artifacts/pass-01b-r3a1-control-fabric-geometry-correction/**`

Public homepage not replaced. Unrelated diagram families untouched.

## Corrections applied

1. Strict three-column / four-lane SVG grid (`0 0 1280 680`)
2. Persistent Enterprise Application boundary with three equal internal states and equal vertical gaps
3. DENY terminals placed above/below gates with clearance; equal terminal dimensions
4. Result-to-Action ALLOW returns into Enterprise Application EXECUTE (not SoR)
5. Execute → System of Record routes below the action gate (“App executes”)
6. Provider return enters RECEIVE + DECLARE
7. Evidence lane separate; Verify read-only

## Desktop geometry

| Region | Approximate SVG bounds |
| --- | --- |
| Col 1 Enterprise Application | x 60–330 |
| Col 2 BeaconGuard | x 430–760 |
| Col 3 Provider / SoR / Verify | x 860–1210 |
| Top lane | y ≈ 148–244 |
| Middle return | y ≈ 280–364 |
| Bottom action | y ≈ 420–516 |
| Evidence | y ≈ 616–664 |

Gates: 180×96 · DENY terminals: 180×48 · App states: 230×80 · state gap: 56

## Mobile geometry

viewBox `0 0 440 1080` — vertical circuit with shared Enterprise Application boundary, side DENY branches, evidence rail. No list fallback.

## Screenshot inventory

- `crops/control-fabric-corrected-{1440,1920,1024,768,390}.png`
- `crops/control-fabric-corrected-in-hero-{1440,390}.png`
- `comparisons/r3a-vs-r3a1-*.png`
- `responsive/` staging viewports
- `fullpage/` 27 public routes

## Remaining uncertainties

- Hero-column optical weight vs headline at 1440
- Whether DENY paths crossing the BeaconGuard boundary edge read as “outside” clearly enough
- Compact enclosing boundary vs spine preference

No site-wide adoption. Pass 01C unauthorized.
