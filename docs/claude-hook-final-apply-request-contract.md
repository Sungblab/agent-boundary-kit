# Claude Hook Final Apply Request Contract

This document records a final apply request contract only.

It is not settings application, not an installed hook, not an installer, and not a setup script.

## Boundary

final apply request is not settings application.

Agent must not edit settings after recognizing a final apply request.

A final apply request can only advance to application preflight review.

generic continuation text is not a final apply request.

The target review decision source is `docs/claude-hook-user-owned-target-review-decision.md`.

The target review packet source is `docs/claude-hook-user-owned-target-review-packet.md`.

The target review evidence source is `docs/claude-hook-user-owned-target-review-evidence.md`.

The target checklist source is `docs/claude-hook-user-owned-target-checklist.md`.

The install application source is `docs/claude-hook-install-application-contract.md`.

The user-approved install language source is `docs/claude-hook-user-approved-install-language.md`.

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

The application preflight review source is `docs/claude-hook-application-preflight-review-contract.md`.

The user execution packet review source is `docs/claude-hook-user-execution-packet-review-contract.md`.

This contract does not identify a user settings path.

This contract does not apply settings for the user.

This contract does not create repository hook setup files.

## Decision Rule

A valid final apply request is eligible only for `application-preflight-review`.

That means:

- the source text role is a final apply request
- the target review decision was reviewed
- the target review packet was reviewed
- the target review evidence was reviewed
- no settings mutation was attempted
- agent may not apply settings
- the next gate remains review-only

## Fixtures

Valid explicit final request:

- `hooks/claude/examples/final-apply-request.valid-explicit-final-request.json`

Rejected generic continuation:

- `hooks/claude/examples/final-apply-request.invalid-generic-continuation.json`

Rejected missing decision:

- `hooks/claude/examples/final-apply-request.invalid-missing-decision.json`

Rejected agent-applied settings:

- `hooks/claude/examples/final-apply-request.invalid-agent-applied-settings.json`

The valid fixture proves that a final apply request can be recognized without applying settings.

The generic continuation fixture proves that ordinary continuation text cannot become a final apply request.

The missing decision fixture proves that a final apply request cannot advance without a prior target review decision.

The agent-applied settings fixture proves that settings mutation blocks this gate.

## Evidence Gate

Before this contract is described as ready, verify:

```sh
node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js
node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js
node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js
node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- final apply request contract only
- final apply request is not settings application
- target review decision is required
- target review packet is required
- target review evidence is required
- generic continuation text is blocked
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

Do not execute scanners from final apply request language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is recorded in `docs/claude-hook-application-preflight-review-contract.md`: application preflight review. It still does not apply settings, install hooks, or mutate Claude configuration.

That gate is checked by `benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js`.
