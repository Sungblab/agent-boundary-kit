# Claude Hook Native Command Input Contract

This document records the command-entrypoint input contract for native Claude hook payloads.

It is not an installed hook, not an installer, and not live settings guidance.

## Boundary

The command is still `abk-claude-hook`.

Native payload input must be a single JSON stdin envelope.

The only native command envelope mode in this contract is `native-payload-with-carrier`.

The envelope fields are:

- `inputMode`
- `nativePayload`
- `metadataCarrier`

The entrypoint may pass `nativePayload` and `metadataCarrier` to `lib/abk-claude-native-payload-adapter.js`.

The adapter boundary is recorded in `docs/claude-hook-native-adapter.md`.

The carrier source contract is recorded in `docs/claude-hook-carrier-source-contract.md`.

The wrapper input contract is recorded in `docs/claude-hook-wrapper-input-contract.md`.

The wrapper output fixtures are recorded in `docs/claude-hook-wrapper-output-fixtures.md`.

The wrapper implementation contract is recorded in `docs/claude-hook-wrapper-implementation-contract.md`.

The current command entrypoint boundary is recorded in `docs/claude-hook-command-adapter-entrypoint.md`.

It must not accept carrier file paths.

It must not read `transcript_path`.

It must not pass through `session_id`.

It must not infer missing metadata.

It must not read raw private transcripts, prompt text, message arrays, issue bodies, PR text, logs, or broad workspace files.

Do not install Claude hooks.

Do not publish live settings fragments.

Do not create or edit Claude configuration files.

## Fixtures

Valid native command envelope:

- `hooks/claude/examples/native-command-envelope.post-tool-use.valid.json`

Expected ABK hook event:

- `hooks/claude/examples/native-command-envelope.expected-hook-event.json`

Rejected missing-carrier envelope:

- `hooks/claude/examples/native-command-envelope.invalid-missing-carrier.json`

Rejected missing-carrier output:

- `hooks/claude/examples/native-command-envelope.invalid-missing-carrier-output.json`

The valid envelope includes the native hook payload and explicit metadata carrier in the same stdin JSON value.

The expected event keeps carrier metadata explicit and uses only `nativePayload.tool_input.file_path` as `changedFiles`.

The missing-carrier fixture proves native payload alone is still insufficient for ABK hook event mapping.

## Evidence Gate

Before the command entrypoint accepts native payload input, run:

```sh
node benchmarks/scripts/check-claude-hook-native-command-input-contract.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
node benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js
node benchmarks/scripts/check-claude-hook-native-adapter.js
node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must prove:

- native input is a single explicit stdin envelope
- `metadataCarrier` is required
- `carrierPath` and `metadataCarrierPath` are not accepted
- `transcript_path` is not read
- `session_id` is not passed through
- missing metadata is rejected before consuming native payload fields
- no hook install files or Claude configuration files exist

## Non-Goals

Do not install Claude hooks.

Do not publish live settings fragments.

Do not add hook setup scripts.

Do not create or edit Claude configuration files.

Do not accept carrier file paths.

Do not execute scanners from native command input.

Do not turn this into a broad command router.

## Next Gate

The next gate is implementation of this input contract in `lib/abk-claude-hook-adapter.js`, still without hook installation, live settings fragments, scanner execution, or transcript reads.

That implementation gate is checked by `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`.
