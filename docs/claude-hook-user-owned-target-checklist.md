# Claude Hook User-Owned Target Checklist

This document records a checklist contract only.

It is not an installed hook, not an installer, and not a setup script.

## Boundary

User-owned target required.

An explicit install request is not sufficient by itself.

Agent must not edit settings until target ownership, scope, backup, and evidence are reviewed.

The install application source is `docs/claude-hook-install-application-contract.md`.

The user-approved install language source is `docs/claude-hook-user-approved-install-language.md`.

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

The wrapper wiring evidence is `docs/claude-hook-wrapper-wiring-review.md`.

The target review evidence source is `docs/claude-hook-user-owned-target-review-evidence.md`.

The target review packet source is `docs/claude-hook-user-owned-target-review-packet.md`.

The target review decision source is `docs/claude-hook-user-owned-target-review-decision.md`.

The final apply request source is `docs/claude-hook-final-apply-request-contract.md`.

The application preflight review source is `docs/claude-hook-application-preflight-review-contract.md`.

This checklist does not identify a user settings path.

This checklist does not apply settings for the user.

This checklist does not create repository hook setup files.

## Checklist

Before any future settings application is eligible for review, evidence must show:

- an explicit user install request exists
- the target is user-owned
- the target is outside this repository
- the target scope has been reviewed
- a backup plan is required
- the wrapper-backed settings candidate remains review-only
- the user-approved install language remains language-only
- generic continuation text is not treated as installation approval

## Fixtures

Eligible target-review fixture:

- `hooks/claude/examples/user-owned-target.valid-explicit-target.json`

Rejected repository-target fixture:

- `hooks/claude/examples/user-owned-target.invalid-repo-target.json`

Rejected missing-backup fixture:

- `hooks/claude/examples/user-owned-target.invalid-missing-backup.json`

The eligible fixture proves that even after an explicit install request and a user-owned target, this repository remains a source fixture and contract repo. Settings application is still not performed here.

The rejected repository-target fixture proves that this repo cannot be used as the configuration target.

The rejected missing-backup fixture proves that target ownership is insufficient without backup evidence.

## Evidence Gate

Before this checklist is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js
node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js
node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js
node benchmarks/scripts/check-claude-hook-install-application-contract.js
node benchmarks/scripts/check-claude-hook-user-approved-install-language.js
node benchmarks/scripts/check-claude-hook-settings-fragment-review.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- user-owned target required
- explicit install request is not sufficient by itself
- target scope must be reviewed before settings application
- backup plan is required before settings application
- repository targets are blocked
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

Do not execute scanners from target checklist language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is recorded in `docs/claude-hook-user-owned-target-review-evidence.md`: evidence recording for a future user-owned target review. It still does not apply settings, install hooks, or mutate Claude configuration.

That gate is checked by `benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js`.
