# Claude Hook Packaging Contract

This contract defines the next allowed Claude hook packaging gate.

It is not an installed hook, not an installer, and not a background watcher.

## Boundary

A future Claude hook package may connect Claude hook runtime events to the existing runner command chain only.

It may read only explicit hook event JSON and bounded runner outputs.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No broad workspace scraping.

No automatic hook installation.

No final response generation.

Do not install Claude hooks yet.

Do not infer missing metadata.

Do not create connectors.

Do not build dashboards.

Do not add SaaS workflow.

## Prerequisites

The package boundary depends on these contracts:

- `docs/packaging-readiness.md`
- `docs/claude-hook-event-input-contract.md`
- `docs/claude-hook-event-mapping-examples.md`
- `docs/claude-hook-event-mapper-contract.md`
- `docs/claude-hook-event-mapper-output-fixtures.md`
- `docs/hook-runner-read-only-execution-contract.md`
- `docs/hook-runner-selection-matrix.md`
- `docs/scanner-coverage-matrix.md`

Required implementation checks:

- `benchmarks/scripts/check-claude-hook-packaging-contract.js`
- `benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js`
- `benchmarks/scripts/check-abk-runner-map-event.js`
- `benchmarks/scripts/check-abk-runner-dry-run.js`
- `benchmarks/scripts/check-abk-runner-scan.js`

## Allowed Package Shape

A future package may reference only these hook ids:

- `pre_write_boundary_check`
- `post_edit_scope_check`
- `test_integrity_check`
- `completion_evidence_check`

Allowed package contents:

- declarative hook id mapping
- command templates that call the local `abk-runner`
- references to the existing hook specs in `hooks/claude/`
- documentation for manual review and user-approved installation

Blocked package contents:

- transcript readers
- prompt readers
- chat history readers
- broad repository watchers
- final response generators
- dashboard or connector code
- installer code that mutates a user repository without explicit user action

## Runtime Flow

The only allowed runtime command chain is:

```sh
abk-runner map-event --input <hook-event.json>
abk-runner dry-run --input <runner-input.json>
abk-runner scan --input <runner-input.json> --scanner <scanner-id>
```

`map-event` must run first.

Do not execute scanners before map-event succeeds.

`dry-run` may select scanner ids from declared runner input.

`scan` may execute exactly one selected scanner with explicit runner input.

If `map-event` returns Exit 2, the package must stop and surface the bounded configuration error.

If `dry-run` returns Exit 2, the package must stop and surface the bounded configuration error.

If `scan` returns Exit 1, the package may report a boundary finding, but it must not write final copy or claim completion.

The package must not repair errors by reading private chat context, prompt text, message arrays, hidden state, broad workspace files, issue text, PR text, or logs.

## Evidence Gate

Before any Claude hook package is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-packaging-contract.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
node benchmarks/scripts/check-claude-hook-event-mapping-examples.js
node benchmarks/scripts/check-claude-hook-event-mapper-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js
node benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js
node benchmarks/scripts/check-claude-hook-manual-install-contract.js
node benchmarks/scripts/check-abk-runner-map-event.js
node benchmarks/scripts/check-abk-runner-dry-run.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The evidence must prove:

- runtime events become runner input only through `abk-runner map-event --input <hook-event.json>`
- scanner selection remains plan-only until `abk-runner dry-run --input <runner-input.json>` succeeds
- scanner execution remains limited to `abk-runner scan --input <runner-input.json> --scanner <scanner-id>`
- configuration errors do not trigger inference from private context
- scanner output is not final copy

## Non-Goals

Do not install Claude hooks yet.

Do not add a hook installer.

Do not add background watchers.

Do not execute scanners before map-event succeeds.

Do not infer missing metadata.

Do not read raw private transcripts, hidden chat history, prompt text, or message arrays.

Do not create connectors.

Do not build dashboards.

Do not add SaaS workflow.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Package Manifest Fixtures

The package manifest fixtures are recorded in `docs/claude-hook-package-manifest-fixtures.md`.

They include:

- `hooks/claude/examples/package-manifest.valid.json`
- `hooks/claude/examples/package-manifest.invalid-auto-install.json`

## Manual Install Documentation Fixture

The manual install documentation fixture is recorded in `docs/claude-hook-manual-install-doc-fixture.md`.

It is documentation-only and must not mutate a repository.

## Manual Install Contract

The manual install contract is recorded in `docs/claude-hook-manual-install-contract.md`.

Its check is `benchmarks/scripts/check-claude-hook-manual-install-contract.js`.

It defines future user-approved manual installation language without adding installer code.

## Next Gate

The next gate is a user-approved manual install document that can define bounded installation and uninstall instructions without changing this repository into an installer.
