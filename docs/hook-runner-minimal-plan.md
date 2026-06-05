# Hook Runner Minimal Plan

This is a runner contract for future hook packaging. It is not an installed hook.

The runner exists only to pass explicit file or repo paths and declared metadata into the read-only scanners already covered by fixture evidence.

## Boundary

The runner must preserve the same boundary recorded in `docs/hook-scanner-contracts.md` and `docs/scanner-coverage-matrix.md`.

- No raw private transcripts.
- No hidden chat history.
- No secrets, cookies, tokens, or credential material.
- No broad workspace scraping.
- No inference of approval, scope, stale terms, named tools, or final gates from private chat context.

Do not package hooks yet. This plan is a contract for what a hook runner may receive and emit once packaging starts.

## Runner Inputs

The runner may receive only explicit file or repo paths plus declared metadata:

- hook id
- repo root path
- changed file paths or an explicit diff path
- task type, such as research-only, planning-only, implementation, replacement, test repair, or completion
- approved scope and off-limits file paths
- named tool, parser, renderer, provider, or architecture constraints
- stale public terms for replacement work
- external text source paths for issue, PR, log, or web evidence
- final gate command and final gate artifact path
- command log summary path
- completion draft or report metadata path when materialized
- changed test files, related production files, and declared behavior contract

The runner must reject missing required inputs for a scanner instead of broadening its read scope.

## Execution Order

1. Read declared metadata.
2. Resolve only the explicit file or repo paths.
3. Select matching scanners from `docs/scanner-coverage-matrix.md`.
4. Apply scanner input and output rules from `docs/hook-scanner-contracts.md`.
5. Run the selected read-only scanners.
6. Interpret scanner exit status.
7. Emit a bounded result summary for reviewer or hook handling.

Exit status handling:

- Exit 0: no scanner finding for the provided inputs.
- Exit 1: scanner finding; a future hook should block or require explicit reviewer override.
- Exit 2: scanner invocation error, missing input, or unsupported input; a future hook should report configuration failure, not treat the check as passed.

## Hook And Scanner Mapping

| Hook spec | Runner input focus | Scanner scripts |
| --- | --- | --- |
| `hooks/claude/pre-write-boundary-check.md` | declared task type, named constraints, plan artifact path | `benchmarks/scripts/scan-phase-gate-plan.js` |
| `hooks/claude/post-edit-scope-check.md` | changed file paths, repo path, stale terms, named tool constraints | `benchmarks/scripts/scan-parser-fallback-boundary.js`, `benchmarks/scripts/scan-latex-renderer-boundary.js`, `benchmarks/scripts/scan-hardcoded-credential-fallback.js`, `benchmarks/scripts/scan-legacy-surface-retention.js`, `benchmarks/scripts/scan-untrusted-context-canary.js`, `benchmarks/scripts/scan-noisy-log-root-cause.js` |
| `hooks/claude/test-integrity-check.md` | changed test files, related production files, behavior contract | `benchmarks/scripts/scan-test-runtime-patch.js`, `benchmarks/scripts/scan-test-fake-contract.js`, `benchmarks/scripts/scan-noisy-log-root-cause.js` |
| `hooks/claude/completion-evidence-check.md` | final response draft path, command log summary, report metadata paths, final gate artifact path | `benchmarks/scripts/scan-completion-evidence-gate.js`, `benchmarks/scripts/scan-untrusted-context-canary.js`, `benchmarks/scripts/scan-phase-gate-plan.js` |

## Result Shape

A future runner result should be small enough to inspect and safe to publish after ordinary path/privacy review:

```json
{
  "hookId": "post_edit_scope_check",
  "scanner": "legacy-surface-retention-scan",
  "status": "finding",
  "blocked": true,
  "reason": "stale public surface term found",
  "inputsUsed": ["repoRoot", "changedFiles", "staleTerms"],
  "findings": [
    {
      "path": "docs/example.md",
      "line": 12,
      "rule": "stale-public-surface"
    }
  ]
}
```

Do not write PR metadata, final responses, release notes, user-visible product copy, or completion claims from this result. It is supporting evidence for a reviewer or agent gate.

## Evidence Gate

This plan is checked by:

```sh
node benchmarks/scripts/check-hook-runner-minimal-plan.js
npm run bench:check
npm run bench:check:red
```

The check requires this file to name each hook spec, each scanner script, the scanner contract doc, the scanner coverage matrix, and the transcript boundary.

## Non-Goals

- Do not install hooks.
- Do not build a dashboard.
- Do not build a SaaS workflow.
- Do not create a connector.
- Do not package a plugin.
- Do not infer missing metadata from chat history.
- Do not treat scanner output as a substitute for tests, final gates, or reviewer judgment.
