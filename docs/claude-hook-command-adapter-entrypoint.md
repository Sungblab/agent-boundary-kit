# Claude Hook Command Adapter Entrypoint

This document records the bounded local entrypoint for Claude hook command input.

It is not an installed hook, not an installer, and not hook setup guidance.

It implements the boundary recorded in `docs/claude-hook-command-adapter-implementation-contract.md`.

## Boundary

The entrypoint may bridge one Claude hook stdin payload into the existing ABK runner chain.

It must read stdin only.

It may parse one JSON payload.

It must write temporary files only for the runner bridge.

It must delete temporary files before exit.

It must preserve runner exit codes.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No repository mutation.

No automatic hook installation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not execute scanners in this entrypoint.

Do not generate final copy.

## Command Shape

The published package bin is:

```sh
abk-claude-hook
```

The repository entrypoint is:

- `bin/abk-claude-hook.js`

The implementation module is:

- `lib/abk-claude-hook-adapter.js`

The command reads stdin and emits one bounded JSON result to stdout.

It does not accept workspace paths, broad scan targets, hook install options, or Claude configuration paths.

## Current Implementation

`bin/abk-claude-hook.js` is a thin wrapper that delegates to `lib/abk-claude-hook-adapter.js`.

The adapter writes the stdin payload to a temporary `hook-event.json` file, calls the local mapper, and stops immediately if mapper output has a non-zero exit code.

For a valid mapped event, the adapter writes a temporary `runner-input.json` file and calls `dry-run`.

The adapter does not call `scan`.

The adapter reports scanner selection only as `willExecute: false`.

The adapter reports temporary file cleanup through the fixture placeholder `<explicit-temp-dir>` and an empty `repositoryWrites` array.

The valid-output fixture is:

- `hooks/claude/examples/adapter-entrypoint.valid-plan-output.json`

The rejected transcript fixture is:

- `hooks/claude/examples/adapter-entrypoint.invalid-transcript-output.json`

## Evidence Gate

Before this entrypoint is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-contract.js
npm run bench:check
npm run bench:check:red
```

The evidence must prove:

- `abk-claude-hook` is registered as `bin/abk-claude-hook.js`
- the bin wrapper delegates to `lib/abk-claude-hook-adapter.js`
- valid stdin preserves `map-event` and `dry-run` exit codes
- rejected transcript stdin preserves Exit 2 and stops after `map-event`
- temporary files are removed before exit
- no hook install files or Claude configuration files exist in the repository

## Non-Goals

Do not install Claude hooks.

Do not publish hook setup commands.

Do not create or edit Claude configuration files.

Do not execute scanners in this entrypoint.

Do not add background watchers.

Do not create connectors.

Do not build dashboards.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is manual install language that points at this bounded command without creating install scripts, mutating Claude configuration, or broadening input beyond explicit hook event metadata.
