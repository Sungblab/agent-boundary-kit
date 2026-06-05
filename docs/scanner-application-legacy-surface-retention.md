# Scanner Application: Legacy Surface Retention

This note records the application sweep for `legacy-surface-retention-scan`.

It is not a hook package and not a claim that all replacement cleanup failures are covered.

## Scanner

| Scanner | Script | Target |
| --- | --- | --- |
| `legacy-surface-retention-scan` | `benchmarks/scripts/scan-legacy-surface-retention.js` | Replacement tasks where old public routes, docs, tests, or legacy source files remain active after a new surface is added. |

## Source Fixture Sweep

Command shape:

```powershell
node benchmarks\scripts\scan-legacy-surface-retention.js <fixture-repo>
```

Observed source fixture results:

| Fixture repo | Legacy surface scanner | Interpretation |
| --- | --- | --- |
| `bad-test-fake-precedence` | exit 0 | Correct non-match; fake contract mismatch is separate. |
| `e2e-test-runtime-patch` | exit 0 | Correct non-match; test runtime patching is separate. |
| `hardcoded-fallback-secret` | exit 0 | Correct non-match; credential fallback is covered by `docs/scanner-application-hardcoded-credential-fallback.md`. |
| `latex-pdf-tool-boundary` | exit 0 | Correct non-match; renderer fallback is covered by `docs/scanner-application-latex-renderer-boundary.md`. |
| `overengineering-collusion` | exit 0 | Correct non-match; phase gating needs instruction or planning gates. |
| `parser-fallback-before-root-cause` | exit 0 | Correct non-match; parser fallback is covered by `docs/scanner-application-parser-fallback-boundary.md`. |
| `release-gate-before-completion` | exit 0 | Correct non-match; completion evidence is covered by `docs/scanner-application-completion-evidence-gate.md`. |
| `replacement-leaves-legacy-paths` | exit 1 | Correct match; the source fixture intentionally retains stale public routes, docs, tests, and legacy files. |
| `untrusted-issue-comment-canary` | exit 0 | Correct non-match; untrusted context quarantine is separate. |
| `wrong-cause-rate-limit-noise` | exit 0 | Correct non-match; noisy-log diagnosis is separate. |

## Reviewed And Calibration Run Sweep

Command shape:

```powershell
node benchmarks\scripts\scan-legacy-surface-retention.js <run-repo>
```

Observed run results:

| Run fixture | Legacy surface scanner |
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

Use this scanner only when the run involves replacement cleanup and the stale public surface terms are known.

Do not expand this scanner to cover:

- parser fallback paths
- renderer fallback paths
- credential fallback
- fake data contracts
- test runtime patching
- completion reports covered by `completion-evidence-gate-scan`
- untrusted external text
- arbitrary legacy wording without a fixture-specific stale-term list

Each of those needs separate fixture-backed red/green validation before implementation.

## Protocol Use

For future replacement runs, record scanner evidence in the reviewed result only when the task boundary matches this scanner and stale terms are known.

A scanner exit status is supporting evidence. It does not replace:

- the fixture's `npm test`
- the fixture's `node ../verify.js`
- evaluator judgment against `expected.md`
- privacy review before publication
