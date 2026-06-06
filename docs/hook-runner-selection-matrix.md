# Hook Runner Selection Matrix

This is a selection contract for the future hook runner described in `docs/hook-runner-minimal-plan.md`.

It is not an installed hook and not a runner implementation. It defines how declared runner input may select read-only scanners before any hook packaging exists.

## Boundary

No raw private transcripts.

No hidden chat history.

No broad workspace scraping.

No inference from private chat context.

The selection matrix may use only declared input from `docs/hook-runner-input-contract.md`, scanner coverage from `docs/scanner-coverage-matrix.md`, output handling from `docs/hook-runner-output-contract.md`, and dry-run examples from `docs/hook-runner-dry-run-spec.md`.

Claude hook event data must first satisfy `docs/claude-hook-event-input-contract.md` before it can become declared runner input.

The plan-only dry-run CLI contract is recorded in `docs/hook-runner-dry-run-cli-contract.md`.

Missing required inputs must return configuration error. The runner must not broaden its read scope to guess missing stale terms, named tools, final gates, issue sources, test files, or plan artifacts.

Do not package hooks yet.

## Selection Rules

Select zero scanners when no predicate matches. A clear no-op selection is better than guessing from private context.

Select every scanner whose predicate matches. Scanner fan-out is expected for mixed tasks such as replacement work with named tools, stale terms, and external evidence sources.

Do not infer stale terms. They must be declared.

Do not infer named tools. They must be declared.

Do not infer final gates. They must be declared.

Do not treat scanner selection as proof of correctness. It only decides which read-only checks receive the declared input.

## Hook Selection Matrix

| Hook id | Hook spec | Declared input predicate | Selected scanner | Script | Required declared inputs |
| --- | --- | --- | --- | --- | --- |
| `pre_write_boundary_check` | `hooks/claude/pre-write-boundary-check.md` | Planning or oversized-scope work has a declared plan artifact. | `phase-gate-plan-scan` | `benchmarks/scripts/scan-phase-gate-plan.js` | `task`, `metadataFiles` |
| `post_edit_scope_check` | `hooks/claude/post-edit-scope-check.md` | Changed parser or ingest files plus declared parser/provider constraint. | `parser-fallback-boundary-scan` | `benchmarks/scripts/scan-parser-fallback-boundary.js` | `repoRoot`, `changedFiles`, `namedTools` |
| `post_edit_scope_check` | `hooks/claude/post-edit-scope-check.md` | Changed PDF/export files plus declared LaTeX or renderer constraint. | `latex-renderer-boundary-scan` | `benchmarks/scripts/scan-latex-renderer-boundary.js` | `repoRoot`, `changedFiles`, `namedTools` |
| `post_edit_scope_check` | `hooks/claude/post-edit-scope-check.md` | Changed source or config files in an env/config repair task. | `hardcoded-credential-fallback-scan` | `benchmarks/scripts/scan-hardcoded-credential-fallback.js` | `repoRoot`, `changedFiles` |
| `post_edit_scope_check` | `hooks/claude/post-edit-scope-check.md` | Changed model, AI default, or settings source files plus declared task metadata for model settings or product behavior. | `guidance-to-code-leakage-scan` | `benchmarks/scripts/scan-guidance-to-code-leakage.js` | `repoRoot`, `changedFiles`, `task` |
| `post_edit_scope_check` | `hooks/claude/post-edit-scope-check.md` | Replacement work includes declared stale public terms. | `legacy-surface-retention-scan` | `benchmarks/scripts/scan-legacy-surface-retention.js` | `repoRoot`, `changedFiles`, `staleTerms` |
| `post_edit_scope_check` | `hooks/claude/post-edit-scope-check.md` | Bug repair or scoped edit declares an approved file mask. | `approved-file-mask-scan` | `benchmarks/scripts/scan-approved-file-mask-scope.js` | `repoRoot`, `changedFiles`, `approvedScope` |
| `post_edit_scope_check` | `hooks/claude/post-edit-scope-check.md` | Changed trusted outputs cite external issue, PR, log, or web evidence. | `untrusted-context-canary-scan` | `benchmarks/scripts/scan-untrusted-context-canary.js` | `externalSources`, `changedFiles` |
| `post_edit_scope_check` | `hooks/claude/post-edit-scope-check.md` | Debugging or data-path repair includes command evidence with noisy logs. | `noisy-log-root-cause-scan` | `benchmarks/scripts/scan-noisy-log-root-cause.js` | `repoRoot`, `changedFiles`, `commandLog` |
| `test_integrity_check` | `hooks/claude/test-integrity-check.md` | Browser or E2E test changes are declared. | `test-runtime-patch-scan` | `benchmarks/scripts/scan-test-runtime-patch.js` | `testFiles`, `productionFiles`, `behaviorContract` |
| `test_integrity_check` | `hooks/claude/test-integrity-check.md` | Unit or integration fake data changes are declared. | `test-fake-contract-scan` | `benchmarks/scripts/scan-test-fake-contract.js` | `testFiles`, `productionFiles`, `behaviorContract` |
| `test_integrity_check` | `hooks/claude/test-integrity-check.md` | Test repair includes command evidence with noisy logs or wrong-cause risk. | `noisy-log-root-cause-scan` | `benchmarks/scripts/scan-noisy-log-root-cause.js` | `testFiles`, `productionFiles`, `commandLog` |
| `completion_evidence_check` | `hooks/claude/completion-evidence-check.md` | Completion artifacts or report metadata are declared. | `completion-evidence-gate-scan` | `benchmarks/scripts/scan-completion-evidence-gate.js` | `completionDraft`, `commandLog`, `finalGate` |
| `completion_evidence_check` | `hooks/claude/completion-evidence-check.md` | Completion artifacts cite external issue, PR, log, or web evidence. | `untrusted-context-canary-scan` | `benchmarks/scripts/scan-untrusted-context-canary.js` | `externalSources`, `completionDraft` |
| `completion_evidence_check` | `hooks/claude/completion-evidence-check.md` | Completion or launch claims include declared plan artifacts. | `phase-gate-plan-scan` | `benchmarks/scripts/scan-phase-gate-plan.js` | `task`, `metadataFiles` |

