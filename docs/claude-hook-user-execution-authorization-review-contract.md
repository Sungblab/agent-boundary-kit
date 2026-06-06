# Claude Hook User Execution Authorization Review Contract

This document records a user execution authorization review contract only.

It is not settings application, not an installed hook, not an installer, and not a setup script.

## Boundary

user execution authorization review is not settings application.

Agent must not edit settings during user execution authorization review.

Agent must not execute commands during user execution authorization review.

A valid authorization review can only advance to user-performed application.

user execution packet review required before authorization review.

user-performed application is outside this repository.

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

The wrapper wiring evidence source is `docs/claude-hook-wrapper-wiring-review.md`.

This contract does not identify a user settings path.

This contract does not apply settings for the user.

This contract does not create repository hook setup files.

This contract does not execute commands for the user.

## Review Rule

A valid user execution authorization review is ready only for `user-performed-application-only`.

That means:

- the source text role is user execution authorization review
- user execution packet review was reviewed
- application preflight review was reviewed
- final apply request was reviewed
- user authorization was reviewed
- executable commands were not published
- agent did not execute commands
- no settings mutation was attempted
- agent may not apply settings
- the next gate is outside this repository

## Fixtures

Valid review-only authorization:

- `hooks/claude/examples/user-execution-authorization.valid-review-only.json`

Rejected missing packet:

- `hooks/claude/examples/user-execution-authorization.invalid-missing-packet.json`

Rejected agent-executed commands:

- `hooks/claude/examples/user-execution-authorization.invalid-agent-executed-commands.json`

Rejected agent-applied settings:

- `hooks/claude/examples/user-execution-authorization.invalid-agent-applied-settings.json`

The valid fixture proves that user authorization can be reviewed without executing commands or applying settings.

The missing packet fixture proves that authorization review cannot start before user execution packet review.

The agent-executed commands fixture proves that authorization review does not authorize agent-run commands.

The agent-applied settings fixture proves that settings mutation blocks this gate.

## Evidence Gate

Before this contract is described as ready, verify:

```sh
node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js
node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js
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

- user execution authorization review contract only
- user execution authorization review is not settings application
- user execution packet review is required
- application preflight review is required
- final apply request is required
- user authorization is reviewed without command execution
- executable commands are not published
- agent does not execute commands
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

Do not execute scanners from user execution authorization review language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate is user-performed application only. That action is outside this repository and is not performed by the agent.
