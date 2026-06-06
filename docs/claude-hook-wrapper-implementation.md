# Claude Hook Wrapper Implementation

This document records the local wrapper implementation.

It is not an installed hook, not an installer, and not live settings guidance.

## Boundary

The local wrapper implementation is `bin/abk-claude-hook-wrapper.js` plus `lib/abk-claude-hook-wrapper.js`.

The command shape is:

```sh
abk-claude-hook-wrapper --carrier <user-owned-carrier-json>
```

The wrapper reads native hook JSON from stdin.

The wrapper reads exactly one explicit carrier JSON file.

The wrapper emits exactly one native-payload-with-carrier JSON object on stdout.

The wrapper does not invoke abk-claude-hook.

The wrapper does not invoke abk-runner.

The wrapper does not execute scanners.

The wrapper does not install hooks.

The wrapper does not create or edit Claude configuration files.

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not publish shell copy commands.

## Source Contracts

The implementation is bounded by:

- `docs/claude-hook-wrapper-wiring-review.md`
- `docs/claude-hook-wrapper-implementation-fixtures.md`
- `docs/claude-hook-wrapper-implementation-contract.md`
- `docs/claude-hook-wrapper-output-fixtures.md`
- `docs/claude-hook-wrapper-input-contract.md`
- `docs/claude-hook-carrier-source-contract.md`
- `docs/claude-hook-native-command-input-contract.md`

The valid output fixture is:

- `hooks/claude/examples/wrapper-implementation.expected-envelope.json`

The rejected transcript-derived output fixture is:

- `hooks/claude/examples/wrapper-implementation.invalid-transcript-derived-output.json`

The rejected missing-carrier output fixture is:

- `hooks/claude/examples/wrapper-implementation.invalid-missing-carrier-output.json`

## Input Handling

Native stdin may contain `session_id` and `transcript_path`.

The wrapper projects only:

- `hook_event_name`
- `tool_name`
- `tool_input.file_path`

The wrapper must not pass through `session_id`, `transcript_path`, prompt text, message arrays, raw transcripts, hidden chat history, tool responses, credentials, cookies, tokens, passwords, issue text, PR text, logs, or broad workspace content.

Carrier JSON must be user-owned sidecar JSON.

Carrier JSON must not derive task metadata from `transcript_path`.

## Evidence Gate

Before this wrapper implementation is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-wrapper-implementation.js
node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- valid wrapper CLI output matches `hooks/claude/examples/wrapper-implementation.expected-envelope.json`
- missing carrier input is rejected
- transcript-derived carrier input is rejected
- output does not echo private native fields
- package metadata exposes `abk-claude-hook-wrapper`
- no hook setup file or repository-level Claude configuration exists

## Non-Goals

Do not install Claude hooks.

Do not publish final settings copy.

Do not publish shell copy commands.

Do not add setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from wrapper implementation.

Do not make `abk-claude-hook` read carrier paths.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is recorded in `docs/claude-hook-wrapper-wiring-review.md`: prove whether this wrapper output can safely feed the existing native command entrypoint without publishing live settings guidance.

That gate is checked by `benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js`.
