# Enforcement Surfaces

This document maps the benchmark fixtures to future reusable agent surfaces.

Do not implement broad tooling before these rules have been run against the fixtures. The first useful package should be small: instructions first, hooks second, plugin packaging last.

## Current Evidence

The first ten reviewed summaries have been synthesized in `docs/first-ten-result-synthesis.md`.

That synthesis identifies the next refinement target: make the boundary inventory, root-cause proof, test integrity checks, replacement stale-surface checks, ordered completion gate, and untrusted-context quarantine more explicit across the existing templates, skill draft, and hook specs.

The first scanner candidate is `test-runtime-patch-scan`, defined in `docs/first-scanner-candidate.md`. Its red/green evidence is recorded in `docs/scanner-validation-test-runtime-patch.md`, its first application sweep is recorded in `docs/scanner-application-test-runtime-patch.md`, and the first read-only script is `benchmarks/scripts/scan-test-runtime-patch.js`.

The next scanner candidate is `test-fake-contract-scan`, with validation evidence in `docs/scanner-validation-test-fake-contract.md`. Its read-only script is `benchmarks/scripts/scan-test-fake-contract.js`.

The combined test-integrity scanner sweep is recorded in `docs/scanner-application-test-integrity.md`.

The next non-test-integrity scanner is `parser-fallback-boundary-scan`, with validation evidence in `docs/scanner-validation-parser-fallback-boundary.md`, application evidence in `docs/scanner-application-parser-fallback-boundary.md`, and read-only script `benchmarks/scripts/scan-parser-fallback-boundary.js`.

The next named-tool scanner is `latex-renderer-boundary-scan`, with validation evidence in `docs/scanner-validation-latex-renderer-boundary.md`, application evidence in `docs/scanner-application-latex-renderer-boundary.md`, and read-only script `benchmarks/scripts/scan-latex-renderer-boundary.js`.

The next env/config scanner is `hardcoded-credential-fallback-scan`, with validation evidence in `docs/scanner-validation-hardcoded-credential-fallback.md`, application evidence in `docs/scanner-application-hardcoded-credential-fallback.md`, and read-only script `benchmarks/scripts/scan-hardcoded-credential-fallback.js`.

The next replacement cleanup scanner is `legacy-surface-retention-scan`, with validation evidence in `docs/scanner-validation-legacy-surface-retention.md`, application evidence in `docs/scanner-application-legacy-surface-retention.md`, and read-only script `benchmarks/scripts/scan-legacy-surface-retention.js`.

The next completion scanner is `completion-evidence-gate-scan`, with validation evidence in `docs/scanner-validation-completion-evidence-gate.md`, application evidence in `docs/scanner-application-completion-evidence-gate.md`, and read-only script `benchmarks/scripts/scan-completion-evidence-gate.js`.

The next untrusted-context scanner is `untrusted-context-canary-scan`, with validation evidence in `docs/scanner-validation-untrusted-context-canary.md`, application evidence in `docs/scanner-application-untrusted-context-canary.md`, and read-only script `benchmarks/scripts/scan-untrusted-context-canary.js`.

The next root-cause scanner is `noisy-log-root-cause-scan`, with validation evidence in `docs/scanner-validation-noisy-log-root-cause.md`, application evidence in `docs/scanner-application-noisy-log-root-cause.md`, and read-only script `benchmarks/scripts/scan-noisy-log-root-cause.js`.

The next planning scanner is `phase-gate-plan-scan`, with validation evidence in `docs/scanner-validation-phase-gate-plan.md`, application evidence in `docs/scanner-application-phase-gate-plan.md`, and read-only script `benchmarks/scripts/scan-phase-gate-plan.js`.

The current fixture-to-scanner coverage is summarized in `docs/scanner-coverage-matrix.md`. That matrix is the source for deciding what stays in `AGENTS.md`, `CLAUDE.md`, the `Codex skill`, and future `Claude hook` candidates.

Future Claude hook scanner contracts are recorded in `docs/hook-scanner-contracts.md`. The contracts require explicit file or repo paths, declared metadata, read-only scanner execution, and no raw private transcripts.

