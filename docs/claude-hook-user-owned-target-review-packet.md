# Claude Hook User-Owned Target Review Packet

This document records a manual review packet only.

It is not settings application, not an installed hook, not an installer, and not a setup script.

## Boundary

User-owned target review evidence required.

Agent must not edit settings.

The packet source is `docs/claude-hook-user-owned-target-review-evidence.md`.

The target checklist source is `docs/claude-hook-user-owned-target-checklist.md`.

The install application source is `docs/claude-hook-install-application-contract.md`.

The user-approved install language source is `docs/claude-hook-user-approved-install-language.md`.

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

The wrapper wiring evidence is `docs/claude-hook-wrapper-wiring-review.md`.

The target review decision source is `docs/claude-hook-user-owned-target-review-decision.md`.

The final apply request source is `docs/claude-hook-final-apply-request-contract.md`.

The application preflight review source is `docs/claude-hook-application-preflight-review-contract.md`.

This packet does not identify a user settings path.

This packet does not apply settings for the user.

This packet does not create repository hook setup files.

## Packet Fields

A valid review packet may summarize:

- source text role
- target ownership
- target location relative to this repository
- target scope review status
- backup evidence status
- preflight evidence status
- settings mutation status
- review-only status
- evidence gates

The packet must not include final settings text, shell copy language, direct settings paths, or agent-applied settings instructions.

## Fixtures

Valid packet:

- `hooks/claude/examples/user-owned-target-review-packet.valid.md`

Rejected agent-applied settings packet:

- `hooks/claude/examples/user-owned-target-review-packet.invalid-agent-applied-settings.md`

The valid packet proves that user-owned target review evidence can be summarized without applying settings.

The rejected packet intentionally includes a direct settings path, a mutation command, and paste-oriented wording.

## Evidence Gate

Before this review packet is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js
node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js
node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js
node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js
node benchmarks/scripts/check-claude-hook-install-application-contract.js
node benchmarks/scripts/check-claude-hook-user-approved-install-language.js
node benchmarks/scripts/check-claude-hook-settings-fragment-review.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- the packet is manual review packet only
- target review evidence is required
- source text role is explicit install request
- target ownership is user-owned
- target scope is reviewed
- backup evidence is recorded
- preflight evidence is recorded
- settings mutation is not attempted
- packet remains review-only
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

Do not execute scanners from target review packet language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is recorded in `docs/claude-hook-user-owned-target-review-decision.md`: a target review decision fixture. It still does not apply settings, install hooks, or mutate Claude configuration.

That gate is checked by `benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js`.
