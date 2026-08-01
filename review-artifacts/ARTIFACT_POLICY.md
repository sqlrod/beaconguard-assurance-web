# BeaconGuard staging screenshot artifact policy

Artifacts uploaded by `.github/workflows/staging-screenshot-review-artifact.yml`
contain review metadata and screenshots only.

Allowed contents:

- `STAGING_REVIEW.md`
- `review-artifacts/LATEST_PASS.txt`
- `review-artifacts/ARTIFACT_POLICY.md`
- The latest pass directory referenced by `LATEST_PASS.txt`

Forbidden contents:

- Website application source (`src/`, `public/`, Astro config)
- `package.json` / lockfiles
- `node_modules`, `dist`, `.astro`
- Secrets, environment files, credentials
- Customer data

The workflow is read-only and does not deploy or promote the corporate website.