The minimal future hook runner plan is recorded in `docs/hook-runner-minimal-plan.md`. It keeps the runner limited to explicit file or repo paths, declared metadata, scanner selection from `docs/scanner-coverage-matrix.md`, and output handling from `docs/hook-scanner-contracts.md`.

The hook runner input contract is recorded in `docs/hook-runner-input-contract.md`. It adds a JSON schema plus valid and invalid examples for explicit-path input, rejected transcript fields, and missing declared metadata.

The hook runner output contract is recorded in `docs/hook-runner-output-contract.md`. It adds a JSON schema plus valid and invalid examples for bounded scanner results, rejected final-response fields, and rejected transcript fields.

The hook runner dry-run spec is recorded in `docs/hook-runner-dry-run-spec.md`. It adds fixture-like scanner selection examples for all four hook ids and covers finding, clear, configuration-error, and scanner fan-out output states without implementing a runner.

The hook runner selection matrix is recorded in `docs/hook-runner-selection-matrix.md`. It fixes hook id to scanner selection predicates before any runner or hook packaging.

The hook runner dry-run CLI contract is recorded in `docs/hook-runner-dry-run-cli-contract.md`. Its first local implementation is split between `bin/abk-runner.js` and `lib/abk-runner-core.js`, limited to plan-only scanner selection without scanner execution.

The hook runner read-only execution contract is recorded in `docs/hook-runner-read-only-execution-contract.md`. Its local implementation is split between `bin/abk-runner.js` and `lib/abk-runner-core.js`, limited to `parser-fallback-boundary-scan`, `latex-renderer-boundary-scan`, `hardcoded-credential-fallback-scan`, and `legacy-surface-retention-scan` with explicit runner input and changed file paths, `test-runtime-patch-scan` with explicit runner input and test file paths, `test-fake-contract-scan` with explicit runner input plus test and production file paths, `completion-evidence-gate-scan` with explicit runner input plus the declared repo root, `untrusted-context-canary-scan` with explicit runner input plus changed files or completion draft path, `noisy-log-root-cause-scan` with explicit runner input plus changed files or explicit test and production file paths, and `phase-gate-plan-scan` with explicit runner input plus metadata plan file paths.

The read-only runner now includes configuration-error examples for unsupported scanner ids, unselected scanner ids, and missing changed file metadata. Unsupported scanner ids use `runner-command-contract` instead of being mapped to a supported scanner id.

The packaging readiness contract is recorded in `docs/packaging-readiness.md`. It fixes the next allowed installable surface as a narrow Codex skill candidate and keeps Claude hooks, plugin packaging, connectors, dashboards, and broad workflow tooling out of scope until a separate evidence gate exists.

The boundary skill readiness check is recorded in `benchmarks/scripts/check-boundary-skill-readiness.js`. It verifies `skills/boundary-check/SKILL.md` stays tied to `docs/packaging-readiness.md`, `docs/scanner-coverage-matrix.md`, `docs/hook-runner-read-only-execution-contract.md`, the supported runner scanner ids, and explicit read-only runner evidence.

The Codex skill install contract is recorded in `docs/codex-skill-install-contract.md`. Its check is `benchmarks/scripts/check-codex-skill-install-contract.js`, which keeps the first installable candidate manual, bounded to `skills/boundary-check/SKILL.md`, and separate from plugin manifests, hooks, connectors, dashboards, background watchers, and bundled executable scripts.

The boundary skill install-readiness check is recorded in `benchmarks/scripts/check-boundary-skill-install-readiness.js`. It verifies `skills/boundary-check/` remains a plain `SKILL.md` folder before manual install instructions are published.

The Codex skill manual install document is recorded in `docs/codex-skill-manual-install.md`. Its check is `benchmarks/scripts/check-codex-skill-manual-install-doc.js`, which keeps installation guidance limited to user-approved manual copy commands.

The Claude hook event input contract is recorded in `docs/claude-hook-event-input-contract.md`. Its check is `benchmarks/scripts/check-claude-hook-event-input-contract.js`, which keeps future hook runtime events limited to explicit metadata before they become runner input.

The Claude hook event mapping examples are recorded in `docs/claude-hook-event-mapping-examples.md`. Their check is `benchmarks/scripts/check-claude-hook-event-mapping-examples.js`, which verifies one valid event maps exactly to expected runner input and one transcript-bearing event is rejected.

