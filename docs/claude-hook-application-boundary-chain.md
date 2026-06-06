# Claude Hook Application Boundary Chain

This document records the Claude hook application boundary chain only.

It is not settings application, not an installed hook, not an installer, and not a setup script.

## Boundary

application boundary chain only.

The chain is non-mutating from install application review through terminal boundary.

The terminal state is user-performed application outside this repository.

No gate in this chain installs hooks, edits settings, executes commands, or claims external verification.

No next repository gate exists after the terminal boundary.

## Chain Order

1. explicit install request: `docs/claude-hook-install-application-contract.md`
2. user-owned target review: `docs/claude-hook-user-owned-target-checklist.md`
3. target review evidence: `docs/claude-hook-user-owned-target-review-evidence.md`
4. target review packet: `docs/claude-hook-user-owned-target-review-packet.md`
5. target review decision: `docs/claude-hook-user-owned-target-review-decision.md`
6. final apply request: `docs/claude-hook-final-apply-request-contract.md`
7. application preflight review: `docs/claude-hook-application-preflight-review-contract.md`
8. user execution packet review: `docs/claude-hook-user-execution-packet-review-contract.md`
9. user execution authorization review: `docs/claude-hook-user-execution-authorization-review-contract.md`
10. user-performed application boundary: `docs/claude-hook-user-performed-application-boundary-contract.md`

## Evidence Order

```sh
node benchmarks/scripts/check-claude-hook-install-application-contract.js
node benchmarks/scripts/check-claude-hook-user-owned-target-checklist.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-evidence.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-packet.js
node benchmarks/scripts/check-claude-hook-user-owned-target-review-decision.js
node benchmarks/scripts/check-claude-hook-final-apply-request-contract.js
node benchmarks/scripts/check-claude-hook-application-preflight-review-contract.js
node benchmarks/scripts/check-claude-hook-user-execution-packet-review-contract.js
node benchmarks/scripts/check-claude-hook-user-execution-authorization-review-contract.js
node benchmarks/scripts/check-claude-hook-user-performed-application-boundary-contract.js
npm run bench:check
npm run bench:check:red
```

## Required Invariants

- no raw private transcripts
- no settings mutation
- no command execution
- no direct settings path
- no hook setup file
- no external verification claim
- no completion claim for user-performed application
- terminal boundary recorded after authorization review

## Non-Goals

No raw private transcripts.

No automatic hook installation.

No repository mutation.

Do not install Claude hooks.

Do not create or edit Claude configuration files.

Do not publish shell copy commands.

Do not add installer code.

Do not add hook setup scripts.

Do not generate final responses, PR metadata, release notes, product copy, or completion claims.
