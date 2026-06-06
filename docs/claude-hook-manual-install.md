# Claude Hook Manual Install

This is a user-approved manual install document.

## Status

Status: blocked for live installation.

Do not paste a live settings fragment yet.

The native Claude Code hook payload compatibility is not proven.

The current adapter expects ABK hook event fields.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/configuration`

The source evidence says command hooks receive JSON on stdin and Claude Code settings files define hook configuration.

## Current Boundary

Review `docs/claude-hook-manual-install-language-fixtures.md` before changing install language.

Review `docs/claude-hook-command-adapter-entrypoint.md` before naming `abk-claude-hook` in install language.

Review `docs/claude-hook-event-input-contract.md` before claiming native Claude Code hook payload compatibility.

Review `docs/claude-hook-native-payload-mapping-fixtures.md` before publishing any live settings fragment.

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not run shell copy commands.

Do not generate final copy.

## Blocked Settings Fragment

The reviewed settings fragment is intentionally blocked.

Reason: the current adapter is verified against ABK hook event fixtures, not native Claude Code hook payload fixtures.

The next implementation must first prove that native Claude Code hook stdin can be mapped into the allowed event fields without reading private transcripts, prompt text, message arrays, broad workspace files, or inferred metadata.

Until that proof exists, this document must not include a live hook settings fragment.

## Evidence Gate

Before this manual install document is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-manual-install-document.js
node benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-contract.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the document remains blocked for live installation
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

The next gate is an explicit metadata carrier for native Claude Code hook events after `docs/claude-hook-native-payload-mapping-fixtures.md` proves native payload alone is insufficient.