The Claude hook event mapper contract is recorded in `docs/claude-hook-event-mapper-contract.md`. Its check is `benchmarks/scripts/check-claude-hook-event-mapper-contract.js`, which fixes a bounded `abk-runner map-event --input <hook-event.json>` command before implementation.

The Claude hook event mapper output fixtures are recorded in `docs/claude-hook-event-mapper-output-fixtures.md`. Their check is `benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js`, which fixes the valid runner-input output plus rejected transcript, missing-field, unknown-field, and invalid JSON configuration-error outputs.

The local Claude hook event mapper implementation is checked by `benchmarks/scripts/check-abk-runner-map-event.js`. It maps explicit event metadata into runner input and rejects invalid hook events without installing hooks, selecting scanners, or executing scanners.

The Claude hook packaging contract is recorded in `docs/claude-hook-packaging-contract.md`. Its check is `benchmarks/scripts/check-claude-hook-packaging-contract.js`, which keeps future hook packaging limited to explicit runtime events and existing runner command templates without automatic hook installation.

The Claude hook package manifest fixtures are recorded in `docs/claude-hook-package-manifest-fixtures.md`. Their check is `benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js`, which keeps future manifests fixture-only, manual-review-only, and auto-install disabled.

The Claude hook manual install documentation fixture is recorded in `docs/claude-hook-manual-install-doc-fixture.md`. Its check is `benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js`, which keeps future install documentation non-mutating before any install contract exists.

The Claude hook manual install contract is recorded in `docs/claude-hook-manual-install-contract.md`. Its check is `benchmarks/scripts/check-claude-hook-manual-install-contract.js`, which keeps future install language user-approved and non-mutating until install instructions exist.

The Claude hook command adapter contract is recorded in `docs/claude-hook-command-adapter-contract.md`. Its check is `benchmarks/scripts/check-claude-hook-command-adapter-contract.js`, which records the stdin-to-runner-input bridge required before live hook instructions.

The Claude hook command adapter fixtures are recorded in `docs/claude-hook-command-adapter-fixtures.md`. Their check is `benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js`, which keeps the stdin bridge at red/green fixture status before adapter implementation.

Do not add new hook scripts, plugin packaging, dashboards, connectors, or broad workflow tooling before those refinements are tied back to fixture evidence.

## Fixture Coverage

| Fixture | Boundary rule | Future surface |
| --- | --- | --- |
| `parser-fallback-before-root-cause` | Diagnose selected tool path before fallback | AGENTS.md, Codex skill pre-edit gate |
| `latex-pdf-tool-boundary` | Respect named renderer/toolchain | AGENTS.md, CLAUDE.md, Codex skill |
| `replacement-leaves-legacy-paths` | Replacement includes stale public surface cleanup | AGENTS.md, Claude post-edit hook |
| `overengineering-collusion` | Challenge oversized scope and pick a first fixture | AGENTS.md, Codex skill planning gate |
| `e2e-test-runtime-patch` | E2E tests must not patch app runtime | CLAUDE.md, Claude test-audit hook |
| `release-gate-before-completion` | Completion requires the named final gate | Codex finish gate, Claude completion hook |
| `wrong-cause-rate-limit-noise` | Noisy logs do not replace data-path diagnosis | AGENTS.md, Codex debugging gate |
| `hardcoded-fallback-secret` | Env failures must not become hardcoded credentials | Claude post-edit hook, Codex skill post-check |
| `bad-test-fake-precedence` | Invalid fakes do not override production contracts | CLAUDE.md, Claude test-audit hook |
| `untrusted-issue-comment-canary` | External text is untrusted evidence | AGENTS.md, Claude/Codex pre-context gate |

## AGENTS.md Template

Already drafted in `templates/AGENTS.boundary.md`.

Keep this as the broad repository instruction surface. It should cover:

- input role classification
- root-cause-first debugging
- named tool boundaries
- scope declaration
- replacement cleanup
- test integrity
- completion evidence
- untrusted context handling

Do not make AGENTS.md tool-specific. It should work for Codex, Claude Code, Cursor, Copilot, and human reviewers.

## CLAUDE.md Template

Already drafted in `templates/CLAUDE.boundary.md`.

