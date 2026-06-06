# Claude Hook Manual Install Contract

This is a manual contract only for future Claude hook installation documentation.

It is not an installed hook, not an installer, and not hook setup guidance.

## Boundary

Future Claude hook installation language may be written only after an explicit user request.

It may describe user-approved manual installation language, but it must keep Agent Boundary Kit as the source fixture and contract repo.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No repository mutation.

No automatic hook installation.

Do not install Claude hooks yet.

Do not publish copy commands yet.

Do not create or edit Claude configuration files.

Do not add installer code.

Do not execute scanners before map-event succeeds.

Do not generate final copy.

## Preconditions

The contract depends on:

- `docs/packaging-readiness.md`
- `docs/claude-hook-packaging-contract.md`
- `docs/claude-hook-package-manifest-fixtures.md`
- `docs/claude-hook-manual-install-doc-fixture.md`
- `docs/claude-hook-manual-install-language-fixtures.md`
- `docs/claude-hook-manual-install.md`
- `docs/claude-hook-manual-install-review-packet.md`
- `docs/claude-hook-settings-fragment-draft-fixtures.md`
- `docs/claude-hook-carrier-source-contract.md`
- `docs/claude-hook-native-command-input-contract.md`
- `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`
- `docs/claude-hook-command-adapter-contract.md`
- `docs/claude-hook-command-adapter-fixtures.md`
- `hooks/claude/examples/package-manifest.valid.json`

The package manifest must remain manual-review-only, must keep automatic installation disabled, and must preserve the local runner command chain:

```sh
abk-runner map-event --input <hook-event.json>
abk-runner dry-run --input <runner-input.json>
abk-runner scan --input <runner-input.json> --scanner <scanner-id>
```

## Allowed Manual Install Language

Allowed future language may describe:

- required review gates before installation instructions are published
- explicit user approval before any hook setup is attempted
- a bounded manifest source: `hooks/claude/examples/package-manifest.valid.json`
- the bounded command source: `docs/claude-hook-command-adapter-entrypoint.md`
- the native command input source: `docs/claude-hook-native-command-input-contract.md`
- native command entrypoint evidence from `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`
- the review-only packet in `docs/claude-hook-manual-install-review-packet.md`
- the draft-only settings-fragment fixture in `docs/claude-hook-settings-fragment-draft-fixtures.md`
- the carrier source contract in `docs/claude-hook-carrier-source-contract.md`
- the manual install language fixture: `docs/claude-hook-manual-install-language-fixtures.md`
- the stop condition when `map-event`, `dry-run`, or `scan` returns a configuration or boundary finding
- the fact that scanner output is evidence, not final copy

It must not imply automatic setup, hidden context access, broad workspace scanning, connector setup, dashboards, SaaS workflow, or final response generation.

## Configuration Mutation Boundary

This contract does not provide commands that create folders, copy files, remove files, or edit Claude configuration files.

Any later manual installation document must separate:

- source fixture review in this repository
- user approval
- the user's local configuration action
- post-install evidence gates
- uninstall scope

The agent must not perform those actions unless the user explicitly requests installation in that turn.

## Evidence Gate

Before any Claude hook manual install contract or install documentation is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-manual-install-contract.js
node benchmarks/scripts/check-claude-hook-manual-install-review-packet.js
node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js
node benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-document.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
node benchmarks/scripts/check-claude-hook-command-adapter-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js
node benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js
node benchmarks/scripts/check-claude-hook-packaging-contract.js
node benchmarks/scripts/check-abk-runner-map-event.js
node benchmarks/scripts/check-abk-runner-dry-run.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- this contract remains documentation-only
- no install scripts or setup scripts exist in `hooks/claude/`
- no repository-level Claude hook configuration exists
- the manual install document records native command entrypoint evidence
- the manual install review packet remains review-only
- the settings-fragment draft fixture remains not installable as-is
- the carrier source contract remains not consumed by the current entrypoint
- the manual install document remains blocked for agent-performed installation
- manual install language fixtures reject copy and configuration-edit instructions until native payload mapping is proven
- the command adapter contract records the stdin-to-runner-input bridge required before live hooks
- the command adapter fixtures prove the stdin payload maps to explicit runner input before live hooks
- scanner execution remains gated by `abk-runner map-event --input <hook-event.json>`

## Non-Goals

Do not install Claude hooks yet.

Do not publish copy commands yet.

Do not add installer code.

Do not add hook setup commands.

Do not add background watchers.

Do not create connectors.

Do not build dashboards.

Do not add SaaS workflow.

Do not read raw private transcripts, hidden chat history, prompt text, or message arrays.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is a wrapper input contract after the carrier source contract remains not consumed by the current entrypoint.
