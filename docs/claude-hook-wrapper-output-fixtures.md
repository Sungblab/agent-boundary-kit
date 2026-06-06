# Claude Hook Wrapper Output Fixtures

These fixtures define the expected output envelope for a future Claude hook wrapper.

They are fixture only.

They are not an installed hook, not an installer, and not live settings guidance.

They are not implemented by the current entrypoint.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/configuration`

The source evidence says command hooks receive JSON on stdin.

## Boundary

User approval required.

The wrapper output combines a native stdin projection with user-owned sidecar JSON.

The expected output envelope is `native-payload-with-carrier`.

The expected output envelope includes `nativePayload` and `metadataCarrier`.

The wrapper input contract is `docs/claude-hook-wrapper-input-contract.md`.

The carrier source contract is `docs/claude-hook-carrier-source-contract.md`.

The command input contract is `docs/claude-hook-native-command-input-contract.md`.

The wrapper implementation contract is `docs/claude-hook-wrapper-implementation-contract.md`.

The wrapper implementation fixtures are `docs/claude-hook-wrapper-implementation-fixtures.md`.

The wrapper implementation is `docs/claude-hook-wrapper-implementation.md`.

The carrier fixture contract is `docs/claude-hook-native-metadata-carrier-fixtures.md`.

The current entrypoint boundary is unchanged.

carrierPath and metadataCarrierPath remain rejected by abk-claude-hook.

Do not read transcript_path.

Do not pass through session_id.

Do not infer task metadata from native stdin.

Do not create or edit Claude configuration files.

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not publish shell copy commands.

## Fixtures

Valid wrapper output:

- `hooks/claude/examples/wrapper-output.valid-envelope.json`

Rejected transcript-derived wrapper output:

- `hooks/claude/examples/wrapper-output.invalid-transcript-derived.json`

Rejected current-entrypoint carrier path output:

- `hooks/claude/examples/wrapper-output.invalid-current-entrypoint-carrier-path.json`

The valid fixture is expected-output-only and not installable as-is.

The valid fixture records native stdin projection as the source for `nativePayload`.

The valid fixture records user-owned sidecar JSON as the source for `metadataCarrier`.

The valid fixture records that the current entrypoint does not implement this wrapper output.

The rejected transcript-derived fixture intentionally mentions transcript_path.

The rejected current-entrypoint fixture intentionally includes carrierPath and metadataCarrierPath.

## Evidence Gate

Before wrapper output fixture language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation-fixtures.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation.js
node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js
node benchmarks/scripts/check-claude-hook-native-command-input-contract.js
node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the wrapper output fixture is fixture-only
- the wrapper output is not implemented by the current entrypoint
- native stdin projection is the `nativePayload` source
- user-owned sidecar JSON is the `metadataCarrier` source
- the output envelope is `native-payload-with-carrier`
- `metadataCarrier` remains explicit
- carrierPath and metadataCarrierPath remain rejected by abk-claude-hook
- transcript-derived metadata is rejected
- no repository-level Claude configuration exists

## Non-Goals

Do not install Claude hooks.

Do not publish final settings copy.

Do not publish shell copy commands.

Do not add setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from wrapper output fixtures.

Do not implement wrapper file reading in this gate.

Do not make `abk-claude-hook` read carrier paths in this gate.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is local wrapper module implementation against `docs/claude-hook-wrapper-implementation-fixtures.md`, still without hook installation or live settings guidance.
