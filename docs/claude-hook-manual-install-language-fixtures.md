# Claude Hook Manual Install Language Fixtures

These fixtures define bounded manual install language for the Claude hook adapter.

They extend `docs/claude-hook-manual-install-contract.md`, `docs/claude-hook-manual-install-doc-fixture.md`, `docs/claude-hook-manual-install.md`, `docs/claude-hook-manual-install-review-packet.md`, `docs/claude-hook-settings-fragment-draft-fixtures.md`, `docs/claude-hook-carrier-source-contract.md`, `docs/claude-hook-wrapper-input-contract.md`, `docs/claude-hook-native-command-input-contract.md`, and `docs/claude-hook-command-adapter-entrypoint.md`.

They are language fixtures only. They are not installed hooks, not installers, and not hook setup scripts.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/configuration`

The source evidence says command hooks receive JSON on stdin and Claude Code settings files define hook configuration.

## Boundary

The valid language may name `abk-claude-hook` as the bounded command candidate.

It may point to `docs/claude-hook-command-adapter-entrypoint.md`.

It may point to `docs/claude-hook-native-command-input-contract.md`.

It may cite native command entrypoint evidence from `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`.

It may point to `docs/claude-hook-manual-install-review-packet.md`.

It may point to `docs/claude-hook-settings-fragment-draft-fixtures.md`.

It may point to `docs/claude-hook-carrier-source-contract.md`.

It may point to `docs/claude-hook-wrapper-input-contract.md`.

It may require manual approval only.

It may say the user edits their own Claude Code settings after reviewing the generated settings fragment.

No raw private transcripts.

No hidden chat history.

No prompt text.

No message arrays.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks in this repository.

Do not create or edit Claude configuration files from this repository.

Do not provide shell copy commands.

Do not execute scanners in the install language.

Do not generate final copy.

## Fixtures

Valid language fixture:

- `hooks/claude/examples/manual-install-language.valid.md`

Rejected language fixture:

- `hooks/claude/examples/manual-install-language.invalid-mutating.md`

The valid fixture names the bounded command, official source references, required review gates, and user-owned settings action.

The rejected fixture intentionally includes mutation commands and a direct Claude settings path so the check can reject the pattern.

## Evidence Gate

Before manual install language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js
node benchmarks/scripts/check-claude-hook-manual-install-review-packet.js
node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js
node benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js
node benchmarks/scripts/check-claude-hook-manual-install-document.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
node benchmarks/scripts/check-claude-hook-manual-install-contract.js
node benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js
node benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the valid fixture names `abk-claude-hook`
- the valid fixture links the bounded adapter entrypoint
- the valid fixture links the native command input contract
- the valid fixture links the manual install review packet
- the valid fixture links the settings-fragment draft fixtures
- the valid fixture links the carrier source contract
- the valid fixture links the wrapper input contract
- the valid fixture cites native command entrypoint evidence
- the valid fixture cites official Claude Code hooks and settings references
- the valid fixture does not include shell copy commands
- the valid fixture does not include direct Claude settings paths
- no install scripts or setup scripts exist in `hooks/claude/`
- no repository-level Claude hook configuration exists

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

The next gate is wrapper output fixtures after the wrapper input contract remains contract-only.
