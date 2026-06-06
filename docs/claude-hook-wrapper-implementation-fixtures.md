# Claude Hook Wrapper Implementation Fixtures

These fixtures define the first valid and rejected inputs for the future Claude hook wrapper.

They are fixture-only.

They are not implemented in this gate.

They are not an installed hook, not an installer, and not live settings guidance.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/configuration`

The source evidence says command hooks receive JSON on stdin. Common native stdin fields may include `session_id` and `transcript_path`.

## Boundary

The candidate command is `abk-claude-hook-wrapper`.

The candidate module is `lib/abk-claude-hook-wrapper.js`.

The wrapper remains unimplemented in this gate.

The fixture models native stdin plus user-owned sidecar JSON.

The wrapper must emit `native-payload-with-carrier`.

The output must include `metadataCarrier`.

The carrier source remains user-owned sidecar JSON.

The wrapper must not infer task metadata from native stdin.

Do not infer task metadata from native stdin.

Do not make `abk-claude-hook` accept carrierPath or metadataCarrierPath.

native stdin contains session_id and transcript_path.

output must not include session_id or transcript_path.

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not publish shell copy commands.

## Fixture Dependencies

These fixtures extend:

- `docs/claude-hook-wrapper-implementation-contract.md`
- `docs/claude-hook-wrapper-output-fixtures.md`
- `docs/claude-hook-wrapper-input-contract.md`
- `docs/claude-hook-carrier-source-contract.md`
- `docs/claude-hook-native-command-input-contract.md`

The expected envelope must match:

- `hooks/claude/examples/wrapper-output.valid-envelope.json`

## Green Fixture

The valid stdin fixture is:

- `hooks/claude/examples/wrapper-implementation.stdin.post-tool-use.valid.json`

The valid carrier fixture is:

- `hooks/claude/examples/wrapper-implementation.carrier.valid.json`

The expected envelope fixture is:

- `hooks/claude/examples/wrapper-implementation.expected-envelope.json`

The green fixture proves:

- native stdin may contain `session_id` and `transcript_path`
- the wrapper projects only `hook_event_name`, `tool_name`, and `tool_input.file_path`
- the wrapper uses reviewed carrier JSON as `metadataCarrier`
- the expected envelope is `native-payload-with-carrier`
- the expected output does not pass through private native fields

## Red Fixture

The transcript-derived carrier red fixture is:

- `hooks/claude/examples/wrapper-implementation.carrier.invalid-transcript-derived.json`

The rejected transcript-derived output is:

- `hooks/claude/examples/wrapper-implementation.invalid-transcript-derived-output.json`

The missing carrier red fixture output is:

- `hooks/claude/examples/wrapper-implementation.invalid-missing-carrier-output.json`

The red fixture proves:

- carrier metadata must not derive from `transcript_path`
- missing carrier input blocks before envelope creation
- rejected outputs do not echo transcripts, prompt text, message arrays, session ids, carrier paths, final copy, or scanner findings

## Evidence Gate

Before wrapper implementation fixtures are described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js
node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-native-command-input-contract.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the fixtures are fixture-only
- the wrapper is not implemented in this gate
- the valid stdin fixture includes common native fields
- the expected envelope omits `session_id` and `transcript_path`
- the expected envelope matches the wrapper output fixture
- transcript-derived carrier metadata is rejected
- missing carrier input is rejected
- no wrapper implementation, hook setup file, or repository-level Claude configuration exists

## Non-Goals

Do not implement the wrapper in this gate.

Do not install Claude hooks.

Do not publish final settings copy.

Do not publish shell copy commands.

Do not add setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from wrapper implementation fixtures.

Do not make `abk-claude-hook` read carrier paths in this gate.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is local wrapper module implementation against these fixtures, still without hook installation or live settings guidance.
