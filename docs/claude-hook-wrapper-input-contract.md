# Claude Hook Wrapper Input Contract

This is a contract only.

It is not an installed hook, not an installer, and not live settings guidance.

It is not implemented by the current entrypoint.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/configuration`

The source evidence says command hooks receive JSON on stdin.

## Boundary

User approval required.

The wrapper input combines native stdin with user-owned sidecar JSON.

The wrapper must produce a native-payload-with-carrier envelope.

The produced envelope must include `nativePayload` and `metadataCarrier`.

The wrapper output fixture contract is `docs/claude-hook-wrapper-output-fixtures.md`.

The wrapper implementation contract is `docs/claude-hook-wrapper-implementation-contract.md`.

The output envelope contract is `docs/claude-hook-native-command-input-contract.md`.

The carrier source contract is `docs/claude-hook-carrier-source-contract.md`.

The carrier fixture contract is `docs/claude-hook-native-metadata-carrier-fixtures.md`.

The wrapper is not consumed by the current entrypoint.

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

Valid wrapper input contract:

- `hooks/claude/examples/wrapper-input.valid.json`

Rejected transcript-derived wrapper:

- `hooks/claude/examples/wrapper-input.invalid-transcript-derived.json`

Rejected current-entrypoint carrier path:

- `hooks/claude/examples/wrapper-input.invalid-current-entrypoint-carrier-path.json`

The valid fixture is contract-only and not installable as-is.

The valid fixture records native stdin as the source for the native payload.

The valid fixture records user-owned sidecar JSON as the source for `metadataCarrier`.

The valid fixture records that the current entrypoint does not consume wrapper input.

The rejected transcript-derived fixture intentionally mentions transcript_path.

The rejected current-entrypoint fixture intentionally includes carrierPath and metadataCarrierPath.

## Evidence Gate

Before wrapper input language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-output-fixtures.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation-contract.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js
node benchmarks/scripts/check-claude-hook-native-command-input-contract.js
node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the wrapper input contract is contract-only
- the wrapper is not implemented by the current entrypoint
- native stdin is the native payload source
- user-owned sidecar JSON is the carrier source
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

Do not execute scanners from wrapper input language.

Do not implement wrapper file reading in this gate.

Do not make `abk-claude-hook` read carrier paths in this gate.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is wrapper implementation fixtures that consume `docs/claude-hook-wrapper-implementation-contract.md`, still without installation or live settings guidance.
