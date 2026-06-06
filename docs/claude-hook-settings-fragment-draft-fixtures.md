# Claude Hook Settings Fragment Draft Fixtures

These fixtures define the first Claude hook settings-fragment draft.

They are draft fixture only.

They are not a live settings fragment, not an installer, and not hook setup guidance.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/configuration`

The source evidence says hooks are defined in settings JSON and command hooks receive JSON on stdin.

## Boundary

User approval required.

Agent must not edit settings.

The valid fixture is not installable as-is.

The carrier gap must stay explicit.

The command candidate is `abk-claude-hook`.

The matcher candidate is `Edit|MultiEdit|Write`.

The required input mode is `native-payload-with-carrier`.

The required carrier field is `metadataCarrier`.

The carrier contract is `docs/claude-hook-native-command-input-contract.md`.

The carrier source contract is `docs/claude-hook-carrier-source-contract.md`.

The wrapper input contract is `docs/claude-hook-wrapper-input-contract.md`.

The review packet is `docs/claude-hook-manual-install-review-packet.md`.

The draft fixture may contain a `settingsFragmentDraft` object for review.

The draft fixture must not tell the user to paste, run, install, or apply it.

The nested draft must not be published as final install copy until the carrier source contract exists.

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not publish shell copy commands.

## Fixtures

Valid draft fixture:

- `hooks/claude/examples/settings-fragment-draft.valid.json`

Rejected live settings fixture:

- `hooks/claude/examples/settings-fragment-draft.invalid-live-settings.json`

Rejected mutating fixture:

- `hooks/claude/examples/settings-fragment-draft.invalid-mutating.md`

The valid fixture is a fixture wrapper. It is not a settings file.

The valid fixture includes `userApprovalRequired`, `agentMayApplySettings`, `notInstallableAsIs`, and `carrierGapAcknowledged`.

The valid fixture names `abk-claude-hook`, `Edit|MultiEdit|Write`, `native-payload-with-carrier`, and `metadataCarrier`.

The rejected live settings fixture intentionally exposes a top-level `hooks` block without approval metadata.

The rejected mutating fixture intentionally includes a direct settings path and mutation command.

## Evidence Gate

Before settings-fragment draft language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js
node benchmarks/scripts/check-claude-hook-carrier-source-contract.js
node benchmarks/scripts/check-claude-hook-wrapper-input-contract.js
node benchmarks/scripts/check-claude-hook-manual-install-review-packet.js
node benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js
node benchmarks/scripts/check-claude-hook-manual-install-document.js
node benchmarks/scripts/check-claude-hook-native-command-entrypoint.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the draft fixture is not installable as-is
- the draft fixture requires user approval
- the agent may not apply settings
- the carrier gap stays explicit
- the carrier source contract is not consumed by the current entrypoint
- the wrapper input contract is contract-only
- the draft names `abk-claude-hook`
- the draft names `Edit|MultiEdit|Write`
- the draft names `native-payload-with-carrier`
- the draft names `metadataCarrier`
- no shell copy command is published
- no repository-level Claude configuration exists
- the invalid live settings fixture is rejected because it lacks approval and carrier metadata

## Non-Goals

Do not install Claude hooks.

Do not publish final settings copy.

Do not publish shell copy commands.

Do not add setup scripts.

Do not create or edit Claude configuration files.

Do not execute scanners from draft language.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is wrapper output fixtures that show the exact envelope produced from native stdin plus user-owned carrier metadata, still without implementation.
