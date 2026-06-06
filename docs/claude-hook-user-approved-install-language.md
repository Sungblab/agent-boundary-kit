# Claude Hook User-Approved Manual Install Language

This document records language-only user-approved manual install wording.

It is not an installed hook, not an installer, and not a setup script.

## Boundary

This language may describe a user-approved manual configuration action.

Agent must not edit settings.

The user edits their own Claude Code settings after reviewing the fixture.

The bounded command candidate is:

```text
abk-claude-hook-wrapper --carrier <user-owned-carrier-json>
```

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

The reviewed fixture source is `hooks/claude/examples/settings-fragment-review.valid.json`.

The wrapper wiring evidence is `docs/claude-hook-wrapper-wiring-review.md`.

The wrapper implementation boundary is `docs/claude-hook-wrapper-implementation.md`.

The native command input contract is `docs/claude-hook-native-command-input-contract.md`.

The later user-owned target checklist source is `docs/claude-hook-user-owned-target-checklist.md`.

The later target review evidence source is `docs/claude-hook-user-owned-target-review-evidence.md`.

This language must not tell an agent to apply the settings.

This language must not include shell copy commands.

This language must not include direct Claude settings paths.

## Source Evidence

Claude Code hook reference:

- `https://code.claude.com/docs/en/hooks`

Claude Code settings reference:

- `https://code.claude.com/docs/en/settings`

The source evidence says command hooks receive JSON on stdin and settings files define hook configuration.

## Fixtures

Valid language fixture:

- `hooks/claude/examples/user-approved-install-language.valid.md`

Rejected agent-applied fixture:

- `hooks/claude/examples/user-approved-install-language.invalid-agent-applied.md`

The valid fixture is manual approval only.

The valid fixture names `abk-claude-hook-wrapper --carrier <user-owned-carrier-json>`.

The valid fixture points to the settings-fragment review, wrapper wiring review, wrapper implementation boundary, and evidence gates.

The rejected fixture intentionally includes a direct settings path, a mutation command, and paste-oriented wording.

## Evidence Gate

Before this language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-user-approved-install-language.js
node benchmarks/scripts/check-claude-hook-settings-fragment-review.js
node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js
node benchmarks/scripts/check-claude-hook-wrapper-implementation.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the language is user-approved
- the valid fixture is manual approval only
- the valid fixture names `abk-claude-hook-wrapper --carrier <user-owned-carrier-json>`
- the agent may not edit settings
- no shell copy command is published
- no direct Claude settings path is published
- no hook setup file or repository-level Claude configuration exists

## Non-Goals

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not publish shell copy commands.

Do not execute scanners from install language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is recorded in `docs/claude-hook-install-application-contract.md`: a user-requested install application turn. Until the user explicitly requests that action, this repository stays at language review.

That gate is checked by `benchmarks/scripts/check-claude-hook-install-application-contract.js`.

The later target-review gate is recorded in `docs/claude-hook-user-owned-target-checklist.md` and checked by `benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js`.

The target evidence-record gate is recorded in `docs/claude-hook-user-owned-target-review-evidence.md` and checked by `benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js`.
