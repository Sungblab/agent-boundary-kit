# Claude Hook Manual Install Documentation Fixture

This fixture defines the only allowed documentation shape before any Claude hook installation instructions exist.

It extends `docs/claude-hook-package-manifest-fixtures.md` and `docs/claude-hook-packaging-contract.md`.

It is documentation fixture only, not an installer, not an installed hook, and not hook setup guidance.

## Boundary

The documentation fixture must be manual-review-only.

It must cite `hooks/claude/examples/package-manifest.valid.json`.

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks yet.

Do not add installer code.

Do not provide copy commands.

Do not create or edit Claude configuration files.

Do not execute scanners before map-event succeeds.

Do not generate final copy.

## Fixtures

Valid documentation fixture:

- `hooks/claude/examples/manual-install-doc.valid.md`

Rejected documentation fixture:

- `hooks/claude/examples/manual-install-doc.invalid-mutating.md`

The valid fixture may describe review requirements, prerequisites, and stop conditions. It must not include commands that create folders, copy files, remove files, or edit Claude configuration.

The rejected fixture intentionally includes mutation instructions. The check must reject that pattern before any install documentation is published.

## Evidence Gate

Before any Claude hook manual install documentation is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js
node benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js
node benchmarks/scripts/check-claude-hook-packaging-contract.js
node benchmarks/scripts/check-abk-runner-map-event.js
node benchmarks/scripts/check-abk-runner-dry-run.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The check verifies that manual install documentation remains documentation-only, references the package manifest fixture, disables automatic installation, avoids repository mutation, and rejects copy/config-edit instructions.

## Non-Goals

Do not install Claude hooks yet.

Do not add installer code.

Do not add hook setup commands.

Do not add background watchers.

Do not add connector code.

Do not build dashboards.

Do not add SaaS workflow.

Do not read raw private transcripts, hidden chat history, prompt text, or message arrays.

Do not generate final copy, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is a manual install contract that can define user-approved installation language without repository mutation.
