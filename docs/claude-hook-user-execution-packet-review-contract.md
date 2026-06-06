# Claude Hook User Execution Packet Review Contract

This document records a user execution packet review contract only.

It is not settings application, not an installed hook, not an installer, and not a setup script.

## Boundary

user execution packet review is not settings application.

Agent must not edit settings during user execution packet review.

Agent must not publish executable commands during user execution packet review.

A valid packet review can only advance to user execution authorization review.

application preflight review required before user execution packet review.

manual execution packet remains review-only.

The application preflight review source is `docs/claude-hook-application-preflight-review-contract.md`.

The final apply request source is `docs/claude-hook-final-apply-request-contract.md`.

The target review decision source is `docs/claude-hook-user-owned-target-review-decision.md`.

The target review packet source is `docs/claude-hook-user-owned-target-review-packet.md`.

The target review evidence source is `docs/claude-hook-user-owned-target-review-evidence.md`.

The target checklist source is `docs/claude-hook-user-owned-target-checklist.md`.

The install application source is `docs/claude-hook-install-application-contract.md`.

The user-approved install language source is `docs/claude-hook-user-approved-install-language.md`.

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

The wrapper wiring evidence source is `docs/claude-hook-wrapper-wiring-review.md`.

The user execution authorization review source is `docs/claude-hook-user-execution-authorization-review-contract.md`.

The user-performed application boundary source is `docs/claude-hook-user-performed-application-boundary-contract.md`.

This contract does not identify a user settings path.

This contract does not apply settings for the user.

This contract does not create repository hook setup files.

This contract does not publish an executable packet.

## Review Rule

A valid user execution packet review is ready only for `user-execution-authorization-review`.

That means:

- the source text role is user execution packet review
- application preflight review was reviewed
- final apply request was reviewed
- target review decision was reviewed
- backup evidence was reviewed
- settings-fragment review was reviewed
- user-approved install language was reviewed
- executable commands were not published
- no settings mutation was attempted
- agent may not apply settings
- the next gate remains review-only

## Fixtures

Valid review-only packet:

- `hooks/claude/examples/user-execution-packet.valid-review-only.json`

Rejected missing preflight:

- `hooks/claude/examples/user-execution-packet.invalid-missing-preflight.json`

Rejected executable commands:

- `hooks/claude/examples/user-execution-packet.invalid-executable-commands.json`

Rejected agent-applied settings:

- `hooks/claude/examples/user-execution-packet.invalid-agent-applied-settings.json`

The valid fixture proves that a user execution packet can be reviewed without publishing executable commands or applying settings.

The missing preflight fixture proves that packet review cannot start before application preflight review.

The executable commands fixture proves that this gate cannot publish shell copy commands or direct execution language.

The agent-applied settings fixture proves that settings mutation blocks this gate.

## Evidence Gate

Before this contract is described as ready, verify:

```sh
node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js
node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js
node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js
node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js
node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js
node benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- user execution packet review contract only
- user execution packet review is not settings application
- application preflight review is required
- final apply request is required
- target review decision is required
- target review packet is required
- target review evidence is required
- backup evidence is required
- executable commands are not published
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

Do not execute scanners from user execution packet review language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is recorded in `docs/claude-hook-user-execution-authorization-review-contract.md`: user execution authorization review. It still does not apply settings, install hooks, or mutate Claude configuration.

That gate is checked by `benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js`.
