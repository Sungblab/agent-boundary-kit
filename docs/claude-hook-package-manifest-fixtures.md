# Claude Hook Package Manifest Fixtures

These fixtures define the allowed package manifest shape for future Claude hook packaging.

They extend `docs/claude-hook-packaging-contract.md`. They are not installed hooks, not an installer, and not hook scripts.

## Boundary

The manifest is fixture-only.

The manifest must use `manual-review-only` installation.

The manifest must set `autoInstall` to `false`.

No raw private transcripts.

No automatic hook installation.

No final response generation.

Do not install Claude hooks yet.

Do not add installer code.

Do not execute scanners before map-event succeeds.

Do not generate final copy.

## Valid Manifest

Valid fixture:

- `hooks/claude/examples/package-manifest.valid.json`

The valid manifest must cite:

- `docs/claude-hook-packaging-contract.md`
- `hooks/claude/pre-write-boundary-check.md`
- `hooks/claude/post-edit-scope-check.md`
- `hooks/claude/test-integrity-check.md`
- `hooks/claude/completion-evidence-check.md`

The valid manifest must include these command templates for each hook:

- `abk-runner map-event --input <hook-event.json>`
- `abk-runner dry-run --input <runner-input.json>`
- `abk-runner scan --input <runner-input.json> --scanner <scanner-id>`

## Rejected Auto-Install Manifest

Rejected fixture:

- `hooks/claude/examples/package-manifest.invalid-auto-install.json`

This manifest sets `autoInstall` to `true`. The checker must reject it because packaging fixtures must not imply automatic hook installation.

## Evidence Gate

Before any package manifest is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js
node benchmarks/scripts/check-claude-hook-packaging-contract.js
node benchmarks/scripts/check-abk-runner-map-event.js
node benchmarks/scripts/check-abk-runner-dry-run.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The check verifies fixture-only status, manual review installation, disabled auto-install, supported hook ids, runner command templates, and rejected automatic installation.

## Non-Goals

Do not install Claude hooks yet.

Do not add installer code.

Do not add background watchers.

Do not add connector code.

Do not build dashboards.

Do not add SaaS workflow.

Do not read raw private transcripts, hidden chat history, prompt text, or message arrays.

Do not generate final copy, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is a bounded manual install documentation fixture that references this manifest without mutating a repository.
