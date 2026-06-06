# Claude Hook User-Performed Application Boundary Contract

This document records a user-performed application boundary contract only.

It is not settings application, not an installed hook, not an installer, and not a setup script.

## Boundary

user-performed application boundary contract only.

user-performed application is outside this repository.

Agent must not claim user-performed application completed.

Agent must not verify external user-owned settings from this repository.

Agent must not edit settings after user execution authorization review.

This is a terminal boundary, not an application step.

The user execution authorization review source is `docs/claude-hook-user-execution-authorization-review-contract.md`.

The user execution packet review source is `docs/claude-hook-user-execution-packet-review-contract.md`.

The application preflight review source is `docs/claude-hook-application-preflight-review-contract.md`.

The final apply request source is `docs/claude-hook-final-apply-request-contract.md`.

The target review decision source is `docs/claude-hook-user-owned-target-review-decision.md`.

The target review packet source is `docs/claude-hook-user-owned-target-review-packet.md`.

The target review evidence source is `docs/claude-hook-user-owned-target-review-evidence.md`.

The target checklist source is `docs/claude-hook-user-owned-target-checklist.md`.

The install application source is `docs/claude-hook-install-application-contract.md`.

The user-approved install language source is `docs/claude-hook-user-approved-install-language.md`.

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

This contract does not identify a user settings path.

This contract does not apply settings for the user.

This contract does not create repository hook setup files.

This contract does not execute commands for the user.

This contract does not claim external application evidence.

## Boundary Rule

A valid user-performed application boundary is a terminal record only.

That means:

- user execution authorization review was reviewed
- user-performed application remains outside this repository
- agent did not execute commands
- no settings mutation was attempted
- agent may not apply settings
- agent did not claim completion
- agent did not claim external verification
- no next gate exists inside this repository

## Fixtures

Valid terminal boundary:

- `hooks/claude/examples/user-performed-application.valid-terminal-boundary.json`

Rejected agent completion claim:

- `hooks/claude/examples/user-performed-application.invalid-agent-completion-claim.json`

Rejected external verification claim:

- `hooks/claude/examples/user-performed-application.invalid-agent-verification-claim.json`

Rejected settings mutation:

- `hooks/claude/examples/user-performed-application.invalid-settings-mutation.json`

The valid fixture proves that the chain can end without applying settings or claiming external evidence.

The completion-claim fixture proves that this repository cannot claim the user completed external application.

The verification-claim fixture proves that this repository cannot claim external user-owned settings were verified.

The settings-mutation fixture proves that settings edits remain blocked at the terminal boundary.

## Evidence Gate

Before this contract is described as ready, verify:

```sh
node benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js
node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js
node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js
node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js
node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- terminal boundary is recorded
- user-performed application is outside this repository
- agent does not execute commands
- settings mutation is not attempted
- agent may not apply settings inside this repository
- agent does not claim user-performed application completion
- agent does not claim external user-owned settings verification
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

Do not execute scanners from user-performed application boundary language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Terminal State

No next repository gate exists. A user-performed application may happen outside this repository, but this repository cannot claim, verify, or perform it.
