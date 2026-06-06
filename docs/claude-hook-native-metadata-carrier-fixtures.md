# Claude Hook Native Metadata Carrier Fixtures

These fixtures define the explicit metadata carrier required before native Claude Code hook payloads can become ABK hook events.

They extend `docs/claude-hook-native-payload-mapping-fixtures.md`, `docs/claude-hook-event-input-contract.md`, and `docs/claude-hook-command-adapter-entrypoint.md`.

The bounded adapter implementation is recorded in `docs/claude-hook-native-adapter.md`.

The carrier source contract is recorded in `docs/claude-hook-carrier-source-contract.md`.

The wrapper input contract is recorded in `docs/claude-hook-wrapper-input-contract.md`.

The wrapper output fixtures are recorded in `docs/claude-hook-wrapper-output-fixtures.md`.

They are fixture-only. They are not installed hooks, not installers, and not live settings fragments.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

The source evidence says command hooks receive JSON on stdin.

## Boundary

Native payload plus carrier may produce an ABK hook event only when the carrier supplies hookId, repoRoot, and task.

The carrier is an explicit metadata carrier.

The carrier must not derive task metadata from transcript_path.

`transcript_path` must not be read.

`session_id` must not be passed through.

`tool_input.file_path` may become changedFiles.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No inferred metadata.

Do not install Claude hooks.

Do not publish live settings fragments.

Do not create or edit Claude configuration files.

## Fixtures

Valid metadata carrier:

- `hooks/claude/examples/native-metadata-carrier.post-edit.valid.json`

Expected native payload plus carrier event:

- `hooks/claude/examples/native-payload-plus-carrier.expected-hook-event.json`

Rejected transcript-derived carrier:

- `hooks/claude/examples/native-metadata-carrier.invalid-transcript-derived.json`

Rejected transcript-derived output:

- `hooks/claude/examples/native-metadata-carrier.invalid-transcript-derived-output.json`

The expected event keeps `hookId`, `repoRoot`, `task`, `approvedScope`, `namedTools`, `staleTerms`, `externalSources`, and `metadataFiles` from the carrier.

The expected event takes `changedFiles` only from `tool_input.file_path`.

The expected event must not include `transcript_path`, `session_id`, prompt text, message arrays, raw transcripts, or inferred task metadata.

## Evidence Gate

Before metadata carrier mapping is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js
node benchmarks/scripts/check-claude-hook-native-adapter.js
node benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the valid carrier supplies `hookId`, `repoRoot`, and `task`
- the expected event omits `transcript_path` and `session_id`
- the expected event uses `tool_input.file_path` only as `changedFiles`
- transcript-derived task metadata is rejected
- no live install fragment is published

## Non-Goals

Do not install Claude hooks.

Do not publish live settings fragments.

Do not add installer code.

Do not add hook setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from native payload fixtures.

Do not read transcripts, prompt text, message arrays, issue bodies, PR text, logs, or broad workspace files to fill missing metadata.

## Next Gate

The next gate is `docs/claude-hook-native-adapter.md` and `benchmarks/scripts/check-claude-hook-native-adapter.js`.
