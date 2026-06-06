# Claude Hook Wrapper Implementation Contract

This is an implementation contract only for a future Claude hook wrapper.

It is not implemented in this gate.

It is not an installed hook, not an installer, and not live settings guidance.

## Boundary

The wrapper may prepare the explicit native command envelope required by `abk-claude-hook`.

The candidate command is `abk-claude-hook-wrapper`.

The candidate module is `lib/abk-claude-hook-wrapper.js`.

The wrapper must read native hook JSON from stdin only.

The wrapper may read one explicit user-owned sidecar JSON file only after user approval.

The wrapper must emit exactly one `native-payload-with-carrier` JSON object on stdout.

The wrapper must not invoke `abk-claude-hook` in this gate.

The wrapper must not make `abk-claude-hook` accept carrierPath or metadataCarrierPath.

The wrapper must not execute scanners.

The wrapper must not install hooks.

Do not read transcript_path.

Do not pass through session_id.

Do not infer task metadata from native stdin.

Do not create or edit Claude configuration files.

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not publish shell copy commands.

## Preconditions

The implementation contract depends on:

- `docs/claude-hook-wrapper-input-contract.md`
- `docs/claude-hook-wrapper-output-fixtures.md`
- `docs/claude-hook-carrier-source-contract.md`
- `docs/claude-hook-native-command-input-contract.md`
- `docs/claude-hook-native-metadata-carrier-fixtures.md`
- `hooks/claude/examples/wrapper-output.valid-envelope.json`
- `hooks/claude/examples/wrapper-output.invalid-transcript-derived.json`
- `hooks/claude/examples/wrapper-output.invalid-current-entrypoint-carrier-path.json`

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/configuration`

The source evidence says command hooks receive JSON on stdin.

The wrapper output fixtures must stay green before any wrapper implementation exists.

## Allowed Wrapper Shape

The future wrapper may:

- read one native hook payload from stdin
- read one reviewed carrier JSON value from a user-owned sidecar source
- validate that the carrier includes `carrierVersion`, `hookId`, `repoRoot`, and `task`
- project native payload fields into the allowed `nativePayload` shape
- place the reviewed carrier value under `metadataCarrier`
- write the expected output envelope to stdout
- return a bounded configuration error when required input is missing

The future wrapper must not:

- install hooks
- create or edit Claude configuration files
- call scanner scripts
- call `abk-runner`
- call `abk-claude-hook`
- persist native stdin, carrier JSON, temporary envelopes, or rejected payloads
- infer task metadata from native payload fields
- generate final responses, PR metadata, release notes, product copy, or completion claims

## Input Projection

The wrapper may project these native stdin fields into `nativePayload`:

- `hook_event_name`
- `tool_name`
- `tool_input.file_path`

The wrapper must not pass through `transcript_path`, `session_id`, prompt text, message arrays, raw transcripts, hidden chat history, tool responses, credentials, cookies, tokens, passwords, issue text, PR text, logs, or broad workspace content.

Native stdin is evidence for tool event context only.

Native stdin is not task metadata.

## Carrier Read Boundary

The carrier source remains user-owned sidecar JSON.

The carrier source is not Claude settings JSON.

The carrier source is not transcript-derived metadata.

The wrapper may read the carrier only from an explicit user-approved source.

The wrapper must not create, edit, normalize, or repair the carrier source.

The wrapper must not accept carrierPath or metadataCarrierPath inside native stdin.

The wrapper must not make `abk-claude-hook` accept carrierPath or metadataCarrierPath.

## Output Contract

The only valid wrapper output mode is `native-payload-with-carrier`.

The output object must contain:

- `inputMode`
- `nativePayload`
- `metadataCarrier`

The expected output fixture is `hooks/claude/examples/wrapper-output.valid-envelope.json`.

The rejected transcript-derived fixture is `hooks/claude/examples/wrapper-output.invalid-transcript-derived.json`.

The rejected current-entrypoint carrier path fixture is `hooks/claude/examples/wrapper-output.invalid-current-entrypoint-carrier-path.json`.

## Evidence Gate

Before wrapper implementation language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js
node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-native-command-input-contract.js
node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the wrapper implementation contract remains contract-only
- the wrapper is not implemented in this gate
- wrapper output fixtures remain expected-output-only
- native stdin projection stays bounded
- carrier JSON remains user-owned
- `abk-claude-hook` still rejects carrierPath and metadataCarrierPath
- transcript-derived metadata is rejected
- no repository-level Claude configuration exists

## Non-Goals

Do not implement the wrapper in this gate.

Do not install Claude hooks.

Do not publish final settings copy.

Do not publish shell copy commands.

Do not add setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from wrapper implementation language.

Do not make `abk-claude-hook` read carrier paths in this gate.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is wrapper implementation fixtures for the candidate command and module, still without hook installation or live settings guidance.
