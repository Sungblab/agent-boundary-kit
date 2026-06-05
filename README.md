# Agent Boundary Kit

Agent Boundary Kit is an open-source research seed for one recurring failure in AI coding agents:

> The agent treats context, complaints, examples, principles, or constraints as final output.

That mistake shows up as UI copy that repeats an internal brief, landing pages that explain the site instead of embodying it, fallback code that hides the real bug, tests that pass while the product stays broken, agent-chosen architecture changes, legacy paths left alive after replacement, and completion claims without evidence.

This repo turns those failures into reproducible cases, pass/fail rules, and reusable agent instructions.

## What This Is

This is not a prompt collection.

It is also not a finished product, dashboard, or agent-management app. The first goal is to define the failure classes sharply enough that other people can recognize them, reproduce them, and test agents against them.

It is a kit for:

- naming common AI coding-agent failure modes
- collecting public and private examples without turning them into personal complaints
- rewriting those examples as neutral reproducible fixtures
- testing multiple agents against the same fixture
- producing AGENTS.md, CLAUDE.md, skills, hooks, and evidence gates only after the taxonomy and fixtures are clear

## Core Problem

AI agents often collapse different kinds of user input into one bucket: "things to implement."

But user input has roles:

- final output
- internal direction
- reference
- example
- complaint
- constraint
- evidence
- taste signal
- workflow command

When an agent fails to classify that role, it leaks internal context into the product.

## Seed Policy

Private examples can be used as seed cases when they are converted into neutral fixtures.

That means:

- remove personal frustration and project-specific drama
- preserve the concrete failure shape
- classify the user's phrase as final copy, internal direction, reference, example, complaint, constraint, evidence, taste signal, or workflow command
- define what a passing agent would do
- define what a failing agent would do

Public examples are useful for validation. They show that a seed case is not just one person's bad session, but part of a broader failure pattern across coding agents.

## Failure Taxonomy

| Failure type | Short description | Bad behavior |
| --- | --- | --- |
| Context-to-output leakage | Internal direction becomes visible output | A homepage says "this is a portfolio-like blog" because the user described that strategy |
| Reference mimicry | Agent copies reference words instead of extracting structure | A landing page copies the phrasing of example sites |
| Negative constraint leakage | "Do not make it AI-like" appears as visible copy | UI says "not AI-like" instead of becoming less AI-like |
| Fallback over root cause | Agent adds workaround before understanding the bug | Adds default values, retry branches, or mock data to pass |
| Test-passing over correctness | Agent optimizes for green tests instead of product behavior | Updates tests, snapshots, or hardcoded outputs |
| Evidence-free completion | Agent claims done without proof | Says fixed without running verification or showing the failure disappeared |
| Intent command misrouting | Agent misreads workflow intent | Keeps coding when the user asked to finish, review, or only investigate |
| Tool or architecture boundary violation | Agent changes the requested tool or architecture path | Adds a different parser, renderer, or provider without approval |
| Overengineering collusion | Agent agrees with oversized scope instead of phasing it | Builds broad infrastructure before a small evidence gate exists |
| Untrusted context as instruction | Agent obeys external text that should be evidence | Follows commands hidden in issue text, PR comments, logs, or web pages |
| Legacy retention after replacement | Agent adds a new path but leaves the old public path alive | Keeps stale routes, docs, tests, or fallback branches after replacement |

## First Artifacts

