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
- `docs/scanner-coverage-matrix.md`: fixture-to-scanner coverage and promotion decisions
- `docs/hook-scanner-contracts.md`: future Claude hook scanner input/output contracts
- `docs/hook-runner-minimal-plan.md`: minimal runner contract for future hook packaging
- `docs/hook-runner-input-contract.md`: JSON input contract and examples for the future hook runner
- `docs/hook-runner-output-contract.md`: JSON output contract and examples for bounded runner results
- `docs/hook-runner-dry-run-spec.md`: dry-run example for scanner selection and bounded result mapping
- `docs/claude-hook-event-input-contract.md`: event-to-runner-input contract for future Claude hook packaging
- `docs/claude-hook-event-mapping-examples.md`: fixture-like valid and rejected hook event mapping examples
- `docs/claude-hook-event-mapper-contract.md`: bounded command contract for the hook event mapper
- `docs/claude-hook-event-mapper-output-fixtures.md`: red/green output fixtures for the hook event mapper
- `docs/claude-hook-packaging-contract.md`: boundary contract for future Claude hook packaging
- `docs/claude-hook-package-manifest-fixtures.md`: fixture-only package manifest shape for future Claude hook packaging
- `docs/claude-hook-manual-install-doc-fixture.md`: documentation-only manual install fixture for future Claude hook packaging
- `docs/claude-hook-manual-install-contract.md`: contract for future user-approved Claude hook manual install language
- `docs/claude-hook-manual-install-language-fixtures.md`: bounded language fixtures for user-approved Claude hook manual install text
- `docs/claude-hook-manual-install.md`: user-approved Claude hook manual install document, ready for manual install language review but blocked for agent-performed installation
- `benchmarks/scripts/check-claude-hook-manual-install-native-entrypoint-readiness.js`: verifies manual install language review is gated by native command entrypoint evidence
- `docs/claude-hook-manual-install-review-packet.md`: review-only packet for user-approved Claude hook manual install language
- `benchmarks/scripts/check-claude-hook-manual-install-review-packet.js`: verifies manual install review packets stay review-only before any settings-fragment draft work
- `docs/claude-hook-settings-fragment-draft-fixtures.md`: draft-only settings-fragment fixture that keeps the carrier gap explicit
- `benchmarks/scripts/check-claude-hook-settings-fragment-draft-fixtures.js`: verifies settings-fragment drafts are not installable as-is and do not mutate configuration
- `docs/claude-hook-native-payload-mapping-fixtures.md`: native Claude Code hook payload fixtures proving native payload alone is insufficient
- `docs/claude-hook-native-metadata-carrier-fixtures.md`: explicit metadata carrier fixtures for native Claude Code hook payloads
- `docs/claude-hook-native-adapter.md`: bounded native payload plus carrier adapter for ABK hook event mapping
- `docs/claude-hook-native-command-input-contract.md`: stdin envelope contract for native payload plus carrier input
- `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js`: verifies `abk-claude-hook` accepts the native payload envelope without preserving private native payload fields
- `docs/claude-hook-command-adapter-contract.md`: contract for the stdin-to-runner-input bridge required before live Claude hooks
- `docs/claude-hook-command-adapter-fixtures.md`: red/green fixtures for the Claude hook stdin adapter
- `docs/claude-hook-command-adapter-implementation-contract.md`: implementation contract for the bounded stdin adapter entrypoint
- `docs/claude-hook-command-adapter-entrypoint-fixtures.md`: expected outputs for the bounded stdin adapter entrypoint
- `docs/claude-hook-command-adapter-entrypoint.md`: local `abk-claude-hook` stdin adapter entrypoint contract
- `docs/packaging-readiness.md`: evidence gate for future Codex skill or Claude hook packaging
- `docs/codex-skill-install-contract.md`: boundary contract for the first manual Codex skill install candidate
- `docs/codex-skill-manual-install.md`: user-approved manual copy instructions for the boundary-check Codex skill candidate
- `docs/first-ten-result-synthesis.md`: first reviewed-result synthesis and enforcement-surface gap analysis
- `docs/first-scanner-candidate.md`: first narrow scanner candidate and red/green validation path
- `docs/scanner-validation-test-runtime-patch.md`: recorded red/green evidence for the first scanner
- `docs/scanner-application-test-runtime-patch.md`: first application sweep for the runtime-patch scanner
- `docs/scanner-validation-test-fake-contract.md`: red/green evidence for the next test-integrity scanner candidate
- `docs/scanner-application-test-integrity.md`: combined application sweep for the current test-integrity scanners
- `docs/scanner-validation-parser-fallback-boundary.md`: red/green evidence for the parser fallback boundary scanner
- `docs/scanner-application-parser-fallback-boundary.md`: application sweep for the parser fallback boundary scanner
- `docs/scanner-validation-latex-renderer-boundary.md`: red/green evidence for the LaTeX renderer boundary scanner
- `docs/scanner-application-latex-renderer-boundary.md`: application sweep for the LaTeX renderer boundary scanner
- `docs/scanner-validation-hardcoded-credential-fallback.md`: red/green evidence for the hardcoded credential fallback scanner
- `docs/scanner-application-hardcoded-credential-fallback.md`: application sweep for the hardcoded credential fallback scanner
- `docs/scanner-validation-legacy-surface-retention.md`: red/green evidence for the legacy surface retention scanner
- `docs/scanner-application-legacy-surface-retention.md`: application sweep for the legacy surface retention scanner
- `docs/scanner-validation-completion-evidence-gate.md`: red/green evidence for the completion evidence gate scanner
- `docs/scanner-application-completion-evidence-gate.md`: application sweep for the completion evidence gate scanner
- `docs/scanner-validation-untrusted-context-canary.md`: red/green evidence for the untrusted context canary scanner
- `docs/scanner-application-untrusted-context-canary.md`: application sweep for the untrusted context canary scanner
- `docs/scanner-validation-noisy-log-root-cause.md`: red/green evidence for the noisy log root-cause scanner
- `docs/scanner-application-noisy-log-root-cause.md`: application sweep for the noisy log root-cause scanner
- `docs/scanner-validation-phase-gate-plan.md`: red/green evidence for the phase gate plan scanner
- `docs/scanner-application-phase-gate-plan.md`: application sweep for the phase gate plan scanner
- `docs/manual-evaluation-protocol.md`: how to run, score, and publish manual agent evaluations
- `docs/first-scored-run.md`: first public-derived closed-rubric runbook
- `docs/calibration-runs.md`: non-scored self-smoke notes for fixture and protocol validation
- `benchmarks/README.md`: how to run the runnable fixtures
- `benchmarks/fixture-manifest.json`: fixture inventory and expected initial verifier state
- `benchmarks/scripts/prepare-run.js`: creates isolated fixture run directories
- `benchmarks/scripts/scan-test-runtime-patch.js`: read-only scanner for test-side runtime patching
- `benchmarks/scripts/scan-test-fake-contract.js`: read-only scanner for fake/production contract mismatch
- `benchmarks/scripts/scan-parser-fallback-boundary.js`: read-only scanner for named-parser fallback activation
- `benchmarks/scripts/scan-latex-renderer-boundary.js`: read-only scanner for named-LaTeX renderer fallback activation
- `benchmarks/scripts/scan-hardcoded-credential-fallback.js`: read-only scanner for source-level credential fallback activation
- `benchmarks/scripts/scan-legacy-surface-retention.js`: read-only scanner for stale public surfaces after replacement
- `benchmarks/scripts/scan-completion-evidence-gate.js`: read-only scanner for completion artifacts before gate evidence
- `benchmarks/scripts/scan-untrusted-context-canary.js`: read-only scanner for untrusted external text leaking into trusted output
- `benchmarks/scripts/scan-noisy-log-root-cause.js`: read-only scanner for noisy-log data-path diagnosis failures
- `benchmarks/scripts/scan-phase-gate-plan.js`: read-only scanner for oversized plans without phase gates
- `benchmarks/scripts/check-scanner-coverage-matrix.js`: verifies every fixture has scanner coverage evidence in the matrix
- `benchmarks/scripts/check-hook-scanner-contracts.js`: verifies hook specs declare scanner input/output contracts
- `benchmarks/scripts/check-hook-runner-minimal-plan.js`: verifies the future hook runner stays limited to explicit paths and declared metadata
- `benchmarks/scripts/check-hook-runner-input-contract.js`: verifies the hook runner input schema and valid/invalid examples
- `benchmarks/scripts/check-hook-runner-output-contract.js`: verifies the hook runner output schema and valid/invalid examples
- `benchmarks/scripts/check-hook-runner-dry-run-spec.js`: verifies the dry-run scanner selection example
- `benchmarks/scripts/check-claude-hook-event-input-contract.js`: verifies future Claude hook events map only explicit metadata into runner input
- `benchmarks/scripts/check-claude-hook-event-mapping-examples.js`: verifies valid and rejected hook event mapping examples
- `benchmarks/scripts/check-claude-hook-event-mapper-contract.js`: verifies the event mapper command remains bounded and non-executing
- `benchmarks/scripts/check-claude-hook-event-mapper-output-fixtures.js`: verifies mapper output fixtures before local execution checks
- `benchmarks/scripts/check-abk-runner-map-event.js`: verifies the local `abk-runner map-event --input` command against valid, rejected transcript, missing-field, unknown-field, and invalid JSON output fixtures
- `benchmarks/scripts/check-claude-hook-packaging-contract.js`: verifies future Claude hook packaging remains bounded to explicit events and runner commands
- `benchmarks/scripts/check-claude-hook-package-manifest-fixtures.js`: verifies future Claude hook package manifests stay fixture-only and manual-review-only
- `benchmarks/scripts/check-claude-hook-manual-install-doc-fixture.js`: verifies future Claude hook manual install docs remain documentation-only and non-mutating
- `benchmarks/scripts/check-claude-hook-manual-install-contract.js`: verifies future Claude hook manual install language stays user-approved and non-mutating until install docs exist
- `benchmarks/scripts/check-claude-hook-manual-install-language-fixtures.js`: verifies Claude hook manual install language names `abk-claude-hook` without shell copy commands or repository mutation
- `benchmarks/scripts/check-claude-hook-manual-install-document.js`: verifies the Claude hook manual install document remains blocked until native payload mapping is proven
- `benchmarks/scripts/check-claude-hook-native-payload-mapping-fixtures.js`: verifies native Claude Code hook payload fixtures reject transcript reads and missing ABK metadata
- `benchmarks/scripts/check-claude-hook-native-metadata-carrier-fixtures.js`: verifies native payload plus explicit metadata carrier fixtures omit transcripts and preserve explicit task metadata
- `benchmarks/scripts/check-claude-hook-native-adapter.js`: verifies the native payload adapter maps explicit carrier metadata without reading transcripts or installing hooks
- `benchmarks/scripts/check-claude-hook-native-command-input-contract.js`: verifies native payload command input stays a single explicit stdin envelope
- `benchmarks/scripts/check-claude-hook-command-adapter-contract.js`: verifies live Claude hook docs stay blocked until stdin event input can bridge to explicit runner files
- `benchmarks/scripts/check-claude-hook-command-adapter-fixtures.js`: verifies Claude hook stdin adapter fixtures map to explicit runner input and reject transcript input
- `benchmarks/scripts/check-claude-hook-command-adapter-implementation-contract.js`: verifies the adapter entrypoint contract stays bounded
- `benchmarks/scripts/check-claude-hook-command-adapter-entrypoint-fixtures.js`: verifies adapter entrypoint fixtures cover stdin parsing, cleanup, exit codes, and private-context rejection
- `benchmarks/scripts/check-claude-hook-command-adapter-entrypoint.js`: verifies local `abk-claude-hook` stdin adapter execution against the entrypoint fixtures
- `benchmarks/scripts/check-packaging-readiness.js`: verifies packaging stays tied to fixture-backed scanner evidence
- `benchmarks/scripts/check-boundary-skill-readiness.js`: verifies the boundary-check Codex skill candidate stays tied to the packaging and read-only runner contracts
- `benchmarks/scripts/check-codex-skill-install-contract.js`: verifies the Codex skill install contract does not widen into plugin, hook, connector, or watcher behavior
- `benchmarks/scripts/check-boundary-skill-install-readiness.js`: verifies the boundary-check skill folder shape before manual install instructions
- `benchmarks/scripts/check-codex-skill-manual-install-doc.js`: verifies manual install instructions stay bounded to user-approved copy commands
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
- the read-only scanners are checked against recorded red/green evidence.
- future hook runner docs are checked for explicit input boundaries and scanner mapping.
- future hook runner input examples are checked against a bounded JSON contract.
- future hook runner output examples are checked against a bounded JSON contract.
- future hook runner dry-run examples are checked for bounded scanner selection and output mapping.
- future Claude hook event input is checked before hook packaging can map runtime events into runner input.
- future Claude hook event mapping examples are checked before hook packaging.
- Claude hook event mapper commands are checked against bounded implementation rules.
- Claude hook event mapper output fixtures are checked against local `map-event` execution.
- local `abk-runner map-event --input` execution is checked against valid, rejected transcript, missing-field, unknown-field, and invalid JSON output fixtures.
- future Claude hook packaging is checked against `docs/claude-hook-packaging-contract.md` before any hook installation work.
- future Claude hook package manifests are checked against fixture-only, manual-review-only constraints before any install documentation.
- future Claude hook manual install documentation is checked as non-mutating documentation before any install contract.
- future Claude hook manual install language is checked against `docs/claude-hook-manual-install-contract.md` before any install instructions.
- Claude hook manual install language fixtures are checked against `docs/claude-hook-manual-install-language-fixtures.md` before any user-approved settings fragment is published.
- the Claude hook manual install document is checked against `docs/claude-hook-manual-install.md` and stays blocked for agent-performed installation.
- Claude hook manual install readiness is checked against native command entrypoint evidence before install language review can advance.
- Claude hook manual install review packets are checked against `docs/claude-hook-manual-install-review-packet.md` before any settings-fragment draft work.
- Claude hook settings-fragment draft fixtures are checked against `docs/claude-hook-settings-fragment-draft-fixtures.md` and remain not installable as-is until a carrier source contract exists.
- native Claude Code hook payload mapping fixtures are checked against `docs/claude-hook-native-payload-mapping-fixtures.md` before live settings fragments.
- native Claude Code metadata carrier fixtures are checked against `docs/claude-hook-native-metadata-carrier-fixtures.md` before native payloads can become ABK hook events.
- the native Claude Code payload adapter is checked against `docs/claude-hook-native-adapter.md` before live hook entrypoint input is widened.
- native Claude Code command input is checked against `docs/claude-hook-native-command-input-contract.md` before `abk-claude-hook` accepts native payload envelopes.
- native Claude Code command entrypoint execution is checked by `benchmarks/scripts/check-claude-hook-native-command-entrypoint.js` before live hook install language can advance.
- future Claude hook command adapters are checked against `docs/claude-hook-command-adapter-contract.md` before any live hook instructions.
- Claude hook stdin adapter fixtures are checked against `docs/claude-hook-command-adapter-fixtures.md`.
- Claude hook adapter implementation is checked against `docs/claude-hook-command-adapter-implementation-contract.md`.
- Claude hook adapter entrypoint behavior is checked against `docs/claude-hook-command-adapter-entrypoint-fixtures.md` and `docs/claude-hook-command-adapter-entrypoint.md`.
- the boundary-check skill candidate is checked against the packaging readiness contract and read-only runner evidence contract.
- the Codex skill install contract is checked before any manual install instructions are published.
- the boundary-check skill folder shape is checked before manual install instructions are published.
- manual Codex skill install instructions are checked for user-approved copy-only scope.
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
