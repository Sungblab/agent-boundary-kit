# Claude Hook Manual Install

This is a user-approved manual install document.

## Status

Status: ready for user-approved manual install language review.

Blocked for agent-performed installation.

Do not paste a live settings fragment yet.

The native command entrypoint evidence is proven by `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`.

The current adapter accepts ABK hook event fields and native payload envelopes with metadataCarrier.

metadataCarrier is required.

No live hook settings fragment is published.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/configuration`

The source evidence says command hooks receive JSON on stdin and Claude Code settings files define hook configuration.

## Current Boundary

Review `docs/claude-hook-manual-install-language-fixtures.md` before changing install language.

Review `docs/claude-hook-manual-install-review-packet.md` before changing user-facing manual install review language.

Review `docs/claude-hook-settings-fragment-draft-fixtures.md` before drafting any settings-fragment fixture.

Review `docs/claude-hook-command-adapter-entrypoint.md` before naming `abk-claude-hook` in install language.

Review `docs/claude-hook-event-input-contract.md` before changing ABK hook event fields.

Review `docs/claude-hook-native-payload-mapping-fixtures.md` before changing native payload handling.

Review `docs/claude-hook-native-command-input-contract.md` before changing native-payload-with-carrier input.

Review `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js` before claiming native command entrypoint readiness.

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not run shell copy commands.

Do not generate final copy.

## Blocked Settings Fragment

The reviewed settings fragment is intentionally blocked.

Reason: native command entrypoint evidence exists, but installation is still a user-owned configuration action.

The current allowed next step is manual install language review, not settings mutation.

The user must explicitly request installation in that turn before an agent may help apply settings outside this repository.

Until that approval exists, this document must not include a live hook settings fragment.

## Evidence Gate

Before this manual install document is described as ready for manual install language review, run:

```sh
node benchmarks/scripts/check-claude-hook-manual-install-document.js
node benchmarks/scripts/check-claude-hook-manual-install-review-packet.js
node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
node benchmarks/scripts/check-claude-hook-native-command-input-contract.js
node benchmarks/scripts/check-claude-hook-native-adapter.js
node benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- native command entrypoint evidence is proven
- the manual install review packet is review-only
- the settings-fragment draft fixture is not installable as-is
- the document is ready only for user-approved manual install language review
- agent-performed installation remains blocked
- no live hook settings fragment is published
- no hook install files or setup scripts exist in this repository
- no Claude configuration files exist in this repository
- the current adapter still preserves the bounded stdin-to-runner dry-run path

## Non-Goals

Do not install Claude hooks.

Do not publish shell copy commands.

Do not add installer code.

Do not add hook setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from install language.

Do not add background watchers.

Do not create connectors.

Do not build dashboards.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is a carrier source contract for a user-owned hook configuration path, still without shell copy commands, live settings fragments, or agent-performed configuration mutation.
