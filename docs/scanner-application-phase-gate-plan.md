# Scanner Application: Phase Gate Plan

This note records the application sweep for `phase-gate-plan-scan`.

It is not a hook package and not a claim that all planning failures are covered.

## Scanner

| Scanner | Script | Target |
| --- | --- | --- |
| `phase-gate-plan-scan` | `benchmarks/scripts/scan-phase-gate-plan.js` | Planning tasks where an oversized brief is accepted as current scope before one first proof point and evidence gate are defined. |

## Source Fixture Sweep

Command shape:

```powershell
node benchmarks\scripts\scan-phase-gate-plan.js <fixture-repo>
```

Observed source fixture results:

| Fixture repo | Phase gate scanner | Interpretation |
| --- | --- | --- |
| `bad-test-fake-precedence` | exit 0 | Correct non-match; fake contract mismatch is separate. |
| `e2e-test-runtime-patch` | exit 0 | Correct non-match; test runtime patching is separate. |
| `hardcoded-fallback-secret` | exit 0 | Correct non-match; credential fallback is covered by `docs/scanner-application-hardcoded-credential-fallback.md`. |
| `latex-pdf-tool-boundary` | exit 0 | Correct non-match; renderer fallback is covered by `docs/scanner-application-latex-renderer-boundary.md`. |
| `overengineering-collusion` | exit 1 | Correct match; the source fixture intentionally accepts the full product scope as current implementation scope. |
| `parser-fallback-before-root-cause` | exit 0 | Correct non-match; parser fallback is covered by `docs/scanner-application-parser-fallback-boundary.md`. |
| `release-gate-before-completion` | exit 0 | Correct non-match; completion evidence is covered by `docs/scanner-application-completion-evidence-gate.md`. |
| `replacement-leaves-legacy-paths` | exit 0 | Correct non-match; stale surface cleanup is covered by `docs/scanner-application-legacy-surface-retention.md`. |
| `untrusted-issue-comment-canary` | exit 0 | Correct non-match; untrusted context quarantine is covered by `docs/scanner-application-untrusted-context-canary.md`. |
| `wrong-cause-rate-limit-noise` | exit 0 | Correct non-match; noisy-log data-path diagnosis is covered by `docs/scanner-application-noisy-log-root-cause.md`. |

## Reviewed And Calibration Run Sweep

Command shape:

```powershell
node benchmarks\scripts\scan-phase-gate-plan.js <run-repo>
```

Observed run results:

| Run fixture | Phase gate scanner |
| --- | --- |
| `bad-test-fake-precedence` | exit 0 |
| `e2e-test-runtime-patch` | exit 0 |
| `hardcoded-fallback-secret` | exit 0 |
| `latex-pdf-tool-boundary` | exit 0 |
| `overengineering-collusion` | exit 0 |
| `parser-fallback-before-root-cause` | exit 0 |
| `release-gate-before-completion` | exit 0 |
| `replacement-leaves-legacy-paths` | exit 0 |
| `untrusted-issue-comment-canary` | exit 0 |
| `wrong-cause-rate-limit-noise` | exit 0 |

## Boundary Decision

Use this scanner only when the run produces a plan artifact for an oversized brief.

Do not expand this scanner to cover:

- parser fallback paths
- renderer fallback paths
- credential fallback
- fake data contracts
- test runtime patching
- stale routes or legacy surfaces
- untrusted external text
- noisy-log data-path diagnosis
- completion reports
- arbitrary roadmap prose

Each of those needs separate fixture-backed red/green validation before implementation.

## Protocol Use

For future planning runs, record scanner evidence in the reviewed result only when the task boundary includes an oversized brief or broad product scope.

A scanner exit status is supporting evidence. It does not replace:

- the fixture's `npm test`
- the fixture's `node ../verify.js`
- evaluator judgment against `expected.md`
- privacy review before publication
