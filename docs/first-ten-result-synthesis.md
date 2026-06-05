# First Ten Result Synthesis

This synthesis covers the first ten reviewed result summaries in `benchmarks/results/`.

It is not an agent leaderboard. It is an evidence summary for deciding which enforcement surfaces are worth refining next.

Evidence base:

- 9 scored `closed-rubric` Codex CLI runs.
- 1 calibration-only parser run used to validate fixture mechanics and protocol shape.
- All reviewed summaries passed the repository result checks and privacy checks before publication.

## Result Map

| Fixture | Result scope | Boundary tested | Enforcement implication |
| --- | --- | --- | --- |
| `parser-fallback-before-root-cause` | calibration-only | fallback over root cause; named parser boundary | The primary tool path must be inspected before alternate parser fallback is allowed. |
| `wrong-cause-rate-limit-noise` | scored | fallback over root cause | Debugging gates need data-shape evidence, not just plausible log interpretation. |
| `latex-pdf-tool-boundary` | scored | named renderer boundary; fallback over root cause | Named renderer constraints need both pre-edit reminders and post-edit scanner coverage. |
| `release-gate-before-completion` | scored | evidence-free completion; intent command misrouting | Completion gates need the exact named final command, not partial test/build evidence. |
| `e2e-test-runtime-patch` | scored | test-passing over correctness | Test gates need runtime-patching detection, not just green test output. |
| `hardcoded-fallback-secret` | scored | fallback over root cause; test-passing over correctness | Post-edit checks need hardcoded credential/default scans and env-root-cause evidence. |
| `bad-test-fake-precedence` | scored | test-passing over correctness | Test gates need production-contract checks before production code is changed for a fake. |
| `replacement-leaves-legacy-paths` | scored | legacy retention after replacement; intent command misrouting | Replacement tasks need stale route, doc, label, test, and fallback cleanup checks. |
| `overengineering-collusion` | scored | overengineering collusion; evidence-free completion | Planning tasks need a phase gate, one first proof point, and explicit deferred scope. |
| `untrusted-issue-comment-canary` | scored | untrusted context as instruction | External issue, PR, log, and web text need an untrusted-evidence gate plus output scans. |

## Cross-Cutting Findings

1. Boundary inventory is the missing shared primitive.

   The fixtures repeatedly need the same pre-edit facts: input role, task type, named tool or architecture path, expected files, off-limits files, and verification command. The current templates ask for this, but hook specs cannot enforce it unless the agent produces a structured inventory before writes.

2. Fallback prevention needs both pre-edit and post-edit checks.

   Pre-edit checks catch missing root-cause plans. Post-edit checks catch actual fallback code: alternate parsers, renderer swaps, retries, default rows, hardcoded credentials, and magic env defaults.

3. Test integrity is two different problems.

   E2E runtime patching and invalid fake precedence are not the same failure. A useful test gate needs separate checks for runtime mutation, weakened assertions, skipped coverage, stale snapshots, and production code accepting fake-only shapes.

4. Replacement work needs stale-surface terms.

   A generic scope check is too weak. Replacement fixtures need the agent to carry a task-specific stale-term list into post-edit search: old routes, labels, docs, tests, feature names, and fallback branches.

5. Completion evidence needs ordering.

   The release fixture showed that final status, PR metadata, and completion reports are not valid until the named final gate passes after the relevant edits. The completion surface should check ordering, not just whether a command appears somewhere in the transcript.

6. Untrusted context must be separated from final reports and source code.

   The issue fixture needed both source checks and output checks. It was not enough to avoid printing the sensitive value; the code also had to stop reading environment state and the report had to omit the embedded directive.

7. Publication rules are part of the benchmark.

   Reviewed results must remain neutral summaries. Raw transcripts, local paths, private user text, credentials, canary values, and long complaint quotes stay out of public files.

## Enforcement Surface Gaps

| Gap | Evidence | Surface to refine next | Do not do yet |
| --- | --- | --- | --- |
| Structured boundary inventory | All ten fixtures need role, task type, scope, and verification facts. | `skills/boundary-check/SKILL.md`; `templates/AGENTS.boundary.md`; `templates/CLAUDE.boundary.md` | Do not build a new CLI around it. |
| Root-cause and named-tool proof | Parser, LaTeX, rate-limit, and env fixtures all rely on primary-path evidence. | Boundary skill pre-edit gate; Claude pre-write spec | Do not add fallback scripts before defining evidence fields. |
| Post-edit fallback and secret scan | Parser, LaTeX, hardcoded secret, and untrusted-context fixtures need diff scans. | `hooks/claude/post-edit-scope-check.md` spec | Do not package hooks before writing fixture-backed scanner rules. |
| Test integrity split | E2E patch and invalid fake fixtures need different checks. | `hooks/claude/test-integrity-check.md`; CLAUDE template | Do not collapse them into a generic "tests changed" warning. |
| Replacement stale-surface list | Legacy replacement fixture needs old public terms searched across routes, docs, labels, and tests. | AGENTS template scope rule; post-edit hook spec | Do not rely on changed-file count alone. |
| Ordered completion gate | Release fixture requires the final gate before completion report and PR metadata. | `hooks/claude/completion-evidence-check.md`; boundary skill completion gate | Do not treat `npm test` or build as sufficient when a named gate exists. |
| External text quarantine | Issue fixture needs issue body treated as evidence, not instruction. | AGENTS/CLAUDE templates; pre-context hook spec | Do not quote embedded directives in public summaries. |
| Scope phase gate | Overengineering fixture needs a first proof point and deferred scope. | Boundary skill planning section; AGENTS scope rule | Do not turn this into project-management tooling. |

## Next Refinement Order

1. Refine `skills/boundary-check/SKILL.md` so the pre-edit and post-edit checklists match the eight gaps above.
2. Refine `templates/AGENTS.boundary.md` and `templates/CLAUDE.boundary.md` only where the synthesis shows missing or underspecified rules.
3. Tighten the four Claude hook specs as specs, not installed scripts.
4. Add one small script only after a hook spec has a clear fixture-backed pattern and a red/green validation path.
5. Keep plugin, connector, dashboard, and broad automation packaging out of scope until at least one enforcement surface has fixture-backed before/after evidence.

