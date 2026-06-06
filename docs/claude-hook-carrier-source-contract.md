# Claude Hook Carrier Source Contract

This is a contract only.

It is not an installed hook, not an installer, and not live settings guidance.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/configuration`

The source evidence says command hooks receive JSON on stdin and settings JSON defines hook handlers.

## Boundary

User approval required.

Agent must not create or edit the carrier source.

The carrier source is user-owned sidecar JSON.

The source is not consumed by the current entrypoint.

The current entrypoint must still reject carrierPath and metadataCarrierPath.

The command envelope remains `native-payload-with-carrier`.

The required field remains `metadataCarrier`.

The required carrier fields are `hookId`, `repoRoot`, and `task`.

The command input contract is `docs/claude-hook-native-command-input-contract.md`.

The carrier fixture contract is `docs/claude-hook-native-metadata-carrier-fixtures.md`.

The settings-fragment draft fixture is `docs/claude-hook-settings-fragment-draft-fixtures.md`.

The valid carrier source fixture records a source shape for review only.

It must not turn into a file-read path accepted by `abk-claude-hook`.

It must not embed task metadata into Claude settings JSON.

It must not derive task metadata from transcripts.

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not publish shell copy commands.

## Fixtures

Valid carrier source:

- `hooks/claude/examples/carrier-source.valid.json`

Rejected transcript-derived carrier source:

- `hooks/claude/examples/carrier-source.invalid-transcript-derived.json`

Rejected settings-inline carrier source:

- `hooks/claude/examples/carrier-source.invalid-settings-inline.json`

The valid fixture is contract-only and not installable as-is.

The valid fixture uses a placeholder carrier source, not a repository path.

The valid fixture keeps `metadataCarrier` explicit and includes `hookId`, `repoRoot`, and `task`.

The rejected transcript-derived fixture intentionally mentions transcript_path.

The rejected settings-inline fixture intentionally puts `metadataCarrier` next to a top-level `hooks` block.

## Evidence Gate

Before carrier source language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js
node benchmarks/scripts/check-claude-hook-native-command-input-contract.js
node benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the carrier source is contract-only
- user approval is required
- the agent may not create or edit the carrier source
- the current entrypoint does not consume the carrier source
- the current entrypoint still rejects carrier paths
- `native-payload-with-carrier` remains the command input mode
- `metadataCarrier` remains required
- `hookId`, `repoRoot`, and `task` remain required carrier fields
- no shell copy command is published
- no repository-level Claude configuration exists

## Non-Goals

Do not install Claude hooks.

Do not publish final settings copy.

Do not publish shell copy commands.

Do not add setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from carrier source language.

Do not make `abk-claude-hook` read carrier paths in this gate.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is a wrapper input contract that can combine native stdin with a user-owned carrier source without reading transcripts or mutating Claude configuration.
