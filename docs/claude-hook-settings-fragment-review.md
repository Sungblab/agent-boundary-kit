# Claude Hook Settings Fragment Review

This document records a review-only Claude hook settings fragment candidate.

It is not a live settings fragment, not an installer, and not hook setup guidance.

## Boundary

User approval required.

Agent must not edit settings.

The reviewed candidate is not installable as-is.

The reviewed command candidate is:

```text
abk-claude-hook-wrapper --carrier <user-owned-carrier-json>
```

The matcher candidate is `Edit|MultiEdit|Write`.

The required input mode is `native-payload-with-carrier`.

The required carrier field is `metadataCarrier`.

The wrapper wiring evidence is `docs/claude-hook-wrapper-wiring-review.md`.

The wrapper implementation boundary is `docs/claude-hook-wrapper-implementation.md`.

The native command input contract is `docs/claude-hook-native-command-input-contract.md`.

The review does not install hooks.

The review does not create or edit Claude configuration files.

The review does not execute scanners.

The review does not publish live settings guidance.

The review does not publish shell copy commands.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/settings`

The source evidence says hooks are defined in settings JSON and command hooks receive JSON on stdin.

## Fixtures

Valid review fixture:

- `hooks/claude/examples/settings-fragment-review.valid.json`

Rejected live settings fixture:

- `hooks/claude/examples/settings-fragment-review.invalid-live-settings.json`

Rejected mutating fixture:

- `hooks/claude/examples/settings-fragment-review.invalid-mutating.md`

The valid fixture is a fixture wrapper. It is not a settings file.

The valid fixture includes `userApprovalRequired`, `agentMayApplySettings`, `notInstallableAsIs`, and `wrapperWiringReviewed`.

The valid fixture names `abk-claude-hook-wrapper --carrier <user-owned-carrier-json>`, `Edit|MultiEdit|Write`, `native-payload-with-carrier`, and `metadataCarrier`.

The rejected live settings fixture intentionally exposes a top-level `hooks` block without review metadata.

The rejected mutating fixture intentionally includes a direct settings path and mutation command.

## Evidence Gate

Before settings-fragment review language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-settings-fragment-review.js
node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation.js
node benchmarks/scripts/check-claude-hook-native-command-input-contract.js
node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the review fixture is review-only
- the review fixture is not installable as-is
- the review fixture requires user approval
- the agent may not apply settings
- wrapper wiring has already been reviewed
- the candidate command uses `abk-claude-hook-wrapper --carrier <user-owned-carrier-json>`
- the matcher is `Edit|MultiEdit|Write`
- the required input mode is `native-payload-with-carrier`
- the required carrier field is `metadataCarrier`
- no shell copy command is published
- no live settings fragment is published
- no repository-level Claude configuration exists

## Non-Goals

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not publish final settings copy.

Do not publish shell copy commands.

Do not publish live settings guidance.

Do not add setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from review language.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is user-approved manual installation language, still separate from agent-performed installation.
