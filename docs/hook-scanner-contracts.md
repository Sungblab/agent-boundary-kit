# Hook Scanner Contracts

These are scanner contracts for future Claude hooks. They are not installed hooks.

The scanners are read-only support checks. They consume explicit file or repo paths plus declared task metadata. They do not receive raw private transcripts, hidden chain-of-thought, secrets, cookies, or undeclared local state.

No raw private transcripts.

Use `docs/scanner-coverage-matrix.md` as the source of truth for which scanner maps to which fixture boundary.

## Shared Output Contract

- Exit 0: no scanner finding for the provided inputs.
- Exit 1: scanner finding; the hook candidate should block or require explicit reviewer override.
- Exit 2: scanner invocation error, missing input, or unsupported input; the hook candidate should report the configuration problem instead of treating the check as passed.

Scanner stdout or stderr must include enough file/path and finding detail to support review. A scanner result is supporting evidence, not a replacement for required tests, verifiers, final gates, or evaluator judgment.

## Hook Mapping

| Hook spec | Input contract | Matching scanners |
| --- | --- | --- |
| `hooks/claude/pre-write-boundary-check.md` | declared task type, named constraints, intended plan artifact path when available | `scan-phase-gate-plan.js` |
| `hooks/claude/post-edit-scope-check.md` | changed file list, repo path or explicit changed source/report paths, declared stale terms, named tool constraints | `scan-parser-fallback-boundary.js`, `scan-latex-renderer-boundary.js`, `scan-hardcoded-credential-fallback.js`, `scan-legacy-surface-retention.js`, `scan-untrusted-context-canary.js`, `scan-noisy-log-root-cause.js` |
| `hooks/claude/test-integrity-check.md` | changed test files, related production files, declared behavior contract | `scan-test-runtime-patch.js`, `scan-test-fake-contract.js`, `scan-noisy-log-root-cause.js` |
| `hooks/claude/completion-evidence-check.md` | final response draft path when materialized, command log summary, repo path, report/metadata paths, final gate artifact path | `scan-completion-evidence-gate.js`, `scan-untrusted-context-canary.js`, `scan-phase-gate-plan.js` |

## Packaging Boundary

Do not package these as executable hooks until the repo has a small hook runner contract that can pass explicit paths and declared metadata without broad workspace scraping.

The runner must not infer approval, scope, final gates, or stale terms from private chat history. Those fields must be declared by the agent or provided by the user-facing workflow.