## Fan-Out Behavior

Scanner fan-out is additive. For one runner input, the future runner should select every row whose hook id and declared input predicate match.

Example: a `post_edit_scope_check` input with `repoRoot`, `changedFiles`, `namedTools`, `staleTerms`, and `externalSources` can select:

- `parser-fallback-boundary-scan`
- `latex-renderer-boundary-scan`
- `legacy-surface-retention-scan`
- `untrusted-context-canary-scan`

This behavior is fixture-backed by `hooks/claude/examples/runner-dry-run.post-edit-scope-fanout.json`.

## Configuration Errors

If a matching scanner lacks a required declared input, the future runner should emit a bounded configuration-error output with `exitCode: 2`.

Examples:

- A stale-term scanner selected without `staleTerms` is a configuration error.
- A named-tool scanner selected without `namedTools` is a configuration error.
- A completion scanner selected without `finalGate` is a configuration error.
- A plan scanner selected without `metadataFiles` is a configuration error.

The runner must not repair missing metadata by reading raw chat history, issue comments, PR descriptions, logs, or broad workspace files.

## Evidence Gate

This matrix is checked by:

```sh
node benchmarks/scripts/check-hook-runner-selection-matrix.js
node benchmarks/scripts/check-claude-hook-event-input-contract.js
npm run bench:check
npm run bench:check:red
```

The check verifies hook ids, hook specs, selected scanner names, scanner scripts, declared input fields, selection rules, transcript boundaries, and links from runner documentation.

## Non-Goals

- Do not install hooks.
- Do not implement a runner.
- Do not package a plugin.
- Do not infer missing metadata from private chat context.
- Do not use this matrix as a substitute for fixture verification, final gates, or reviewer judgment.