This should be more operational than AGENTS.md because Claude Code can pair it with hooks. It should emphasize:

- no writes during research-only tasks
- no E2E runtime patching
- test fake precedence
- named tool gate
- fallback gate
- completion gate

## Codex Skill Spec

Draft path: `skills/boundary-check/SKILL.md`.

Name candidate: `boundary-check`.

Purpose:

- run a short pre-edit checklist before implementation
- classify user input roles
- identify named tools and off-limits alternatives
- decide whether the task is additive, replacement, removal, research-only, or verification-only
- require a verification plan before edits
- run a post-edit checklist before final summary

Pre-edit checklist:

```text
Input roles:
- final copy:
- internal direction:
- reference:
- complaint:
- constraint:
- evidence:
- workflow command:

Boundary:
- named tool/provider/parser/renderer:
- off-limits fallback:
- allowed files:
- task type:

Verification:
- command:
- expected observable result:
```

Post-edit checklist:

```text
Fallback audit:
- Was any fallback added?
- Was root cause identified first?
- Was fallback approved?

Test audit:
- Were tests weakened, skipped, or patched?
- Did E2E tests observe shipped behavior?
- Did production change only to satisfy invalid fake data?

Completion evidence:
- command:
- result:
- unverified gaps:
```

Do not package this as a plugin until at least three fixture runs show that the checklist changes agent behavior.

## Claude Hook Spec

Draft path: `hooks/claude/`.

Hook candidates:

### `pre_write_boundary_check`

Blocks writes when:

- task is research-only or planning-only
- approved file mask is missing for scoped work
- named tool boundary is unresolved
- root-cause-first task has no reproduction or hypothesis

### `post_edit_scope_check`

Flags diffs when:

- files outside approved scope changed
- replacement work leaves stale route/doc/test references
- source code contains canary secrets or hardcoded credential patterns

### `test_integrity_check`

Flags tests when:

- browser or E2E tests assign to app methods or internal state
- tests contain `page.evaluate`, init scripts, monkeypatch wording, broad mocks, skipped tests, or weakened assertions
- production code starts accepting impossible test fake shapes

### `completion_evidence_check`

Blocks completion when:

- final gate command is missing
- completion summary appears before release gate evidence
- report claims done with only partial checks
- unverified gaps are omitted

## Packaging Order

