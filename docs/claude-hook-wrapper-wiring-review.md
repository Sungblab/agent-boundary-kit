# Claude Hook Wrapper Wiring Review

This document records the wrapper wiring review only.

It is not an installed hook, not an installer, and not live settings guidance.

## Boundary

The reviewed local chain is:

1. `abk-claude-hook-wrapper --carrier <user-owned-carrier-json>`
2. `abk-claude-hook`

The wiring review proves wrapper output can feed the existing native command entrypoint.

The handoff format is `native-payload-with-carrier`.

The wrapper must produce the envelope on stdout.

The entrypoint must consume that envelope from stdin.

The review does not install hooks.

The review does not create or edit Claude configuration files.

The review does not execute scanners.

The review does not publish live settings guidance.

The review does not make `abk-claude-hook` read carrier paths.

## Source Contracts

The wiring review is bounded by:

- `docs/claude-hook-wrapper-implementation.md`
- `docs/claude-hook-native-command-input-contract.md`
- `docs/claude-hook-command-adapter-entrypoint.md`
- `docs/claude-hook-wrapper-implementation-fixtures.md`
- `docs/claude-hook-wrapper-output-fixtures.md`

The wrapper input fixture is:

- `hooks/claude/examples/wrapper-implementation.stdin.post-tool-use.valid.json`

The wrapper carrier fixture is:

- `hooks/claude/examples/wrapper-implementation.carrier.valid.json`

The wrapper envelope fixture is:

- `hooks/claude/examples/wrapper-implementation.expected-envelope.json`

The wiring plan output fixture is:

- `hooks/claude/examples/wrapper-wiring.valid-plan-output.json`

## Evidence Gate

Before wrapper wiring is described as reviewed, run:

```sh
node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
node benchmarks/scripts/check-claude-hook-native-command-input-contract.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- wrapper output matches `hooks/claude/examples/wrapper-implementation.expected-envelope.json`
- wrapper output can feed the existing native command entrypoint
- resulting plan output matches `hooks/claude/examples/wrapper-wiring.valid-plan-output.json`
- scanner execution remains false
- selected scanners remain plan-only
- missing carrier input blocks before entrypoint handoff
- transcript-derived carrier input blocks before entrypoint handoff
- private native fields are not echoed
- no hook setup file or repository-level Claude configuration exists

## Non-Goals

Do not install Claude hooks.

Do not publish final settings copy.

Do not publish shell copy commands.

Do not add setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from wiring review.

Do not make `abk-claude-hook` read carrier paths.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is recorded in `docs/claude-hook-settings-fragment-review.md`: manual settings-fragment review, still user-approved and still separate from agent-performed installation.

That gate is checked by `benchmarks/scripts/check-claude-hook-settings-fragment-review.js`.
