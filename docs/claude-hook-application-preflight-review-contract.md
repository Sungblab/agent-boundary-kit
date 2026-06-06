# Claude Hook Application Preflight Review Contract

This document records an application preflight review contract only.

It is not settings application, not an installed hook, not an installer, and not a setup script.

## Boundary

application preflight review is not settings application.

Agent must not edit settings during application preflight review.

A valid preflight review can only advance to user execution packet review.

final apply request required before application preflight review.

backup evidence required before application preflight review.

The final apply request source is `docs/claude-hook-final-apply-request-contract.md`.

The target review decision source is `docs/claude-hook-user-owned-target-review-decision.md`.

The target review packet source is `docs/claude-hook-user-owned-target-review-packet.md`.

The target review evidence source is `docs/claude-hook-user-owned-target-review-evidence.md`.

The target checklist source is `docs/claude-hook-user-owned-target-checklist.md`.

The install application source is `docs/claude-hook-install-application-contract.md`.

The user-approved install language source is `docs/claude-hook-user-approved-install-language.md`.

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

The wrapper wiring evidence source is `docs/claude-hook-wrapper-wiring-review.md`.

This contract does not identify a user settings path.

This contract does not apply settings for the user.

This contract does not create repository hook setup files.

## Review Rule

A valid application preflight review is ready only for `user-execution-packet-review`.

That means:

- the source text role is application preflight review
- the final apply request was reviewed
- the target review decision was reviewed
- the target review packet was reviewed
- the target review evidence was reviewed
- backup evidence was reviewed
- settings-fragment review was reviewed
- user-approved install language was reviewed
- no settings mutation was attempted
- agent may not apply settings
- the next gate remains review-only

## Fixtures

Valid reviewed evidence:

- `hooks/claude/examples/application-preflight.valid-reviewed-evidence.json`

Rejected missing final request:

- `hooks/claude/examples/application-preflight.invalid-missing-final-request.json`

Rejected missing backup evidence:

- `hooks/claude/examples/application-preflight.invalid-missing-backup-evidence.json`

Rejected agent-applied settings:

- `hooks/claude/examples/application-preflight.invalid-agent-applied-settings.json`

The valid fixture proves that preflight evidence can be reviewed without applying settings.

The missing final request fixture proves that preflight review cannot start before the final apply request gate.

The missing backup evidence fixture proves that target ownership is insufficient without backup evidence.

The agent-applied settings fixture proves that settings mutation blocks this gate.

## Evidence Gate

Before this contract is described as ready, verify:

```sh
node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js
node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js
node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- application preflight review contract only
- application preflight review is not settings application
- final apply request is required
- target review decision is required
- target review packet is required
- target review evidence is required
- backup evidence is required
- settings-fragment review is required
- user-approved install language is required
- settings mutation is not attempted
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

Do not execute scanners from application preflight review language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is user execution packet review. It still does not apply settings, install hooks, or mutate Claude configuration.
