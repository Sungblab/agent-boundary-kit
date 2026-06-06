# Claude Hook Manual Install Review Packet

This is a review packet only.

It is not a live settings fragment, not an installer, and not hook setup guidance.

## Boundary

User approval required.

The agent must not edit settings.

The bounded command candidate is `abk-claude-hook`.

The native input mode is `native-payload-with-carrier`.

The required carrier is `metadataCarrier`.

The review packet extends:

- `docs/claude-hook-manual-install.md`
- `docs/claude-hook-manual-install-contract.md`
- `docs/claude-hook-manual-install-language-fixtures.md`
- `docs/claude-hook-settings-fragment-draft-fixtures.md`
- `docs/claude-hook-carrier-source-contract.md`
- `docs/claude-hook-wrapper-input-contract.md`
- `docs/claude-hook-native-command-input-contract.md`

Native command entrypoint evidence is:

- `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`

Manual install readiness evidence is:

- `benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js`

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not publish shell copy commands.

## Fixtures

Valid review packet:

- `hooks/claude/examples/manual-install-review-packet.valid.md`

Rejected review packet:

- `hooks/claude/examples/manual-install-review-packet.invalid-settings-fragment.md`

The valid packet may name the bounded command, input mode, required carrier, evidence gates, and official source references.

The valid packet must not contain a live settings fragment, direct settings path, shell copy command, or instruction that the agent should apply settings for the user.

The rejected packet intentionally includes a live hook settings fragment and direct settings path so the checker can reject it.

## Evidence Gate

Before manual install review language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-manual-install-review-packet.js
node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js
node benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js
node benchmarks/scripts/check-claude-hook-manual-install-document.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the review packet is review-only
- the valid packet names `abk-claude-hook`
- the valid packet requires `native-payload-with-carrier`
- the valid packet requires `metadataCarrier`
- the valid packet lists evidence gates
- the settings-fragment draft fixture is not installable as-is
- the carrier source contract is not consumed by the current entrypoint
- the wrapper input contract is contract-only
- no live hook settings fragment is published
- no shell copy command is published
- no repository-level Claude configuration exists

## Non-Goals

Do not install Claude hooks.

Do not publish live settings fragments.

Do not publish shell copy commands.

Do not add installer code.

Do not add hook setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from install language.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is wrapper output fixtures, still non-mutating and still separate from any agent-performed installation.
