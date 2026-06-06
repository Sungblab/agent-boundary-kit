# Claude Hook Install Application Contract

This document records the application contract only.

It is not an installed hook, not an installer, and not a setup script.

## Boundary

Explicit user request required.

Generic continuation commands are insufficient.

Agent must not edit settings without that request.

The current safe state is language review.

The user-approved install language source is `docs/claude-hook-user-approved-install-language.md`.

The settings-fragment review source is `docs/claude-hook-settings-fragment-review.md`.

The wrapper wiring evidence is `docs/claude-hook-wrapper-wiring-review.md`.

The wrapper implementation boundary is `docs/claude-hook-wrapper-implementation.md`.

The application contract does not provide settings mutation commands.

The application contract does not name a local settings path.

The application contract does not create repository hook setup files.

## Fixtures

Blocked fixture:

- `hooks/claude/examples/install-application.invalid-no-explicit-request.json`

Eligible review fixture:

- `hooks/claude/examples/install-application.valid-explicit-request.json`

The blocked fixture proves that ordinary continuation text does not authorize settings edits.

The eligible fixture proves that even with an explicit install request, this repository remains a source fixture and contract repo. Applying settings still requires a user-owned target outside this repo.

## Evidence Gate

Before install application language is described as ready, run:

```sh
node benchmarks/scripts/check-claude-hook-install-application-contract.js
node benchmarks/scripts/check-claude-hook-user-approved-install-language.js
node benchmarks/scripts/check-claude-hook-settings-fragment-review.js
node benchmarks/scripts/check-claude-hook-wrapper-wiring-review.js
npm run bench:check
npm run bench:check:red
```

The evidence must show:

- explicit user request required
- generic continuation commands are insufficient
- agent may not apply settings without that request
- user-approved install language remains language-only
- settings-fragment review remains review-only
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

Do not execute scanners from install application language.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.

## Next Gate

The next gate requires a new user turn that explicitly asks to apply installation to a user-owned target. Without that request, stay at language review.
