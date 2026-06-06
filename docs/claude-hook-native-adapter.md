# Claude Hook Native Adapter

This document records the bounded native payload adapter for Claude hook payloads.

It is not an installed hook, not an installer, and not hook setup guidance.

## Boundary

The bounded native payload adapter is `lib/abk-claude-native-payload-adapter.js`.

It exports `mapNativePayloadWithCarrier`.

The adapter may read JSON values already supplied to the adapter:

- one native Claude hook payload
- one explicit metadata carrier

It must not read `transcript_path`.

It must not pass through `session_id`.

It must not infer task metadata.

It must not install Claude hooks.

It must not create or edit Claude configuration files.

It must not execute scanners.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No repository mutation.

## Inputs

The fixture inputs are:

- `hooks/claude/examples/native-payload.post-tool-use.write.json`
- `hooks/claude/examples/native-metadata-carrier.post-edit.valid.json`

The adapter accepts the native payload only for declared native fields needed by ABK.

The only native field mapped in this slice is `tool_input.file_path`, which becomes `changedFiles`.

The carrier supplies `hookId`, `repoRoot`, `task`, and optional declared scanner metadata.

The carrier boundary is defined in `docs/claude-hook-native-metadata-carrier-fixtures.md`.

## Outputs

The expected hook event fixture is:

- `hooks/claude/examples/native-payload-plus-carrier.expected-hook-event.json`

The rejected transcript-derived carrier output fixture is:

- `hooks/claude/examples/native-metadata-carrier.invalid-transcript-derived-output.json`

The valid output returns a mapped ABK hook event.

The rejected output blocks with Exit 2 and consumes no transcript input.

## Evidence Gate

Before native adapter behavior is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-native-adapter.js
node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js
node benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must prove:

- valid native payload plus explicit carrier maps to the expected ABK hook event
- invalid transcript-derived carrier metadata is rejected
- missing carrier `task` is rejected before consuming native payload fields
- missing native `tool_input.file_path` is rejected
- the adapter does not use filesystem APIs, spawn commands, install hooks, or reference Claude configuration paths

## Non-Goals

Do not install Claude hooks.

Do not publish live settings fragments.

Do not add installer code.

Do not add hook setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from native payload fixtures.

Do not read transcripts, prompt text, message arrays, issue bodies, PR text, logs, or broad workspace files to fill missing metadata.

## Next Gate

The next gate is a command-entrypoint input contract that decides how a user-approved hook command may receive the explicit carrier without reading transcripts or publishing live settings fragments.