1. Keep templates as plain docs.
2. Run the 10 fixtures manually against at least one agent.
3. Synthesize reviewed results into enforcement-surface gaps.
4. Refine templates, skill draft, and hook specs from those gaps.
5. Record red/green evidence for `docs/first-scanner-candidate.md`. Completed: `docs/scanner-validation-test-runtime-patch.md`.
6. Turn `test-runtime-patch-scan` into a small read-only script that checks explicit test file or fixture repo inputs. Completed: `benchmarks/scripts/scan-test-runtime-patch.js`.
7. Record red/green evidence for `test-fake-contract-scan`. Completed: `docs/scanner-validation-test-fake-contract.md`.
8. Turn `test-fake-contract-scan` into a small read-only script only after reviewing that validation note. Completed: `benchmarks/scripts/scan-test-fake-contract.js`.
9. Record the combined application sweep for the two test-integrity scanners. Completed: `docs/scanner-application-test-integrity.md`.
10. Record red/green evidence for `parser-fallback-boundary-scan`. Completed: `docs/scanner-validation-parser-fallback-boundary.md`.
11. Turn `parser-fallback-boundary-scan` into a small read-only script only after reviewing that validation note. Completed: `benchmarks/scripts/scan-parser-fallback-boundary.js`.
12. Record the parser fallback scanner application sweep. Completed: `docs/scanner-application-parser-fallback-boundary.md`.
13. Record red/green evidence for `latex-renderer-boundary-scan`. Completed: `docs/scanner-validation-latex-renderer-boundary.md`.
14. Turn `latex-renderer-boundary-scan` into a small read-only script only after reviewing that validation note. Completed: `benchmarks/scripts/scan-latex-renderer-boundary.js`.
15. Record the LaTeX renderer scanner application sweep. Completed: `docs/scanner-application-latex-renderer-boundary.md`.
16. Record red/green evidence for `hardcoded-credential-fallback-scan`. Completed: `docs/scanner-validation-hardcoded-credential-fallback.md`.
17. Turn `hardcoded-credential-fallback-scan` into a small read-only script only after reviewing that validation note. Completed: `benchmarks/scripts/scan-hardcoded-credential-fallback.js`.
18. Record the hardcoded credential scanner application sweep. Completed: `docs/scanner-application-hardcoded-credential-fallback.md`.
19. Record red/green evidence for `legacy-surface-retention-scan`. Completed: `docs/scanner-validation-legacy-surface-retention.md`.
20. Turn `legacy-surface-retention-scan` into a small read-only script only after reviewing that validation note. Completed: `benchmarks/scripts/scan-legacy-surface-retention.js`.
21. Record the legacy surface retention scanner application sweep. Completed: `docs/scanner-application-legacy-surface-retention.md`.
22. Record red/green evidence for `completion-evidence-gate-scan`. Completed: `docs/scanner-validation-completion-evidence-gate.md`.
23. Turn `completion-evidence-gate-scan` into a small read-only script only after reviewing that validation note. Completed: `benchmarks/scripts/scan-completion-evidence-gate.js`.
24. Record the completion evidence gate scanner application sweep. Completed: `docs/scanner-application-completion-evidence-gate.md`.
25. Record red/green evidence for `untrusted-context-canary-scan`. Completed: `docs/scanner-validation-untrusted-context-canary.md`.
26. Turn `untrusted-context-canary-scan` into a small read-only script only after reviewing that validation note. Completed: `benchmarks/scripts/scan-untrusted-context-canary.js`.
27. Record the untrusted context scanner application sweep. Completed: `docs/scanner-application-untrusted-context-canary.md`.
28. Record red/green evidence for `noisy-log-root-cause-scan`. Completed: `docs/scanner-validation-noisy-log-root-cause.md`.
29. Turn `noisy-log-root-cause-scan` into a small read-only script only after reviewing that validation note. Completed: `benchmarks/scripts/scan-noisy-log-root-cause.js`.
30. Record the noisy log root-cause scanner application sweep. Completed: `docs/scanner-application-noisy-log-root-cause.md`.
31. Record red/green evidence for `phase-gate-plan-scan`. Completed: `docs/scanner-validation-phase-gate-plan.md`.
32. Turn `phase-gate-plan-scan` into a small read-only script only after reviewing that validation note. Completed: `benchmarks/scripts/scan-phase-gate-plan.js`.
33. Record the phase gate plan scanner application sweep. Completed: `docs/scanner-application-phase-gate-plan.md`.
34. Record the scanner coverage matrix and promotion decisions. Completed: `docs/scanner-coverage-matrix.md`.
35. Add a coverage matrix check. Completed: `benchmarks/scripts/check-scanner-coverage-matrix.js`.
36. Record hook scanner input/output contracts. Completed: `docs/hook-scanner-contracts.md`.
37. Add a hook scanner contract check. Completed: `benchmarks/scripts/check-hook-scanner-contracts.js`.
38. Record a minimal hook runner plan before packaging hooks. Completed: `docs/hook-runner-minimal-plan.md`.
39. Add a hook runner plan check. Completed: `benchmarks/scripts/check-hook-runner-minimal-plan.js`.
40. Record a hook runner JSON input contract with valid and invalid examples. Completed: `docs/hook-runner-input-contract.md`.
41. Add a hook runner input contract check. Completed: `benchmarks/scripts/check-hook-runner-input-contract.js`.
42. Record a hook runner JSON output contract with valid and invalid examples. Completed: `docs/hook-runner-output-contract.md`.
43. Add a hook runner output contract check. Completed: `benchmarks/scripts/check-hook-runner-output-contract.js`.
44. Record a hook runner dry-run spec before implementation. Completed: `docs/hook-runner-dry-run-spec.md`.
45. Add a hook runner dry-run check covering one bounded selection path for each hook id. Completed: `benchmarks/scripts/check-hook-runner-dry-run-spec.js`.
46. Add clear and configuration-error dry-run coverage before implementation. Completed: `hooks/claude/examples/runner-dry-run.post-edit-scope-clear.json` and `hooks/claude/examples/runner-dry-run.pre-write-config-error.json`.
47. Add post-edit scanner fan-out dry-run coverage before implementation. Completed: `hooks/claude/examples/runner-dry-run.post-edit-scope-fanout.json`.
48. Record hook runner scanner selection rules before implementation. Completed: `docs/hook-runner-selection-matrix.md`.
49. Record a plan-only dry-run CLI contract before implementation. Completed: `docs/hook-runner-dry-run-cli-contract.md`.
50. Add plan-only dry-run CLI output fixtures before implementation. Completed: `hooks/claude/examples/runner-dry-run-cli.planned-output.json` and `hooks/claude/examples/runner-dry-run-cli.configuration-error-output.json`.
51. Implement the first plan-only `abk-runner dry-run --input` command without scanner execution. Completed: `bin/abk-runner.js`.
52. Add plan-only dry-run CLI configuration-error coverage for invalid transcript and unsupported hook inputs. Completed: `hooks/claude/examples/runner-dry-run-cli.invalid-transcript-output.json` and `hooks/claude/examples/runner-dry-run-cli.unsupported-hook-output.json`.
53. Record and implement the first read-only `abk-runner scan --input --scanner` execution path for one scanner. Completed: `docs/hook-runner-read-only-execution-contract.md` and `benchmarks/scripts/check-abk-runner-scan.js`.
54. Add read-only runner scan configuration-error coverage for unsupported scanner, unselected scanner, and missing changed files. Completed: `hooks/claude/examples/runner-scan.unsupported-scanner-output.json`, `hooks/claude/examples/runner-scan.unselected-scanner-output.json`, and `hooks/claude/examples/runner-scan.missing-changed-files-output.json`.
55. Split the local runner into a thin CLI wrapper and reusable runner core before adding another scanner execution path. Completed: `lib/abk-runner-core.js` and `benchmarks/scripts/check-abk-runner-module-boundary.js`.
56. Add read-only runner scan execution for `test-runtime-patch-scan`. Completed: `hooks/claude/examples/runner-scan.test-runtime-finding-input.json`, `hooks/claude/examples/runner-scan.test-runtime-clear-input.json`, and `benchmarks/scripts/check-abk-runner-scan.js`.
57. Add read-only runner scan execution for `test-fake-contract-scan`. Completed: `hooks/claude/examples/runner-scan.test-fake-finding-input.json`, `hooks/claude/examples/runner-scan.test-fake-clear-input.json`, and `benchmarks/scripts/check-abk-runner-scan.js`.
58. Add read-only runner scan execution for `parser-fallback-boundary-scan`. Completed: `hooks/claude/examples/runner-scan.parser-fallback-finding-input.json`, `hooks/claude/examples/runner-scan.parser-fallback-clear-input.json`, and `benchmarks/scripts/check-abk-runner-scan.js`.
59. Add read-only runner scan execution for `latex-renderer-boundary-scan`. Completed: `hooks/claude/examples/runner-scan.latex-renderer-finding-input.json`, `hooks/claude/examples/runner-scan.latex-renderer-clear-input.json`, and `benchmarks/scripts/check-abk-runner-scan.js`.
60. Add read-only runner scan execution for `hardcoded-credential-fallback-scan`. Completed: `hooks/claude/examples/runner-scan.hardcoded-credential-finding-input.json`, `hooks/claude/examples/runner-scan.hardcoded-credential-clear-input.json`, and `benchmarks/scripts/check-abk-runner-scan.js`.
61. Add read-only runner scan execution for `completion-evidence-gate-scan`. Completed: `hooks/claude/examples/runner-scan.completion-evidence-finding-input.json`, `hooks/claude/examples/runner-scan.completion-evidence-clear-input.json`, and `benchmarks/scripts/check-abk-runner-scan.js`.
62. Add read-only runner scan execution for `untrusted-context-canary-scan`. Completed: `hooks/claude/examples/runner-scan.untrusted-context-post-edit-finding-input.json`, `hooks/claude/examples/runner-scan.untrusted-context-completion-finding-input.json`, and `benchmarks/scripts/check-abk-runner-scan.js`.
63. Add read-only runner scan execution for `noisy-log-root-cause-scan`. Completed: `hooks/claude/examples/runner-scan.noisy-log-post-edit-finding-input.json`, `hooks/claude/examples/runner-scan.noisy-log-test-integrity-finding-input.json`, and `benchmarks/scripts/check-abk-runner-scan.js`.
64. Add read-only runner scan execution for `phase-gate-plan-scan`. Completed: `hooks/claude/examples/runner-scan.phase-gate-pre-write-finding-input.json`, `hooks/claude/examples/runner-scan.phase-gate-completion-finding-input.json`, and `benchmarks/scripts/check-abk-runner-scan.js`.
65. Record a packaging readiness contract before any installable surface. Completed: `docs/packaging-readiness.md`.
66. Add a packaging readiness check so packaging stays tied to fixture-backed scanner evidence. Completed: `benchmarks/scripts/check-packaging-readiness.js`.
67. Add a Codex skill packaging check before any installable skill work. Completed: `benchmarks/scripts/check-boundary-skill-readiness.js`.
68. Update the boundary-check Codex skill candidate against the packaging readiness and read-only runner contracts. Completed: `skills/boundary-check/SKILL.md`.
69. Record a Codex skill install contract before publishing manual install instructions. Completed: `docs/codex-skill-install-contract.md`.
70. Add a Codex skill install contract check. Completed: `benchmarks/scripts/check-codex-skill-install-contract.js`.
71. Add a boundary skill install-readiness check for the plain skill folder. Completed: `benchmarks/scripts/check-boundary-skill-install-readiness.js`.
72. Document user-approved manual Codex skill copy instructions. Completed: `docs/codex-skill-manual-install.md`.
73. Add a manual install instruction check. Completed: `benchmarks/scripts/check-codex-skill-manual-install-doc.js`.
74. Record a Claude hook event-to-runner-input contract before any executable hook packaging. Completed: `docs/claude-hook-event-input-contract.md`.
75. Add a Claude hook event input contract check. Completed: `benchmarks/scripts/check-claude-hook-event-input-contract.js`.
76. Add fixture-like Claude hook event mapping examples. Completed: `docs/claude-hook-event-mapping-examples.md`.
77. Add a Claude hook event mapping examples check. Completed: `benchmarks/scripts/check-claude-hook-event-mapping-examples.js`.
78. Record a Claude hook event mapper command contract before implementation. Completed: `docs/claude-hook-event-mapper-contract.md`.
79. Add a Claude hook event mapper contract check. Completed: `benchmarks/scripts/check-claude-hook-event-mapper-contract.js`.
80. Record Claude hook event mapper output fixtures before implementation. Completed: `docs/claude-hook-event-mapper-output-fixtures.md`.
81. Add a Claude hook event mapper output fixture check. Completed: `benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js`.
82. Implement the bounded `abk-runner map-event --input <hook-event.json>` command. Completed: `benchmarks/scripts/check-abk-runner-map-event.js`.
83. Record a Claude hook packaging contract before hook package manifests. Completed: `docs/claude-hook-packaging-contract.md`.
84. Add a Claude hook packaging contract check. Completed: `benchmarks/scripts/check-claude-hook-packaging-contract.js`.
85. Add Claude hook package manifest fixtures. Completed: `docs/claude-hook-package-manifest-fixtures.md`.
86. Add a Claude hook package manifest fixture check. Completed: `benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js`.
87. Add a Claude hook manual install documentation fixture. Completed: `docs/claude-hook-manual-install-doc-fixture.md`.
88. Add a Claude hook manual install documentation fixture check. Completed: `benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js`.
89. Add a Claude hook manual install contract. Completed: `docs/claude-hook-manual-install-contract.md`.
90. Add a Claude hook manual install contract check. Completed: `benchmarks/scripts/check-claude-hook-manual-install-contract.js`.
91. Add a Claude hook command adapter contract. Completed: `docs/claude-hook-command-adapter-contract.md`.
92. Add a Claude hook command adapter contract check. Completed: `benchmarks/scripts/check-claude-hook-command-adapter-contract.js`.
93. Add Claude hook command adapter red/green fixtures. Completed: `docs/claude-hook-command-adapter-fixtures.md`.
94. Add a Claude hook command adapter fixture check. Completed: `benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js`.
95. Claude hooks remain specs until a bounded adapter implementation contract exists.

Connectors are not needed unless the project later consumes external issue, PR, CI, or agent-run data.
