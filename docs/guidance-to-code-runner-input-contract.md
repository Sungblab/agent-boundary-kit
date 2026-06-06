# Guidance To Code Runner Input Contract

This is a candidate runner input contract for `guidance-to-code-leakage-scan`.

It is not an installed hook, not a runner execution path, and not plugin packaging. It exists to keep the scanner bounded before any runner selection or execution wiring is added.

## Candidate Scanner

- Scanner id: `guidance-to-code-leakage-scan`
- Script: `benchmarks/scripts/scan-guidance-to-code-leakage.js`
- Validation note: `docs/scanner-validation-guidance-to-code-leakage.md`
- Application note: `docs/scanner-application-guidance-to-code-leakage.md`
- Current status: script-level scanner only

## Allowed Runner Inputs

The runner may pass only declared, bounded inputs:

- `repoRoot`: explicit repository root path.
- `changedFiles`: explicit source files changed by the agent.
- `task`: short declared task metadata when needed for selection.

The scanner must receive source files or a bounded repo path. It must not receive raw chat text as scanner input.

## Selection Predicate

The conservative future selection predicate is:

Changed application source files plus declared task metadata for model settings, AI defaults, settings labels, user model selection, or product behavior that could absorb repository guidance.

The likely hook surface is `post_edit_scope_check`.

Do not select this scanner for documentation-only edits, config-only model lists, tests-only changes, parser fallback, renderer fallback, credentials, completion claims, untrusted issue text, noisy logs, or research-only tasks.

## Rejected Inputs

No raw private transcripts.

No hidden chat history.

No message arrays.

No private user examples.

No repository guidance prose as executable scanner input unless it is already part of an explicit source diff under review.

No broad workspace scraping.

No inferred model preferences from chat context.

If required declared inputs are missing, a future runner must return a bounded configuration error. It must not inspect chat history, prompts, issue comments, docs, or hidden state to infer missing source files or task intent.

## Execution Boundary

Do not add this scanner to `docs/hook-runner-selection-matrix.md` until selection examples and runner scan fixtures exist.

Do not add this scanner to `docs/hook-runner-read-only-execution-contract.md` until read-only clear, finding, unsupported, and missing-input outputs are fixture-backed.

Do not change `lib/abk-runner-core.js` in this contract step.

Do not package hooks yet.

## Evidence Gate

This contract is checked by:

```sh
node benchmarks/scripts/check-guidance-to-code-runner-input-contract.js
npm run bench:check
npm run bench:check:red
```

The check verifies that the contract records allowed inputs, rejected transcript boundaries, the script-level-only status, and the ban on runner execution wiring before fixtures.
