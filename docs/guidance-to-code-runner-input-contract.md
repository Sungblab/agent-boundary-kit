# Guidance To Code Runner Input Contract

This is a candidate runner input contract for `guidance-to-code-leakage-scan`.

It is not an installed hook and not plugin packaging. It records the bounded runner input used by the fixture-backed `abk-runner scan` execution path.

## Candidate Scanner

- Scanner id: `guidance-to-code-leakage-scan`
- Script: `benchmarks/scripts/scan-guidance-to-code-leakage.js`
- Validation note: `docs/scanner-validation-guidance-to-code-leakage.md`
- Application note: `docs/scanner-application-guidance-to-code-leakage.md`
- Current status: read-only runner execution is fixture-backed

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

This scanner is selected in `docs/hook-runner-selection-matrix.md` only for bounded `post_edit_scope_check` inputs.

Its read-only execution examples are recorded in `docs/hook-runner-read-only-execution-contract.md`:

- `hooks/claude/examples/runner-scan.guidance-to-code-finding-input.json`
- `hooks/claude/examples/runner-scan.guidance-to-code-clear-input.json`
- `hooks/claude/examples/runner-scan.guidance-to-code-finding-output.json`
- `hooks/claude/examples/runner-scan.guidance-to-code-clear-output.json`

Do not package hooks yet.

## Evidence Gate

This contract is checked by:

```sh
node benchmarks/scripts/check-guidance-to-code-runner-input-contract.js
npm run bench:check
npm run bench:check:red
```

The check verifies that the contract records allowed inputs, rejected transcript boundaries, fixture-backed runner status, runner selection linkage, and read-only scan examples.
