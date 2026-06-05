# Enforcement Surfaces

This document maps the benchmark fixtures to future reusable agent surfaces.

Do not implement broad tooling before these rules have been run against the fixtures. The first useful package should be small: instructions first, hooks second, plugin packaging last.

## Current Evidence

The first ten reviewed summaries have been synthesized in `docs/first-ten-result-synthesis.md`.

That synthesis identifies the next refinement target: make the boundary inventory, root-cause proof, test integrity checks, replacement stale-surface checks, ordered completion gate, and untrusted-context quarantine more explicit across the existing templates, skill draft, and hook specs.

The first scanner candidate is `test-runtime-patch-scan`, defined in `docs/first-scanner-candidate.md`. Its red/green evidence is recorded in `docs/scanner-validation-test-runtime-patch.md`, its first application sweep is recorded in `docs/scanner-application-test-runtime-patch.md`, and the first read-only script is `benchmarks/scripts/scan-test-runtime-patch.js`.

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
7. Only then package a Codex skill or Claude hooks.

Connectors are not needed unless the project later consumes external issue, PR, CI, or agent-run data.
