# Claude Hook Command Adapter Contract

This contract defines the missing bridge between Claude Code command hooks and the current Agent Boundary Kit runner.

It is not an installed hook, not an installer, and not a background watcher.

## Boundary

Claude Code command hooks receive event JSON on stdin.

The current ABK runner commands require explicit input file paths.

That means a live hook cannot be documented honestly until a stdin-to-runner-input bridge is specified and tested.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No repository mutation.

No automatic hook installation.

Do not install Claude hooks yet.

Do not publish copy commands yet.

Do not create or edit Claude configuration files.

Do not add hook setup commands.

Do not execute scanners before map-event succeeds.

Do not generate final copy.

## Source Evidence

Official Claude Code references:

- `https://code.claude.com/docs/en/hooks`
- `https://code.claude.com/docs/en/settings`

The hooks reference describes command hooks as handlers that receive hook input on stdin.

The settings reference defines where hook configuration can be declared and which scopes can load hooks.

ABK references:

- `docs/claude-hook-packaging-contract.md`
- `docs/claude-hook-manual-install-contract.md`
- `docs/claude-hook-event-mapper-contract.md`
- `docs/claude-hook-event-mapper-output-fixtures.md`
- `docs/hook-runner-read-only-execution-contract.md`

## Input Bridge

The bridge must convert the Claude command hook stdin payload into a bounded temporary hook-event file, then call:

```sh
abk-runner map-event --input <hook-event.json>
abk-runner dry-run --input <runner-input.json>
abk-runner scan --input <runner-input.json> --scanner <scanner-id>
```

`map-event` must run first.

`dry-run` must remain plan-only.

`scan` must execute only a selected scanner from explicit runner input.

The bridge must not infer missing task metadata from private chat history, prompt text, message arrays, transcript files, broad workspace scans, issue text, PR text, or logs.

## Allowed Adapter Shape

The next adapter may be a small command entrypoint only after red/green fixtures exist.

Allowed behavior:

- read only stdin from the Claude command hook
- parse only the event JSON supplied by Claude Code
- write bounded temporary files only when required to pass explicit runner input to `abk-runner`
- delete temporary files after the runner chain completes
- preserve runner exit codes
- surface bounded configuration errors

Blocked behavior:

- installing hooks
- editing Claude configuration
- watching the workspace
- reading transcripts
- reading prompt text outside the event payload
- generating final responses
- executing scanners before `map-event` succeeds
- running scanner fan-out

## Evidence Gate

Before any adapter, hook package, or manual install document is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-command-adapter-contract.js
node benchmarks/scripts/check-claude-hook-manual-install-contract.js
node benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js
node benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js
node benchmarks/scripts/check-claude-hook-packaging-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-contract.js
node benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js
node benchmarks/scripts/check-abk-runner-map-event.js
node benchmarks/scripts/check-abk-runner-dry-run.js
node benchmarks/scripts/check-abk-runner-scan.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the adapter contract is documentation-only
- no hook setup files exist
- no Claude configuration file is created in this repository
- the stdin-to-runner-input bridge is specified before manual install instructions
- runner execution remains gated by `abk-runner map-event --input <hook-event.json>`

## Non-Goals

Do not install Claude hooks yet.

Do not publish copy commands yet.

Do not add hook setup commands.

Do not add background watchers.

Do not create connectors.

Do not build dashboards.

Do not add SaaS workflow.

Do not read raw private transcripts, hidden chat history, prompt text, or message arrays.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is a red/green adapter fixture proving that a Claude command hook stdin payload can be converted to explicit runner input without reading private context or installing hooks.
