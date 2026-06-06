# Claude Hook User-Owned Target Review Evidence

This document records an evidence-record contract only.

It is not an installed hook, not an installer, and not a setup script.

## Boundary

User-owned target review required.

Review evidence is not settings application.

Agent must not edit settings after recording review evidence.

The target checklist source is `docs/claude-hook-user-owned-target-checklist.md`.

The install application source is `docs/claude-hook-install-application-contract.md`.

The user-approved install language source is `docs/claude-hook-user-approved-install-language.md`.

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

The wrapper wiring evidence is `docs/claude-hook-wrapper-wiring-review.md`.

The target review packet source is `docs/claude-hook-user-owned-target-review-packet.md`.

The target review decision source is `docs/claude-hook-user-owned-target-review-decision.md`.

The final apply request source is `docs/claude-hook-final-apply-request-contract.md`.

The application preflight review source is `docs/claude-hook-application-preflight-review-contract.md`.

This evidence record does not identify a user settings path.

This evidence record does not apply settings for the user.

This evidence record does not create repository hook setup files.

## Evidence Fields

A valid target review evidence record must show:

- the source text role is an explicit install request
- a user-owned target was provided
- the target is outside this repository
- target scope was reviewed
- backup evidence was recorded
- preflight evidence was recorded
- no settings mutation was attempted
- the record is review-only

Generic workflow commands remain workflow commands. They cannot become target review evidence.

## Fixtures

Valid evidence record:

- `hooks/claude/examples/user-owned-target-review.valid-evidence-record.json`

Rejected generic continuation fixture:

- `hooks/claude/examples/user-owned-target-review.invalid-generic-continuation.json`

Rejected agent-applied settings fixture:

- `hooks/claude/examples/user-owned-target-review.invalid-agent-applied-settings.json`

Rejected missing-scope-review fixture:

- `hooks/claude/examples/user-owned-target-review.invalid-missing-scope-review.json`

The valid fixture proves that target review evidence can be recorded without applying settings.

The generic continuation fixture proves that ordinary continuation text cannot become install evidence.

The agent-applied settings fixture proves that evidence recording is blocked if settings mutation is attempted.

The missing-scope-review fixture proves that target ownership is insufficient without scope review.

## Evidence Gate

Before this evidence record is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js
node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js
node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js
node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js
node benchmarks/scripts/check-claude-hook-install-application-contract.js
node benchmarks/scripts/check-claude-hook-user-approved-install-language.js
node benchmarks/scripts/check-claude-hook-settings-fragment-review.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- user-owned target review required
- review evidence is not settings application
- generic continuation text is blocked
- target scope review is required
- backup evidence is required
- preflight evidence is required
- agent may not apply settings inside this repository
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

Do not execute scanners from target review evidence language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is recorded in `docs/claude-hook-user-owned-target-review-packet.md`: a manual review packet for target review evidence. It still does not apply settings, install hooks, or mutate Claude configuration.

That gate is checked by `benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js`.
