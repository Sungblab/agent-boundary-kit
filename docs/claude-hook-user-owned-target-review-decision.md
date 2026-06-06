# Claude Hook User-Owned Target Review Decision

This document records a decision-fixture contract only.

It is not settings application, not an installed hook, not an installer, and not a setup script.

## Boundary

Target review decision is not settings application.

Agent must not edit settings after recording a review decision.

Final user apply request required before any future application review.

generic continuation text is not an application decision.

The target review packet source is `docs/claude-hook-user-owned-target-review-packet.md`.

The target review evidence source is `docs/claude-hook-user-owned-target-review-evidence.md`.

The target checklist source is `docs/claude-hook-user-owned-target-checklist.md`.

The install application source is `docs/claude-hook-install-application-contract.md`.

The user-approved install language source is `docs/claude-hook-user-approved-install-language.md`.

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

The final apply request source is `docs/claude-hook-final-apply-request-contract.md`.

The application preflight review source is `docs/claude-hook-application-preflight-review-contract.md`.

The user execution packet review source is `docs/claude-hook-user-execution-packet-review-contract.md`.

The user execution authorization review source is `docs/claude-hook-user-execution-authorization-review-contract.md`.

The user-performed application boundary source is `docs/claude-hook-user-performed-application-boundary-contract.md`.

The wrapper wiring evidence is `docs/claude-hook-wrapper-wiring-review.md`.

This decision does not identify a user settings path.

This decision does not apply settings for the user.

This decision does not create repository hook setup files.

## Decision Rule

The current valid decision is `defer-settings-application`.

That means:

- the target review packet was reviewed
- the target review evidence was reviewed
- the source text role is an explicit install request
- no final user apply request is present
- settings mutation was not attempted
- agent may not apply settings
- the decision remains review-only

## Fixtures

Valid deferred decision:

- `hooks/claude/examples/user-owned-target-review-decision.valid-defer-application.json`

Rejected generic continuation decision:

- `hooks/claude/examples/user-owned-target-review-decision.invalid-generic-continuation.json`

Rejected missing-packet decision:

- `hooks/claude/examples/user-owned-target-review-decision.invalid-missing-packet.json`

Rejected agent-applied settings decision:

- `hooks/claude/examples/user-owned-target-review-decision.invalid-agent-applied-settings.json`

The valid decision proves that a target review can produce a bounded decision without applying settings.

The rejected generic continuation fixture proves that ordinary continuation text cannot become an application decision.

The rejected missing-packet fixture proves that a decision cannot be recorded before packet review.

The rejected agent-applied settings fixture proves that a decision is blocked if settings mutation is attempted.

## Evidence Gate

Before this decision fixture is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js
node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js
node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js
node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js
node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js
node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js
node benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js
node benchmarks/scripts/check-claude-hook-install-application-contract.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- target review decision is not settings application
- final user apply request required before any future application review
- generic continuation text is blocked
- packet review is required
- target review evidence is required
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

Do not execute scanners from target review decision language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is recorded in `docs/claude-hook-final-apply-request-contract.md`: a final apply request contract. It still does not apply settings, install hooks, or mutate Claude configuration.

That gate is checked by `benchmarks/scripts/check-claude-hook-final-apply-request-contract.js`.
