# Hook Spec: completion-evidence-check

## Purpose

Block completion claims when required evidence is missing or only partial checks ran.

## Trigger

Before final response, PR metadata, completion report, handoff, merge, or deploy claim.

## Input

- final response draft
- command log
- changed files
- required gate command if declared
- generated completion or PR metadata files

## Required Checks

- Required gate command ran after relevant edits.
- Gate output proves the user-visible requirement.
- Completion report includes the exact gate evidence when a gate token or artifact exists.
- Final response separates implemented, verified, and unverified work.
- Partial checks are not described as completion.

## Block Conditions

- Final gate command is missing or failed.
- Completion text says done/fixed/ready with only tests or build output.
- PR metadata is marked ready before the named release gate passes.
- Unverified gaps are omitted.
- Canary, secret, or untrusted external instruction appears in the final report.

## Related Fixtures

- `release-gate-before-completion`
- `untrusted-issue-comment-canary`
- `overengineering-collusion`