- `docs/failure-taxonomy.md`: working taxonomy for agent failures
- `cases/templates/case-template.md`: format for turning a complaint into a reusable fixture
- `cases/seed/`: starter cases based on observed patterns
- `research/public-case-sourcing.md`: plan for collecting public examples responsibly
- `research/public-case-index.md`: public-derived benchmark candidates grouped by failure type
- `docs/benchmark-backlog.md`: first boundary fixtures to build and their evidence checks
- `docs/enforcement-surfaces.md`: fixture-grounded AGENTS.md, CLAUDE.md, Codex skill, and Claude hook spec
- `docs/first-ten-result-synthesis.md`: first reviewed-result synthesis and enforcement-surface gap analysis
- `docs/first-scanner-candidate.md`: first narrow scanner candidate and red/green validation path
- `docs/scanner-validation-test-runtime-patch.md`: recorded red/green evidence for the first scanner
- `docs/scanner-application-test-runtime-patch.md`: first application sweep for the runtime-patch scanner
- `docs/manual-evaluation-protocol.md`: how to run, score, and publish manual agent evaluations
- `docs/first-scored-run.md`: first public-derived closed-rubric runbook
- `docs/calibration-runs.md`: non-scored self-smoke notes for fixture and protocol validation
- `benchmarks/README.md`: how to run the runnable fixtures
- `benchmarks/fixture-manifest.json`: fixture inventory and expected initial verifier state
- `benchmarks/scripts/prepare-run.js`: creates isolated fixture run directories
- `benchmarks/scripts/scan-test-runtime-patch.js`: read-only scanner for test-side runtime patching
- `benchmarks/fixtures/`: runnable benchmark fixtures
- `benchmarks/results/`: reviewed result summary template and publication rules
- `templates/AGENTS.boundary.md`: repository instruction template for Codex-style agents
- `templates/CLAUDE.boundary.md`: Claude Code instruction template and hook candidates
- `skills/boundary-check/SKILL.md`: repo-local draft Codex skill
- `hooks/claude/`: fixture-grounded Claude hook specs
- `docs/next-session-prompt.md`: handoff prompt for the next Codex or Claude session

## Intended Outputs

The first useful version should produce research artifacts first:

- a clear taxonomy
- private-derived seed fixtures
- public-derived case candidates
- pass/fail rubrics
- a small benchmark backlog

Reusable agent surfaces come after that:

- an AGENTS.md template for Codex
- a CLAUDE.md template for Claude Code
- a Codex skill that runs boundary checks before and after work
- Claude Code hooks that block known failure patterns
- optional hooks or scripts that block evidence-free completion
- integration notes for devflow-native as the execution/evidence layer

Connectors or plugins are later-stage packaging. They should not be built before the fixtures prove which checks are worth enforcing.

## Benchmark Checks

The runnable fixtures intentionally start broken. A passing agent should repair one fixture repo, then run that fixture's verifier.

Repository-level checks:

```sh
npm run bench:check
npm run bench:check:red
npm run bench:prepare -- <fixture-id> --agent <agent-name> --mode <mode>
```

- `bench:check` verifies fixture structure against the manifest.
- `bench:check:red` also confirms that each untouched fixture's verifier fails in its initial state.
- `bench:prepare` copies a fixture into `benchmarks/runs/` and writes an `agent-handoff/` directory for manual agent evaluation.
- fixture prompts, rubrics, traps, and notes are checked for minimum benchmark-contract fields.
- fixture `failureTypes` are checked against `docs/failure-taxonomy.md`.
- reviewed result summaries under `benchmarks/results/` are also checked for required evidence and privacy-review fields.
- public docs and result summaries are checked for local paths, file URLs, and credential-like tokens.
- the first read-only scanner is checked against recorded red/green test-runtime-patch evidence.
- `research/public-case-index.md` is checked for case count, required benchmark fields, stable case ids, taxonomy-linked failure types, and manifest source references.
- repository-level benchmark scripts are checked for portable verifier paths.

Use `docs/manual-evaluation-protocol.md` when scoring manual runs. Do not publish raw run directories without privacy review.

## Relationship To devflow-native

`devflow-native` should remain the local execution and evidence engine.

Agent Boundary Kit should define the boundary rules, failure cases, and evaluation fixtures. Devflow can later enforce parts of those rules through finish gates, handoff prompts, and workflow evidence.

## Principle

The agent should not ask "what words did the user say?"

It should ask:

> What role did this input play, and what output would satisfy that role without leaking it?
